import type { TaskContext } from '../../src/domain/task-context.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';
import { m602CuedVersions, M602_CUED_CONTRACT } from '../../src/domain/m602-cued-contract.ts';
import type { M602CuedSubmission } from '../../src/domain/m602-cued-contract.ts';
import type { M602Field } from '../../src/domain/m602-contract.ts';
import { m602Context as legacyContext, M602_SUPPORT } from './m602.ts';
export { M602_SUPPORT };
export function m602CuedContext(change: Partial<TaskContext> = {}): TaskContext {
  const { contextHash: _hash, ...original } = legacyContext();
  return createTaskContext({ ...original, ...m602CuedVersions(original.modelVersion), ...change });
}
export function m602CuedInput(answers: Partial<Record<M602Field, string>> = {}, extras: readonly string[] = []): M602CuedSubmission {
  return { contractVersion: M602_CUED_CONTRACT, context: m602CuedContext(), attemptId: 'cued-attempt', revision: 1, predecessorId: null,
    answers: { process: 'Osmose', direction: 'nach außen', volume: 'nimmt ab', ...answers }, additionalStatements: extras };
}
