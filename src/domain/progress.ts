import { ASSISTANCE_KINDS, STATUSES } from './contracts.ts';
import type { Assistance, Status } from './contracts.ts';
import { ContextContractError, readDataRecord, snapshotContextData } from './context-data.ts';
import { isMissionId, isTaskId } from './identities.ts';
import type { MissionId, TaskId } from './identities.ts';
import { createContextBinding, isResultForContext, parseTaskContext } from './task-context.ts';
import type { ContextBinding, TaskContext } from './task-context.ts';

export interface AttemptRecord {
  readonly attemptId: string;
  readonly taskId: TaskId;
  readonly instanceId: string;
  readonly taskVersion: string;
  readonly rubricVersion: string;
  readonly modelVersion: string;
  readonly status: Status;
  readonly assistance: Assistance;
}

/** Exact persistence shape from spec/progress.schema.json. One content version per envelope. */
export interface ProgressEnvelope {
  readonly schemaVersion: 1;
  readonly contentVersion: string;
  readonly attempts: readonly AttemptRecord[];
  readonly recommendedMissionIds?: readonly MissionId[];
  readonly selectedMissionId?: MissionId;
}

export type ProgressErrorCode = 'INVALID_DATA' | 'UNSUPPORTED_SCHEMA' | 'INVALID_ID'
  | 'INVALID_LABEL' | 'DUPLICATE_ID' | 'CONTEXT_MISMATCH' | 'CONTENT_VERSION_MISMATCH' | 'ASSISTANCE_REGRESSION';
export class ProgressContractError extends Error {
  constructor(readonly code: ProgressErrorCode) {
    super(`Invalid progress: ${code}.`);
    this.name = 'ProgressContractError';
  }
}

const ATTEMPT_FIELDS = ['attemptId', 'taskId', 'instanceId', 'taskVersion', 'rubricVersion', 'modelVersion', 'status', 'assistance'];
const ROOT_FIELDS = ['schemaVersion', 'contentVersion', 'attempts', 'recommendedMissionIds', 'selectedMissionId'];
const sessionBindings = new WeakMap<AttemptRecord, Readonly<{ binding: ContextBinding; contentVersion: string }>>();

function fail(code: ProgressErrorCode): never { throw new ProgressContractError(code); }
function exact(record: Readonly<Record<string, unknown>>, required: readonly string[], allowed = required): void {
  if (!required.every((key) => Object.hasOwn(record, key)) || Object.keys(record).some((key) => !allowed.includes(key))) fail('INVALID_DATA');
}
export function requireProgressLabel(value: unknown): asserts value is string {
  // Technical labels, never pupil text. No coercion, trimming or invented versions.
  if (typeof value !== 'string' || value.length === 0 || value.length > 256 || value.trim() !== value || /[\u0000-\u001f\u007f]/.test(value)) fail('INVALID_LABEL');
}

/** Untrusted input is copied and deeply frozen. Parsing NEVER restores session trust. */
export function parseProgress(input: unknown): ProgressEnvelope {
  try {
    const root = readDataRecord(input);
    if (!Object.hasOwn(root, 'schemaVersion')) fail('INVALID_DATA');
    if (root['schemaVersion'] !== 1) fail('UNSUPPORTED_SCHEMA');
    const value = snapshotContextData(input).value;
    exact(value, ['schemaVersion', 'contentVersion', 'attempts'], ROOT_FIELDS);
    requireProgressLabel(value['contentVersion']);
    if (!Array.isArray(value['attempts'])) fail('INVALID_DATA');
    const ids = new Set<string>();
    const usedHelp = new Map<string, Readonly<{ supported: boolean; solutionViewed: boolean }>>();
    for (const item of value['attempts']) {
      const attempt = readDataRecord(item);
      exact(attempt, ATTEMPT_FIELDS);
      if (!isTaskId(attempt['taskId'])) fail('INVALID_ID');
      for (const field of ['attemptId', 'instanceId', 'taskVersion', 'rubricVersion', 'modelVersion']) requireProgressLabel(attempt[field]);
      const id = attempt['attemptId'] as string;
      if (ids.has(id)) fail('DUPLICATE_ID');
      ids.add(id);
      if (!STATUSES.includes(attempt['status'] as Status) || !ASSISTANCE_KINDS.includes(attempt['assistance'] as Assistance)) fail('INVALID_DATA');
      // Append order is history order. A new example needs a new instance ID.
      const instanceKey = JSON.stringify(['taskId', 'instanceId', 'taskVersion', 'rubricVersion', 'modelVersion'].map((key) => attempt[key]));
      const previous = usedHelp.get(instanceKey);
      if ((previous?.supported && attempt['assistance'] === 'independent')
        || (previous?.solutionViewed && attempt['assistance'] !== 'solution_viewed')) fail('ASSISTANCE_REGRESSION');
      usedHelp.set(instanceKey, { supported: previous?.supported === true || attempt['assistance'] !== 'independent',
        solutionViewed: previous?.solutionViewed === true || attempt['assistance'] === 'solution_viewed' });
    }
    if (Object.hasOwn(value, 'selectedMissionId') && !isMissionId(value['selectedMissionId'])) fail('INVALID_ID');
    if (Object.hasOwn(value, 'recommendedMissionIds')) {
      const missions = value['recommendedMissionIds'];
      if (!Array.isArray(missions) || !missions.every(isMissionId)) fail('INVALID_ID');
      if (new Set(missions).size !== missions.length) fail('DUPLICATE_ID');
    }
    return value as unknown as ProgressEnvelope;
  } catch (error) {
    if (error instanceof ContextContractError) fail('INVALID_DATA');
    throw error;
  }
}

