import { createTaskContext } from '../../src/domain/task-context.ts';
import type { TaskContext } from '../../src/domain/task-context.ts';
import { m602Versions, M602_CONTRACT } from '../../src/domain/m602-contract.ts';
import type { M602Submission, M602Field } from '../../src/domain/m602-contract.ts';
import { OSMOSIS_TEST_MATERIAL } from './osmosis.ts';
import { INDEPENDENT_SUPPORT } from './naming-v1.ts';
export const M602_SUPPORT = Object.freeze({ process: INDEPENDENT_SUPPORT, direction: INDEPENDENT_SUPPORT, volume: INDEPENDENT_SUPPORT });
export function m602Context(change: Partial<TaskContext> = {}): TaskContext {
  return createTaskContext({ ...m602Versions('review-no-simulation'), taskId: 'M6.02', instanceId: 'm602-material-A', seed: 'm602-seed-A', phase: 'explain', material: OSMOSIS_TEST_MATERIAL, modelState: {}, ...change });
}
export function m602Input(answers: Partial<Record<M602Field, string>> = {}, extras: readonly string[] = []): M602Submission {
  return { contractVersion: M602_CONTRACT, context: m602Context(), attemptId: 'm602-attempt', revision: 1, predecessorId: null,
    answers: { process: 'Osmose', direction: 'nach außen', volume: 'nimmt ab', ...answers }, additionalStatements: extras };
}
