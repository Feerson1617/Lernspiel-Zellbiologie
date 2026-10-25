import { ASSISTANCE_KINDS } from '../domain/contracts.ts';
import type { Assistance } from '../domain/contracts.ts';
import { readDataRecord, snapshotContextData } from '../domain/context-data.ts';
import { namingSnapshot, namingRequire, exactNamingFields, createNamingSupport } from '../domain/naming-contract.ts';
import type { NamingHelpEvent, NamingSupport } from '../domain/naming-contract.ts';
import { M602_FIELDS, M602_CONTRACT, parseM602Submission } from '../domain/m602-contract.ts';
import type { M602Field } from '../domain/m602-contract.ts';
import { parseProgress, createAttemptRecord, requireProgressLabel } from '../domain/progress.ts';
import type { AttemptRecord } from '../domain/progress.ts';
import { createContextBinding, parseTaskContext, isResultForContext } from '../domain/task-context.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { evaluateM602, supportsM602Context } from '../assessment/m602.ts';
import { M602_CUED_CONTRACT, parseM602CuedSubmission } from '../domain/m602-cued-contract.ts';
import type { M602ContractVersion, M602VersionedSubmission, M602VersionedOutcome } from '../domain/m602-cued-contract.ts';
import { evaluateM602Cued, supportsM602CuedContext } from '../assessment/m602-cued.ts';
import type { NamingSessionOptions } from './naming-session.ts';

