import { expect, it } from 'vitest';
import { createEvaluatedAttempt } from '../../src/assessment/progress.ts';
import { appendAttempt, getAttemptOutcome, parseProgress, ProgressContractError } from '../../src/domain/progress.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';
import { ASSISTANCE_KINDS } from '../../src/domain/contracts.ts';
import { TEST_CONTEXT, TEST_EVALUATOR, TEST_VERSIONS } from '../helpers/tonoplast.ts';

for (const assistance of ASSISTANCE_KINDS) it(`transfers a real evaluation with ${assistance} without raw evidence or automatic storage`, () => {
  const result = TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: 'Die Membran heißt Tonoplast.' }, assistance);
  const attempt = createEvaluatedAttempt('attempt', result, TEST_CONTEXT);
  const progress = appendAttempt(parseProgress({ schemaVersion: 1, contentVersion: TEST_VERSIONS.contentVersion, attempts: [] }), attempt);
  expect(getAttemptOutcome(progress, 'attempt', TEST_CONTEXT)).toMatchObject({ successful: assistance !== 'solution_viewed', independent: assistance === 'independent', assistance });
  expect(Object.keys(attempt).sort()).toEqual(['attemptId', 'taskId', 'instanceId', 'taskVersion', 'rubricVersion', 'modelVersion', 'status', 'assistance'].sort());
  expect(JSON.stringify(progress)).not.toMatch(/Die Membran|Tonoplast|evidence|criteria|contextHash|text/);
  expect(getAttemptOutcome(parseProgress(JSON.parse(JSON.stringify(progress))), 'attempt', TEST_CONTEXT).successful).toBe(false);
});

for (const change of [{ taskVersion: 'changed' }, { rubricVersion: 'changed' }, { contentVersion: 'changed' }, { modelVersion: 'changed' }, { material: { highlightedStructureId: 'tonoplast', extra: 'changed' } }, { instanceId: 'changed' }]) {
  it(`refuses stale result handoff after ${Object.keys(change)[0]} change`, () => {
    const { contextHash: _hash, ...input } = TEST_CONTEXT;
    const next = createTaskContext({ ...input, ...change });
    const result = TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: 'Tonoplast' }, 'independent');
    expect(() => createEvaluatedAttempt('stale', result, next)).toThrow(ProgressContractError);
  });
}
it('does not accept malformed artificial successes or add missing result fields', () => {
  const result = TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: 'Tonoplast' }, 'independent');
  for (const malformed of [{ status: 'correct' }, { ...result, unassessedRelevantText: true }, { ...result, criteria: [] }]) {
    expect(() => createEvaluatedAttempt('forged', malformed, TEST_CONTEXT)).toThrow();
  }
});
