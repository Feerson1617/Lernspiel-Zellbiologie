import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import type { Status } from '../../src/domain/contracts.ts';
import { MAX_ANSWER_LENGTH } from '../../src/assessment/text.ts';
import { TONOPLAST_CRITERION_ID, TONOPLAST_FIELD_ID, TONOPLAST_RUBRIC_ID } from '../../src/assessment/tonoplast.ts';
import { TEST_CONTEXT, TEST_EVALUATOR } from '../helpers/tonoplast.ts';
import { TONOPLAST_CASES } from '../fixtures/tonoplast-cases.ts';
import { NEW_CORRECT_CASES, NEW_SAFETY_CASES, REVIEW_REGRESSIONS } from '../fixtures/tonoplast-revision-cases.ts';

const read = (file: string): string => readFileSync(new URL(`../../spec/${file}`, import.meta.url), 'utf8');
interface Reference { id: string; task_id: string; field_id: string; input: string; expected_status: Status; reason: string }
const references = (JSON.parse(read('reference-fixtures.json')) as { cases: Reference[] }).cases.filter((item) => item.task_id === 'Z1.02');
for (const fixture of references) it(`editorial ${fixture.id}: ${fixture.expected_status} (${fixture.reason})`, () => {
  expect(TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: fixture.field_id, text: fixture.input }, 'independent').status).toBe(fixture.expected_status);
});

it('projects only the authorized task/field/criterion/rubric and all specified vocabulary without changing sources', () => {
  const task = (JSON.parse(read('tasks.json')) as { tasks: { id: string; response_spec: { fields: { id: string; hard_limit_chars: number }[] }; expected: { rule_id: string }; criteria: { id: string }[] }[] }).tasks.find((item) => item.id === 'Z1.02')!;
  expect(task.response_spec.fields).toHaveLength(1);
  expect(task.response_spec.fields[0]).toMatchObject({ id: TONOPLAST_FIELD_ID, hard_limit_chars: MAX_ANSWER_LENGTH });
  expect(task.criteria.map((item) => item.id)).toEqual([TONOPLAST_CRITERION_ID]);
  expect(task.expected.rule_id).toBe(TONOPLAST_RUBRIC_ID);
  const rubric = (JSON.parse(read('text-rubrics.json')) as { rules: { id: string; correct_aliases_or_relation_forms: string[]; partial_forms: string[]; known_wrong_forms: string[] }[] }).rules.find((item) => item.id === TONOPLAST_RUBRIC_ID)!;
  for (const [key, expected] of [['correct_aliases_or_relation_forms', 'correct'], ['partial_forms', 'partial'], ['known_wrong_forms', 'incorrect']] as const) {
    for (const text of rubric[key]) expect(TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text }, 'independent').status).toBe(expected);
  }
  expect(references).toHaveLength(39);
});

it('counts only genuinely new complete correct inputs in the revision recognition denominator', () => {
  const used = new Set([...references, ...TONOPLAST_CASES, ...REVIEW_REGRESSIONS].map(({ input }) => input));
  expect(NEW_CORRECT_CASES.length).toBeGreaterThanOrEqual(40);
  expect(NEW_CORRECT_CASES.filter(({ input }) => used.has(input))).toEqual([]);
});

it('validates every actual corpus/reference result against the unchanged JSON Schema with Python jsonschema', () => {
  const results = [...references, ...TONOPLAST_CASES, ...REVIEW_REGRESSIONS, ...NEW_CORRECT_CASES, ...NEW_SAFETY_CASES].map((item) => TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: item.input }, 'independent'));
  const venv = fileURLToPath(new URL('../../.venv/bin/python', import.meta.url));
  const python = existsSync(venv) ? venv : 'python3';
  const validation = spawnSync(python, ['-c', [
    'import json,sys,jsonschema',
    'data=json.load(sys.stdin)',
    'validator=jsonschema.Draft202012Validator(data["schema"])',
    'errors=sum(1 for result in data["results"] for error in validator.iter_errors(result))',
    'print("Validated {} results; {} schema errors".format(len(data["results"]), errors))',
    'sys.exit(1 if errors else 0)',
  ].join('\n')], { input: JSON.stringify({ schema: JSON.parse(read('result.schema.json')) as unknown, results }), encoding: 'utf8', timeout: 20_000 });
  expect(validation.error).toBeUndefined();
  expect(validation.stderr).toBe('');
  expect(validation.status).toBe(0);
  expect(validation.stdout.trim()).toBe(`Validated ${results.length} results; 0 schema errors`);
});
