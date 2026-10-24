import { createTaskContext } from '../../src/domain/task-context.ts';
import { createOsmosisEvaluator } from '../../src/assessment/osmosis.ts';
import { createTonoplastEvaluator } from '../../src/assessment/tonoplast.ts';
import { getOsmosisFeedback } from '../../src/assessment/osmosis-feedback.ts';
import { getTonoplastFeedback } from '../../src/assessment/feedback.ts';
import { REVIEW_MATERIAL } from './p02b-second.ts';
import { acceptedFourth } from './p02b-fourth.ts';
import type { R3Case } from '../fixtures/p02b-r3-cases.ts';
import { R3_MAIN, R3_SYSTEMATIC, R3_TARGETED, R3_KNOWN } from '../fixtures/p02b-r3-cases.ts';
import { R3_FRESH, R3_METAMORPHIC } from '../fixtures/p02b-r3-fresh.ts';
import type { Status } from '../../src/domain/contracts.ts';

export const R3_VERSIONS = { taskVersion: 'review4-task-20261023', rubricVersion: 'review4-rubric-20261023', contentVersion: 'concept-1.0-20261023', modelVersion: 'review-no-simulation' };
const input = { ...R3_VERSIONS, instanceId: 'independent-review4-PR6', seed: 'fixed-independent-review', phase: 'explain' as const, modelState: {} };
export const R3_OSMOSIS_CONTEXT = createTaskContext({ ...input, taskId: 'M6.02', material: REVIEW_MATERIAL });
export const R3_TONOPLAST_CONTEXT = createTaskContext({ ...input, taskId: 'Z1.02', material: { highlightedStructureId: 'tonoplast' } });
const osmosis = createOsmosisEvaluator(R3_VERSIONS), tonoplast = createTonoplastEvaluator(R3_VERSIONS);
export { R3_KNOWN };
export const R3_CASES = [...R3_MAIN, ...R3_SYSTEMATIC, ...R3_TARGETED, ...R3_FRESH, ...R3_METAMORPHIC];
export const executeR3 = (f: Pick<R3Case, 'field' | 'text'>) => {
  const context = f.field === 'osmosis' ? R3_OSMOSIS_CONTEXT : R3_TONOPLAST_CONTEXT;
  const result = (f.field === 'osmosis' ? osmosis : tonoplast).evaluate(context, { fieldId: f.field === 'osmosis' ? 'process' : 'term', text: f.text }, 'independent');
  return { result, feedback: (f.field === 'osmosis' ? getOsmosisFeedback : getTonoplastFeedback)(result.feedbackCode) };
};
/** Original supplied expectations remain unchanged. Only longer explanations
 * outside process/C01 receive the already documented scope allowance. */
export const R3_OUTSIDE_EXPLANATION = ['wrong-name-13', 'wrong-name-14', 'wrong-name-15', 'wrong-name-17', 'wrong-name-18', 'wrong-name-19', 'wrong-name-20'] as const;
export const acceptedR3 = (f: R3Case): readonly Status[] => f.group === 'long-correct' ? ['correct', 'clarify']
  : (R3_OUTSIDE_EXPLANATION as readonly string[]).includes(f.id) ? ['incorrect', 'clarify'] : f.expected;
export const acceptedKnown = (f: R3Case): readonly Status[] => acceptedFourth({ ...f, id: f.id.replace(/^previous[012]-/u, ''), group: f.group.replace(/^previous[012]-/u, '') });
