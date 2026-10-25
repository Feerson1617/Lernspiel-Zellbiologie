import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';
import { inspectReachableHistory } from '../../tools/publish-history.ts';
import { assertRepositoryFiles } from '../../tools/publish-policy.ts';

it('uses each reachable tree policy while preserving the current-tree boundary in normal and isolated clones', () => {
  const root = mkdtempSync(join(tmpdir(), 'publish-history-'));
  const git = (...a: string[]) => execFileSync('git', a, { cwd: root, stdio: 'pipe' }).toString().trim();
  const policy = ['publish.allowlist.json', 'source.ts'];
  const commit = () => { git('add', '-A'); git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'synthetic'); };
  try {
    git('init', '-b', 'main'); writeFileSync(join(root, 'source.ts'), 'export const safe = true;');
    writeFileSync(join(root, 'publish.allowlist.json'), JSON.stringify({ repositoryFiles: policy })); commit();
    git('checkout', '-b', 'parallel'); writeFileSync(join(root, 'future.ts'), 'export const future = true;');
    writeFileSync(join(root, 'publish.allowlist.json'), JSON.stringify({ repositoryFiles: [...policy, 'future.ts'] })); commit(); git('checkout', 'main');
    expect(inspectReachableHistory(root, policy).paths).toBe(3);
    expect(() => assertRepositoryFiles([...policy, 'future.ts'], policy)).toThrow();
    for (const isolated of [false, true]) {
      const clone = join(root, isolated ? 'isolated' : 'full');
      git('clone', ...(isolated ? ['--single-branch', '--branch', 'main'] : []), root, clone);
      expect(inspectReachableHistory(clone, policy).paths).toBe(isolated ? 2 : 3);
      rmSync(clone, { recursive: true, force: true });
    }
    git('checkout', 'parallel'); writeFileSync(join(root, 'unapproved.txt'), 'synthetic harmless marker'); commit();
    expect(() => inspectReachableHistory(root, policy)).toThrow('Unapproved');
    git('rm', 'unapproved.txt'); commit(); // deletion cannot hide an earlier forbidden path
    expect(() => inspectReachableHistory(root, policy)).toThrow('Unapproved');
  } finally { rmSync(root, { recursive: true, force: true }); }
});
for (const disguised of [false, true]) it(`blocks a prohibited historical ${disguised ? 'blob under an approved name' : 'path even if self-allowlisted'}`, () => {
  const root = mkdtempSync(join(tmpdir(), 'publish-negative-'));
  const git = (...a: string[]) => execFileSync('git', a, { cwd: root, stdio: 'pipe' });
  const name = disguised ? 'source.ts' : 'originalklausur.pdf';
  const policy = ['publish.allowlist.json', name];
  try {
    git('init'); writeFileSync(join(root, 'publish.allowlist.json'), JSON.stringify({ repositoryFiles: policy }));
    writeFileSync(join(root, name), '%PDF-synthetic test only');
    git('add', '.'); git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'synthetic bad blob');
    writeFileSync(join(root, name), 'harmless replacement'); git('add', '.'); git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'replace');
    expect(() => inspectReachableHistory(root, policy)).toThrow(/Prohibited historical/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
