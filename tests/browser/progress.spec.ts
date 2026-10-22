import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';

let source: string;
test.beforeAll(async () => { source = await buildDomainModule(); });
test.beforeEach(async ({ page, baseURL }) => {
  await page.route(`${baseURL}progress-under-test.mjs`, (route) => route.fulfill({ contentType: 'text/javascript', body: source }));
  await page.goto('./');
});
type API = typeof import('../../src/domain/task-context.ts') & typeof import('../../src/domain/progress.ts') & typeof import('../../src/persistence/progress-store.ts');

test('persists schema metadata across reload, loses session trust and retains foreign data', async ({ page, baseURL }) => {
  const url = `${baseURL}progress-under-test.mjs`;
  const live = await page.evaluate(async (url) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const context = api.createTaskContext({ taskId: 'M6.02', taskVersion: 'test-task', rubricVersion: 'test-rubric', contentVersion: 'test-content', modelVersion: 'test-model', instanceId: 'test-instance', seed: 'test-seed', phase: 'predict', material: { concentration: 300 }, modelState: {} });
    const store = api.createProgressStore('test-content');
    localStorage.setItem('foreign-app', 'preserved');
    const result = { ...api.createContextBinding(context), status: 'correct', assistance: 'hint' } as const;
    const record = api.createAttemptRecord('attempt', result, context);
    store.save(api.appendAttempt(store.getState().progress, record));
    return { outcome: api.getAttemptOutcome(store.getState().progress, 'attempt', context), serialized: localStorage.getItem(api.PROGRESS_STORAGE_KEY), keys: Object.keys(record) };
  }, url);
  expect(live.outcome).toMatchObject({ successful: true, independent: false, assistance: 'hint' });
  expect(live.keys.sort()).toEqual(['attemptId', 'taskId', 'instanceId', 'taskVersion', 'rubricVersion', 'modelVersion', 'status', 'assistance'].sort());
  expect(live.serialized).not.toMatch(/contextHash|material|seed|criteria|rawAnswer/);
  await page.reload();
  const loaded = await page.evaluate(async (url) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const context = api.createTaskContext({ taskId: 'M6.02', taskVersion: 'test-task', rubricVersion: 'test-rubric', contentVersion: 'test-content', modelVersion: 'test-model', instanceId: 'test-instance', seed: 'test-seed', phase: 'predict', material: { concentration: 300 }, modelState: {} });
    const store = api.createProgressStore('test-content');
    const outcome = api.getAttemptOutcome(store.getState().progress, 'attempt', context);
    store.reset();
    return { outcome, foreign: localStorage.getItem('foreign-app'), own: localStorage.getItem(api.PROGRESS_STORAGE_KEY) };
  }, url);
  expect(loaded).toMatchObject({ outcome: { validity: 'context_unverified', successful: false }, foreign: 'preserved', own: null });
});

test('continues in memory when the actual browser storage getter is denied', async ({ page, baseURL }) => {
  const result = await page.evaluate(async (url) => {
    const api = await import(/* @vite-ignore */ url) as API;
    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('denied', 'SecurityError'); } });
    const store = api.createProgressStore('test-content');
    const data = api.parseProgress({ schemaVersion: 1, contentVersion: 'test-content', attempts: [], selectedMissionId: 'Z1' });
    return { state: store.save(data), exported: JSON.parse(store.exportProgress()), reset: store.reset() };
  }, `${baseURL}progress-under-test.mjs`);
  expect(result.state).toMatchObject({ mode: 'session', issue: 'denied', progress: { selectedMissionId: 'Z1' } });
  expect(result.exported.selectedMissionId).toBe('Z1');
  expect(result.reset).toMatchObject({ mode: 'session', issue: 'denied' });
});

test('handles browser quota exceptions on writes and denial on targeted reset', async ({ page, baseURL }) => {
  const result = await page.evaluate(async (url) => {
    const api = await import(/* @vite-ignore */ url) as API;
    localStorage.setItem('foreign-app', 'preserved');
    const store = api.createProgressStore('test-content');
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function () { throw new DOMException('full', 'QuotaExceededError'); };
    const state = store.save(api.parseProgress({ schemaVersion: 1, contentVersion: 'test-content', attempts: [], selectedMissionId: 'M6' }));
    Storage.prototype.setItem = original;
    const recovered = store.save(store.getState().progress);
    Storage.prototype.removeItem = function () { throw new DOMException('denied', 'SecurityError'); };
    return { state, recovered, reset: store.reset(), foreign: localStorage.getItem('foreign-app') };
  }, `${baseURL}progress-under-test.mjs`);
  expect(result.state).toMatchObject({ mode: 'session', issue: 'quota', progress: { selectedMissionId: 'M6' } });
  expect(result.recovered.mode).toBe('local');
  expect(result.reset).toMatchObject({ mode: 'session', issue: 'denied' });
  expect(result.foreign).toBe('preserved');
});

