import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import vite from '../../vite.config.ts';

const read = (path: string): string => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

describe('P00 project configuration', () => {
  it('builds for the repository subpath without public copies or source maps', () => {
    expect(vite.base).toBe('/Lernspiel-Zellbiologie/');
    expect(vite.publicDir).toBe(false);
    expect(vite.build?.sourcemap).toBe(false);
  });

  it('enables strict checks for application, tooling and tests', () => {
    const config = JSON.parse(read('tsconfig.json'));
    expect(config.compilerOptions).toMatchObject({ strict: true, noEmit: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true });
    expect(config.include).toEqual(expect.arrayContaining(['src', 'tests', 'tools/*.ts', '*.config.ts']));
  });

  it('pins dependencies consistently with the npm lock and supported Node runtime', () => {
    const pkg = JSON.parse(read('package.json'));
    const lock = JSON.parse(read('package-lock.json'));
    for (const kind of ['dependencies', 'devDependencies']) {
      expect(lock.packages[''][kind]).toEqual(pkg[kind]);
      for (const [name, version] of Object.entries(pkg[kind])) {
        expect(version).toMatch(/^\d+\.\d+\.\d+$/);
        expect(lock.packages[`node_modules/${name}`].version).toBe(version);
      }
    }
    expect(read('.nvmrc').trim()).toBe('24.19.0');
    expect(pkg.engines.node).toBe('>=24.19.0 <25');
  });

  it('runs empty later-phase suites as failures and keeps them outside the P00 check', () => {
    const scripts = JSON.parse(read('package.json')).scripts;
    for (const key of ['test:models', 'test:content', 'test:review']) {
      expect(scripts[key]).toMatch(/^vitest run /);
      expect(scripts[key]).not.toContain('passWithNoTests');
    }
    expect(scripts.check).toBe('npm run check:spec && npm run test');
  });

  it('deploys only the checked dist artifact from main after required checks', () => {
    const workflow = read('.github/workflows/pages.yml');
    expect(workflow).toContain('npm ci');
    expect(workflow).toContain('npm run check');
    expect(workflow).toContain('path: dist');
    expect(workflow).toContain("github.event_name == 'push' && github.ref == 'refs/heads/main'");
    expect(workflow).toContain('needs: build');
    expect(workflow).not.toContain('pull_request_target');
  });
});
