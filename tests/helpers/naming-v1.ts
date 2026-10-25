import { createTaskContext } from '../../src/domain/task-context.ts';
import type { TaskContext } from '../../src/domain/task-context.ts';
import { NAMING_CONTRACT, namingVersions } from '../../src/domain/naming-contract.ts';
import type { NamingTaskId, NamingSubmission } from '../../src/domain/naming-contract.ts';
import { OSMOSIS_TEST_MATERIAL } from './osmosis.ts';

export function namingContext(taskId: NamingTaskId, change: Partial<TaskContext> = {}): TaskContext {
  return createTaskContext({ ...namingVersions(taskId, 'review-no-simulation'), taskId,
    instanceId: `naming-test-${taskId}`, seed: 'fixed-synthetic-material-1', phase: 'explain',
    material: taskId === 'Z1.02' ? { highlightedStructureId: 'tonoplast', cellProfile: 'onion_epidermis' } : OSMOSIS_TEST_MATERIAL,
    modelState: {}, ...change,
  });
}
export function namingInput(taskId: NamingTaskId, termText: string, additionalStatements: readonly string[] = []): NamingSubmission {
  return { contractVersion: NAMING_CONTRACT, target: taskId === 'Z1.02' ? { taskId, fieldId: 'term' } : { taskId, fieldId: 'process' },
    context: namingContext(taskId), attemptId: 'synthetic-attempt', revision: 1, predecessorId: null, termText, additionalStatements };
}
export const INDEPENDENT_SUPPORT = Object.freeze({ assistance: 'independent', history: 'verified', origin: 'typed', events: [] } as const);
