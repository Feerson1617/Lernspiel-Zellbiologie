import { createAttemptRecord, ProgressContractError } from '../domain/progress.ts';
import type { AttemptRecord } from '../domain/progress.ts';
import { isResultForContext } from '../domain/task-context.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { parseEvaluationResult } from './result.ts';

export class IncompleteTaskAssessmentError extends Error {
  constructor() { super('A field-only assessment cannot be recorded as a complete task.'); this.name = 'IncompleteTaskAssessmentError'; }
}

/** Explicit handoff only. Drops ALL evidence/raw spans; never writes browser storage. */
export function createEvaluatedAttempt(attemptId: string, input: unknown, activeContext: TaskContext): AttemptRecord {
  const result = parseEvaluationResult(input);
  if (!isResultForContext(result, activeContext)) throw new ProgressContractError('CONTEXT_MISMATCH');
  // Z1.02 is still the only fully implemented task. M6.02/process is only C01
  // of three required criteria; its correct field status is not task completion.
  if (result.taskId !== 'Z1.02' || result.criteria.length !== 1 || result.criteria[0]?.id !== 'Z1.02.C01') throw new IncompleteTaskAssessmentError();
  return createAttemptRecord(attemptId, {
    taskId: result.taskId, taskVersion: result.taskVersion, rubricVersion: result.rubricVersion,
    contextHash: result.contextHash, status: result.status, assistance: result.assistance,
  }, activeContext);
}
