import { createTaskContext } from '../../src/domain/task-context.ts';
import { createOsmosisEvaluator } from '../../src/assessment/osmosis.ts';
import { createTonoplastEvaluator } from '../../src/assessment/tonoplast.ts';
import { getOsmosisFeedback } from '../../src/assessment/osmosis-feedback.ts';
import { getTonoplastFeedback } from '../../src/assessment/feedback.ts';
import { REVIEW_MATERIAL } from './p02b-second.ts';
import { acceptedThird } from './p02b-third.ts';
import { FOURTH_MAIN, FOURTH_TARGETED, FOURTH_KNOWN } from '../fixtures/p02b-20261023-r2-cases.ts';
import type { FourthCase } from '../fixtures/p02b-20261023-r2-cases.ts';
import { FOURTH_FRESH, FOURTH_METAMORPHIC } from '../fixtures/p02b-20261023-r2-fresh.ts';
import { FOURTH_ADDITIONS, FOURTH_ADDITIONAL_NEGATIVES } from '../fixtures/p02b-20261023-r2-additions.ts';
import type { Status } from '../../src/domain/contracts.ts';

export const FOURTH_VERSIONS = { taskVersion: 'review3-task-20261023', rubricVersion: 'review3-rubric-20261023', contentVersion: 'concept-1.0-20261023', modelVersion: 'review-no-simulation' };
const input = { ...FOURTH_VERSIONS, instanceId: 'independent-review3-PR6', seed: 'fixed-independent-review', phase: 'explain' as const, modelState: {} };
export const FOURTH_OSMOSIS_CONTEXT = createTaskContext({ ...input, taskId: 'M6.02', material: REVIEW_MATERIAL });
export const FOURTH_TONOPLAST_CONTEXT = createTaskContext({ ...input, taskId: 'Z1.02', material: { highlightedStructureId: 'tonoplast' } });
const osmosis = createOsmosisEvaluator(FOURTH_VERSIONS), tonoplast = createTonoplastEvaluator(FOURTH_VERSIONS);
export const FOURTH_NOVEL = [...FOURTH_FRESH.filter(f => !['r2-fresh-short-3', 'r2-fresh-short-16'].includes(f.id)), ...FOURTH_ADDITIONS];
export const FOURTH_CASES = [...FOURTH_MAIN, ...FOURTH_TARGETED, ...FOURTH_KNOWN,
  ...FOURTH_FRESH.map(f => ({ ...f, group: ['r2-fresh-short-3', 'r2-fresh-short-16'].includes(f.id) ? 'known-overlap' : f.group })),
  ...FOURTH_ADDITIONS, ...FOURTH_METAMORPHIC, ...FOURTH_ADDITIONAL_NEGATIVES];
export const executeFourth = (f: Pick<FourthCase, 'field' | 'text'>) => {
  const context = f.field === 'osmosis' ? FOURTH_OSMOSIS_CONTEXT : FOURTH_TONOPLAST_CONTEXT;
  const result = (f.field === 'osmosis' ? osmosis : tonoplast).evaluate(context, { fieldId: f.field === 'osmosis' ? 'process' : 'term', text: f.text }, 'independent');
  return { result, feedback: (f.field === 'osmosis' ? getOsmosisFeedback : getTonoplastFeedback)(result.feedbackCode) };
};
/** Original expectations remain unchanged. Earlier adjudication is reused only
 * for the corresponding earlier record; long explanations remain outside C01. */
export function acceptedFourth(f: FourthCase): readonly Status[] {
  if (f.group === 'long-correct') return ['correct', 'clarify'];
  if (/^known[123]-/u.test(f.id)) return acceptedThird({ ...f, id: f.id.replace(/^known[123]-/u, ''), group: f.group.replace(/^known[123]-/u, '') });
  return f.expected;
}

/** Source-motivated boundary diagnostics, not a fresh recognition sample. */
export const FOURTH_RETRACTION_CASES: readonly FourthCase[] = ([
  ['osmosis', 'Endocytose', 'Exocytose', 'Osmose'],
  ['tonoplast', 'Zellwand', 'Zellmembran', 'Tonoplast'],
] as const).flatMap(([field, first, second, target]) => [
  ...[
    `${first}. Es ist in Wirklichkeit ${second}. Es ist in Wirklichkeit ${target}.`,
    `${first}. Es ist in Wirklichkeit ${second}. Es ist in Wirklichkeit ${second}. Es ist in Wirklichkeit ${target}.`,
    `Nicht ${first}, sondern ${second}. Es ist in Wirklichkeit ${target}.`,
    `${target}. Es ist in Wirklichkeit ${first}. Es ist in Wirklichkeit ${target}.`,
  ].map((text, i): FourthCase => ({ id: `retraction-${field}-${i + 1}`, group: 'repeated-retraction', field, text, expected: ['clarify'] })),
  { id: `retraction-${field}-confirmation`, group: 'retraction-control', field, text: `${first}. Es ist in Wirklichkeit ${target}. Es ist in Wirklichkeit ${target}.`, expected: ['correct'] },
  { id: `retraction-${field}-exclusion`, group: 'retraction-control', field, text: `Nicht ${target}, sondern ${target}. Es ist in Wirklichkeit ${target}.`, expected: ['incorrect'] },
]);
