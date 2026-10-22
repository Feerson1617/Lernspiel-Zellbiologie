import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { catalogData } from '../../src/content/catalog-data.ts';
import { taskRegistry } from '../../src/content/task-catalog.ts';
import { CatalogContractError, createTaskRegistry, parseTaskCatalog } from '../../src/domain/catalog.ts';
import type { CatalogIssueCode } from '../../src/domain/catalog.ts';
import { MISSION_IDS, TASK_IDS } from '../../src/domain/identities.ts';
import type { TaskId } from '../../src/domain/identities.ts';
import { ASSISTANCE_KINDS, STATUSES, TASK_TYPES } from '../../src/domain/contracts.ts';
import { projectTaskCatalog, serializeTaskCatalog } from '../../tools/catalog-source.ts';

const read = (path: string): string => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const tasks = JSON.parse(read('spec/tasks.json')) as {
  schema_version: string; tasks: { id: string; mission_id: string; title: string; type: string; assessment_implementation_status: string }[];
};
const missions = JSON.parse(read('spec/missions.json')) as {
  schema_version: string; missions: { id: string; title: string; tasks: string[] }[];
};

function editableCatalog() {
  return structuredClone(catalogData) as unknown as {
    schemaVersion: number;
    tasks: Record<string, unknown>[];
    missions: { id: unknown; title: unknown; taskIds: unknown[] }[];
  };
}

function expectIssue(input: unknown, code: CatalogIssueCode): void {
  expect(() => parseTaskCatalog(input)).toThrow(CatalogContractError);
  try { parseTaskCatalog(input); } catch (error) {
    expect(error).toBeInstanceOf(CatalogContractError);
    expect((error as CatalogContractError).issues.map((issue) => issue.code)).toContain(code);
  }
}

