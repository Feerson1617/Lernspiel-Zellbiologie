import { describe, expect, it } from 'vitest';
import { createM602Learning } from '../../src/application/m602-learning.ts';
import type { M602LearningController } from '../../src/application/m602-learning.ts';
import { PROGRESS_STORAGE_KEY } from '../../src/persistence/progress-store.ts';
import type { StoragePort } from '../../src/persistence/progress-store.ts';

function memory(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  const port: StoragePort = { getItem: key => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value); }, removeItem: key => { data.delete(key); } };
  return { data, port };
}
function correct(app: M602LearningController) {
  app.edit('process', 'Osmose'); app.edit('direction', 'nach außen'); app.edit('volume', 'nimmt ab');
  return app.submit();
}
function fresh() {
  const storage = memory({ foreign: 'keep' });
  return { storage, app: createM602Learning({ idPrefix: 'own-p03a', resumed: false, acquireStorage: () => storage.port }) };
}

describe('public learning cycle uses the existing assessment and volatile session', () => {
  it('starts empty; repeated submit is idempotent and only eight metadata fields persist', () => {
    const { app, storage } = fresh();
    expect(app.getState().answers).toEqual({ process: '', direction: '', volume: '' });
    expect(app.getState().hasSubmitted).toBe(false);
    expect(app.submit().overallStatus).toBe('empty');
    expect(storage.data.has(PROGRESS_STORAGE_KEY)).toBe(false);
    const outcome = correct(app);
    expect(outcome.overallStatus).toBe('correct');
    expect(app.submit()).toBe(outcome);
    expect(app.getState().recordedCount).toBe(1);
    const persisted = JSON.parse(storage.data.get(PROGRESS_STORAGE_KEY)!);
    expect(Object.keys(persisted.attempts[0]).sort()).toEqual(['assistance', 'attemptId', 'instanceId', 'modelVersion', 'rubricVersion', 'status', 'taskId', 'taskVersion']);
    expect(storage.data.get(PROGRESS_STORAGE_KEY)).not.toMatch(/Osmose|nach außen|nimmt ab|answers|evidence|events/);
    expect(storage.data.get('foreign')).toBe('keep');
  });
  it('only actual changes after feedback prove revision, while all help invalidates results', () => {
    const { app } = fresh();
    correct(app);
    expect(app.getState().revisedAfterFeedback).toBe(false);
    app.edit('process', 'Osmose');
    expect(app.getState().stale).toBe(false);
    app.help('direction', 'hint');
    expect(app.getState().stale).toBe(true);
    expect(app.getState().revisedAfterFeedback).toBe(false);
    app.edit('direction', 'hinaus');
    expect(app.getState().revisedAfterFeedback).toBe(true);
    expect(app.submit().support.assistance).toBe('hint');
    expect(app.getState().stale).toBe(false);
  });
  it('new material clears drafts and uses another binding; return preserves help', () => {
    const { app } = fresh();
    app.help('process', 'solution_viewed');
    const original = correct(app);
    app.editAdditional('Eine ungeprüfte Zusatzbehauptung');
    app.activateCase(1);
    expect(app.getState().context.contextHash).not.toBe(original.submission.context.contextHash);
    expect(app.getState().outcome).toBeNull();
    expect(app.getState().additional).toBe('');
    expect(app.getState().answers).toEqual({ process: '', direction: '', volume: '' });
    expect(correct(app).support.assistance).toBe('independent');
    app.activateCase(0);
    expect(app.getState().answers.process).toBe('');
    expect(app.getState().context.contextHash).toBe(original.submission.context.contextHash);
    expect(correct(app).support.assistance).toBe('solution_viewed');
    expect(() => app.activateCase(7 as 0)).toThrow();
  });
  it('selection is a new supported origin and typing retains assistance', () => {
    const { app } = fresh();
    app.choose('direction', 'nach außen');
    expect(app.getState().support.fields.direction.origin).toBe('wordbank_selection');
    app.edit('direction', 'hinaus');
    expect(app.getState().support.fields.direction.origin).toBe('typed');
    expect(app.getState().support.fields.direction.assistance).toBe('clarified');
    expect(correct(app).support.assistance).toBe('clarified');
  });
  it('unassessed relevant extras remain attached and block whole-task success', () => {
    const { app } = fresh();
    app.editAdditional('Die Zellwand wird kleiner.');
    const outcome = correct(app);
    expect(outcome.overallStatus).toBe('clarify');
    expect(outcome.notAssessed[0]?.value).toBe('Die Zellwand wird kleiner.');
    expect(app.getState().recordedCount).toBe(0);
  });
  it('the voluntary notebook example records solution disclosure for every criterion', () => {
    const { app } = fresh();
    app.showNotebookSolution();
    const outcome = correct(app);
    expect(outcome.overallStatus).toBe('correct');
    for (const support of Object.values(outcome.fieldSupport)) expect(support.assistance).toBe('solution_viewed');
  });
  it.each([false, true])('reload and prior receipts never recreate trusted independence (resumed=%s)', resumed => {
    const { app, storage } = fresh();
    correct(app);
    const next = createM602Learning({ idPrefix: 'new-load', resumed, acquireStorage: () => storage.port });
    expect(correct(next).overallStatus).toBe('technical');
    next.activateCase(1);
    expect(correct(next).overallStatus).toBe('technical');
    expect(next.getState().recordedCount).toBe(1);
  });
  it('reload without saved receipts still cannot reconstruct unrecorded help', () => {
    const storage = memory();
    const app = createM602Learning({ idPrefix: 'reload', resumed: true, acquireStorage: () => storage.port });
    expect(correct(app).fields.process.result.status).toBe('correct');
    expect(app.getState().support.history).toBe('history_unverified');
    expect(app.getState().recordedCount).toBe(0);
  });
  it.each(['broken', JSON.stringify({ schemaVersion: 1, contentVersion: 'other-version', attempts: [] }), JSON.stringify({ schemaVersion: 99 })])('protects unreadable or foreign-version saved data', value => {
    const storage = memory({ [PROGRESS_STORAGE_KEY]: value, foreign: 'keep' });
    const app = createM602Learning({ idPrefix: 'corrupt', resumed: false, acquireStorage: () => storage.port });
    expect(correct(app).overallStatus).toBe('technical');
    expect(storage.data.get(PROGRESS_STORAGE_KEY)).toBe(value);
    expect(storage.data.get('foreign')).toBe('keep');
  });
  it('denied storage permits criterion feedback without claiming recovered history', () => {
    const app = createM602Learning({ idPrefix: 'denied', resumed: false, acquireStorage: () => { throw new DOMException('', 'SecurityError'); } });
    const result = correct(app);
    expect(result.fields.volume.result.status).toBe('correct');
    expect(result.overallStatus).toBe('technical');
    expect(app.getState().storage.issue).toBe('denied');
  });
});
