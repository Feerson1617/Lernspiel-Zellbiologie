import { evaluateM603, m603EdgeKey, parseM603Answer } from '../assessment/m603.ts';
import { createM603Context, readM603Material } from '../content/m603-materials.ts';
import { M603_HELP_TOPICS } from '../content/m603-learning.ts';
import type { M603HelpTopic } from '../content/m603-learning.ts';
import type { M603Answer, M603Claim, M603Edge, M603Outcome } from '../domain/m603-contract.ts';
import type { Assistance } from '../domain/contracts.ts';
import { requireProgressLabel } from '../domain/progress.ts';

export interface M603PriorHelp {
  readonly id: string; readonly source: string; readonly contextHash: string;
  readonly kind: Exclude<Assistance, 'independent'>;
}
export interface M603HelpEvent {
  readonly id: number; readonly taskId: 'M6.03' | 'M6.02'; readonly contextHash: string;
  readonly source: string; readonly level: 1 | 2 | 3; readonly kind: Exclude<Assistance, 'independent'>;
}
export interface M603Options { readonly idPrefix?: string; readonly resumed?: boolean }
export interface M603Receipt {
  readonly taskId: 'M6.03'; readonly contextHash: string; readonly revision: number;
  readonly outcome: M603Outcome; readonly assistance: Assistance;
}

/** No storage dependency. Help applies across these equivalent practice cases;
 * changing numeric material cannot erase disclosure of the same causal map. */
export function createM603Learning(options: M603Options = {}) {
  const prefix = options.idPrefix ?? `p03b-${crypto.randomUUID()}`;
  const contexts = [createM603Context(0, prefix), createM603Context(1, prefix)] as const;
  const navigation = globalThis.performance?.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  let historyUnverified = options.resumed ?? (navigation !== undefined && navigation.type !== 'navigate');
  let caseIndex: 0 | 1 = 0, revision = 0, evaluatedRevision = -1, layout: 'default' | 'alternate' = 'default';
  let answer = parseM603Answer({ edges: [], claims: [] }), explanation = '', revisedAfterFeedback = false;
  let outcome: M603Outcome | null = null, receipt: M603Receipt | null = null;
  const events: M603HelpEvent[] = [], priorIds = new Set<string>();
  const issued = new WeakMap<M603Outcome, Readonly<{ revision: number; hash: string }>>();

  function invalidate(edited: boolean) {
    revision++; receipt = null;
    if (edited && outcome) revisedAfterFeedback = true;
  }
  function edit(next: M603Answer) {
    const checked = parseM603Answer(next);
    if (JSON.stringify(checked) === JSON.stringify(answer)) return;
    answer = checked; invalidate(true);
  }
  function addEdge(edge: M603Edge) { edit({ ...answer, edges: [...answer.edges, edge] }); }
  function replaceEdge(index: number, edge: M603Edge) {
    if (!Number.isInteger(index) || !answer.edges[index]) throw new Error('Unknown edge.');
    edit({ ...answer, edges: answer.edges.map((item, i) => i === index ? edge : item) });
  }
  function removeEdge(index: number) {
    if (!Number.isInteger(index) || !answer.edges[index]) throw new Error('Unknown edge.');
    edit({ ...answer, edges: answer.edges.filter((_item, i) => i !== index) });
  }
  function toggleClaim(claim: M603Claim, selected: boolean) {
    edit({ ...answer, claims: selected ? [...answer.claims.filter(item => item !== claim), claim] : answer.claims.filter(item => item !== claim) });
  }
  function assistance(): Assistance {
    return events.some(event => event.kind === 'solution_viewed') ? 'solution_viewed' : events.length ? 'hint' : 'independent';
  }
  function help(source: M603HelpTopic | 'comparison', level: 1 | 2 | 3) {
    if ((!M603_HELP_TOPICS.includes(source as M603HelpTopic) && source !== 'comparison')
      || ![1, 2, 3].includes(level) || (source === 'comparison' && level !== 3)) throw new Error('Invalid help source.');
    const kind = level === 3 ? 'solution_viewed' : 'hint';
    events.push(Object.freeze({ id: events.length + 1, taskId: 'M6.03', contextHash: contexts[caseIndex].contextHash, source, level, kind }));
    invalidate(false);
  }
  function syncPriorHelp(prior: readonly M603PriorHelp[], unverified: boolean) {
    // Entry adapter supplies real M6.02 help events, never pupil responses.
    let changed = false;
    for (const event of prior) {
      requireProgressLabel(event.id); requireProgressLabel(event.source);
      if (!/^sha256-v1:[a-f0-9]{64}$/.test(event.contextHash) || !['hint', 'wordbank', 'clarified', 'solution_viewed'].includes(event.kind)) throw new Error('Invalid prior help.');
      if (priorIds.has(event.id)) continue;
      priorIds.add(event.id);
      events.push(Object.freeze({ id: events.length + 1, taskId: 'M6.02', contextHash: event.contextHash, source: event.source,
        level: event.kind === 'solution_viewed' ? 3 : 1, kind: event.kind }));
      changed = true;
    }
    if (unverified && !historyUnverified) { historyUnverified = true; changed = true; }
    if (changed) invalidate(false);
  }
  function confirm(candidate: M603Outcome): M603Receipt {
    const binding = issued.get(candidate), current = contexts[caseIndex];
    if (!binding || candidate !== outcome || binding.revision !== revision || binding.hash !== current.contextHash
      || candidate.status !== 'correct' || candidate.binding?.contextHash !== current.contextHash || historyUnverified) {
      throw new Error('No current verified causal-map evidence.');
    }
    receipt ??= Object.freeze({ taskId: 'M6.03', contextHash: current.contextHash, revision, outcome: candidate, assistance: assistance() });
    return receipt;
  }
  function submit(): M603Outcome {
    if (outcome && evaluatedRevision === revision) return outcome;
    outcome = evaluateM603(contexts[caseIndex], answer); evaluatedRevision = revision;
    issued.set(outcome, Object.freeze({ revision, hash: contexts[caseIndex].contextHash }));
    if (outcome.status === 'correct' && !historyUnverified) confirm(outcome);
    return outcome;
  }
  function activateCase(index: 0 | 1) {
    if (!Number.isInteger(index) || !contexts[index]) throw new Error('Unknown case.');
    if (caseIndex === index) return;
    caseIndex = index; invalidate(false);
    answer = parseM603Answer({ edges: [], claims: [] }); explanation = ''; outcome = null; revisedAfterFeedback = false;
  }
  return Object.freeze({
    addEdge, replaceEdge, removeEdge, toggleClaim, help, syncPriorHelp, submit, confirm, activateCase,
    setLayout: (value: 'default' | 'alternate') => { if (!['default', 'alternate'].includes(value)) throw new Error('Invalid layout.'); layout = value; },
    editExplanation: (value: string) => { if (typeof value !== 'string') throw new Error('Invalid draft.'); explanation = value; },
    getState: () => Object.freeze({ context: contexts[caseIndex], material: readM603Material(contexts[caseIndex]), caseIndex,
      answer, outcome, revision, stale: outcome !== null && evaluatedRevision !== revision, layout, explanation,
      assistance: assistance(), historyUnverified, help: Object.freeze([...events]), receipt, revisedAfterFeedback,
      edgeKeys: Object.freeze(answer.edges.map(m603EdgeKey)),
    }),
  });
}
export type M603LearningController = ReturnType<typeof createM603Learning>;
