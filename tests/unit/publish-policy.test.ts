import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { assertDistFiles, assertRepositoryFiles, assertRuntimeModule, listRegularFiles, publishedAssetPaths } from '../../tools/publish-policy.ts';
import policy from '../../publish.allowlist.json';

describe('publication boundaries', () => {
  it('accepts the explicitly reviewed repository inventory', () => {
    expect(() => assertRepositoryFiles(['AGENTS.md', 'spec/tasks.json', 'src/main.ts'], policy.repositoryFiles)).not.toThrow();
  });

  it.each(['private/exam.pdf', '.env', 'spec/new-original.json', 'src/private-original.txt'])('rejects an unapproved repository path: %s', (path) => {
    expect(() => assertRepositoryFiles([path], policy.repositoryFiles)).toThrow('Unapproved repository files');
  });

  it('accepts only the expected static output', () => {
    expect(() => assertDistFiles(['index.html', 'assets/index-a1b2c3d4.js', 'assets/index-a1b2c3d4.css', 'assets/favicon-a1b2c3d4.svg'], policy.distPatterns)).not.toThrow();
  });

  it.each(['spec/reference-fixtures.json', 'exam.pdf', 'assets/index-a1b2c3d4.js.map', 'assets/original.txt', '../index.html'])('rejects an unexpected dist file: %s', (path) => {
    expect(() => assertDistFiles(['index.html', path], policy.distPatterns)).toThrow();
  });

  it('rejects a missing entry page', () => {
    expect(() => assertDistFiles(['assets/index-a1b2c3d4.js'], policy.distPatterns)).toThrow();
  });

  it('blocks editorial/test imports in the runtime, including raw imports', () => {
    for (const path of ['spec/reference-fixtures.json?raw', 'spec/tasks.json', 'spec/text-rubrics.json?raw', 'tests/fixtures/osmosis-cases.ts', 'qa/p02b-review.json', 'tests/unit/config.test.ts', '../private/data.ts', 'src/private-original.pdf?raw', '../private/node_modules/data.ts']) {
      expect(() => assertRuntimeModule(`/project/${path}`, '/project/', policy.repositoryFiles)).toThrow('Runtime import outside src');
    }
    expect(() => assertRuntimeModule('/project/src/main.ts', '/project/', policy.repositoryFiles)).not.toThrow();
    expect(() => assertRuntimeModule('/project/node_modules/three/build/three.module.js', '/project/', policy.repositoryFiles)).not.toThrow();
  });

  it('checks all built asset paths against the repository base', () => {
    expect(publishedAssetPaths('<script src="/Lernspiel-Zellbiologie/assets/index-12345678.js"></script>', policy.base)).toEqual(['assets/index-12345678.js']);
    for (const url of ['/assets/index.js', 'https://example.com/x.js', '//example.com/x.js', `${policy.base}../private.json`]) {
      expect(() => publishedAssetPaths(`<script src="${url}"></script>`, policy.base)).toThrow();
    }
  });

  it('refuses to follow a symlink into files outside dist', () => {
    const directory = mkdtempSync(join(tmpdir(), 'zelllabor11-policy-test-'));
    try {
      mkdirSync(join(directory, 'dist'));
      writeFileSync(join(directory, 'not-for-publication.txt'), 'synthetic negative test, no private source');
      symlinkSync(join(directory, 'not-for-publication.txt'), join(directory, 'dist/linked.txt'));
      expect(() => listRegularFiles(join(directory, 'dist'))).toThrow('Symlinks');
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
});
