import { createTaskContext } from '../../src/domain/task-context.ts';
import { createOsmosisEvaluator } from '../../src/assessment/osmosis.ts';
import type { OsmosisMaterial } from '../../src/assessment/osmosis-context.ts';

/** Explicit technical labels and illustrative material values, not invented model release versions. */
export const OSMOSIS_TEST_VERSIONS = Object.freeze({ taskVersion: 'test-task', rubricVersion: 'test-osmosis-rubric', contentVersion: 'test-content', modelVersion: 'test-no-simulation' });
export const OSMOSIS_TEST_MATERIAL = Object.freeze({
  cellProfile: 'onion_epidermis', cellIntegrity: 'intact', observationPhase: 'early_water_loss_after_solution_change',
  waterPotential: Object.freeze({ unit: 'Pa', vacuole: -100_000, cytosol: -300_000, external: -700_000 }),
  waterPermeability: Object.freeze({ cellMembrane: true, tonoplast: true }),
  sucroseRetention: 'largely_retained', otherTransport: 'excluded',
} satisfies OsmosisMaterial);
export const OSMOSIS_TEST_CONTEXT = createTaskContext({ ...OSMOSIS_TEST_VERSIONS, taskId: 'M6.02', instanceId: 'test-osmosis-instance', seed: 'test-seed', phase: 'explain', material: OSMOSIS_TEST_MATERIAL, modelState: {} });
export const OSMOSIS_TEST_EVALUATOR = createOsmosisEvaluator(OSMOSIS_TEST_VERSIONS);
