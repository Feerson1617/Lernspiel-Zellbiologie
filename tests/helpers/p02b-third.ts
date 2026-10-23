import { createTaskContext } from '../../src/domain/task-context.ts';
import { createOsmosisEvaluator } from '../../src/assessment/osmosis.ts';
import { createTonoplastEvaluator } from '../../src/assessment/tonoplast.ts';
import { getOsmosisFeedback } from '../../src/assessment/osmosis-feedback.ts';
import { getTonoplastFeedback } from '../../src/assessment/feedback.ts';
import { REVIEW_MATERIAL } from './p02b-second.ts';
import { SUPPLIED_MAIN, SUPPLIED_DIAGNOSTIC, SUPPLIED_DIAGNOSTIC2 } from '../fixtures/p02b-20261023-cases.ts';
import type { SuppliedCase } from '../fixtures/p02b-20261023-cases.ts';
import { FRESH_SHORT_20261023, FRESH_NEGATIVE_20261023 } from '../fixtures/p02b-20261023-fresh.ts';
import type { Status } from '../../src/domain/contracts.ts';

export const THIRD_VERSIONS = { taskVersion: 'review-task-20261023', rubricVersion: 'review-rubric-20261023', contentVersion: 'concept-1.0-20261023', modelVersion: 'review-no-simulation' };
const input = { ...THIRD_VERSIONS, instanceId: 'independent-review-PR6', seed: 'fixed-independent-review', phase: 'explain' as const, modelState: {} };
export const THIRD_OSMOSIS_CONTEXT = createTaskContext({ ...input, taskId: 'M6.02', material: REVIEW_MATERIAL });
export const THIRD_TONOPLAST_CONTEXT = createTaskContext({ ...input, taskId: 'Z1.02', material: { highlightedStructureId: 'tonoplast' } });
const osmosis = createOsmosisEvaluator(THIRD_VERSIONS), tonoplast = createTonoplastEvaluator(THIRD_VERSIONS);
export const THIRD_CASES = [...SUPPLIED_MAIN, ...SUPPLIED_DIAGNOSTIC, ...SUPPLIED_DIAGNOSTIC2, ...FRESH_SHORT_20261023, ...FRESH_NEGATIVE_20261023];
export const executeThird = (f: Pick<SuppliedCase, 'field' | 'text'>) => {
  const context = f.field === 'osmosis' ? THIRD_OSMOSIS_CONTEXT : THIRD_TONOPLAST_CONTEXT;
  const result = (f.field === 'osmosis' ? osmosis : tonoplast).evaluate(context, { fieldId: f.field === 'osmosis' ? 'process' : 'term', text: f.text }, 'independent');
  return { result, feedback: (f.field === 'osmosis' ? getOsmosisFeedback : getTonoplastFeedback)(result.feedbackCode) };
};
/** Raw records never change. These explicit allowances implement only the
 * supplied report's adjudication and the authorised process/C01 scope. */
export function acceptedThird(f: SuppliedCase): readonly Status[] {
  if (f.group === 'long-correct') return ['correct', 'clarify'];
  if (f.group === 'not-generic-name' || f.group === 'explicit-name-not-alias') return ['correct', 'clarify'];
  if (f.id === 'tonoplast-property-2' || f.id === 'tonoplast-property-3') return ['incorrect'];
  if (f.id === 'tonoplast-property-1') return ['correct', 'clarify'];
  return f.expected;
}
