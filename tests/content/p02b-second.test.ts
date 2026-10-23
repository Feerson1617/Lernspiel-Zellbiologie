import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { TONOPLAST_CASES } from '../fixtures/tonoplast-cases.ts';
import { REVIEW_REGRESSIONS, NEW_CORRECT_CASES, NEW_SAFETY_CASES } from '../fixtures/tonoplast-revision-cases.ts';
import { OSMOSIS_CASES, OSMOSIS_RECOGNITION_CASES, OSMOSIS_ADVERSARIAL_CASES } from '../fixtures/osmosis-cases.ts';
import { OSMOSIS_REVISION_CASES } from '../fixtures/osmosis-revision-cases.ts';
import { COUNTERCHECK_CASES } from '../fixtures/p02b-countercheck-cases.ts';
import { FRESH_LONG, FRESH_SHORT } from '../fixtures/p02b-second-language.ts';
import { FIELD_SCOPE_CASES, SECOND_CASES, runSecondCase } from '../helpers/p02b-second.ts';

it('keeps all fresh language inputs distinct from every known own/supplied/editorial case, including case and punctuation variants', () => {
  const normalize = (text: string) => text.normalize('NFC').toLocaleLowerCase('de-DE').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const reference = JSON.parse(readFileSync('spec/reference-fixtures.json', 'utf8')) as { cases: { input: unknown }[] };
  const known = [
    ...TONOPLAST_CASES, ...REVIEW_REGRESSIONS, ...NEW_CORRECT_CASES, ...NEW_SAFETY_CASES,
    ...OSMOSIS_CASES, ...OSMOSIS_RECOGNITION_CASES, ...OSMOSIS_ADVERSARIAL_CASES, ...OSMOSIS_REVISION_CASES, ...reference.cases,
  ].map(f => f.input).filter((text): text is string => typeof text === 'string');
  const used = new Set([...known, ...COUNTERCHECK_CASES.map(f => f.text)].map(normalize));
  const fresh = [...FRESH_SHORT, ...FRESH_LONG];
  expect(fresh).toHaveLength(80);
  expect(new Set(fresh.map(f => normalize(f.text))).size).toBe(80);
  expect(fresh.filter(f => used.has(normalize(f.text)))).toEqual([]);
});

it('retains yellow in both recognition denominators and requires at least 95 percent for short naming', () => {
  expect(FRESH_SHORT).toHaveLength(60); expect(FRESH_LONG).toHaveLength(20);
  const short = FRESH_SHORT.map(f => runSecondCase(f.field, f.text));
  const long = FRESH_LONG.map(f => runSecondCase(f.field, f.text));
  expect(short.filter(r => r.status === 'correct').length / short.length).toBeGreaterThanOrEqual(0.95);
  expect([...short, ...long].filter(r => r.status === 'incorrect')).toEqual([]);
  expect(long).toHaveLength(20); // No filtering out correct biological explanations that clarified.
});

it('validates all 256 supplied, fresh and field-scope actual result objects against the original JSON Schema', () => {
  const results = [...SECOND_CASES, ...FIELD_SCOPE_CASES].map(f => runSecondCase(f.field, f.text));
  const venv = fileURLToPath(new URL('../../.venv/bin/python', import.meta.url));
  const validation = spawnSync(existsSync(venv) ? venv : 'python3', ['-c', [
    'import json,sys,jsonschema', 'data=json.load(sys.stdin)',
    'validator=jsonschema.Draft202012Validator(data["schema"])',
    'errors=sum(1 for result in data["results"] for error in validator.iter_errors(result))',
    'print("Validated {} results; {} schema errors".format(len(data["results"]), errors))',
    'sys.exit(1 if errors else 0)',
  ].join('\n')], { input: JSON.stringify({ schema: JSON.parse(readFileSync('spec/result.schema.json', 'utf8')) as unknown, results }), encoding: 'utf8', timeout: 20_000 });
  expect(validation.error).toBeUndefined(); expect(validation.stderr).toBe(''); expect(validation.status).toBe(0);
  expect(validation.stdout.trim()).toBe('Validated 256 results; 0 schema errors');
});

it('preserves the complete historical outcome at its reported commit, retaining raw input expectations', () => {
  const bytes = readFileSync('qa/p02b-second-results.json');
  const report = JSON.parse(bytes.toString('utf8')) as { runtimeCodeCommit: string; cases: ({ result: unknown } & Record<string, unknown>)[]; fieldScopeCases: ({ result: unknown } & Record<string, unknown>)[] };
  const review = JSON.parse(readFileSync('qa/p02b-second-review.json', 'utf8')) as { commitSha: string; environment: { publicResultHash: string } };
  expect(report.runtimeCodeCommit).toBe(review.commitSha);
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(review.environment.publicResultHash);
  // This archive reports the old implementation, not a golden status for every
  // future commit. Live regressions above and in unit tests retain fixed norms.
  const inputs = (values: typeof report.cases) => values.map(({ result, ...input }) => { void result; return input; });
  expect(inputs(report.cases)).toEqual(SECOND_CASES);
  expect(inputs(report.fieldScopeCases)).toEqual(FIELD_SCOPE_CASES);
});
