import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import cases from '../fixtures/naming-v1-cases.json' with { type: 'json' };
import { namingInput, INDEPENDENT_SUPPORT } from '../helpers/naming-v1.ts';
import { evaluateNaming } from '../../src/assessment/naming-v1.ts';
import type { NamingTaskId } from '../../src/domain/naming-contract.ts';
import { canonicalReviewData } from '../helpers/p02b-r7.ts';
import { executeR8, R8_CORPUS } from '../helpers/p02b-r8.ts';

it('validates all new envelopes AND unchanged embedded EvaluationResults against separate schemas', () => {
  const results = cases.map(c => evaluateNaming(namingInput(c.taskId as NamingTaskId, c.termText, c.additionalStatements), INDEPENDENT_SUPPORT));
  const schemas = [JSON.parse(readFileSync('contracts/naming-v1.schema.json', 'utf8')), JSON.parse(readFileSync('spec/result.schema.json', 'utf8'))];
  const { $schema: dialect, ...protectedResult } = schemas[1];
  expect(dialect).toBe('https://json-schema.org/draft/2020-12/schema');
  expect(schemas[0].properties.termResult).toEqual(protectedResult);
  const result = execFileSync(existsSync('.venv/bin/python') ? '.venv/bin/python' : 'python3', ['-c', [
    'import json,sys,jsonschema,copy', 'd=json.load(sys.stdin)', 'count=0',
    'for schema, records in zip(d["schemas"], [d["results"], [r["termResult"] for r in d["results"]]]):',
    ' jsonschema.Draft202012Validator.check_schema(schema)',
    ' validator=jsonschema.Draft202012Validator(schema)',
    ' for r in records: validator.validate(r); count+=1',
    'v=jsonschema.Draft202012Validator(d["schemas"][0])',
    'for path,value in [(["overallStatus"],"not_assessed"),(["unexpected"],True),(["submission","target","fieldId"],"process"),(["support","assistance"],"unknown"),(["termResult","status"],"not_assessed"),(["submission","context","seed"],1)]:',
    ' bad=copy.deepcopy(d["results"][0]); parent=bad',
    ' for key in path[:-1]: parent=parent[key]',
    ' parent[path[-1]]=value',
    ' assert not v.is_valid(bad),path',
    'print(count)',
  ].join('\n')], { input: JSON.stringify({ schemas, results }), encoding: 'utf8', timeout: 20000 });
  expect(Number(result.trim())).toBe(520);
});
it('retains all supplied R8 groups and input counts', () => {
  expect(Object.values(R8_CORPUS.groups).map(list => list.length)).toEqual([199, 370, 3017]);
});
const r8cases = Object.values(R8_CORPUS.groups).flat();
for (let offset = 0; offset < r8cases.length; offset += 900) {
  it(`replays immutable full R8 results/feedback batch ${offset / 900 + 1}, at most 900 cases`, () => {
    const list = r8cases.slice(offset, offset + 900);
    const results = list.map(executeR8);
    const sha = createHash('sha256').update(JSON.stringify(canonicalReviewData(results))).digest('hex');
    expect(sha).toBe(R8_CORPUS.expectedBatchHashes[offset / 900]);
    for (const [index, { result }] of results.entries()) for (const e of result.criteria.flatMap(c => c.evidence)) if (e.kind === 'input_span') expect(list[index]!.text.slice(e.start, e.end)).toBe(e.value);
  });
}
it('preserves byte-identical old assertion bodies and deliberately keeps them outside the new release gate', () => {
  const transfers = JSON.parse(readFileSync('qa/legacy-gate-transfer.json', 'utf8')) as { from: string; to: string; testBodySHA256: string; sourceCommit: string }[];
  for (const t of transfers) {
    const before = execFileSync('git', ['show', `${t.sourceCommit}:${t.from}`], { encoding: 'utf8' });
    const originalBody = before.match(/it\('BLOCKED QUALITY GATE:.*?\n\}\);/su)?.[0];
    const now = readFileSync(t.to, 'utf8').match(/it\('BLOCKED QUALITY GATE:.*?\n\}\);/su)?.[0];
    expect(now).toBe(originalBody); expect(createHash('sha256').update(now!).digest('hex')).toBe(t.testBodySHA256);
    expect(readFileSync(t.from, 'utf8')).not.toContain('BLOCKED QUALITY GATE:');
  }
  expect(JSON.parse(readFileSync('package.json', 'utf8')).scripts['test:legacy']).toContain('tests/legacy');
});
