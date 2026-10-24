import { ASSISTANCE_KINDS } from '../domain/contracts.ts';
import type { Assistance } from '../domain/contracts.ts';
import { snapshotContextData } from '../domain/context-data.ts';
import { NAMING_CONTRACT, namingRequire, namingSnapshot, parseNamingSubmission } from '../domain/naming-contract.ts';
import type { NamingHelpEvent, NamingOutcome, NamingSubmission, NamingTaskId } from '../domain/naming-contract.ts';
import { createContextBinding, isResultForContext, parseTaskContext } from '../domain/task-context.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { createAttemptRecord, parseProgress, requireProgressLabel } from '../domain/progress.ts';
import type { AttemptRecord } from '../domain/progress.ts';
import { evaluateNaming, supportsNamingContext } from '../assessment/naming-v1.ts';
import { IncompleteTaskAssessmentError } from '../assessment/progress.ts';

interface InstanceHistory { context: TaskContext; events: NamingHelpEvent[]; history: 'verified' | 'history_unverified'; floor: Assistance }
export interface NamingSessionOptions {
  readonly idPrefix: string;
  readonly resumed: boolean;
  readonly loadedAttempts: readonly AttemptRecord[];
}
/** Private issuance ledger is RAM-only. No raw answers, evidence or links go to storage. */
export function createNamingSession(initial: TaskContext, options: NamingSessionOptions) {
  requireProgressLabel(options.idPrefix);
  namingRequire(typeof options.resumed === 'boolean', 'RESUME_ORIGIN');
  let context = parseTaskContext(initial);
  namingRequire(supportsNamingContext(context), 'CONTEXT');
  const instances = new Map<string, InstanceHistory>();
  const issued = new Map<string, NamingOutcome>();
  const receipts = new Map<NamingOutcome, AttemptRecord>();
  const submissions = new Map<string, string>();
  const loadedAttempts = parseProgress({ schemaVersion: 1, contentVersion: initial.contentVersion, attempts: options.loadedAttempts }).attempts;
  const seenCases: TaskContext[] = [context];
  let revision = 1;
  let latest: NamingOutcome | null = null;
  let origin: 'typed' | 'wordbank_selection' = 'typed';
  let eventSequence = 0;
  const key = (c: TaskContext) => `${c.taskId}/${c.instanceId}`;
  const rank = (a: Assistance) => ASSISTANCE_KINDS.indexOf(a);
  const loaded = loadedAttempts.filter(a => a.taskId === context.taskId && a.instanceId === context.instanceId);
  const floor = loaded.reduce<Assistance>((v, a) => rank(a.assistance) > rank(v) ? a.assistance : v, 'independent');
  instances.set(key(context), { context, events: [], history: options.resumed || loaded.length ? 'history_unverified' : 'verified', floor });
  const history = () => instances.get(key(context))!;
  function assistance(): Assistance { return history().events.reduce<Assistance>((v, e) => rank(e.kind) > rank(v) ? e.kind : v, history().floor); }
  function edit(): void { revision++; origin = 'typed'; }
  function makeSubmission(termText: string, additionalStatements: readonly string[]): NamingSubmission {
    const existing = issued.get(`${options.idPrefix}-${revision}`);
    if (existing) {
      namingRequire(existing.submission.termText === termText && JSON.stringify(existing.submission.additionalStatements) === JSON.stringify(additionalStatements), 'EDIT_REQUIRED');
      return existing.submission;
    }
    return parseNamingSubmission({ contractVersion: NAMING_CONTRACT,
      target: context.taskId === 'Z1.02' ? { taskId: 'Z1.02', fieldId: 'term' } : { taskId: 'M6.02', fieldId: 'process' },
      context, attemptId: `${options.idPrefix}-${revision}`, revision,
      predecessorId: latest?.submission.context.contextHash === context.contextHash ? latest.submission.attemptId : null,
      termText, additionalStatements,
    });
  }
  function submit(input: unknown): NamingOutcome {
    const s = parseNamingSubmission(input);
    namingRequire(s.context.contextHash === context.contextHash && s.revision === revision && s.attemptId === `${options.idPrefix}-${revision}`, 'STALE_SUBMISSION');
    const json = snapshotContextData(s).json;
    const existing = issued.get(s.attemptId);
    if (existing) {
      namingRequire(submissions.get(s.attemptId) === json && existing.support.assistance === assistance(), 'DUPLICATE_CONFLICT');
      return existing;
    }
    const predecessor = latest?.submission.context.contextHash === context.contextHash ? latest : null;
    namingRequire(s.predecessorId === (predecessor?.submission.attemptId ?? null), 'PREDECESSOR');
    const result = evaluateNaming(s, { assistance: assistance(), history: history().history, origin, events: history().events });
    issued.set(s.attemptId, result); submissions.set(s.attemptId, json); latest = result;
    return result;
  }
  function help(kind: Exclude<Assistance, 'independent'>): void {
    namingRequire(ASSISTANCE_KINDS.includes(kind) && kind !== ('independent' as Assistance), 'HELP');
    if (kind === 'clarified') namingRequire(history().events.some(e => e.kind === 'wordbank'), 'WORDBANK_FIRST');
    history().events.push(Object.freeze({ id: `${options.idPrefix}-help-${++eventSequence}`, kind, contextHash: context.contextHash }));
    edit();
    if (kind === 'clarified') origin = 'wordbank_selection';
  }
  function activate(nextInput: TaskContext, mode: 'same_instance' | 'new_case' | 'return'): void {
    const next = parseTaskContext(nextInput);
    namingRequire(supportsNamingContext(next), 'CONTEXT');
    const known = instances.get(key(next));
    if (known) {
      namingRequire(mode !== 'new_case' && (mode !== 'same_instance' || key(next) === key(context)), 'INSTANCE_REUSE');
      // Full context may change, assistance never resets within this instance.
      known.context = next;
    } else {
      namingRequire(mode === 'new_case', 'NEW_CASE_REQUIRED');
      const material = snapshotContextData(next.material).json;
      const prior = seenCases.filter(v => v.taskId === next.taskId);
      namingRequire(prior.every(v => v.seed !== next.seed && snapshotContextData(v.material).json !== material), 'RELABELLED_CASE');
      namingRequire(!loadedAttempts.some(a => a.taskId === next.taskId && a.instanceId === next.instanceId), 'LOADED_INSTANCE');
      instances.set(key(next), { context: next, events: [], floor: 'independent', history: 'verified' });
    }
    seenCases.push(next); context = next; latest = null; edit();
  }
  function record(outcome: NamingOutcome): AttemptRecord {
    namingRequire(issued.get(outcome.submission.attemptId) === outcome && outcome === latest, 'UNISSUED_OUTCOME');
    namingRequire(outcome.submission.context.contextHash === context.contextHash && isResultForContext(outcome.termResult, context), 'STALE_OUTCOME');
    namingRequire(outcome.support.history === 'verified' && history().history === 'verified' && outcome.support.assistance === assistance(), 'HISTORY_UNVERIFIED');
    namingRequire(outcome.submission.revision === revision && outcome.contractVersion === NAMING_CONTRACT, 'STALE_OUTCOME');
    // Recompute ALL scope aggregation, never accept the green criterion alone.
    const verified = evaluateNaming(outcome.submission, outcome.support);
    namingRequire(snapshotContextData(verified).json === snapshotContextData(outcome).json, 'OUTCOME_MISMATCH');
    if (context.taskId !== 'Z1.02' || outcome.pendingCriteria.length) throw new IncompleteTaskAssessmentError();
    const existing = receipts.get(outcome);
    if (existing) return existing;
    namingRequire(outcome.overallStatus !== 'technical', 'TECHNICAL_NO_RECORD');
    const record = createAttemptRecord(outcome.submission.attemptId, { ...createContextBinding(context), status: outcome.overallStatus, assistance: outcome.support.assistance }, context);
    receipts.set(outcome, record); return record;
  }
  return Object.freeze({ makeSubmission, submit, edit, help, activate, record,
    getState: () => namingSnapshot({ context, revision, latest, assistance: assistance(), history: history().history,
      events: history().events, outcomes: [...issued.values()] }),
    getTaskId: () => context.taskId as NamingTaskId,
  });
}
export type NamingSession = ReturnType<typeof createNamingSession>;
