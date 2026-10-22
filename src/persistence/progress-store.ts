import { parseProgress, ProgressContractError, requireProgressLabel, snapshotProgress } from '../domain/progress.ts';
import type { ProgressEnvelope } from '../domain/progress.ts';

export const PROGRESS_STORAGE_KEY = 'zelllabor11.progress.v1';
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export type StorageIssue = 'unavailable' | 'denied' | 'quota' | 'storage_error' | 'corrupt_json'
  | 'invalid_data' | 'unsupported_schema' | 'content_version' | 'storage_changed';
export interface ProgressState {
  readonly mode: 'local' | 'session';
  readonly issue: StorageIssue | null;
  readonly progress: ProgressEnvelope;
  /** A different content version remains intact; no automatic migration or merging. */
  readonly history: ProgressEnvelope | null;
}

function storageFailure(error: unknown): StorageIssue {
  const name = error instanceof Error ? error.name : '';
  if (name === 'SecurityError' || name === 'NotAllowedError') return 'denied';
  if (name === 'QuotaExceededError') return 'quota';
  return 'storage_error';
}

/** Lazy access also catches browsers which throw while obtaining localStorage itself. */
export function browserStorage(): StoragePort | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

/** One explicit load; failed/foreign-version data is preserved until explicit own-data reset. */
export function createProgressStore(contentVersion: string, acquire: () => StoragePort | null = browserStorage) {
  requireProgressLabel(contentVersion);
  const empty = () => parseProgress({ schemaVersion: 1, contentVersion, attempts: [] });
  let state: ProgressState = Object.freeze({ mode: 'session', issue: 'unavailable', progress: empty(), history: null });
  let storage: StoragePort | null = null;
  let expected: string | null = null;
  let protectedData = false;
  const update = (change: Partial<ProgressState>): ProgressState => (state = Object.freeze({ ...state, ...change }));
  function load(): ProgressState {
    // Called once during construction; subsequent saves retain session work.
    try {
      storage = acquire();
      if (!storage) return update({ mode: 'session', issue: 'unavailable' });
      expected = storage.getItem(PROGRESS_STORAGE_KEY);
      if (expected === null) return update({ mode: 'local', issue: null });
      let input: unknown;
      try { input = JSON.parse(expected) as unknown; }
      catch { protectedData = true; return update({ mode: 'session', issue: 'corrupt_json' }); }
      let loaded: ProgressEnvelope;
      try { loaded = parseProgress(input); }
      catch (error) {
        protectedData = true;
        return update({ mode: 'session', issue: error instanceof ProgressContractError && error.code === 'UNSUPPORTED_SCHEMA' ? 'unsupported_schema' : 'invalid_data' });
      }
      if (loaded.contentVersion !== contentVersion) {
        protectedData = true;
        return update({ mode: 'session', issue: 'content_version', history: loaded });
      }
      return update({ mode: 'local', issue: null, progress: loaded });
    } catch (error) { return update({ mode: 'session', issue: storageFailure(error) }); }
  }
  load();

  function save(input: ProgressEnvelope): ProgressState {
    // Contract errors are explicit; never replace a valid in-memory state with invalid input.
    const progress = snapshotProgress(input);
    if (progress.contentVersion !== contentVersion) throw new ProgressContractError('CONTENT_VERSION_MISMATCH');
    update({ progress });
    if (protectedData || !storage) return state;
    try {
      if (storage.getItem(PROGRESS_STORAGE_KEY) !== expected) {
        protectedData = true;
        return update({ mode: 'session', issue: 'storage_changed' });
      }
      const json = JSON.stringify(progress);
      storage.setItem(PROGRESS_STORAGE_KEY, json);
      expected = json;
      return update({ mode: 'local', issue: null });
    } catch (error) { return update({ mode: 'session', issue: storageFailure(error) }); }
  }

  function reset(): ProgressState {
    update({ progress: empty(), history: null });
    try {
      storage = acquire();
      if (!storage) return update({ mode: 'session', issue: 'unavailable' });
      storage.removeItem(PROGRESS_STORAGE_KEY);
      expected = null;
      protectedData = false;
      return update({ mode: 'local', issue: null });
    } catch (error) { return update({ mode: 'session', issue: storageFailure(error) }); }
  }
  return Object.freeze({ getState: () => state, save, reset,
    /** Optional explicit export of metadata only; no automatic download or network request. */
    exportProgress: () => JSON.stringify(parseProgress(state.progress)),
    exportHistory: () => state.history === null ? null : JSON.stringify(parseProgress(state.history)),
  });
}
