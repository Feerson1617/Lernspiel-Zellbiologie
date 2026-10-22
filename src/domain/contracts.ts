import type { MissionId, TaskId, TaskIdFor } from './identities.ts';

/** Exact status vocabulary from the design contract; no evaluation logic. */
export const STATUSES = Object.freeze(['correct', 'incorrect', 'partial', 'clarify', 'empty', 'technical'] as const);
export type Status = (typeof STATUSES)[number];
export const ASSISTANCE_KINDS = Object.freeze(['independent', 'hint', 'wordbank', 'clarified', 'solution_viewed'] as const);
export type Assistance = (typeof ASSISTANCE_KINDS)[number];

export const TASK_TYPES = Object.freeze(['match', 'bounded_text', 'single', 'multi', 'order', 'causal_map', 'numeric', 'experiment', 'model_action', 'graph'] as const);
export type TaskType = (typeof TASK_TYPES)[number];

/** The discriminated union also prevents contradictory pairs at compile time. */
export type TaskIdentity = {
  [M in MissionId]: Readonly<{ id: TaskIdFor<M>; missionId: M }>;
}[MissionId];

/** Public P01a metadata is an explicit whitelist, not an executable task. */
export type TaskMetadata = TaskIdentity & Readonly<{
  title: string;
  type: TaskType;
  publicationStatus: 'draft';
}>;

export interface MissionMetadata {
  readonly id: MissionId;
  readonly title: string;
  readonly taskIds: readonly TaskId[];
}

export interface TaskCatalog {
  /** Version of this metadata representation, not a content/rubric version. */
  readonly schemaVersion: 1;
  readonly missions: readonly MissionMetadata[];
  readonly tasks: readonly TaskMetadata[];
}

/** Structural extension point only. P01b supplies values and version binding. */
export interface VersionInfo {
  readonly taskVersion: string;
  readonly rubricVersion: string;
  readonly contentVersion: string;
  readonly modelVersion: string;
}

export type VersionedTaskReference = TaskIdentity & VersionInfo;