describe('unchanged authoring identities and controlled projection', () => {
  it('preserves all 79 IDs, all 19 mission records and the readable F catalogue', () => {
    expect(tasks.tasks).toHaveLength(79);
    expect(new Set(tasks.tasks.map((task) => task.id)).size).toBe(79);
    expect([...TASK_IDS].sort()).toEqual(tasks.tasks.map((task) => task.id).sort());
    expect([...MISSION_IDS].sort()).toEqual(missions.missions.map((mission) => mission.id).sort());
    const readableIds = [...read('F_Aufgabenkatalog.md').matchAll(/^### (\w+\.\d{2}) ·/gm)].map((match) => match[1]);
    expect(readableIds).toHaveLength(79);
    expect(readableIds.sort()).toEqual([...TASK_IDS].sort());
  });

  it.each(tasks.tasks)('resolves $id with exactly its unchanged public metadata', (source) => {
    const task = taskRegistry.getTask(source.id as TaskId);
    expect(task).toEqual({ id: source.id, missionId: source.mission_id, title: source.title, type: source.type, publicationStatus: 'draft' });
    expect(taskRegistry.getMission(task.missionId).taskIds).toContain(task.id);
  });

  it('preserves both directions of every mission association and all original titles', () => {
    expect(taskRegistry.catalog.missions).toEqual(missions.missions.map((mission) => ({ id: mission.id, title: mission.title, taskIds: mission.tasks })));
    const reverse = taskRegistry.catalog.missions.flatMap((mission) => mission.taskIds);
    expect(new Set(reverse).size).toBe(79);
    expect(reverse).toHaveLength(79);
  });

  it('keeps the generated projection deterministic and excludes full editorial records', () => {
    const projection = projectTaskCatalog(tasks, missions);
    expect(projection).toEqual(taskRegistry.catalog);
    expect(read('src/content/catalog-data.ts')).toBe(serializeTaskCatalog(projection));
    for (const task of projection.tasks) expect(Object.keys(task).sort()).toEqual(['id', 'missionId', 'publicationStatus', 'title', 'type']);
    for (const mission of projection.missions) expect(Object.keys(mission).sort()).toEqual(['id', 'taskIds', 'title']);
    const sourceWithExtra = structuredClone(tasks) as typeof tasks & { privateEditorialNote: string };
    sourceWithExtra.privateEditorialNote = 'SYNTHETIC_DEVELOPMENT_ONLY_SENTINEL';
    expect(JSON.stringify(projectTaskCatalog(sourceWithExtra, missions))).not.toContain(sourceWithExtra.privateEditorialNote);
  });

  it('matches the source schema vocabularies and leaves future version values unset', () => {
    const taskSchema = JSON.parse(read('spec/task.schema.json'));
    const resultSchema = JSON.parse(read('spec/result.schema.json'));
    const progressSchema = JSON.parse(read('spec/progress.schema.json'));
    expect(TASK_TYPES).toEqual(taskSchema.$defs.task.properties.type.enum);
    expect(STATUSES).toEqual(resultSchema.properties.status.enum);
    expect(ASSISTANCE_KINDS).toEqual(progressSchema.properties.attempts.items.properties.assistance.enum);
    expect(JSON.stringify(catalogData)).not.toMatch(/taskVersion|rubricVersion|contentVersion|modelVersion|contextHash/);
  });

  it('rejects source drift instead of normalizing or regenerating unknown identities', () => {
    const changed = structuredClone(tasks);
    changed.tasks[0]!.id = 'Z1.99';
    expect(() => projectTaskCatalog(changed, missions)).toThrow(CatalogContractError);
    expect(() => projectTaskCatalog({ ...tasks, schema_version: '2.0' }, missions)).toThrow('Unsupported editorial schema');
    changed.tasks[0]!.assessment_implementation_status = 'implemented';
    expect(() => projectTaskCatalog(changed, missions)).toThrow('draft metadata only');
  });

  it('keeps registry data immutable and independent of the caller input', () => {
    const input = editableCatalog();
    const registry = createTaskRegistry(input);
    input.tasks[0]!['title'] = 'Synthetic input mutation';
    input.missions[0]!.taskIds.length = 0;
    expect(registry.getTask('Z1.01').title).toBe(tasks.tasks[0]!.title);
    expect(registry.getMission('Z1').taskIds).toHaveLength(4);
    expect(Object.isFrozen(registry)).toBe(true);
    expect(Object.isFrozen(registry.catalog.tasks)).toBe(true);
    expect(Object.isFrozen(registry.getTask('Z1.01'))).toBe(true);
    expect(Object.isFrozen(registry.getMission('Z1').taskIds)).toBe(true);
    expect(() => registry.getTask('Z1.99' as TaskId)).toThrow(CatalogContractError);
  });
});

describe('self-authored negative identity/metadata cases (in memory only)', () => {
  it('rejects duplicate task records even when identical', () => {
    const input = editableCatalog(); input.tasks.push({ ...input.tasks[0] });
    expectIssue(input, 'DUPLICATE_TASK_ID');
  });
  it('rejects missing tasks and now unresolved mission-to-task references', () => {
    const input = editableCatalog(); input.tasks.pop();
    expectIssue(input, 'MISSING_TASK_ID');
    expectIssue(input, 'UNRESOLVED_TASK_REFERENCE');
  });
  it('rejects an identity replacement even when the total is still 79', () => {
    const input = editableCatalog(); input.tasks[0]!['id'] = 'Z1.99';
    expectIssue(input, 'UNKNOWN_TASK_ID'); expectIssue(input, 'MISSING_TASK_ID');
  });
  it('rejects a contradictory known task/mission pair', () => {
    const input = editableCatalog(); input.tasks[0]!['missionId'] = 'Z2';
    expectIssue(input, 'TASK_MISSION_MISMATCH');
  });
  it('rejects an unknown mission', () => {
    const input = editableCatalog(); input.tasks[0]!['missionId'] = 'M11';
    expectIssue(input, 'UNKNOWN_MISSION_ID');
  });
  it('rejects a missing mission assignment without guessing from the task prefix', () => {
    const input = editableCatalog(); delete input.tasks[0]!['missionId'];
    expectIssue(input, 'INVALID_SHAPE');
  });
  it('rejects a missing mission record and unresolved task-to-mission references', () => {
    const input = editableCatalog(); input.missions.pop();
    expectIssue(input, 'MISSING_MISSION_ID'); expectIssue(input, 'UNRESOLVED_MISSION_REFERENCE');
  });
  it('rejects duplicate mission records', () => {
    const input = editableCatalog(); input.missions.push(structuredClone(input.missions[0]!));
    expectIssue(input, 'DUPLICATE_MISSION_ID');
  });
  it('rejects an omitted reverse association', () => {
    const input = editableCatalog(); input.missions[0]!.taskIds.pop();
    expectIssue(input, 'MISSING_TASK_REFERENCE');
  });
  it('rejects an unknown reverse task reference', () => {
    const input = editableCatalog(); input.missions[0]!.taskIds.push('Z1.99');
    expectIssue(input, 'UNKNOWN_TASK_ID');
  });
  it('rejects duplicate reverse references', () => {
    const input = editableCatalog(); input.missions[0]!.taskIds.push('Z1.01');
    expectIssue(input, 'DUPLICATE_TASK_REFERENCE');
  });
  it('rejects a reverse reference to another mission, even if both IDs exist', () => {
    const input = editableCatalog(); input.missions[0]!.taskIds[0] = 'Z2.01';
    expectIssue(input, 'TASK_MISSION_MISMATCH');
  });
  it('rejects unsupported metadata schema versions', () => {
    const input = editableCatalog(); input.schemaVersion = 2;
    expectIssue(input, 'UNSUPPORTED_SCHEMA_VERSION');
  });
  it.each(['expected', 'criteria', 'rubric', 'feedback', 'material', 'prompt', 'response_spec', 'reference_cases'])('rejects an editorial field on a runtime record: %s', (field) => {
    const input = editableCatalog(); input.tasks[0]![field] = 'SYNTHETIC_SECRET_NOT_FOR_LOGGING';
    expectIssue(input, 'INVALID_SHAPE');
    try { parseTaskCatalog(input); } catch (error) {
      expect(String(error) + JSON.stringify((error as CatalogContractError).issues)).not.toContain('SYNTHETIC_SECRET_NOT_FOR_LOGGING');
    }
  });
  it.each([null, [], {}, { schemaVersion: 1, tasks: [] }])('rejects malformed root data: %s', (input) => {
    expectIssue(input, 'INVALID_SHAPE');
  });
  it.each([['title', ' '], ['type', 'essay'], ['publicationStatus', 'released']])('rejects invalid public metadata: %s = %s', (field, value) => {
    const input = editableCatalog(); input.tasks[0]![field!] = value;
    expectIssue(input, 'INVALID_METADATA');
  });
  it('rejects extra root and mission fields rather than retaining them', () => {
    expectIssue({ ...catalogData, expected: {} }, 'INVALID_SHAPE');
    const input = editableCatalog(); Object.assign(input.missions[0]!, { prerequisites: [] });
    expectIssue(input, 'INVALID_SHAPE');
  });
});
