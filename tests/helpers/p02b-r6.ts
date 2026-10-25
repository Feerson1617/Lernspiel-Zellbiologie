import type { Status } from '../../src/domain/contracts.ts';
import type { R6Case } from '../fixtures/p02b-r6-cases.ts';
import { R6_MAIN, R6_SYSTEMATIC, R6_TARGETED, R6_KNOWN } from '../fixtures/p02b-r6-cases.ts';
import { R6_FRESH, R6_VARIANTS } from '../fixtures/p02b-r6-fresh.ts';
import { R6_BOUNDARIES } from '../fixtures/p02b-r6-boundaries.ts';
import { acceptedKnownR5, expectedRuntimeR5 } from './p02b-r5.ts';
export { executeR5 as executeR6, R5_VERSIONS as R6_VERSIONS, R5_OSMOSIS_CONTEXT as R6_OSMOSIS_CONTEXT, R5_TONOPLAST_CONTEXT as R6_TONOPLAST_CONTEXT } from './p02b-r5.ts';
export { R6_KNOWN };
export const R6_CASES = [...R6_MAIN, ...R6_SYSTEMATIC, ...R6_TARGETED, ...R6_FRESH, ...R6_VARIANTS, ...R6_BOUNDARIES];
export const acceptedKnownR6 = (f: R6Case): readonly Status[] => {
  const original = { ...f, id: f.id.replace(/^previous[0123]-/u, ''), group: f.group.replace(/^previous[0123]-/u, '') };
  return f.id.startsWith('previous0-') ? acceptedKnownR5(original) : expectedRuntimeR5(original);
};

/** Measured unresolved gaps, never revised biological Soll or release acceptance.
 * The separate 95% content gate deliberately remains failing. */
export const R6_UNRESOLVED: readonly string[] = ["R6-061", "R6-062", "R6-063", "R6-064", "R6-065", "R6-066", "R6-067", "R6-068", "R6-069", "R6-070", "R6-071", "R6-072", "R6-073", "R6-074", "R6-075", "R6-098", "R6-100", "R6-101", "R6-103", "R6-106", "R6-107", "R6-120", "R6-121", "R6-122", "R6-123", "R6-124", "R6-125", "R6-127", "R6-132", "R6-133", "R6-134", "R6-150", "R6-151", "R6-152", "R6-153", "R6-154", "R6-155", "R6-156", "R6-157", "R6-158", "R6-159", "R6-179", "r6-fresh-7", "r6-fresh-18", "r6-fresh-40", "r6-fresh-44", "r6-wrong-7-1", "r6-wrong-7-2", "r6-wrong-7-3", "r6-partial-7", "r6-negative-7", "r6-contradiction-7", "r6-wrong-18-1", "r6-wrong-18-2", "r6-wrong-18-3", "r6-partial-18", "r6-negative-18", "r6-contradiction-18", "r6-wrong-40-1", "r6-wrong-40-2", "r6-wrong-40-3", "r6-partial-40", "r6-negative-40", "r6-contradiction-40", "r6-wrong-44-1", "r6-wrong-44-2", "r6-wrong-44-3", "r6-partial-44", "r6-negative-44", "r6-contradiction-44"];
export const expectedRuntimeR6 = (f: R6Case): readonly Status[] =>
  f.id === 'R6DIAG-23' ? ['incorrect'] : R6_UNRESOLVED.includes(f.id) ? ['clarify'] : f.expected;
