import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { expect, it } from 'vitest';
import { FOURTH_NOVEL } from '../helpers/p02b-fourth.ts';
import { FOURTH_CASES, executeFourth, acceptedFourth } from '../helpers/p02b-fourth.ts';

it('checks all 40 novel short sentences against known fixtures, QA and editorial strings', async () => {
  const normalize = (s: string) => s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const known = new Set<string>();
  const collect = (v: unknown): void => {
    if (typeof v === 'string') known.add(normalize(v));
    else if (v && typeof v === 'object') Object.values(v).forEach(collect);
  };
  const directory = fileURLToPath(new URL('../fixtures/', import.meta.url));
  for (const n of readdirSync(directory).filter(n => n.endsWith('.ts') && !['p02b-20261023-r2-fresh.ts', 'p02b-20261023-r2-additions.ts'].includes(n))) collect(await import(/* @vite-ignore */ pathToFileURL(`${directory}/${n}`).href));
  for (const n of readdirSync('qa').filter(n => n.endsWith('.json') && !n.startsWith('p02b-fourth-'))) collect(JSON.parse(readFileSync(`qa/${n}`, 'utf8')));
  collect(JSON.parse(readFileSync('spec/reference-fixtures.json', 'utf8')));
  expect(FOURTH_NOVEL).toHaveLength(40);
  expect(new Set(FOURTH_NOVEL.map(f => normalize(f.text))).size).toBe(40);
  expect(FOURTH_NOVEL.filter(f => known.has(normalize(f.text)))).toEqual([]);
});

it('requires the chosen 95 percent short naming target without dropping yellow answers', () => {
  const r = FOURTH_NOVEL.map(f => executeFourth(f).result);
  expect(r.filter(f => f.status === 'correct').length / r.length).toBeGreaterThanOrEqual(0.95);
  expect(r.some(f => f.status === 'incorrect')).toBe(false);
});

it('validates all 956 actual supplied, fresh and metamorphic objects against the protected result schema', () => {
  const results = FOURTH_CASES.map(f => executeFourth(f).result);
  const venv = fileURLToPath(new URL('../../.venv/bin/python', import.meta.url));
  const r = spawnSync(existsSync(venv) ? venv : 'python3', ['-c', [
    'import json,sys,jsonschema', 'd=json.load(sys.stdin)',
    'v=jsonschema.Draft202012Validator(d["schema"])',
    'errors=sum(1 for result in d["results"] for error in v.iter_errors(result))',
    'print("Validated {} results; {} schema errors".format(len(d["results"]),errors))',
    'sys.exit(1 if errors else 0)',
  ].join('\n')], { input: JSON.stringify({ schema: JSON.parse(readFileSync('spec/result.schema.json', 'utf8')), results }), encoding: 'utf8', timeout: 20_000 });
  expect(r.error).toBeUndefined(); expect(r.stderr).toBe(''); expect(r.status).toBe(0);
  expect(r.stdout.trim()).toBe('Validated 956 results; 0 schema errors');
});

it('publishes all raw expectations and actual results, including yellow and explicitly adjudicated discrepancies', () => {
  const report = JSON.parse(readFileSync('qa/p02b-fourth-results.json', 'utf8')) as { cases: { result: { status: string }; feedback: string; [key: string]: unknown }[] };
  const inputs = report.cases.map(({ result, feedback, ...input }) => { void result; void feedback; return input; });
  expect(inputs).toEqual(FOURTH_CASES.map(f => ({ ...f, accepted: acceptedFourth(f) })));
  for (const [i, f] of FOURTH_CASES.entries()) {
    const archived = report.cases[i]!;
    expect(acceptedFourth(f), f.id).toContain(archived.result.status);
    expect(archived.feedback.length).toBeGreaterThan(20);
  }
});
