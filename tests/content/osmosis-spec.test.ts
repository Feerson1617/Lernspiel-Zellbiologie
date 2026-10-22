import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import type { Status } from '../../src/domain/contracts.ts';
import { OSMOSIS_CRITERION_ID, OSMOSIS_FIELD_ID, OSMOSIS_RUBRIC_ID } from '../../src/assessment/osmosis.ts';
import { MAX_ANSWER_LENGTH } from '../../src/assessment/text.ts';
import { OSMOSIS_TEST_CONTEXT as CONTEXT, OSMOSIS_TEST_EVALUATOR as EVALUATOR } from '../helpers/osmosis.ts';
import { OSMOSIS_ADVERSARIAL_CASES, OSMOSIS_CASES, OSMOSIS_RECOGNITION_CASES } from '../fixtures/osmosis-cases.ts';
const read = (name: string) => JSON.parse(readFileSync(new URL(`../../spec/${name}`, import.meta.url), 'utf8')) as unknown;
interface Reference { id: string; task_id: string; field_id: string; input: string; expected_status: Status; reason: string }
const references = (read('reference-fixtures.json') as { cases: Reference[] }).cases.filter(({ task_id, field_id }) => task_id === 'M6.02' && field_id === 'process');
for (const fixture of references) it(`editorial ${fixture.id}: ${fixture.expected_status} — ${fixture.reason}`, () => {
  expect(EVALUATOR.evaluate(CONTEXT, { fieldId: fixture.field_id, text: fixture.input }, 'independent').status).toBe(fixture.expected_status);
});
it('projects only process/C01 and every TERM_OSMOSIS form without altering other field expectations', () => {
  const task = (read('tasks.json') as { tasks: { id: string; response_spec: { fields: { id: string; hard_limit_chars: number }[] }; expected: { fields: Record<string, { rule_id: string }> }; criteria: { id: string; label: string }[] }[] }).tasks.find(({ id }) => id === 'M6.02')!;
  expect(task.response_spec.fields.find(({ id }) => id === OSMOSIS_FIELD_ID)?.hard_limit_chars).toBe(MAX_ANSWER_LENGTH);
  expect(task.expected.fields['process']?.rule_id).toBe(OSMOSIS_RUBRIC_ID);
  expect(task.criteria.find(({ label }) => label === 'process')?.id).toBe(OSMOSIS_CRITERION_ID);
  expect(task.expected.fields['direction']?.rule_id).toBe('REL_NET_WATER_OUT');
  expect(task.expected.fields['volume']?.rule_id).toBe('REL_VACUOLE_SMALLER');
  const rubric = (read('text-rubrics.json') as { rules: { id: string; correct_aliases_or_relation_forms: string[]; partial_forms: string[]; known_wrong_forms: string[] }[] }).rules.find(({ id }) => id === OSMOSIS_RUBRIC_ID)!;
  for (const [key, expected] of [['correct_aliases_or_relation_forms', 'correct'], ['partial_forms', 'partial'], ['known_wrong_forms', 'incorrect']] as const) {
    for (const text of rubric[key]) expect(EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text }, 'independent').status).toBe(expected);
  }
  expect(references).toHaveLength(13);
});
it('keeps all 40 recognition inputs distinct from the implementation/editorial corpus and one another', () => {
  const used = new Set([...OSMOSIS_CASES, ...references].map(({ input }) => input));
  expect(OSMOSIS_RECOGNITION_CASES).toHaveLength(40);
  expect(new Set(OSMOSIS_RECOGNITION_CASES.map(({ input }) => input)).size).toBe(40);
  expect(OSMOSIS_RECOGNITION_CASES.filter(({ input }) => used.has(input))).toEqual([]);
});
it('validates every actual osmosis corpus/reference result against the unchanged result schema', () => {
  const inputs = [...OSMOSIS_CASES, ...references, ...OSMOSIS_ADVERSARIAL_CASES, ...OSMOSIS_RECOGNITION_CASES];
  const results = inputs.map(({ input }) => EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text: input }, 'independent'));
  const venv = fileURLToPath(new URL('../../.venv/bin/python', import.meta.url));
  const validation = spawnSync(existsSync(venv) ? venv : 'python3', ['-c', [
    'import json,sys,jsonschema', 'data=json.load(sys.stdin)',
    'validator=jsonschema.Draft202012Validator(data["schema"])',
    'errors=sum(1 for result in data["results"] for error in validator.iter_errors(result))',
    'print("Validated {} results; {} schema errors".format(len(data["results"]), errors))',
    'sys.exit(1 if errors else 0)',
  ].join('\n')], { input: JSON.stringify({ schema: read('result.schema.json'), results }), encoding: 'utf8', timeout: 20_000 });
  expect(validation.error).toBeUndefined(); expect(validation.stderr).toBe(''); expect(validation.status).toBe(0);
  expect(validation.stdout.trim()).toBe(`Validated ${results.length} results; 0 schema errors`);
});
