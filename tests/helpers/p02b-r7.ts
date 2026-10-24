import { createTaskContext } from '../../src/domain/task-context.ts';
import { createOsmosisEvaluator } from '../../src/assessment/osmosis.ts';
import { createTonoplastEvaluator } from '../../src/assessment/tonoplast.ts';
import { getOsmosisFeedback } from '../../src/assessment/osmosis-feedback.ts';
import { getTonoplastFeedback } from '../../src/assessment/feedback.ts';
import { REVIEW_MATERIAL } from './p02b-second.ts';
import { acceptedKnownR6, expectedRuntimeR6 } from './p02b-r6.ts';
import type { R7Case } from '../fixtures/p02b-r7-cases.ts';
import { R7_MAIN, R7_SYSTEMATIC, R7_TARGETED, R7_KNOWN } from '../fixtures/p02b-r7-cases.ts';
import type { Status } from '../../src/domain/contracts.ts';

// Explicit synthetic test bindings match the supplied R7 execution. No model
// version of an existing simulation is claimed; no product version is invented.
export const R7_VERSIONS = { taskVersion: 'review8-task-20261023', rubricVersion: 'review8-rubric-20261023', contentVersion: 'concept-1.0-20261023', modelVersion: 'review-no-simulation' };
const input = { ...R7_VERSIONS, instanceId: 'independent-review8-PR6', seed: 'fixed-independent-review', phase: 'explain' as const, modelState: {} };
export const R7_OSMOSIS_CONTEXT = createTaskContext({ ...input, taskId: 'M6.02', material: REVIEW_MATERIAL });
export const R7_TONOPLAST_CONTEXT = createTaskContext({ ...input, taskId: 'Z1.02', material: { highlightedStructureId: 'tonoplast' } });
const osmosis = createOsmosisEvaluator(R7_VERSIONS), tonoplast = createTonoplastEvaluator(R7_VERSIONS);
export { R7_KNOWN };
export const R7_CASES = [...R7_MAIN, ...R7_SYSTEMATIC, ...R7_TARGETED];
export const executeR7 = (f: Pick<R7Case, 'field' | 'text'>) => {
  const context = f.field === 'osmosis' ? R7_OSMOSIS_CONTEXT : R7_TONOPLAST_CONTEXT;
  const result = (f.field === 'osmosis' ? osmosis : tonoplast).evaluate(context, { fieldId: f.field === 'osmosis' ? 'process' : 'term', text: f.text }, 'independent');
  return { result, feedback: (f.field === 'osmosis' ? getOsmosisFeedback : getTonoplastFeedback)(result.feedbackCode) };
};
export const acceptedKnownR7 = (f: R7Case): readonly Status[] => {
  const original = { ...f, id: f.id.replace(/^previous[0123]-/u, ''), group: f.group.replace(/^previous[0123]-/u, '') };
  return f.id.startsWith('previous0-') ? acceptedKnownR6(original) : expectedRuntimeR6(original);
};

/** Observed unresolved gaps, not changed biological Soll. Both the existing
 * R6 gate and the new check of the same 95% requirement on R7 stay failing. */
export const R7_UNRESOLVED: readonly string[] = ["R7-013","R7-014","R7-015","R7-016","R7-017","R7-018","R7-019","R7-021","R7-024","R7-025","R7-030","R7-033","R7-041","R7-044","R7-048","R7-050","R7-051","R7-052","R7-054","R7-061","R7-062","R7-063","R7-064","R7-065","R7-066","R7-067","R7-068","R7-069","R7-070","R7-071","R7-072","R7-073","R7-074","R7-075","R7-100","R7-101","R7-102","R7-104","R7-105","R7-107","R7-120","R7-121","R7-122","R7-123","R7-124","R7-125","R7-126","R7-127","R7-133","R7-134","R7-135","R7-150","R7-151","R7-152","R7-153","R7-154","R7-155","R7-156","R7-157","R7-158","R7-159","R7-176","R7-179","R7SYS-097","R7SYS-098","R7SYS-099","R7SYS-101","R7SYS-103","R7SYS-104","R7SYS-105","R7SYS-106","R7SYS-107","R7SYS-109","R7SYS-111","R7SYS-112","R7SYS-113","R7SYS-114","R7SYS-115","R7SYS-117","R7SYS-119","R7SYS-120","R7SYS-121","R7SYS-122","R7SYS-123","R7SYS-125","R7SYS-127","R7SYS-128","R7SYS-129","R7SYS-130","R7SYS-131","R7SYS-133","R7SYS-135","R7SYS-136","R7SYS-137","R7SYS-138","R7SYS-139","R7SYS-141","R7SYS-143","R7SYS-144","R7SYS-145","R7SYS-146","R7SYS-147","R7SYS-149","R7SYS-151","R7SYS-152","R7SYS-241","R7SYS-245","R7SYS-256","R7SYS-260","R7SYS-261","R7SYS-265","R7SYS-286","R7SYS-290"];
export const expectedRuntimeR7 = (f: R7Case): readonly Status[] => R7_UNRESOLVED.includes(f.id) ? ['clarify'] : f.expected;

/** Canonical data order for full input/result digests, never answer parsing. */
export function canonicalReviewData(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalReviewData);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalReviewData((value as Record<string, unknown>)[key])]));
  return value;
}
