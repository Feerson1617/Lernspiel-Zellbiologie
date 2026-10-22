import { createTonoplastEvaluator } from '../../src/assessment/tonoplast.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';

/** Technical labels for tests only; no release or biological model version is invented. */
export const TEST_VERSIONS = Object.freeze({ taskVersion: 'test-task', rubricVersion: 'test-rubric', contentVersion: 'test-content', modelVersion: 'test-no-simulation' });
export const TEST_CONTEXT = createTaskContext({ ...TEST_VERSIONS, taskId: 'Z1.02', instanceId: 'test-instance', seed: 'test-seed', phase: 'explain', material: { highlightedStructureId: 'tonoplast' }, modelState: {} });
export const TEST_EVALUATOR = createTonoplastEvaluator(TEST_VERSIONS);
