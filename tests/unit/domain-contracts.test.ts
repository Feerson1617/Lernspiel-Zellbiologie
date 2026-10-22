import { expect, expectTypeOf, it } from 'vitest';
import { ASSISTANCE_KINDS, STATUSES, TASK_TYPES } from '../../src/domain/contracts.ts';
import type { Assistance, Status, TaskIdentity, TaskMetadata, VersionInfo, VersionedTaskReference } from '../../src/domain/contracts.ts';
import { MISSION_IDS, TASK_IDS, isMissionId, isTaskId, missionForTask } from '../../src/domain/identities.ts';
import type { TaskId } from '../../src/domain/identities.ts';
import type { Assistance as DesignAssistance, Status as DesignStatus, TaskContext as DesignContext } from '../../spec/contracts.d.ts';

it('preserves the design status and assistance vocabularies without evaluating answers', () => {
  expectTypeOf<Status>().toEqualTypeOf<DesignStatus>();
  expectTypeOf<Assistance>().toEqualTypeOf<DesignAssistance>();
  expect(STATUSES).toEqual(['correct', 'incorrect', 'partial', 'clarify', 'empty', 'technical']);
  expect(ASSISTANCE_KINDS).toEqual(['independent', 'hint', 'wordbank', 'clarified', 'solution_viewed']);
});

it('reserves the original version fields without assigning content versions', () => {
  expectTypeOf<VersionInfo>().toEqualTypeOf<Pick<DesignContext, 'taskVersion' | 'rubricVersion' | 'contentVersion' | 'modelVersion'>>();
  expectTypeOf<VersionedTaskReference>().toMatchTypeOf<VersionInfo & TaskIdentity>();
});

it('resolves every canonical identity without normalization or guessed numeric ranges', () => {
  expect(TASK_IDS).toHaveLength(79);
  expect(MISSION_IDS).toHaveLength(19);
  expect(TASK_TYPES).toHaveLength(10);
  for (const id of TASK_IDS) {
    expect(isTaskId(id)).toBe(true);
    expect(isMissionId(missionForTask(id))).toBe(true);
  }
  expect(Object.isFrozen(TASK_IDS)).toBe(true);
});

it.each(['Z1.99', 'Z1.1', 'z1.01', ' Z1.01', 'T.09', 'D0.07', '', null, 1])('rejects a noncanonical task identity: %s', (value) => {
  expect(isTaskId(value)).toBe(false);
});

it.each(['M0', 'M11', 'Z01', 'T.01', 'E2 bei Diagnosebedarf', undefined])('rejects an unresolved mission identity: %s', (value) => {
  expect(isMissionId(value)).toBe(false);
});

// These assertions are checked by tsc, never executed or used as runtime data.
function checkStaticContracts(metadata: TaskMetadata, version: VersionInfo): void {
  // @ts-expect-error Unknown task IDs must not typecheck.
  const unknown: TaskId = 'Z1.99';
  // @ts-expect-error A known task may not claim a different mission.
  const contradiction: TaskIdentity = { id: 'Z1.01', missionId: 'M1' };
  // @ts-expect-error Public metadata has no answer key.
  const answer: TaskMetadata = { id: 'Z1.01', missionId: 'Z1', title: 'Synthetic type fixture', type: 'match', publicationStatus: 'draft', expected: {} };
  // @ts-expect-error Identity fields are immutable.
  metadata.id = 'Z1.02';
  // @ts-expect-error Version fields are immutable.
  version.taskVersion = 'synthetic';
  void [unknown, contradiction, answer];
}
void checkStaticContracts;