test('preserves old versions and rejects corrupted or manipulated browser data', async ({ page, baseURL }) => {
  const result = await page.evaluate(async (url) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const old = { schemaVersion: 1, contentVersion: 'old-content', attempts: [{ attemptId: 'old', taskId: 'M6.02', instanceId: 'old-instance', taskVersion: 'old-task', rubricVersion: 'old-rubric', modelVersion: 'old-model', status: 'correct', assistance: 'solution_viewed' }] };
    const raw = JSON.stringify(old);
    localStorage.setItem(api.PROGRESS_STORAGE_KEY, raw);
    const store = api.createProgressStore('new-content');
    store.save(store.getState().progress);
    const state = store.getState();
    const preserved = localStorage.getItem(api.PROGRESS_STORAGE_KEY) === raw;
    localStorage.setItem(api.PROGRESS_STORAGE_KEY, '{broken');
    const corrupt = api.createProgressStore('new-content').getState();
    localStorage.setItem(api.PROGRESS_STORAGE_KEY, JSON.stringify({ ...old, contentVersion: 'new-content', name: 'PRIVATE_TEST_MARKER', attempts: [{ ...old.attempts[0], status: 'passed' }] }));
    const manipulated = api.createProgressStore('new-content');
    return { state, preserved, corrupt, manipulated: manipulated.getState(), exported: manipulated.exportProgress() };
  }, `${baseURL}progress-under-test.mjs`);
  expect(result.state).toMatchObject({ mode: 'session', issue: 'content_version', progress: { attempts: [] }, history: { contentVersion: 'old-content', attempts: [{ assistance: 'solution_viewed' }] } });
  expect(result.preserved).toBe(true);
  expect(result.corrupt.issue).toBe('corrupt_json');
  expect(result.manipulated).toMatchObject({ mode: 'session', issue: 'invalid_data', progress: { attempts: [] } });
  expect(result.exported).not.toContain('PRIVATE_TEST_MARKER');
});

test('invalidates live successes after each version/context change and never erases help', async ({ page, baseURL }) => {
  const result = await page.evaluate(async (url) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const input = { taskId: 'M6.02', taskVersion: 'test-task', rubricVersion: 'test-rubric', contentVersion: 'test-content', modelVersion: 'test-model', instanceId: 'test-instance', seed: 'test-seed', phase: 'predict', material: { concentration: 300 }, modelState: { profile: 'onion_epidermis' } } as const;
    const active = api.createTaskContext(input);
    const store = api.createProgressStore('test-content');
    const outcome = { ...api.createContextBinding(active), status: 'correct', assistance: 'hint' } as const;
    store.save(api.appendAttempt(store.getState().progress, api.createAttemptRecord('hinted', outcome, active)));
    const changes = [{ contentVersion: 'new-content' }, { taskVersion: 'new-task' }, { rubricVersion: 'new-rubric' }, { modelVersion: 'new-model' }, { material: { concentration: 301 } }, { modelState: { profile: 'plant_leaf' } }];
    const stale = changes.map((change) => api.getAttemptOutcome(store.getState().progress, 'hinted', api.createTaskContext({ ...input, ...change })));
    let rejected = false;
    try { api.appendAttempt(store.getState().progress, api.createAttemptRecord('later', { ...outcome, assistance: 'independent' }, active)); }
    catch { rejected = true; }
    const viewed = api.createAttemptRecord('viewed', { ...outcome, assistance: 'solution_viewed' }, active);
    const progress = api.appendAttempt(store.getState().progress, viewed);
    return { stale, rejected, viewed: api.getAttemptOutcome(progress, 'viewed', active), hint: progress.attempts[0]?.assistance };
  }, `${baseURL}progress-under-test.mjs`);
  expect(result.stale).toHaveLength(6);
  expect(result.stale.every((outcome) => !outcome.successful && !outcome.independent && outcome.validity !== 'current')).toBe(true);
  expect(result.rejected).toBe(true);
  expect(result.viewed).toMatchObject({ status: 'correct', assistance: 'solution_viewed', successful: false, independent: false });
  expect(result.hint).toBe('hint');
});