/** Internal application snapshots retain only receipts already held in this session. */
export function snapshotProgress(input: ProgressEnvelope): ProgressEnvelope {
  const copy = parseProgress(input);
  copy.attempts.forEach((attempt, index) => {
    const original = input.attempts[index];
    const binding = original && sessionBindings.get(original);
    if (binding) sessionBindings.set(attempt, binding);
  });
  return copy;
}

/** P02 handoff only: status is supplied by the future corrector, never inferred here. */
export interface AssessmentHandoff extends ContextBinding {
  readonly status: Status;
  readonly assistance: Assistance;
}

export function createAttemptRecord(attemptId: string, result: AssessmentHandoff, context: TaskContext): AttemptRecord {
  const active = parseTaskContext(context);
  const record = readDataRecord(result);
  exact(record, ['taskId', 'taskVersion', 'rubricVersion', 'contextHash', 'status', 'assistance']);
  if (!isResultForContext(result, active)) fail('CONTEXT_MISMATCH');
  const attempt = parseProgress({ schemaVersion: 1, contentVersion: active.contentVersion, attempts: [{
    attemptId, taskId: active.taskId, instanceId: active.instanceId, taskVersion: active.taskVersion,
    rubricVersion: active.rubricVersion, modelVersion: active.modelVersion,
    status: record['status'], assistance: record['assistance'],
  }] }).attempts[0];
  if (!attempt) fail('INVALID_DATA');
  sessionBindings.set(attempt, Object.freeze({ binding: createContextBinding(active), contentVersion: active.contentVersion }));
  return attempt;
}

export function appendAttempt(progress: ProgressEnvelope, attempt: AttemptRecord): ProgressEnvelope {
  const checked = snapshotProgress(progress);
  const receipt = sessionBindings.get(attempt);
  if (receipt && receipt.contentVersion !== checked.contentVersion) fail('CONTEXT_MISMATCH');
  return snapshotProgress({ ...checked, attempts: [...checked.attempts, attempt] });
}

export type AttemptValidity = 'current' | 'version_mismatch' | 'context_unverified' | 'context_mismatch';
export interface AttemptOutcome {
  readonly validity: AttemptValidity;
  readonly status: Status;
  readonly assistance: Assistance;
  readonly successful: boolean;
  /** A concrete independent attempt, not a competence/mastery certificate. */
  readonly independent: boolean;
}

/** Stored successes alone cannot become current successes: schema v1 has no context hash. */
export function getAttemptOutcome(progress: ProgressEnvelope, attemptId: string, context: TaskContext): AttemptOutcome {
  const checked = parseProgress(progress);
  const active = parseTaskContext(context);
  const index = checked.attempts.findIndex((attempt) => attempt.attemptId === attemptId);
  const attempt = checked.attempts[index];
  if (!attempt) fail('INVALID_ID');
  let validity: AttemptValidity;
  if (checked.contentVersion !== active.contentVersion || attempt.taskId !== active.taskId
    || attempt.taskVersion !== active.taskVersion || attempt.rubricVersion !== active.rubricVersion
    || attempt.modelVersion !== active.modelVersion) validity = 'version_mismatch';
  else {
    const original = progress.attempts[index];
    const receipt = original && sessionBindings.get(original);
    validity = !receipt ? 'context_unverified'
      : attempt.instanceId !== active.instanceId || !isResultForContext(receipt.binding, active) ? 'context_mismatch' : 'current';
  }
  const successful = validity === 'current' && attempt.status === 'correct' && attempt.assistance !== 'solution_viewed';
  return Object.freeze({ validity, status: attempt.status, assistance: attempt.assistance,
    successful, independent: successful && attempt.assistance === 'independent' });
}
