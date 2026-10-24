import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { expect, it } from 'vitest';
import { R6_FRESH } from '../fixtures/p02b-r6-fresh.ts';
import { R6_CASES, R6_KNOWN, executeR6, expectedRuntimeR6, acceptedKnownR6 } from '../helpers/p02b-r6.ts';

it('checks all 60 novel short sentences against known fixtures, QA and editorial strings', async () => {
  const normalize = (s: string) => s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const known = new Set<string>();
  const collect = (v: unknown): void => {
    if (typeof v === 'string') known.add(normalize(v));
    else if (v && typeof v === 'object') Object.values(v).forEach(collect);
  };
  const directory = fileURLToPath(new URL('../fixtures/', import.meta.url));
  for (const n of readdirSync(directory).filter(n => n.endsWith('.ts') && !['p02b-r6-fresh.ts', 'p02b-r6-boundaries.ts'].includes(n))) collect(await import(/* @vite-ignore */ pathToFileURL(`${directory}/${n}`).href));
  for (const n of readdirSync('qa').filter(n => n.endsWith('.json') && !n.startsWith('p02b-r6-'))) collect(JSON.parse(readFileSync(`qa/${n}`, 'utf8')));
  collect(JSON.parse(readFileSync('spec/reference-fixtures.json', 'utf8')));
  expect(R6_FRESH).toHaveLength(60);
  expect(new Set(R6_FRESH.map(f => normalize(f.text))).size).toBe(60);
  expect(R6_FRESH.filter(f => known.has(normalize(f.text)))).toEqual([]);
});


it('validates all 3580 current corpus/known results against the protected result schema', () => {
  const results = [...R6_CASES, ...R6_KNOWN].map(f => executeR6(f).result);
  const venv = fileURLToPath(new URL('../../.venv/bin/python', import.meta.url));
  const r = spawnSync(existsSync(venv) ? venv : 'python3', ['-c', [
    'import json,sys,jsonschema', 'd=json.load(sys.stdin)',
    'v=jsonschema.Draft202012Validator(d["schema"])',
    'errors=sum(1 for result in d["results"] for error in v.iter_errors(result))',
    'print("Validated {} results; {} schema errors".format(len(d["results"]),errors))',
    'sys.exit(1 if errors else 0)',
  ].join('\n')], { input: JSON.stringify({ schema: JSON.parse(readFileSync('spec/result.schema.json', 'utf8')), results }), encoding: 'utf8', timeout: 20_000 });
  expect(r.error).toBeUndefined(); expect(r.stderr).toBe(''); expect(r.status).toBe(0);
  expect(r.stdout.trim()).toBe('Validated 3580 results; 0 schema errors');
}, 30_000); // 3580 real evaluations plus the bounded Python-schema subprocess.

it('keeps all raw expectations, scope allowances and measured objects in the public record', () => {
  const report = JSON.parse(readFileSync('qa/p02b-r6-results.json', 'utf8')) as { cases: { result: { status: string }; feedback: string; [key: string]: unknown }[]; knownCases: { result: { status: string }; feedback: string; [key: string]: unknown }[] };
  for (const [inputs, records, accepted] of [[R6_CASES, report.cases, expectedRuntimeR6], [R6_KNOWN, report.knownCases, acceptedKnownR6]] as const) {
    expect(records.map(({ result, feedback, ...input }) => { void result; void feedback; return input; })).toEqual(inputs.map(f => ({ ...f, expectedRuntime: accepted(f) })));
    for (const [i, f] of inputs.entries()) expect(accepted(f), f.id).toContain(records[i]!.result.status);
  }
});
