import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { R7_MAIN, R7_RESULT_HASHES } from '../fixtures/p02b-r7-cases.ts';
import { canonicalReviewData } from '../helpers/p02b-r7.ts';
import { createHash } from 'node:crypto';
import { R7_CASES, R7_KNOWN, executeR7, expectedRuntimeR7, acceptedKnownR7 } from '../helpers/p02b-r7.ts';

it('BLOCKED QUALITY GATE: R7 must still meet 95 percent with all 19 yellow answers in the denominator', () => {
  const r = R7_MAIN.filter(f => f.group === 'short-correct').map(f => executeR7(f).result);
  expect(r).toHaveLength(60);
  expect(r.filter(f => f.status === 'correct').length / r.length).toBeGreaterThanOrEqual(0.95);
  expect(r.some(f => f.status === 'incorrect')).toBe(false);
});

it('validates all 3017 current corpus/known results against the protected result schema', () => {
  const results = [...R7_CASES, ...R7_KNOWN].map(f => executeR7(f).result);
  const venv = fileURLToPath(new URL('../../.venv/bin/python', import.meta.url));
  const r = spawnSync(existsSync(venv) ? venv : 'python3', ['-c', [
    'import json,sys,jsonschema', 'd=json.load(sys.stdin)',
    'v=jsonschema.Draft202012Validator(d["schema"])',
    'errors=sum(1 for result in d["results"] for error in v.iter_errors(result))',
    'print("Validated {} results; {} schema errors".format(len(d["results"]),errors))',
    'sys.exit(1 if errors else 0)',
  ].join('\n')], { input: JSON.stringify({ schema: JSON.parse(readFileSync('spec/result.schema.json', 'utf8')), results }), encoding: 'utf8', timeout: 20_000 });
  expect(r.error).toBeUndefined(); expect(r.stderr).toBe(''); expect(r.status).toBe(0);
  expect(r.stdout.trim()).toBe('Validated 3017 results; 0 schema errors');
}, 30_000); // 3017 real evaluations plus the bounded Python-schema subprocess.

it('keeps all raw expectations, scope allowances and measured objects in the public record', () => {
  const report = JSON.parse(readFileSync('qa/p02b-r7-results.json', 'utf8')) as { cases: { result: { status: string }; feedback: string; [key: string]: unknown }[]; knownCases: { result: { status: string }; feedback: string; [key: string]: unknown }[] };
  const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(canonicalReviewData(value))).digest('hex');
  const lists = [report.cases.slice(0, 183), report.cases.slice(183, 473), report.cases.slice(473), report.knownCases];
  expect(lists.map(list => hash(list.map(({ result, feedback }) => ({ result, feedback }))))).toEqual(Object.values(R7_RESULT_HASHES));
  for (const [inputs, records, accepted] of [[R7_CASES, report.cases, expectedRuntimeR7], [R7_KNOWN, report.knownCases, acceptedKnownR7]] as const) {
    expect(records.map(({ result, feedback, ...input }) => { void result; void feedback; return input; })).toEqual(inputs.map(f => ({ ...f, expectedRuntime: accepted(f) })));
    for (const [i, f] of inputs.entries()) expect(accepted(f), f.id).toContain(records[i]!.result.status);
  }
});
