import type { VersionInfo, Status } from './contracts.ts';
import { readDataRecord } from './context-data.ts';
import type { TaskContext } from './task-context.ts';
import { parseTaskContext } from './task-context.ts';
import { namingSnapshot, exactNamingFields, namingRequire } from './naming-contract.ts';
import type { NamingSupport, NamingFeedback } from './naming-contract.ts';
import { requireAssessmentLabel } from '../assessment/result.ts';
import type { EvaluationResult } from '../assessment/result.ts';

export const M602_CONTRACT = 'm602-response/1.0.0' as const;
export const M602_FIELDS = Object.freeze(['process', 'direction', 'volume'] as const);
export type M602Field = typeof M602_FIELDS[number];
export const M602_CRITERIA = Object.freeze({ process: 'M6.02.C01', direction: 'M6.02.C02', volume: 'M6.02.C03' });
export function m602Versions(modelVersion: string): VersionInfo {
  requireAssessmentLabel(modelVersion);
  return Object.freeze({ taskVersion: 'M6.02@relations-input-1', rubricVersion: 'M6.02.C01-C03@concept-1-scope-1', contentVersion: 'zelllabor11.m602-content/1.0.0', modelVersion });
}
export interface M602Submission {
  readonly contractVersion: typeof M602_CONTRACT;
  readonly context: TaskContext;
  readonly attemptId: string;
  readonly revision: number;
  readonly predecessorId: string | null;
  readonly answers: Readonly<Record<M602Field, string>>;
  readonly additionalStatements: readonly string[];
}
export function parseM602Submission(input: unknown): M602Submission {
  const s = namingSnapshot(readDataRecord(input));
  exactNamingFields(s, ['contractVersion', 'context', 'attemptId', 'revision', 'predecessorId', 'answers', 'additionalStatements']);
  namingRequire(s['contractVersion'] === M602_CONTRACT, 'M602_CONTRACT');
  const c = parseTaskContext(s['context']); namingRequire(c.taskId === 'M6.02', 'M602_TASK');
  const answers = readDataRecord(s['answers']); exactNamingFields(answers, M602_FIELDS);
  namingRequire(M602_FIELDS.every(f => typeof answers[f] === 'string'), 'M602_ANSWERS');
  requireAssessmentLabel(s['attemptId']); if (s['predecessorId'] !== null) requireAssessmentLabel(s['predecessorId']);
  namingRequire(Number.isSafeInteger(s['revision']) && (s['revision'] as number) > 0, 'M602_REVISION');
  namingRequire(Array.isArray(s['additionalStatements']) && s['additionalStatements'].length <= 3 && s['additionalStatements'].every(v => typeof v === 'string'), 'M602_EXTRAS');
  return s as unknown as M602Submission;
}
export interface M602FieldOutcome {
  readonly field: M602Field;
  readonly result: EvaluationResult;
  readonly feedback: NamingFeedback;
}
export interface M602Unassessed {
  readonly field: M602Field | 'additionalStatements';
  readonly index: number | null;
  readonly status: 'not_assessed';
  readonly value: string;
  readonly start: number;
  readonly end: number;
}
export interface M602Outcome {
  readonly contractVersion: typeof M602_CONTRACT;
  readonly submission: M602Submission;
  readonly fields: Readonly<Record<M602Field, M602FieldOutcome>>;
  readonly fullResult: EvaluationResult;
  readonly overallStatus: Status;
  readonly pendingCriteria: readonly string[];
  readonly notAssessed: readonly M602Unassessed[];
  readonly support: Readonly<Pick<NamingSupport, 'assistance' | 'history' | 'events'>>;
  readonly fieldSupport: Readonly<Record<M602Field, NamingSupport>>;
}
