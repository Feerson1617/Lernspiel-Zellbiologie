import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';
import { evaluateM602Cued } from '../../src/assessment/m602-cued.ts';
import { m602CuedInput, M602_SUPPORT } from '../helpers/m602-cued.ts';
import type { RelationField } from '../../src/assessment/m602-relations.ts';

it('validates all current envelopes and rejects legacy/extra keys/versions/swapped criteria against the closed schema', () => {
  const rows = ['cases','supplement'].flatMap(name => JSON.parse(readFileSync(`tests/fixtures/m602-cued-${name}.json`, 'utf8'))) as { field: RelationField; text: string }[];
  const valid = rows.map(c => evaluateM602Cued(m602CuedInput({ [c.field]: c.text }), M602_SUPPORT));
  const o = valid[0]!;
  const invalid = [{ ...o, contractVersion: 'm602-response/1.0.0' }, { ...o, extra: true },
    { ...o, submission: { ...o.submission, context: { ...o.submission.context, taskVersion: 'M6.02@relations-input-1' } } },
    { ...o, fields: { ...o.fields, direction: o.fields.volume } },
    { ...o, fullResult: { ...o.fullResult, rubricVersion: 'old' } },
    { ...o, fullResult: { ...o.fullResult, criteria: [...o.fullResult.criteria].reverse() } }];
  const script = `import json,sys\nfrom jsonschema import Draft202012Validator\nv=Draft202012Validator(json.load(open('contracts/m602-cued.schema.json')))\nd=json.load(sys.stdin)\nassert all(not list(v.iter_errors(x)) for x in d['valid'])\nassert all(list(v.iter_errors(x)) for x in d['invalid'])\nprint(len(d['valid']),len(d['invalid']))`;
  const result = spawnSync('python3', ['-c', script], { input: JSON.stringify({ valid, invalid }), encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
});
