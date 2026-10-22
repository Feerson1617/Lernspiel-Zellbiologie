import { createTaskContext } from '../../src/domain/task-context.ts';
import { createOsmosisEvaluator } from '../../src/assessment/osmosis.ts';
import { createTonoplastEvaluator } from '../../src/assessment/tonoplast.ts';
import { COUNTERCHECK_CASES } from '../fixtures/p02b-countercheck-cases.ts';
import { FRESH_LONG, FRESH_SHORT } from '../fixtures/p02b-second-language.ts';

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
export const runSecondCase = (field: 'osmosis' | 'tonoplast', text: string) => field === 'osmosis'
  ? REVIEW_OSMOSIS.evaluate(REVIEW_OSMOSIS_CONTEXT, { fieldId: 'process', text }, 'independent')
  : REVIEW_TONOPLAST.evaluate(REVIEW_TONOPLAST_CONTEXT, { fieldId: 'term', text }, 'independent');
