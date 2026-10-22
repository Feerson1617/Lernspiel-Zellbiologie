import { describe, expect, it } from 'vitest';
import { parseProgress, ProgressContractError } from '../../src/domain/progress.ts';
import { browserStorage, createProgressStore, PROGRESS_STORAGE_KEY } from '../../src/persistence/progress-store.ts';
import type { StoragePort } from '../../src/persistence/progress-store.ts';

const data = (contentVersion = 'content-test') => parseProgress({ schemaVersion: 1, contentVersion, attempts: [{ attemptId: 'a1', taskId: 'Z1.01', instanceId: 'case1', taskVersion: 'task-test', rubricVersion: 'rubric-test', modelVersion: 'model-test', status: 'correct', assistance: 'hint' }] });
function memory(initial?: string) {
  const entries = new Map<string, string>([['foreign-app', 'keep me']]);
  if (initial !== undefined) entries.set(PROGRESS_STORAGE_KEY, initial);
  const calls: string[] = [];
  const storage: StoragePort = {
    getItem(key) { calls.push(`get:${key}`); return entries.get(key) ?? null; },
    setItem(key, value) { calls.push(`set:${key}`); entries.set(key, value); },
    removeItem(key) { calls.push(`remove:${key}`); entries.delete(key); },
  };
  return { entries, calls, storage };
}
describe('local progress adapter', () => {
  it('roundtrips only schema metadata, exports and resets only its own key', () => {
    const { storage, entries, calls } = memory();
    const store = createProgressStore('content-test', () => storage);
    expect(store.getState()).toMatchObject({ mode: 'local', issue: null });
    store.save(data());
    expect(createProgressStore('content-test', () => storage).getState().progress).toEqual(data());
    expect(JSON.parse(store.exportProgress())).toEqual(data());
    expect(store.exportHistory()).toBeNull();
    store.reset();
    expect(entries.has(PROGRESS_STORAGE_KEY)).toBe(false);
    expect(entries.get('foreign-app')).toBe('keep me');
    expect(calls.every((call) => call.endsWith(PROGRESS_STORAGE_KEY))).toBe(true);
    expect(store.getState().progress.attempts).toEqual([]);
  });
  it('does not touch storage on import and works without a browser', () => {
    expect(browserStorage()).toBeNull();
    const store = createProgressStore('content-test');
    expect(store.save(data())).toMatchObject({ mode: 'session', issue: 'unavailable', progress: data() });
  });
  for (const [name, issue] of [['SecurityError', 'denied'], ['NotAllowedError', 'denied'], ['QuotaExceededError', 'quota'], ['Error', 'storage_error']] as const) {
    for (const operation of ['acquire', 'getItem', 'setItem', 'removeItem'] as const) {
      it(`retains session usability after ${name} during ${operation}`, () => {
        const { storage } = memory();
        const failure = () => { const error = new Error('PRIVATE_TEST_MARKER'); error.name = name; throw error; };
        if (operation !== 'acquire') storage[operation] = failure;
        const store = createProgressStore('content-test', operation === 'acquire' ? failure : () => storage);
        const result = operation === 'removeItem' ? store.reset() : store.save(data());
        expect(result).toMatchObject({ mode: 'session', issue });
        if (operation !== 'removeItem') expect(result.progress).toEqual(data());
        expect(JSON.stringify(result)).not.toContain('PRIVATE_TEST_MARKER');
      });
    }
  }
  for (const [raw, issue] of [['{broken', 'corrupt_json'], ['null', 'invalid_data'], ['{}', 'invalid_data'], [JSON.stringify({ ...data(), schemaVersion: 99 }), 'unsupported_schema'], [JSON.stringify({ ...data(), rawAnswer: 'PRIVATE_TEST_MARKER' }), 'invalid_data']] as const) {
    it(`preserves quarantined ${issue} bytes until explicit own reset`, () => {
      const { storage, entries } = memory(raw);
      const store = createProgressStore('content-test', () => storage);
      expect(store.save(data())).toMatchObject({ mode: 'session', issue, progress: data() });
      expect(entries.get(PROGRESS_STORAGE_KEY)).toBe(raw);
      expect(store.exportProgress()).not.toContain('PRIVATE_TEST_MARKER');
      store.reset();
      expect(store.save(data()).mode).toBe('local');
    });
  }
  it('preserves old content and all assistance/version data without a fictitious migration', () => {
    const old = JSON.stringify(data('old-unknown-content'));
    const { storage, entries } = memory(old);
    const store = createProgressStore('content-test', () => storage);
    expect(store.getState()).toMatchObject({ mode: 'session', issue: 'content_version', history: data('old-unknown-content') });
    store.save(data());
    expect(entries.get(PROGRESS_STORAGE_KEY)).toBe(old);
    expect(JSON.parse(store.exportHistory()!)).toEqual(data('old-unknown-content'));
    expect(JSON.parse(store.exportProgress())).toEqual(data());
    store.reset();
    expect(store.save(data()).mode).toBe('local');
  });
  it('refuses accidental overwrites after another tab changes the stored envelope', () => {
    const { storage, entries } = memory();
    const store = createProgressStore('content-test', () => storage);
    entries.set(PROGRESS_STORAGE_KEY, 'changed by another tab');
    expect(store.save(data())).toMatchObject({ mode: 'session', issue: 'storage_changed', progress: data() });
    expect(entries.get(PROGRESS_STORAGE_KEY)).toBe('changed by another tab');
  });
  it('recovers from a transient quota failure without losing current memory data', () => {
    const { storage } = memory();
    const original = storage.setItem;
    storage.setItem = () => { throw new DOMException('full', 'QuotaExceededError'); };
    const store = createProgressStore('content-test', () => storage);
    expect(store.save(data()).issue).toBe('quota');
    storage.setItem = original;
    expect(store.save(store.getState().progress).mode).toBe('local');
  });
  it('rejects invalid input and wrong content versions without changing memory or disk', () => {
    const { storage, entries } = memory();
    const store = createProgressStore('content-test', () => storage);
    expect(() => store.save({ ...data(), rawAnswer: 'PRIVATE_TEST_MARKER' } as ReturnType<typeof data>)).toThrow(ProgressContractError);
    expect(() => store.save(data('another'))).toThrow(ProgressContractError);
    expect(store.getState().progress.attempts).toEqual([]);
    expect(entries.has(PROGRESS_STORAGE_KEY)).toBe(false);
  });
  it('requires an explicit valid content version', () => {
    for (const label of ['', ' x', 'x\ny']) expect(() => createProgressStore(label, () => null)).toThrow(ProgressContractError);
  });
});
