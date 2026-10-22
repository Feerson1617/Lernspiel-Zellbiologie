import { createAttemptRecord, ProgressContractError } from '../domain/progress.ts';
import type { AttemptRecord } from '../domain/progress.ts';
import { isResultForContext } from '../domain/task-context.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { parseEvaluationResult } from './result.ts';

/** Explicit handoff only. Drops ALL evidence/raw spans; never writes browser storage. */
export function createEvaluatedAttempt(attemptId: string, input: unknown, activeContext: TaskContext): AttemptRecord {
  const result = parseEvaluationResult(input);
  if (!isResultForContext(result, activeContext)) throw new ProgressContractError('CONTEXT_MISMATCH');
  return createAttemptRecord(attemptId, {
    taskId: result.taskId, taskVersion: result.taskVersion, rubricVersion: result.rubricVersion,
    contextHash: result.contextHash, status: result.status, assistance: result.assistance,
  }, activeContext);
}
