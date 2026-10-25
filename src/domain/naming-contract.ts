import type { Assistance, Status, VersionInfo } from './contracts.ts';
import { ASSISTANCE_KINDS } from './contracts.ts';
import { readDataRecord, snapshotContextData } from './context-data.ts';
import type { TaskContext } from './task-context.ts';
import { parseTaskContext } from './task-context.ts';
import type { EvaluationResult } from '../assessment/result.ts';
import { requireAssessmentLabel } from '../assessment/result.ts';

export const NAMING_CONTRACT = 'naming-input/1.0.0' as const;
export const NAMING_CONTENT = 'zelllabor11.naming-content/1.0.0' as const;
export type NamingTarget = Readonly<{ taskId: 'Z1.02'; fieldId: 'term' }> | Readonly<{ taskId: 'M6.02'; fieldId: 'process' }>;
export type NamingTaskId = NamingTarget['taskId'];
export function namingVersions(taskId: NamingTaskId, modelVersion: string): VersionInfo {
  if (taskId !== 'Z1.02' && taskId !== 'M6.02') throw new NamingContractError('TARGET');
  requireAssessmentLabel(modelVersion);
  return Object.freeze({ taskVersion: `${taskId}@term-input-1`, rubricVersion: `${taskId}.C01@concept-1-scope-1`, contentVersion: NAMING_CONTENT, modelVersion });
}
export function isNamingTaskVersion(value: string): boolean {
  return value === 'Z1.02@term-input-1' || value === 'M6.02@term-input-1';
}
export class NamingContractError extends Error {
  readonly code: string;
  constructor(code: string) { super(`Ungültige Begriffseingabe: ${code}`); this.code = code; this.name = 'NamingContractError'; }
}
export function namingRequire(condition: unknown, code: string): asserts condition {
  if (!condition) throw new NamingContractError(code);
}
export function exactNamingFields(value: Readonly<Record<string, unknown>>, fields: readonly string[]): void {
  namingRequire(Object.keys(value).length === fields.length && fields.every(key => Object.hasOwn(value, key)), 'FIELDS');
}
/** JSON snapshot without executable properties; input objects are never retained. */
export function namingSnapshot<T>(input: T): T {
  return snapshotContextData(input).value as unknown as T;
}
export interface NamingSubmission {
  readonly contractVersion: typeof NAMING_CONTRACT;
  readonly target: NamingTarget;
  readonly context: TaskContext;
  readonly attemptId: string;
  readonly revision: number;
  readonly predecessorId: string | null;
  readonly termText: string;
  readonly additionalStatements: readonly string[];
}
export function parseNamingSubmission(input: unknown): NamingSubmission {
  const value = snapshotContextData(input).value;
  exactNamingFields(value, ['contractVersion', 'target', 'context', 'attemptId', 'revision', 'predecessorId', 'termText', 'additionalStatements']);
  namingRequire(value['contractVersion'] === NAMING_CONTRACT, 'CONTRACT_VERSION');
  const target = readDataRecord(value['target']);
  exactNamingFields(target, ['taskId', 'fieldId']);
  namingRequire((target['taskId'] === 'Z1.02' && target['fieldId'] === 'term') || (target['taskId'] === 'M6.02' && target['fieldId'] === 'process'), 'TARGET');
  const context = parseTaskContext(value['context']);
  namingRequire(context.taskId === target['taskId'], 'TARGET_CONTEXT');
  for (const label of [value['attemptId'], context.modelVersion, context.instanceId, context.seed]) requireAssessmentLabel(label);
  if (value['predecessorId'] !== null) requireAssessmentLabel(value['predecessorId']);
  namingRequire(Number.isSafeInteger(value['revision']) && (value['revision'] as number) >= 1, 'REVISION');
  namingRequire(typeof value['termText'] === 'string' && Array.isArray(value['additionalStatements']) && value['additionalStatements'].length <= 3 && value['additionalStatements'].every(v => typeof v === 'string'), 'TEXT_SHAPE');
  return value as unknown as NamingSubmission;
}
export interface NamingHelpEvent {
  readonly id: string;
  readonly kind: Exclude<Assistance, 'independent'>;
  readonly contextHash: string;
}
export interface NamingSupport {
  readonly assistance: Assistance;
  readonly history: 'verified' | 'history_unverified';
  readonly origin: 'typed' | 'wordbank_selection';
  readonly events: readonly NamingHelpEvent[];
}
export function createNamingSupport(input: NamingSupport): NamingSupport {
  const s = namingSnapshot(input);
  exactNamingFields(readDataRecord(s), ['assistance', 'history', 'origin', 'events']);
  namingRequire(ASSISTANCE_KINDS.includes(s.assistance) && ['verified', 'history_unverified'].includes(s.history) && ['typed', 'wordbank_selection'].includes(s.origin) && Array.isArray(s.events), 'SUPPORT');
  const ids = new Set<string>();
  let highest = 0;
  for (const event of s.events) {
    exactNamingFields(readDataRecord(event), ['id', 'kind', 'contextHash']);
    requireAssessmentLabel(event.id);
    namingRequire(!ids.has(event.id) && ASSISTANCE_KINDS.indexOf(event.kind) > 0 && /^sha256-v1:[a-f0-9]{64}$/.test(event.contextHash), 'HELP_EVENT');
    ids.add(event.id); highest = Math.max(highest, ASSISTANCE_KINDS.indexOf(event.kind));
  }
  // Loaded metadata may provide a conservative lower bound, never a fabricated event.
  namingRequire(ASSISTANCE_KINDS.indexOf(s.assistance) >= highest && (s.history === 'history_unverified' || ASSISTANCE_KINDS.indexOf(s.assistance) === highest), 'HELP_PROVENANCE');
  namingRequire(s.origin !== 'wordbank_selection' || s.events.some(e => e.kind === 'clarified'), 'SELECTION_PROVENANCE');
  return s;
}
export interface NamingFeedback {
  readonly recognized: string;
  readonly difference: string;
  readonly next: string;
}
export interface UnassessedNamingText {
  readonly field: 'termText' | 'additionalStatements';
  readonly index: number | null;
  readonly status: 'not_assessed';
  readonly value: string;
  readonly start: number;
  readonly end: number;
}
export interface NamingOutcome {
  readonly contractVersion: typeof NAMING_CONTRACT;
  readonly submission: NamingSubmission;
  readonly termResult: EvaluationResult;
  readonly assessedScope: Readonly<{ fieldId: 'term' | 'process'; criterionId: 'Z1.02.C01' | 'M6.02.C01' }>;
  readonly notAssessed: readonly UnassessedNamingText[];
  readonly pendingCriteria: readonly string[];
  readonly overallStatus: Status;
  readonly unassessedRelevantText: boolean;
  readonly reasonCode: string;
  readonly feedback: NamingFeedback;
  readonly support: NamingSupport;
}
