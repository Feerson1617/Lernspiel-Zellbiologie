import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

interface VitestCase { fullName: string; duration?: number; status: string }
interface VitestReport { numPassedTests: number; numFailedTests: number; numPendingTests: number; testResults: { name: string; assertionResults: VitestCase[] }[] }
interface BrowserCase { title: string; tests: { projectName: string; status: string; results: { duration: number; status: string; retry: number }[] }[] }
interface BrowserSuite { file?: string; specs?: BrowserCase[]; suites?: BrowserSuite[] }
interface BrowserReport { stats: unknown; suites: BrowserSuite[] }
const paths = process.argv.slice(2);
if (!paths.length) throw new Error('Supply actual completed Vitest or Playwright report paths.');
const reports = paths.map(path => {
  const raw = readFileSync(path), report: unknown = JSON.parse(raw.toString());
  const binding = { path, sha256: createHash('sha256').update(raw).digest('hex') };
  if (typeof report !== 'object' || report === null) throw new Error(`Invalid report: ${path}`);
  if ('numPassedTests' in report) {
    const data = report as VitestReport;
    const cases = data.testResults.flatMap(file => file.assertionResults.map(test => ({ file: file.name.split('/tests/').pop(), title: test.fullName, durationMs: test.duration ?? null, status: test.status })));
    return { ...binding, kind: 'vitest', counts: { passed: data.numPassedTests, failed: data.numFailedTests, pending: data.numPendingTests },
      slowest: cases.sort((a,b) => (b.durationMs ?? 0) - (a.durationMs ?? 0)).slice(0,20) };
  }
  const data = report as BrowserReport, cases: { file: string; title: string; project: string; durationMs: number; status: string; retry: number }[] = [];
  function collect(suite: BrowserSuite, parentFile = '') {
    const file = suite.file ?? parentFile;
    for (const spec of suite.specs ?? []) for (const test of spec.tests) for (const attempt of test.results) cases.push({ file, title: spec.title, project: test.projectName, durationMs: attempt.duration, status: attempt.status, retry: attempt.retry });
    for (const child of suite.suites ?? []) collect(child,file);
  }
  data.suites.forEach(s => collect(s));
  return { ...binding, kind: 'playwright', counts: data.stats, failures: cases.filter(c => c.status !== 'passed'), slowest: cases.sort((a,b) => b.durationMs - a.durationMs).slice(0,20) };
});
mkdirSync('qa/generated',{recursive:true});
const result = { observedAt: new Date().toISOString(), currentHead: execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  qualification: 'Actual report durations, not profiling or proof of timeout causality. Input file hashes bind each observed run; currentHead is not automatically the tested commit.',
  environment: { node:process.version, platform:process.platform, arch:process.arch }, reports };
writeFileSync('qa/generated/test-timing.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
