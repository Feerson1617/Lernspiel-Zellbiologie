import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { evaluateM602 } from '../../src/assessment/m602.ts';
import { m602Input, M602_SUPPORT } from '../helpers/m602.ts';
import { classifyM602Relation } from '../../src/assessment/m602-relations.ts';
import type { RelationField } from '../../src/assessment/m602-relations.ts';
const references = (JSON.parse(readFileSync('spec/reference-fixtures.json', 'utf8')) as { cases: { id: string; task_id: string; field_id: string; input: string; expected_status: string }[] }).cases.filter(c => c.task_id === 'M6.02' && ['direction', 'volume'].includes(c.field_id));
for (const c of references) it(`${c.id} unchanged editorial relation ${c.field_id}`, () => {
  expect(classifyM602Relation(c.input, c.field_id as RelationField).status, c.input).toBe(c.expected_status);
});
it('actually checks all 50 relevant original editorial cases; no independent acceptance claimed', () => expect(references).toHaveLength(50));
it('validates full runtime envelopes against the closed new schema, including negative extra keys and swapped criteria', () => {
  const own = JSON.parse(readFileSync('tests/fixtures/p02c-cases.json', 'utf8')) as { field: RelationField; text: string }[];
  const valid = [...own, ...references.map(r => ({ field: r.field_id as RelationField, text: r.input }))].map(r => evaluateM602(m602Input({ [r.field]: r.text }), M602_SUPPORT));
  const good = valid.find(r => r.overallStatus === 'correct')!;
  const invalid = [{ ...good, foreign: true }, { ...good, support: { ...good.support, origin: 'typed' } }, { ...good, fields: { ...good.fields, direction: good.fields.volume } }, { ...good, fullResult: { ...good.fullResult, criteria: [...good.fullResult.criteria].reverse() } }];
  const result = spawnSync('.venv/bin/python', ['-c', `import json,sys\nfrom jsonschema import Draft202012Validator\nv=Draft202012Validator(json.load(open('contracts/m602.schema.json')))\nd=json.load(sys.stdin)\nassert all(not list(v.iter_errors(x)) for x in d['valid'])\nassert all(list(v.iter_errors(x)) for x in d['invalid'])\nprint(len(d['valid']),len(d['invalid']))`], { input: JSON.stringify({ valid, invalid }), encoding: 'utf8' });
  // CI installs the documented Python dependency globally; local onboarding uses .venv.
  const executed = result.error && 'code' in result.error && result.error.code === 'ENOENT' ? spawnSync('python3', ['-c', `import json,sys\nfrom jsonschema import Draft202012Validator\nv=Draft202012Validator(json.load(open('contracts/m602.schema.json')))\nd=json.load(sys.stdin)\nassert all(not list(v.iter_errors(x)) for x in d['valid'])\nassert all(list(v.iter_errors(x)) for x in d['invalid'])`], { input: JSON.stringify({ valid, invalid }), encoding: 'utf8' }) : result;
  expect(executed.status, executed.stderr).toBe(0);
});
