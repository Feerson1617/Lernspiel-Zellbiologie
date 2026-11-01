import { createM602CuedSession } from './m602-session.ts';
import { createM602MaterialContext, readM602Material, M602_MATERIAL_CASES } from '../content/m602-materials.ts';
import { M602_FIELDS } from '../domain/m602-contract.ts';
import type { M602Field } from '../domain/m602-contract.ts';
import type { M602CuedOutcome } from '../domain/m602-cued-contract.ts';
import type { Assistance } from '../domain/contracts.ts';
import { appendAttempt } from '../domain/progress.ts';
import { createProgressStore } from '../persistence/progress-store.ts';
import type { StoragePort } from '../persistence/progress-store.ts';

export interface M602LearningOptions {
  readonly idPrefix?: string;
  readonly resumed?: boolean;
  readonly acquireStorage?: () => StoragePort | null;
}

/** A reload loses the volatile help ledger. It cannot restore independent evidence. */
function resumedNavigation(): boolean {
  const navigation = globalThis.performance?.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  return navigation !== undefined && navigation.type !== 'navigate';
}

/** Orchestrates the existing contracts. No classification, biological inference,
 * new persistence shape, or DOM lives here. Retain one controller across routes. */
export function createM602Learning(options: M602LearningOptions = {}) {
  const id = options.idPrefix ?? `p03a-${crypto.randomUUID()}`;
  const contexts = M602_MATERIAL_CASES.map(item => createM602MaterialContext(item.id, id));
  const initial = contexts[0]!;
  const store = createProgressStore(initial.contentVersion, options.acquireStorage);
  const loaded = store.getState();
  const session = createM602CuedSession(initial, {
    idPrefix: id,
    resumed: (options.resumed ?? resumedNavigation()) || loaded.issue !== null,
    loadedAttempts: [...loaded.progress.attempts, ...(loaded.history?.attempts ?? [])],
  });
  let caseIndex = 0;
  const visited = new Set([0]);
  const emptyAnswers = (): Record<M602Field, string> => ({ process: '', direction: '', volume: '' });
  let answers = emptyAnswers(), additional = '', outcome: M602CuedOutcome | null = null;
  let revisedAfterFeedback = false;

  function edit(field: M602Field, value: string) {
    if (answers[field] === value) return;
    session.edit(field);
    answers[field] = value;
    if (outcome) revisedAfterFeedback = true;
  }
  function editAdditional(value: string) {
    if (additional === value) return;
    session.edit(); additional = value;
    if (outcome) revisedAfterFeedback = true;
  }
  function submit() {
    outcome = session.submit(session.makeSubmission(answers, [additional]));
    if (outcome.overallStatus === 'correct' && outcome.support.history === 'verified') {
      const receipt = session.record(outcome);
      if (!store.getState().progress.attempts.some(item => item.attemptId === receipt.attemptId)) {
        store.save(appendAttempt(store.getState().progress, receipt));
      }
    }
    return outcome;
  }
  function help(field: M602Field, kind: Exclude<Assistance, 'independent'>) { session.help(field, kind); }
  function choose(field: M602Field, value: string) {
    // Opening a choice is recorded even when selected directly using the keyboard.
    session.help(field, 'wordbank'); session.help(field, 'clarified');
    answers[field] = value;
  }
  function activateCase(index: 0 | 1) {
    const context = contexts[index];
    if (!context) throw new Error('Unknown M6.02 material case.');
    if (index === caseIndex) return;
    session.activate(context, visited.has(index) ? 'return' : 'new_case');
    visited.add(index); caseIndex = index;
    answers = emptyAnswers(); additional = ''; outcome = null; revisedAfterFeedback = false;
  }
  function getState() {
    const state = session.getState(), storage = store.getState();
    return Object.freeze({
      context: state.context, material: readM602Material(state.context), caseIndex,
      answers: Object.freeze({ ...answers }), additional, outcome,
      stale: outcome !== null && (outcome.submission.revision !== state.revision || outcome.submission.context.contextHash !== state.context.contextHash),
      revisedAfterFeedback, hasSubmitted: outcome !== null,
      support: Object.freeze({ history: state.history, fields: state.fields }), storage,
      recordedCount: storage.progress.attempts.filter(item => item.taskId === 'M6.02').length,
    });
  }
  return Object.freeze({ getState, edit, editAdditional, submit, help, choose, activateCase,
    showNotebookSolution: () => { for (const field of M602_FIELDS) session.help(field, 'solution_viewed'); },
  });
}
export type M602LearningController = ReturnType<typeof createM602Learning>;
