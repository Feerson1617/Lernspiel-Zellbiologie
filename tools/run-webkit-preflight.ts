import { spawnSync, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

// Three separate invocations are declared in advance, including after a failure.
// A later success never cancels an earlier failed required preflight.
const phase = process.argv[2];
if (!['keyboard', 'keyboard-base', 'r1'].includes(phase ?? '')) throw new Error('Expected keyboard, keyboard-base or r1.');
const root = resolve(process.argv[3] ?? 'qa/generated/webkit-preflight');
const keyboard = phase !== 'r1';
const file = `tests/browser/${keyboard ? 'p03b-causal' : 'p03b-r1'}.spec.ts`;
const sha = (...args: string[]) => execFileSync('git', ['rev-parse', ...args], { encoding: 'utf8' }).trim();
const hash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
let failed = false;
for (let invocation = 1; invocation <= (keyboard ? 3 : 1); invocation++) {
  const directory = resolve(root, `${phase}-${invocation}`);
  mkdirSync(directory, { recursive: true });
  const reportPath = resolve(directory, 'report.json');
  const args = ['node_modules/playwright/cli.js', 'test', '--config=playwright.webkit.config.ts', file,
    ...(keyboard ? ['--grep', 'keyboard alone'] : []), '--reporter=line,json', '--trace=on', `--output=${resolve(directory, 'results')}`];
  const metadata = { phase, invocation, prHead: process.env['PR_HEAD_SHA'] ?? null,
    executionSha: process.env['GITHUB_SHA'] ?? null, testedCommit: sha('HEAD'), testedTree: sha('HEAD^{tree}'),
    workingTreeChanges: execFileSync('git', ['status', '--short'], { encoding: 'utf8' }).trim(),
    platform: process.platform, arch: process.arch, node: process.version,
    testSha256: hash(file), configSha256: hash('playwright.webkit.config.ts'),
    sharedConfigSha256: hash('playwright.config.ts'), args, startedAt: new Date().toISOString() };
  writeFileSync(resolve(directory, 'manifest.json'), JSON.stringify(metadata, null, 2) + '\n');
  const run = spawnSync(process.execPath, args, { stdio: 'inherit', env: { ...process.env,
    PLAYWRIGHT_JSON_OUTPUT_FILE: reportPath, WEBKIT_PREFLIGHT_PHASE: `${phase}-${invocation}` } });
  let reportError: string | null = null;
  try {
    const report = JSON.parse(readFileSync(reportPath, 'utf8'));
    const stats = report.stats;
    if (stats.expected !== (keyboard ? 3 : 6) || stats.unexpected || stats.flaky || stats.skipped || report.errors?.length) {
      reportError = `Unexpected preflight results: ${JSON.stringify(stats)}`;
    }
  } catch (error) { reportError = String(error); }
  writeFileSync(resolve(directory, 'manifest.json'), JSON.stringify({ ...metadata,
    finishedAt: new Date().toISOString(), exitCode: run.status, signal: run.signal,
    launchError: run.error?.message ?? null, reportError }, null, 2) + '\n');
  if (run.status !== 0 || reportError) failed = true;
}
if (failed) process.exit(1);
