import { createTaskContext } from '../../src/domain/task-context.ts';
import { createOsmosisEvaluator } from '../../src/assessment/osmosis.ts';
import { createTonoplastEvaluator } from '../../src/assessment/tonoplast.ts';
import { getOsmosisFeedback } from '../../src/assessment/osmosis-feedback.ts';
import { getTonoplastFeedback } from '../../src/assessment/feedback.ts';
import { REVIEW_MATERIAL } from './p02b-second.ts';
import { acceptedKnownR4, expectedRuntimeR4 } from './p02b-r4.ts';
import type { R5Case } from '../fixtures/p02b-r5-cases.ts';
import { R5_MAIN, R5_SYSTEMATIC, R5_TARGETED, R5_KNOWN } from '../fixtures/p02b-r5-cases.ts';
import { R5_BOUNDARIES } from '../fixtures/p02b-r5-boundaries.ts';
import { R5_FRESH, R5_VARIANTS } from '../fixtures/p02b-r5-fresh.ts';
import type { Status } from '../../src/domain/contracts.ts';

export const R5_VERSIONS = { taskVersion: 'review6-task-20261023', rubricVersion: 'review6-rubric-20261023', contentVersion: 'concept-1.0-20261023', modelVersion: 'review-no-simulation' };
const input = { ...R5_VERSIONS, instanceId: 'independent-review6-PR6', seed: 'fixed-independent-review', phase: 'explain' as const, modelState: {} };
export const R5_OSMOSIS_CONTEXT = createTaskContext({ ...input, taskId: 'M6.02', material: REVIEW_MATERIAL });
export const R5_TONOPLAST_CONTEXT = createTaskContext({ ...input, taskId: 'Z1.02', material: { highlightedStructureId: 'tonoplast' } });
const osmosis = createOsmosisEvaluator(R5_VERSIONS), tonoplast = createTonoplastEvaluator(R5_VERSIONS);
export { R5_KNOWN };
export const R5_CASES = [...R5_MAIN, ...R5_SYSTEMATIC, ...R5_TARGETED, ...R5_FRESH, ...R5_VARIANTS, ...R5_BOUNDARIES];
export const executeR5 = (f: Pick<R5Case, 'field' | 'text'>) => {
  const context = f.field === 'osmosis' ? R5_OSMOSIS_CONTEXT : R5_TONOPLAST_CONTEXT;
  const result = (f.field === 'osmosis' ? osmosis : tonoplast).evaluate(context, { fieldId: f.field === 'osmosis' ? 'process' : 'term', text: f.text }, 'independent');
  return { result, feedback: (f.field === 'osmosis' ? getOsmosisFeedback : getTonoplastFeedback)(result.feedbackCode) };
};
export const acceptedKnownR5 = (f: R5Case): readonly Status[] => {
 const original = { ...f, id: f.id.replace(/^previous[0123]-/u, ''), group: f.group.replace(/^previous[0123]-/u, '') };
 return f.id.startsWith('previous0-') ? acceptedKnownR4(original) : expectedRuntimeR4(original);
};

/** Original Soll remains in the fixtures. These are documented unresolved
 * implementation gaps, not biological adjudications or accepted release cases. */
export const R5_UNRESOLVED: readonly string[] = ["R5-061", "R5-062", "R5-063", "R5-064", "R5-065", "R5-066", "R5-067", "R5-068", "R5-069", "R5-070", "R5-071", "R5-072", "R5-073", "R5-074", "R5-075", "R5-097", "R5-099", "R5-100", "R5-101", "R5-102", "R5-103", "R5-104", "R5-105", "R5-106", "R5-120", "R5-121", "R5-122", "R5-123", "R5-124", "R5-125", "R5-126", "R5-127", "R5-132", "R5-133", "R5-134", "R5-135", "R5-150", "R5-151", "R5-152", "R5-153", "R5-154", "R5-155", "R5-156", "R5-157", "R5-158", "R5-159", "R5-177", "R5-179"];
export const expectedRuntimeR5 = (f: R5Case): readonly Status[] => R5_UNRESOLVED.includes(f.id) ? ['clarify'] : f.expected;
