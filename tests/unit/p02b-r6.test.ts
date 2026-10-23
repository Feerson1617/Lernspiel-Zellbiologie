import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { afterAll, expect, it } from 'vitest';
import { R6_CASES, R6_KNOWN, executeR6, expectedRuntimeR6, acceptedKnownR6, R6_OSMOSIS_CONTEXT, R6_TONOPLAST_CONTEXT, R6_UNRESOLVED } from '../helpers/p02b-r6.ts';
import { R6_MAIN, R6_SYSTEMATIC, R6_TARGETED } from '../fixtures/p02b-r6-cases.ts';
import { R5_MAIN, R5_SYSTEMATIC, R5_TARGETED, R5_KNOWN } from '../fixtures/p02b-r5-cases.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { createEvaluatedAttempt, IncompleteTaskAssessmentError } from '../../src/assessment/progress.ts';

const cases = R6_CASES.map(f => ({ ...f, expectedRuntime: expectedRuntimeR6(f), ...executeR6(f) }));
const knownCases = R6_KNOWN.map(f => ({ ...f, expectedRuntime: acceptedKnownR6(f), ...executeR6(f) }));
afterAll(() => writeFileSync('qa/generated/p02b-r6-results.json', JSON.stringify({ cases, knownCases }, null, 2) + '\n'));
for (const f of [...cases, ...knownCases]) it(`${f.id}: ${R6_UNRESOLVED.includes(f.id) ? 'records unresolved original Soll; no acceptance' : 'regression'} — ${f.text}`, () => {
  expect(f.expectedRuntime, f.id).toContain(f.result.status);
  expect(isResultForContext(f.result, f.field === 'osmosis' ? R6_OSMOSIS_CONTEXT : R6_TONOPLAST_CONTEXT)).toBe(true);
  expect(f.result.criteria).toHaveLength(1);
  expect(f.result.criteria[0]!.id).toBe(f.field === 'osmosis' ? 'M6.02.C01' : 'Z1.02.C01');
  expect(f.feedback.length).toBeGreaterThan(20);
  if (f.result.status === 'correct') expect(f.result.unassessedRelevantText).toBe(false);
  for (const e of f.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
  if (f.field === 'osmosis') expect(() => createEvaluatedAttempt(`r4-${f.id}`, f.result, R6_OSMOSIS_CONTEXT)).toThrow(IncompleteTaskAssessmentError);
});

it('preserves the supplied corpora, frozen self-check and original choice resolver', () => {
  const hash = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
  expect([R6_MAIN.length, R6_SYSTEMATIC.length, R6_TARGETED.length, R6_KNOWN.length]).toEqual([183, 290, 24, 2023]);
  expect([R6_MAIN, R6_SYSTEMATIC, R6_TARGETED, R6_KNOWN].map(hash)).toEqual([
    "7c4612bdf02cf1b0b94b9db70d09c40e1087fe91432542bf9da126d74dcfb214",
    "fcfdb46325d01169ffa1dacdc49237034817f3f10dd4331428737e08130e8c40",
    "2df5dc5bb6a126a6b82ffb0bdb7b08d01ed4c4955ef4fbfe17a52b25a42158b0",
    "53eaf23f53aa3d3f4d671abd7bfcdcb15172b3fbd8d08da1a823ec24d784c557",
]);
  expect(R6_KNOWN).toEqual([R5_KNOWN, R5_MAIN, R5_SYSTEMATIC, R5_TARGETED].flatMap((list, i) => list.map(f => ({ ...f, id: `previous${i}-${f.id}`, group: `previous${i}-${f.group}` }))));
  expect(createHash('sha256').update(readFileSync('tests/fixtures/p02b-r6-fresh.ts')).digest('hex')).toBe('f67e544c56285f3ade2914795910deaa2005180651963ea43f94c717b828ab8e');
  expect(createHash('sha256').update(readFileSync('src/assessment/naming-choice.ts')).digest('hex')).toBe("a27e4503483a61432d403e8f75258ce56ca2625d968ad05d439f25450e868143");
  expect(R6_UNRESOLVED).toHaveLength(70); // 42 main + 4 own short + 24 own variants.
});

it('keeps the adjudicated nuclear-envelope error red beside the original clarify Soll', () => {
  const original = R6_TARGETED.find(f => f.id === 'R6DIAG-23')!;
  expect(original.expected).toEqual(['clarify']);
  expect(executeR6(original).result.feedbackCode).toBe('TONOPLAST_FALSE_IDENTITY');
  expect(executeR6(original).result.status).toBe('incorrect');
});
