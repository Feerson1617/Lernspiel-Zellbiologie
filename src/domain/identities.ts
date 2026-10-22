/** Fixed identity snapshot from concept 1.0. Metadata generation never rewrites it. */
export const MISSION_TASK_IDS = Object.freeze({
  Z1: Object.freeze(['Z1.01', 'Z1.02', 'Z1.03', 'Z1.04'] as const),
  Z2: Object.freeze(['Z2.01', 'Z2.02', 'Z2.03', 'Z2.04'] as const),
  Z3: Object.freeze(['Z3.01', 'Z3.02', 'Z3.03', 'Z3.04'] as const),
  Z4: Object.freeze(['Z4.01', 'Z4.02', 'Z4.03', 'Z4.04'] as const),
  M1: Object.freeze(['M1.01', 'M1.02', 'M1.03', 'M1.04'] as const),
  M2: Object.freeze(['M2.01', 'M2.02', 'M2.03', 'M2.04'] as const),
  M3: Object.freeze(['M3.01', 'M3.02', 'M3.03', 'M3.04'] as const),
  M4: Object.freeze(['M4.01', 'M4.02', 'M4.03', 'M4.04'] as const),
  M5: Object.freeze(['M5.01', 'M5.02', 'M5.03', 'M5.04'] as const),
  M6: Object.freeze(['M6.01', 'M6.02', 'M6.03', 'M6.04'] as const),
  M7: Object.freeze(['M7.01', 'M7.02', 'M7.03', 'M7.04'] as const),
  M8: Object.freeze(['M8.01', 'M8.02', 'M8.03', 'M8.04'] as const),
  M9: Object.freeze(['M9.01', 'M9.02', 'M9.03', 'M9.04'] as const),
  M10: Object.freeze(['M10.01', 'M10.02', 'M10.03', 'M10.04'] as const),
  E1: Object.freeze(['E1.01', 'E1.02', 'E1.03'] as const),
  E2: Object.freeze(['E2.01', 'E2.02', 'E2.03'] as const),
  E3: Object.freeze(['E3.01', 'E3.02', 'E3.03'] as const),
  D0: Object.freeze(['D0.01', 'D0.02', 'D0.03', 'D0.04', 'D0.05', 'D0.06'] as const),
  T: Object.freeze(['T.01', 'T.02', 'T.03', 'T.04', 'T.05', 'T.06', 'T.07', 'T.08'] as const),
} as const);

export type MissionId = keyof typeof MISSION_TASK_IDS;
export type TaskIdFor<M extends MissionId> = (typeof MISSION_TASK_IDS)[M][number];
export type TaskId = TaskIdFor<MissionId>;

export const MISSION_IDS: readonly MissionId[] = Object.freeze(Object.keys(MISSION_TASK_IDS) as MissionId[]);
export const TASK_IDS: readonly TaskId[] = Object.freeze(Object.values(MISSION_TASK_IDS).flat());

const taskIds = new Set<string>(TASK_IDS);
const missionIds = new Set<string>(MISSION_IDS);
const taskMissions = Object.freeze(Object.fromEntries(
  Object.entries(MISSION_TASK_IDS).flatMap(([mission, ids]) => ids.map((id) => [id, mission])),
) as Record<TaskId, MissionId>);

export function isTaskId(value: unknown): value is TaskId {
  return typeof value === 'string' && taskIds.has(value);
}

export function isMissionId(value: unknown): value is MissionId {
  return typeof value === 'string' && missionIds.has(value);
}

export function missionForTask(id: TaskId): MissionId {
  return taskMissions[id];
}
