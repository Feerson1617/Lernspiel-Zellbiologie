import { execFileSync } from 'node:child_process';
import { assertRepositoryFiles } from './publish-policy.ts';

/** Every reachable tree is checked against its OWN explicit policy, never a
 * union that would authorize foreign paths in the current production tree. */
export function inspectReachableHistory(root: string, prePolicyFiles: readonly string[]) {
  const git = (...args: string[]) => execFileSync('git', args, { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  const commits = git('rev-list', '--all', 'HEAD').toString().trim().split('\n');
  const policies = new Map<string, readonly string[]>(), blobs = new Set<string>(), paths = new Set<string>();
  const trees = new Set<string>();
  for (const commit of commits) {
    const tree = git('rev-parse', `${commit}^{tree}`).toString().trim();
    if (trees.has(tree)) continue; trees.add(tree);
    const entries = git('ls-tree', '-rz', '--full-tree', tree).toString().split('\0').filter(Boolean).map(line => {
      const match = /^(\d+) (\w+) ([a-f0-9]+)\t([\s\S]+)$/.exec(line);
      if (!match) throw new Error('Invalid historical tree entry.');
      return { mode: match[1]!, type: match[2]!, oid: match[3]!, path: match[4]! };
    });
    const policyEntry = entries.find(e => e.path === 'publish.allowlist.json');
    let allowed = prePolicyFiles;
    if (policyEntry) {
      let stored = policies.get(policyEntry.oid);
      if (!stored) {
        const value = JSON.parse(git('cat-file', 'blob', policyEntry.oid).toString()) as { repositoryFiles?: unknown };
        if (!Array.isArray(value.repositoryFiles) || !value.repositoryFiles.every(p => typeof p === 'string')) throw new Error('Invalid historical allowlist.');
        stored = value.repositoryFiles as string[]; policies.set(policyEntry.oid, stored);
      }
      allowed = stored;
    }
    assertRepositoryFiles(entries.map(e => e.path), allowed);
    for (const e of entries) {
      // Independent of a branch's editable policy. Diagnostics never print blob contents.
      if (!/^100(?:644|755)$/.test(e.mode) || e.type !== 'blob'
        || /(?:^|\/)(?:private|\.env(?:\.[^/]*)?|originalklausur|erwartungshorizont)(?:\/|\.|$)/i.test(e.path)
        || /\.(?:pdf|docx?|xlsx?|pptx?|zip|7z|tar|gz)$/i.test(e.path)) throw new Error('Prohibited historical path or object type.');
      paths.add(e.path);
      if (blobs.has(e.oid)) continue;
      const data = git('cat-file', 'blob', e.oid);
      if (data.includes(0) || data.subarray(0, 5).toString() === '%PDF-' || data.subarray(0, 2).toString() === 'PK') throw new Error('Prohibited historical binary/document blob.');
      try { new TextDecoder('utf-8', { fatal: true }).decode(data); } catch { throw new Error('Historical blob is not approved UTF-8 text.'); }
      blobs.add(e.oid);
    }
  }
  return { commits: commits.length, trees: trees.size, blobs: blobs.size, paths: paths.size };
}
