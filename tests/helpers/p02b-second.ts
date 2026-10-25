import { createTaskContext } from '../../src/domain/task-context.ts';
import { createOsmosisEvaluator } from '../../src/assessment/osmosis.ts';
import { createTonoplastEvaluator } from '../../src/assessment/tonoplast.ts';
import { COUNTERCHECK_CASES } from '../fixtures/p02b-countercheck-cases.ts';
import { FRESH_LONG, FRESH_SHORT } from '../fixtures/p02b-second-language.ts';
import type { ReviewCase } from '../fixtures/p02b-countercheck-cases.ts';

/** Exact supplied illustrative context, not a simulation release. */
export const REVIEW_VERSIONS = { taskVersion: 'review-task-20261022', rubricVersion: 'review-rubric-20261022', contentVersion: 'concept-1.0-20261022', modelVersion: 'review-no-simulation' };
export const REVIEW_MATERIAL = {
  cellProfile: 'onion_epidermis', cellIntegrity: 'intact', observationPhase: 'early_water_loss_after_solution_change',
  waterPotential: { unit: 'Pa', vacuole: -120_000, cytosol: -350_000, external: -810_000 },
  waterPermeability: { cellMembrane: true, tonoplast: true }, sucroseRetention: 'largely_retained', otherTransport: 'excluded',
};
const input = { ...REVIEW_VERSIONS, instanceId: 'independent-review-PR6', seed: 'fixed-independent-review', phase: 'explain' as const, modelState: {} };
export const REVIEW_OSMOSIS_CONTEXT = createTaskContext({ ...input, taskId: 'M6.02', material: REVIEW_MATERIAL });
export const REVIEW_TONOPLAST_CONTEXT = createTaskContext({ ...input, taskId: 'Z1.02', material: { highlightedStructureId: 'tonoplast' } });
export const REVIEW_OSMOSIS = createOsmosisEvaluator(REVIEW_VERSIONS);
export const REVIEW_TONOPLAST = createTonoplastEvaluator(REVIEW_VERSIONS);
export const SECOND_CASES = [...COUNTERCHECK_CASES, ...FRESH_SHORT, ...FRESH_LONG];
/** Extra scope regressions derived during implementation, not a fresh recognition sample. */
export const FIELD_SCOPE_CASES: readonly ReviewCase[] = [
  ...[
    'Ich nehme an, dass der Vorgang X heißt.', 'Ich nenne als Vorgang X.',
    'X, so heißt der Vorgang.', 'X, so würde ich den Vorgang nennen.',
  ].flatMap((frame, i) => [
    { field: 'tonoplast' as const, text: frame.replace('X', 'Tonoplast'), expected: ['clarify' as const] },
    { field: 'osmosis' as const, text: frame.replace('X', 'Osmose'), expected: ['correct' as const] },
    { field: 'osmosis' as const, text: frame.replace('X', 'Plasmolyse'), expected: ['incorrect' as const] },
    { field: 'osmosis' as const, text: frame.replace('X', 'Osmose oder Plasmolyse'), expected: ['clarify' as const] },
  ].map((f, j) => ({ ...f, id: `scope-process-${i + 1}-${j + 1}`, group: 'field-scope', rationale: 'Process reference belongs exclusively to the osmosis profile.' }))),
  ...['Die Membran heißt X.', 'Ich würde die Grenze X nennen.'].flatMap((frame, i) => [
    { field: 'osmosis' as const, text: frame.replace('X', 'Osmose'), expected: ['clarify' as const] },
    { field: 'tonoplast' as const, text: frame.replace('X', 'Tonoplast'), expected: ['correct' as const] },
  ].map((f, j) => ({ ...f, id: `scope-membrane-${i + 1}-${j + 1}`, group: 'field-scope', rationale: 'Membrane reference belongs exclusively to the tonoplast profile.' }))),
];
export const runSecondCase = (field: 'osmosis' | 'tonoplast', text: string) => field === 'osmosis'
  ? REVIEW_OSMOSIS.evaluate(REVIEW_OSMOSIS_CONTEXT, { fieldId: 'process', text }, 'independent')
  : REVIEW_TONOPLAST.evaluate(REVIEW_TONOPLAST_CONTEXT, { fieldId: 'term', text }, 'independent');
