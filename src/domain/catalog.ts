import { MISSION_IDS, MISSION_TASK_IDS, TASK_IDS, isMissionId, isTaskId, missionForTask } from './identities.ts';
import type { MissionId, TaskId } from './identities.ts';
import { TASK_TYPES } from './contracts.ts';
import type { MissionMetadata, TaskCatalog, TaskMetadata, TaskType } from './contracts.ts';

export type CatalogIssueCode =
  | 'INVALID_SHAPE' | 'UNSUPPORTED_SCHEMA_VERSION' | 'INVALID_METADATA'
  | 'UNKNOWN_TASK_ID' | 'UNKNOWN_MISSION_ID'
  | 'DUPLICATE_TASK_ID' | 'DUPLICATE_MISSION_ID' | 'DUPLICATE_TASK_REFERENCE'
  | 'MISSING_TASK_ID' | 'MISSING_MISSION_ID' | 'MISSING_TASK_REFERENCE'
  | 'TASK_MISSION_MISMATCH' | 'UNRESOLVED_TASK_REFERENCE' | 'UNRESOLVED_MISSION_REFERENCE';

export interface CatalogIssue {
  readonly code: CatalogIssueCode;
  readonly path: string;
}

export class CatalogContractError extends Error {
  readonly issues: readonly CatalogIssue[];
  constructor(issues: readonly CatalogIssue[]) {
    // Never include supplied answer data or input values in an error/log.
    super('Invalid public task catalog.');
    this.name = 'CatalogContractError';
    this.issues = Object.freeze(issues.map((issue) => Object.freeze({ ...issue })));
  }
}

function hasExactFields(value: unknown, fields: readonly string[]): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    && Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field));
}

function isTitle(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Validate unknown metadata, then copy/freeze only whitelisted primitive fields. */
export function parseTaskCatalog(input: unknown): TaskCatalog {
  const issues: CatalogIssue[] = [];
  const issue = (code: CatalogIssueCode, path: string): void => { issues.push({ code, path }); };
  if (!hasExactFields(input, ['schemaVersion', 'missions', 'tasks']) || !Array.isArray(input['tasks']) || !Array.isArray(input['missions'])) {
    throw new CatalogContractError([{ code: 'INVALID_SHAPE', path: '$' }]);
  }
  if (input['schemaVersion'] !== 1) issue('UNSUPPORTED_SCHEMA_VERSION', '$.schemaVersion');

  const tasks = new Map<TaskId, TaskMetadata>();
  const missions = new Map<MissionId, MissionMetadata>();
  const rawTasks: readonly unknown[] = input['tasks'];
  const rawMissions: readonly unknown[] = input['missions'];

  rawTasks.forEach((raw, index) => {
    const path = `$.tasks[${index}]`;
    if (!hasExactFields(raw, ['id', 'missionId', 'title', 'type', 'publicationStatus'])) { issue('INVALID_SHAPE', path); return; }
    const { id, missionId, title, type, publicationStatus } = raw;
    if (!isTaskId(id)) { issue('UNKNOWN_TASK_ID', `${path}.id`); return; }
    if (!isMissionId(missionId)) { issue('UNKNOWN_MISSION_ID', `${path}.missionId`); return; }
    if (tasks.has(id)) { issue('DUPLICATE_TASK_ID', `${path}.id`); return; }
    if (missionForTask(id) !== missionId) { issue('TASK_MISSION_MISMATCH', `${path}.missionId`); return; }
    if (!isTitle(title) || typeof type !== 'string' || !TASK_TYPES.includes(type as TaskType) || publicationStatus !== 'draft') {
      issue('INVALID_METADATA', path); return;
    }
    // The canonical mission equality above proves the discriminated identity pair.
    tasks.set(id, Object.freeze({ id, missionId, title, type, publicationStatus }) as TaskMetadata);
  });

  const referencedTasks = new Set<TaskId>();
  rawMissions.forEach((raw, index) => {
    const path = `$.missions[${index}]`;
    if (!hasExactFields(raw, ['id', 'title', 'taskIds'])) { issue('INVALID_SHAPE', path); return; }
    const { id, title, taskIds } = raw;
    if (!isMissionId(id)) { issue('UNKNOWN_MISSION_ID', `${path}.id`); return; }
    if (missions.has(id)) { issue('DUPLICATE_MISSION_ID', `${path}.id`); return; }
    if (!isTitle(title) || !Array.isArray(taskIds)) { issue('INVALID_METADATA', path); return; }
    const members = new Set<TaskId>();
    const references: readonly unknown[] = taskIds;
    references.forEach((taskId, taskIndex) => {
      const referencePath = `${path}.taskIds[${taskIndex}]`;
      if (!isTaskId(taskId)) { issue('UNKNOWN_TASK_ID', referencePath); return; }
      if (members.has(taskId) || referencedTasks.has(taskId)) issue('DUPLICATE_TASK_REFERENCE', referencePath);
      if (missionForTask(taskId) !== id) issue('TASK_MISSION_MISMATCH', referencePath);
      if (!tasks.has(taskId)) issue('UNRESOLVED_TASK_REFERENCE', referencePath);
      members.add(taskId);
      referencedTasks.add(taskId);
    });
    for (const expected of MISSION_TASK_IDS[id]) {
      if (!members.has(expected)) issue('MISSING_TASK_REFERENCE', `${path}.taskIds`);
    }
    missions.set(id, Object.freeze({ id, title, taskIds: Object.freeze([...members]) }));
  });

  for (const id of TASK_IDS) {
    if (!tasks.has(id)) issue('MISSING_TASK_ID', '$.tasks');
  }
  for (const id of MISSION_IDS) {
    if (!missions.has(id)) issue('MISSING_MISSION_ID', '$.missions');
  }
  for (const task of tasks.values()) {
    if (!missions.has(task.missionId)) issue('UNRESOLVED_MISSION_REFERENCE', '$.tasks');
  }
  if (issues.length) throw new CatalogContractError(issues);

  return Object.freeze({ schemaVersion: 1, tasks: Object.freeze([...tasks.values()]), missions: Object.freeze([...missions.values()]) });
}

export interface TaskRegistry {
  readonly catalog: TaskCatalog;
  readonly getTask: (id: TaskId) => TaskMetadata;
  readonly getMission: (id: MissionId) => MissionMetadata;
}

export function createTaskRegistry(input: unknown): TaskRegistry {
  const catalog = parseTaskCatalog(input);
  const tasks = new Map(catalog.tasks.map((task) => [task.id, task]));
  const missions = new Map(catalog.missions.map((mission) => [mission.id, mission]));
  return Object.freeze({
    catalog,
    getTask(id: TaskId): TaskMetadata {
      const task = tasks.get(id);
      if (!task) throw new CatalogContractError([{ code: 'UNKNOWN_TASK_ID', path: '$.lookup' }]);
      return task;
    },
    getMission(id: MissionId): MissionMetadata {
      const mission = missions.get(id);
      if (!mission) throw new CatalogContractError([{ code: 'UNKNOWN_MISSION_ID', path: '$.lookup' }]);
      return mission;
    },
  });
}
