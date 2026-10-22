import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { expect, it } from 'vitest';
import { assertDistFiles, listRegularFiles, publishedAssetPaths } from '../../tools/publish-policy.ts';
import policy from '../../publish.allowlist.json';

const root = new URL('../../dist/', import.meta.url);

it('produces a loadable German start page with existing assets under the Pages base', () => {
  const html = readFileSync(new URL('index.html', root), 'utf8');
  expect(html).toContain('lang="de"');
  expect(html).toContain('<title>Zelllabor 11 – Die Zelle erforschen</title>');
  const paths = publishedAssetPaths(html, policy.base);
  expect(paths).toHaveLength(3);
  for (const path of paths) expect(readFileSync(new URL(path, root)).length).toBeGreaterThan(0);
});

it('publishes only approved application output and stays below the 2 MB initial budget', () => {
  const files = listRegularFiles(root.pathname);
  expect(() => assertDistFiles(files, policy.distPatterns)).not.toThrow();
  const bytes = files.reduce((sum, file) => sum + gzipSync(readFileSync(new URL(file, root))).length, 0);
  expect(bytes).toBeLessThanOrEqual(2_000_000);
  expect(files.some((file) => /spec|fixtures|qa|review|\.map|\.json/.test(file))).toBe(false);
});
