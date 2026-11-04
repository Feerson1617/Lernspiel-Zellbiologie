import { evaluateM702 } from '../assessment/m702.ts';
import type { M702Outcome } from '../assessment/m702.ts';
import { createM702Context, M702_OPTIONS } from '../content/m702.ts';
import type { Assistance } from '../domain/contracts.ts';

type Writing = Readonly<{ argument: string; investigation: string }>;
type HelpKind = 'hint' | 'structure' | 'comparison' | 'criteria';
export interface M702Draft extends Writing { readonly assistance: Assistance; readonly historyUnverified: boolean; readonly trigger: 'criteria' | 'comparison'; readonly hadWriting: boolean }
/** Session-only drafts and disclosure history; deliberately no stored success receipt. */
export function createM702Learning(options: { resumed?: boolean } = {}) {
  let context = createM702Context(crypto.randomUUID());
  let writing: Writing = Object.freeze({ argument: '', investigation: '' }), firstDraft: M702Draft | null = null;
  let selected: readonly string[] = Object.freeze([]), checked: readonly string[] = Object.freeze([]), result: M702Outcome | null = null;
  let events: readonly Readonly<{ sequence: number; kind: HelpKind }>[] = Object.freeze([]), lastHelp: 1 | 2 | 3 | null = null;
  const navigation = globalThis.performance?.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const historyUnverified = options.resumed ?? (navigation !== undefined && navigation.type !== 'navigate');
  const assistance = (): Assistance => events.some(e => e.kind === 'comparison') ? 'solution_viewed' : events.length ? 'hint' : 'independent';
  function record(kind: HelpKind) { events = Object.freeze([...events, Object.freeze({ sequence: events.length + 1, kind })]); }
  function freezeDraft(trigger: 'criteria' | 'comparison') {
    firstDraft ??= Object.freeze({ ...writing, assistance: assistance(), historyUnverified, trigger, hadWriting: Boolean(writing.argument.trim() || writing.investigation.trim()) });
  }
  return Object.freeze({
    edit(field: keyof Writing, value: string) {
      if (!['argument', 'investigation'].includes(field) || typeof value !== 'string') throw new Error('Invalid writing field.');
      writing = Object.freeze({ ...writing, [field]: value });
    },
    select(id: string, value: boolean) {
      if (!M702_OPTIONS.some(option => option.id === id) || typeof value !== 'boolean') throw new Error('Unknown choice.');
      selected = Object.freeze(value ? [...new Set([...selected, id])] : selected.filter(item => item !== id));
    },
    openReview() { freezeDraft('criteria'); if (!events.some(e => e.kind === 'criteria')) record('criteria'); },
    help(level: 1 | 2 | 3) {
      if (![1, 2, 3].includes(level)) throw new Error('Unknown help.');
      if (level === 3) freezeDraft('comparison');
      record(level === 1 ? 'hint' : level === 2 ? 'structure' : 'comparison'); lastHelp = level;
    },
    submit() { freezeDraft('criteria'); checked = Object.freeze([...selected]); result = evaluateM702(context, selected); return result; },
    reset() { context = createM702Context(crypto.randomUUID()); writing = Object.freeze({ argument: '', investigation: '' }); firstDraft = null; selected = Object.freeze([]); checked = Object.freeze([]); result = null; lastHelp = null; },
    getState: () => Object.freeze({ context, writing, firstDraft, selected, checked, result, events, lastHelp, assistance: assistance(), historyUnverified,
      stale: result !== null && (selected.length !== checked.length || selected.some(id => !checked.includes(id))) }),
  });
}
export type M702Learning = ReturnType<typeof createM702Learning>;
