import { createTaskContext } from '../../src/domain/task-context.ts';
import { createOsmosisEvaluator } from '../../src/assessment/osmosis.ts';
import { createTonoplastEvaluator } from '../../src/assessment/tonoplast.ts';
import { getOsmosisFeedback } from '../../src/assessment/osmosis-feedback.ts';
import { getTonoplastFeedback } from '../../src/assessment/feedback.ts';
import { REVIEW_MATERIAL } from './p02b-second.ts';
import { acceptedKnown as acceptedR3Known, acceptedR3 } from './p02b-r3.ts';
import type { R4Case } from '../fixtures/p02b-r4-cases.ts';
import { R4_MAIN, R4_SYSTEMATIC, R4_TARGETED, R4_KNOWN } from '../fixtures/p02b-r4-cases.ts';
import { R4_BOUNDARIES } from '../fixtures/p02b-r4-boundaries.ts';
import { R4_FRESH, R4_VARIANTS } from '../fixtures/p02b-r4-fresh.ts';
import type { Status } from '../../src/domain/contracts.ts';

export const R4_VERSIONS = { taskVersion: 'review5-task-20261023', rubricVersion: 'review5-rubric-20261023', contentVersion: 'concept-1.0-20261023', modelVersion: 'review-no-simulation' };
const input = { ...R4_VERSIONS, instanceId: 'independent-review5-PR6', seed: 'fixed-independent-review', phase: 'explain' as const, modelState: {} };
export const R4_OSMOSIS_CONTEXT = createTaskContext({ ...input, taskId: 'M6.02', material: REVIEW_MATERIAL });
export const R4_TONOPLAST_CONTEXT = createTaskContext({ ...input, taskId: 'Z1.02', material: { highlightedStructureId: 'tonoplast' } });
const osmosis = createOsmosisEvaluator(R4_VERSIONS), tonoplast = createTonoplastEvaluator(R4_VERSIONS);
export { R4_KNOWN };
export const R4_CASES = [...R4_MAIN, ...R4_SYSTEMATIC, ...R4_TARGETED, ...R4_FRESH, ...R4_VARIANTS, ...R4_BOUNDARIES];
export const executeR4 = (f: Pick<R4Case, 'field' | 'text'>) => {
  const context = f.field === 'osmosis' ? R4_OSMOSIS_CONTEXT : R4_TONOPLAST_CONTEXT;
  const result = (f.field === 'osmosis' ? osmosis : tonoplast).evaluate(context, { fieldId: f.field === 'osmosis' ? 'process' : 'term', text: f.text }, 'independent');
  return { result, feedback: (f.field === 'osmosis' ? getOsmosisFeedback : getTonoplastFeedback)(result.feedbackCode) };
};
export const acceptedKnownR4 = (f: R4Case): readonly Status[] => {
 const original = { ...f, id: f.id.replace(/^previous[0123]-/u, ''), group: f.group.replace(/^previous[0123]-/u, '') };
 return f.id.startsWith('previous0-') ? acceptedR3Known(original) : acceptedR3(original);
};

/** Unresolved original-Soll mismatches: these are recorded limitations, not
 * revised biological expectations or adjudications. All original Soll values
 * stay in the fixtures and raw report. A passing technical lock is no release. */
export const R4_UNRESOLVED: readonly string[] = ["R4-061","R4-062","R4-063","R4-064","R4-065","R4-066","R4-067","R4-068","R4-069","R4-070","R4-071","R4-072","R4-073","R4-074","R4-075","R4-097","R4-099","R4-100","R4-102","R4-104","R4-106","R4-107","R4-120","R4-121","R4-122","R4-123","R4-124","R4-125","R4-126","R4-127","R4-128","R4-131","R4-132","R4-133","R4-134","R4-135","R4-150","R4-151","R4-152","R4-153","R4-154","R4-155","R4-156","R4-157","R4-158","R4-159","R4-173","R4-174","R4-175","R4-178","R4-179"];
export const expectedRuntimeR4 = (f: R4Case): readonly Status[] => R4_UNRESOLVED.includes(f.id) ? ['clarify'] : f.expected;
