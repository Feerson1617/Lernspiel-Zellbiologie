import corpus from '../fixtures/p02b-r8-cases.json' with { type: 'json' };
import { createTaskContext } from '../../src/domain/task-context.ts';
import { createOsmosisEvaluator } from '../../src/assessment/osmosis.ts';
import { createTonoplastEvaluator } from '../../src/assessment/tonoplast.ts';
import { getOsmosisFeedback } from '../../src/assessment/osmosis-feedback.ts';
import { getTonoplastFeedback } from '../../src/assessment/feedback.ts';
import { REVIEW_MATERIAL } from './p02b-second.ts';

export { corpus as R8_CORPUS };
export const R8_VERSIONS = Object.freeze({ taskVersion: 'review9-task-20261023', rubricVersion: 'review9-rubric-20261023', contentVersion: 'concept-1.0-20261023', modelVersion: 'review-no-simulation' });
const base = { ...R8_VERSIONS, instanceId: 'independent-review9-PR6', seed: 'fixed-independent-review', phase: 'explain' as const, modelState: {} };
const oc = createTaskContext({ ...base, taskId: 'M6.02', material: REVIEW_MATERIAL });
const tc = createTaskContext({ ...base, taskId: 'Z1.02', material: { highlightedStructureId: 'tonoplast' } });
const oe = createOsmosisEvaluator(R8_VERSIONS), te = createTonoplastEvaluator(R8_VERSIONS);
export function executeR8(c: { readonly field: string; readonly text: string }) {
  const result = (c.field === 'osmosis' ? oe : te).evaluate(c.field === 'osmosis' ? oc : tc, { fieldId: c.field === 'osmosis' ? 'process' : 'term', text: c.text }, 'independent');
  return { result, feedback: (c.field === 'osmosis' ? getOsmosisFeedback : getTonoplastFeedback)(result.feedbackCode) };
}
