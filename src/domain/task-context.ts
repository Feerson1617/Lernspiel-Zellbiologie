import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js';
import type { VersionInfo } from './contracts.ts';
import { isTaskId } from './identities.ts';
import type { TaskId } from './identities.ts';
import { ContextContractError, readDataRecord, snapshotContextData } from './context-data.ts';
import type { ContextRecord } from './context-data.ts';

export const TASK_PHASES = Object.freeze(['predict', 'investigate', 'explain', 'transfer'] as const);
export type TaskPhase = (typeof TASK_PHASES)[number];
export type ContextHash = `sha256-v1:${string}`;

export interface TaskContextInput extends VersionInfo {
  readonly taskId: TaskId;
  readonly instanceId: string;
  readonly seed: string;
  readonly phase: TaskPhase;
  readonly material: ContextRecord;
  /** Explicit complete assessment-relevant snapshot; {} for no state data. */
  readonly modelState: ContextRecord;
}

export interface TaskContext extends TaskContextInput { readonly contextHash: ContextHash }
export interface ContextBinding {
  readonly taskId: TaskId;
  readonly taskVersion: string;
  readonly rubricVersion: string;
  readonly contextHash: ContextHash;
}

const INPUT_FIELDS = ['taskId', 'taskVersion', 'rubricVersion', 'contentVersion', 'modelVersion', 'instanceId', 'seed', 'phase', 'material', 'modelState'] as const;
const LABEL_FIELDS = ['taskVersion', 'rubricVersion', 'contentVersion', 'modelVersion', 'instanceId', 'seed'] as const;
const RESULT_FIELDS = new Set(['taskId', 'taskVersion', 'rubricVersion', 'contextHash', 'status', 'criteria', 'unassessedRelevantText', 'assistance', 'feedbackCode']);

function requireFields(record: Readonly<Record<string, unknown>>, fields: readonly string[]): void {
  if (Object.keys(record).length !== fields.length || !fields.every((field) => Object.hasOwn(record, field))) throw new ContextContractError('INVALID_SHAPE');
}

function isLabel(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.trim() === value && !/[\u0000-\u001f\u007f]/.test(value);
}

/** Synchronous and deterministic; never invents an ID, seed or version value. */
export function createTaskContext(input: TaskContextInput): TaskContext {
  const record = readDataRecord(input);
  requireFields(record, INPUT_FIELDS);
  if (!isTaskId(record['taskId'])) throw new ContextContractError('INVALID_ID');
  for (const field of LABEL_FIELDS) if (!isLabel(record[field])) throw new ContextContractError('INVALID_LABEL');
  if (typeof record['phase'] !== 'string' || !TASK_PHASES.includes(record['phase'] as TaskPhase)) throw new ContextContractError('INVALID_PHASE');
  readDataRecord(record['material']);
  const model = readDataRecord(record['modelState']);
  // BiologySnapshot already carries modelVersion in the design contract.
  if (Object.hasOwn(model, 'modelVersion') && model['modelVersion'] !== record['modelVersion']) throw new ContextContractError('VERSION_MISMATCH');

  const snapshot = snapshotContextData(record);
  const contextHash: ContextHash = `sha256-v1:${bytesToHex(sha256(utf8ToBytes(`zelllabor11.task-context.v1\n${snapshot.json}`)))}`;
  return Object.freeze({ ...snapshot.value, contextHash }) as unknown as TaskContext;
}

/** Validate a supplied snapshot and recompute its identity; never trust a stored hash. */
export function parseTaskContext(input: unknown): TaskContext {
  const record = readDataRecord(input);
  requireFields(record, [...INPUT_FIELDS, 'contextHash']);
  const payload: Record<string, unknown> = {};
  for (const field of INPUT_FIELDS) payload[field] = record[field];
  const context = createTaskContext(payload as unknown as TaskContextInput);
  if (record['contextHash'] !== context.contextHash) throw new ContextContractError('HASH_MISMATCH');
  return context;
}

/** Capture before changing any model condition; no storage or simulation involved. */
export function capturePredictionContext(input: TaskContextInput & Readonly<{ phase: 'predict' }>): TaskContext & Readonly<{ phase: 'predict' }> {
  const context = createTaskContext(input);
  if (context.phase !== 'predict') throw new ContextContractError('INVALID_PHASE');
  return context as TaskContext & Readonly<{ phase: 'predict' }>;
}

export function createContextBinding(context: TaskContext): ContextBinding {
  const active = parseTaskContext(context);
  return Object.freeze({ taskId: active.taskId, taskVersion: active.taskVersion, rubricVersion: active.rubricVersion, contextHash: active.contextHash });
}

/** Checks binding only. A true result says nothing about an answer's correctness. */
export function isResultForContext(result: unknown, activeContext: TaskContext): boolean {
  try {
    const active = parseTaskContext(activeContext);
    const binding = readDataRecord(result);
    if (Object.keys(binding).some((key) => !RESULT_FIELDS.has(key))) return false;
    return ['taskId', 'taskVersion', 'rubricVersion', 'contextHash'].every((field) => Object.hasOwn(binding, field))
      && binding['taskId'] === active.taskId && binding['taskVersion'] === active.taskVersion
      && binding['rubricVersion'] === active.rubricVersion && binding['contextHash'] === active.contextHash;
  } catch (error) {
    if (error instanceof ContextContractError) return false;
    throw error;
  }
}