/** Whole-task ledger; no biological decisions or persistence inside this controller. */
function createSession<V extends M602ContractVersion>(initial: TaskContext, configuration: NamingSessionOptions, api: Readonly<{
  contract: V;
  parse: (input: unknown) => M602VersionedSubmission<V>;
  evaluate: (input: unknown, support: Readonly<Record<M602Field, NamingSupport>>) => M602VersionedOutcome<V>;
  supports: (context: TaskContext) => boolean;
}>) {
  const config = namingSnapshot(configuration); exactNamingFields(readDataRecord(config), ['idPrefix', 'resumed', 'loadedAttempts']);
  requireProgressLabel(config.idPrefix); namingRequire(typeof config.resumed === 'boolean', 'RESUME_ORIGIN');
  let context = parseTaskContext(initial); namingRequire(api.supports(context), 'M602_CONTEXT');
  const loaded = parseProgress({ schemaVersion: 1, contentVersion: context.contentVersion, attempts: config.loadedAttempts }).attempts;
  const history = config.resumed || loaded.length ? 'history_unverified' : 'verified';
  const freshEvents = () => ({ process: [] as NamingHelpEvent[], direction: [] as NamingHelpEvent[], volume: [] as NamingHelpEvent[] });
  const instances = new Map<string, ReturnType<typeof freshEvents>>([[context.instanceId, freshEvents()]]);
  const seen = [context], issued = new Map<string, M602VersionedOutcome<V>>(), requests = new Map<string, string>(), receipts = new Map<M602VersionedOutcome<V>, AttemptRecord>();
  const origins: Record<M602Field, 'typed' | 'wordbank_selection'> = { process: 'typed', direction: 'typed', volume: 'typed' };
  let revision = 1, sequence = 0, latest: M602VersionedOutcome<V> | null = null;
  const rank = (a: Assistance) => ASSISTANCE_KINDS.indexOf(a);
  function supports(): Record<M602Field, NamingSupport> {
    return Object.fromEntries(M602_FIELDS.map(field => {
      const events = instances.get(context.instanceId)![field];
      const assistance = events.reduce<Assistance>((a, e) => rank(a) >= rank(e.kind) ? a : e.kind, 'independent');
      return [field, createNamingSupport({ assistance, history, origin: origins[field], events })];
    })) as Record<M602Field, NamingSupport>;
  }
  function edit(field?: M602Field): void {
    if (field !== undefined) { namingRequire(M602_FIELDS.includes(field), 'M602_FIELD'); origins[field] = 'typed'; }
    revision++;
  }
  function help(field: M602Field, kind: Exclude<Assistance, 'independent'>): void {
    namingRequire(M602_FIELDS.includes(field) && rank(kind) > 0, 'M602_HELP');
    const events = instances.get(context.instanceId)![field];
    if (kind === 'clarified') namingRequire(events.some(e => e.kind === 'wordbank'), 'WORDBANK_FIRST');
    events.push(Object.freeze({ id: `${config.idPrefix}-${field}-help-${++sequence}`, kind, contextHash: context.contextHash }));
    if (kind === 'clarified') origins[field] = 'wordbank_selection';
    revision++;
  }
  function makeSubmission(answers: Readonly<Record<M602Field, string>>, additionalStatements: readonly string[]) {
    const existing = issued.get(`${config.idPrefix}-${revision}`);
    if (existing) {
      namingRequire(JSON.stringify(existing.submission.answers) === JSON.stringify(namingSnapshot(answers)) && JSON.stringify(existing.submission.additionalStatements) === JSON.stringify(additionalStatements), 'EDIT_REQUIRED');
      return existing.submission;
    }
    return api.parse({ contractVersion: api.contract, context, answers, additionalStatements, attemptId: `${config.idPrefix}-${revision}`, revision,
      predecessorId: latest?.submission.context.contextHash === context.contextHash ? latest.submission.attemptId : null });
  }
  function submit(input: unknown): M602VersionedOutcome<V> {
    const request = api.parse(input);
    namingRequire(request.context.contextHash === context.contextHash && request.revision === revision && request.attemptId === `${config.idPrefix}-${revision}`, 'STALE_M602');
    const data = snapshotContextData(request).json, existing = issued.get(request.attemptId);
    if (existing) { namingRequire(requests.get(request.attemptId) === data, 'DUPLICATE_CONFLICT'); return existing; }
    namingRequire(request.predecessorId === (latest?.submission.context.contextHash === context.contextHash ? latest.submission.attemptId : null), 'PREDECESSOR');
    latest = api.evaluate(request, supports()); issued.set(request.attemptId, latest); requests.set(request.attemptId, data); return latest;
  }
  function activate(input: TaskContext, mode: 'same_instance' | 'new_case' | 'return'): void {
    const c = parseTaskContext(input); namingRequire(api.supports(c) && ['same_instance', 'new_case', 'return'].includes(mode), 'M602_CONTEXT');
    if (instances.has(c.instanceId)) namingRequire(mode !== 'new_case' && (mode !== 'same_instance' || c.instanceId === context.instanceId), 'INSTANCE_REUSE');
    else {
      namingRequire(mode === 'new_case' && !loaded.some(a => a.taskId === c.taskId && a.instanceId === c.instanceId), 'NEW_CASE_REQUIRED');
      namingRequire(seen.every(s => s.seed !== c.seed && snapshotContextData(s.material).json !== snapshotContextData(c.material).json), 'RELABELLED_CASE');
      instances.set(c.instanceId, freshEvents());
    }
    // Same-instance material changes retain the visible draft, including its
    // actual selection origin. A fresh/returned draft starts with typed input.
    seen.push(c); context = c; latest = null;
    if (mode !== 'same_instance') for (const f of M602_FIELDS) origins[f] = 'typed';
    revision++;
  }
  function record(outcome: M602VersionedOutcome<V>): AttemptRecord {
    namingRequire(issued.get(outcome.submission.attemptId) === outcome && latest === outcome, 'UNISSUED_M602');
    namingRequire(history === 'verified' && outcome.support.history === 'verified', 'HISTORY_UNVERIFIED');
    namingRequire(outcome.submission.revision === revision && outcome.submission.context.contextHash === context.contextHash && isResultForContext(outcome.fullResult, context), 'STALE_M602');
    namingRequire(snapshotContextData(api.evaluate(outcome.submission, supports())).json === snapshotContextData(outcome).json, 'M602_OUTCOME');
    // Only complete, contradiction-free C01+C02+C03 is a correct whole task.
    namingRequire(outcome.overallStatus === 'correct' && outcome.pendingCriteria.length === 0 && !outcome.notAssessed.length, 'INCOMPLETE_M602');
    const cached = receipts.get(outcome); if (cached) return cached;
    const receipt = createAttemptRecord(outcome.submission.attemptId, { ...createContextBinding(context), status: outcome.overallStatus, assistance: outcome.support.assistance }, context);
    receipts.set(outcome, receipt); return receipt;
  }
  return Object.freeze({ makeSubmission, submit, edit, help, activate, record,
    getState: () => namingSnapshot({ context, revision, history, latest, fields: supports(), outcomes: [...issued.values()] }) });
}
/** Historical response/1.0.0 probe only; not the current cued route. */
export function createM602Session(initial: TaskContext, configuration: NamingSessionOptions) {
  return createSession(initial, configuration, { contract: M602_CONTRACT, parse: parseM602Submission, evaluate: evaluateM602, supports: supportsM602Context });
}
export function createM602CuedSession(initial: TaskContext, configuration: NamingSessionOptions) {
  return createSession(initial, configuration, { contract: M602_CUED_CONTRACT, parse: parseM602CuedSubmission, evaluate: evaluateM602Cued, supports: supportsM602CuedContext });
}
export type M602SessionController<V extends M602ContractVersion> = ReturnType<typeof createSession<V>>;
export type M602Session = ReturnType<typeof createM602Session>;
export type M602CuedSession = ReturnType<typeof createM602CuedSession>;
