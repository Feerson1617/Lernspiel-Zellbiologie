import { evaluateM604, parseM604Answer } from '../assessment/m604.ts';
import { createM604Context, readM604Material } from '../content/m604-materials.ts';
import { M604_CASE_IDS, M604_FIELDS } from '../domain/m604-contract.ts';
import type { M604CaseId, M604Field, M604Outcome } from '../domain/m604-contract.ts';
import type { Assistance } from '../domain/contracts.ts';
import { requireProgressLabel } from '../domain/progress.ts';

export interface M604PriorHelp {
  readonly id: string; readonly taskId: 'M6.02' | 'M6.03'; readonly source: string;
  readonly contextHash: string; readonly kind: Exclude<Assistance, 'independent'>;
}
export interface M604HelpEvent {
  readonly id: string; readonly taskId: 'M6.02' | 'M6.03' | 'M6.04'; readonly source: string;
  readonly contextHash: string; readonly kind: Exclude<Assistance, 'independent'>; readonly level: 1 | 2 | 3;
}
export interface M604Receipt {
  readonly taskId: 'M6.04'; readonly revision: number; readonly contextHash: string;
  readonly outcome: M604Outcome; readonly assistance: Assistance;
}
export function createM604Learning(options: { readonly idPrefix?: string; readonly resumed?: boolean } = {}) {
  const prefix = options.idPrefix ?? `m604-${crypto.randomUUID()}`;
  const contexts = { recovery: createM604Context('recovery', prefix), limited: createM604Context('limited', prefix) };
  const materials = { recovery: readM604Material(contexts.recovery), limited: readM604Material(contexts.limited) };
  const navigation = globalThis.performance?.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  let historyUnverified = options.resumed ?? (navigation !== undefined && navigation.type !== 'navigate');
  let caseId: M604CaseId = 'recovery', revision = 0, evaluatedRevision = -1, step = 0;
  const empty = () => parseM604Answer(Object.fromEntries(M604_FIELDS.map(id => [id, []])));
  let answer = empty(), prediction = '', writing = '', observationsVisible = false, revisedAfterFeedback = false;
  let predictionBeforeData: Readonly<{ text: string; hypothesis: readonly string[]; contextHash: string }> | null = null;
  let predictionAfterData = false;
  const seenCases = new Set<M604CaseId>(), events: M604HelpEvent[] = [], priorIds = new Set<string>();
  let outcome: M604Outcome | null = null, receipt: M604Receipt | null = null;
  const issued = new WeakMap<M604Outcome, Readonly<{ revision: number; hash: string }>>();
  function assistance(): Assistance { return events.some(e => e.kind === 'solution_viewed') ? 'solution_viewed' : events.length ? 'hint' : 'independent'; }
  function invalidate(edited = false) { revision++; receipt = null; if (edited && outcome) revisedAfterFeedback = true; }
  function edit(field: M604Field, selected: readonly string[]) {
    if (!M604_FIELDS.includes(field)) throw new Error('Unknown planning field.');
    if (['observation','observationType','interpretation'].includes(field) && !observationsVisible) throw new Error('Open the supplied observations first.');
    const checked = parseM604Answer({ ...answer, [field]: selected });
    if (JSON.stringify(checked) === JSON.stringify(answer)) return;
    answer = checked; invalidate(true);
    if (field === 'hypothesis' && seenCases.has(caseId)) predictionAfterData = true;
  }
  function revealObservations() {
    if (observationsVisible) return;
    if (!seenCases.has(caseId)) predictionBeforeData = Object.freeze({ text: prediction, hypothesis: answer.hypothesis, contextHash: contexts[caseId].contextHash });
    else predictionAfterData = true;
    seenCases.add(caseId); observationsVisible = true; invalidate();
  }
  function help(source: 'planning' | 'evidence' | 'limits' | 'comparison', level: 1 | 2 | 3) {
    if (!['planning','evidence','limits','comparison'].includes(source) || ![1,2,3].includes(level) || (source === 'comparison' && level !== 3)) throw new Error('Invalid help.');
    events.push(Object.freeze({ id: `m604/${events.length + 1}`, taskId: 'M6.04', source, level,
      contextHash: contexts[caseId].contextHash, kind: level === 3 ? 'solution_viewed' : 'hint' }));
    invalidate();
  }
  function syncPriorHelp(prior: readonly M604PriorHelp[], unverified: boolean) {
    const checked = prior.map(event => {
      requireProgressLabel(event.id); requireProgressLabel(event.source);
      if (!['M6.02','M6.03'].includes(event.taskId) || !/^sha256-v1:[a-f0-9]{64}$/.test(event.contextHash)
        || !['hint','wordbank','clarified','solution_viewed'].includes(event.kind)) throw new Error('Invalid prior help.');
      return Object.freeze({ ...event });
    });
    let changed = false;
    for (const event of checked) {
      const key = `${event.taskId}/${event.id}`;
      if (priorIds.has(key)) continue;
      priorIds.add(key); events.push(Object.freeze({ ...event, id: key, level: event.kind === 'solution_viewed' ? 3 : 1 })); changed = true;
    }
    if (unverified && !historyUnverified) { historyUnverified = true; changed = true; }
    if (changed) invalidate();
  }
  function confirm(candidate: M604Outcome): M604Receipt {
    const binding = issued.get(candidate), context = contexts[caseId];
    if (!binding || candidate !== outcome || binding.revision !== revision || binding.hash !== context.contextHash
      || candidate.status !== 'correct' || candidate.binding?.contextHash !== context.contextHash || !observationsVisible || historyUnverified) throw new Error('No current verified investigation evidence.');
    receipt ??= Object.freeze({ taskId: 'M6.04', revision, contextHash: context.contextHash, outcome: candidate, assistance: assistance() });
    return receipt;
  }
  function submit(): M604Outcome {
    if (outcome && evaluatedRevision === revision) return outcome;
    outcome = evaluateM604(contexts[caseId], answer); evaluatedRevision = revision;
    issued.set(outcome, Object.freeze({ revision, hash: contexts[caseId].contextHash }));
    if (outcome.status === 'correct' && observationsVisible && !historyUnverified) confirm(outcome);
    return outcome;
  }
  function clearDraft() {
    answer = empty(); prediction = ''; writing = ''; outcome = null; receipt = null;
    observationsVisible = false; predictionBeforeData = null; predictionAfterData = seenCases.has(caseId);
    revisedAfterFeedback = false; step = 0; invalidate();
  }
  function activateCase(next: M604CaseId) {
    if (!M604_CASE_IDS.includes(next)) throw new Error('Unknown case.');
    if (next === caseId) return;
    caseId = next; clearDraft();
  }
  return Object.freeze({ edit, revealObservations, help, syncPriorHelp, submit, confirm, activateCase, reset: clearDraft,
    setStep: (next: number) => { if (!Number.isInteger(next) || next < 0 || next > 6) throw new Error('Unknown step.'); step = next; },
    editPrediction: (value: string) => { if (typeof value !== 'string') throw new Error('Invalid draft.'); if (value !== prediction && seenCases.has(caseId)) predictionAfterData = true; prediction = value; },
    editWriting: (value: string) => { if (typeof value !== 'string') throw new Error('Invalid draft.'); writing = value; },
    getState: () => Object.freeze({ caseId, context: contexts[caseId], material: materials[caseId], answer, step, prediction, writing,
      predictionBeforeData, predictionAfterData, observationsVisible, seenDataBefore: seenCases.has(caseId),
      outcome, receipt, revision, stale: outcome !== null && revision !== evaluatedRevision, assistance: assistance(), historyUnverified,
      help: Object.freeze([...events]), revisedAfterFeedback }),
  });
}
export type M604LearningController = ReturnType<typeof createM604Learning>;
