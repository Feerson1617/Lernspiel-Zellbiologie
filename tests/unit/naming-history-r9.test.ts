import { expect, it } from 'vitest';
import { createNamingSession } from '../../src/application/naming-session.ts';
import { namingContext } from '../helpers/naming-v1.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';
import type { TaskContext } from '../../src/domain/task-context.ts';
import type { AttemptRecord } from '../../src/domain/progress.ts';

function nextCase(a: TaskContext): TaskContext {
  const { contextHash: ignored, ...input } = a; void ignored;
  return createTaskContext({ ...input, instanceId: `${a.instanceId}-new-1`, seed: `${a.seed}-new-1`, material: a.taskId === 'Z1.02'
    ? { ...a.material, cellProfile: 'plant_leaf' }
    : { ...a.material, waterPotential: { unit: 'Pa', vacuole: -100000, cytosol: -300000, external: -701000 } } });
}
for (const task of ['Z1.02', 'M6.02'] as const) for (const help of ['hint', 'wordbank', 'clarified', 'solution_viewed'] as const) for (const origin of ['resumed-empty', 'resumed-stored-A', 'loaded-without-resumed'] as const) {
  it(`${task} ${help}: ${origin} cannot verify the identical unseen B after losing RAM history`, () => {
    const a = namingContext(task), b = nextCase(a);
    const first = createNamingSession(a, { idPrefix: 'first', resumed: false, loadedAttempts: [] });
    first.activate(b, 'new_case');
    if (help === 'clarified') first.help('wordbank');
    first.help(help);
    expect(first.getState().outcomes).toHaveLength(0);
    const storedA: AttemptRecord = { attemptId: 'old-A', taskId: task, instanceId: a.instanceId,
      taskVersion: a.taskVersion, rubricVersion: a.rubricVersion, modelVersion: a.modelVersion,
      status: 'partial', assistance: 'independent' };
    const restored = createNamingSession(a, { idPrefix: 'restored', resumed: origin !== 'loaded-without-resumed', loadedAttempts: origin === 'resumed-empty' ? [] : [storedA] });
    restored.activate(nextCase(a), 'new_case');
    expect(restored.getState().context).toEqual(first.getState().context);
    expect(restored.getState().history).toBe('history_unverified');
    expect(restored.getState().events).toEqual([]); // no invented reconstruction of old help
    const result = restored.submit(restored.makeSubmission(task === 'Z1.02' ? 'Tonoplast' : 'Osmose', []));
    expect(result.termResult.status).toBe('correct'); expect(result.overallStatus).toBe('technical');
    expect(() => restored.record(result)).toThrow('HISTORY_UNVERIFIED');
    if (task === 'M6.02') expect(result.pendingCriteria).toEqual(['M6.02.C02', 'M6.02.C03']);
    restored.edit(); expect(restored.submit(restored.makeSubmission(task === 'Z1.02' ? 'Tonoplast' : 'Osmose', [])).support.history).toBe('history_unverified');
  });
}
for (const task of ['Z1.02', 'M6.02'] as const) it(`${task}: explicitly fresh trusted RAM session keeps independent new material case`, () => {
  const a = namingContext(task), s = createNamingSession(a, { idPrefix: 'fresh', resumed: false, loadedAttempts: [] });
  s.activate(nextCase(a), 'new_case');
  const result = s.submit(s.makeSubmission(task === 'Z1.02' ? 'Tonoplast' : 'Osmose', []));
  expect(result.support.history).toBe('verified'); expect(result.support.assistance).toBe('independent');
  expect(result.overallStatus).toBe(task === 'Z1.02' ? 'correct' : 'partial');
  if (task === 'Z1.02') expect(s.record(result)).toBe(s.record(result));
  else expect(() => s.record(result)).toThrow('field-only');
});
