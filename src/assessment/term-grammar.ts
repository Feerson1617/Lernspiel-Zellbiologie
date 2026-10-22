import { editDistance, isLimitedTypo } from './text.ts';
import type { TextToken } from './text.ts';

export interface TermMeaning {
  readonly id: string;
  readonly forms: readonly (readonly string[])[];
  readonly spellingTargets?: readonly string[];
}
export interface TermRef {
  readonly id: string;
  readonly start: number;
  readonly end: number;
  readonly typo: boolean;
}
export type TermClause =
  | Readonly<{ kind: 'name'; terms: readonly TermRef[]; negated: boolean; connector: 'single' | 'or' | 'and' | 'alias'; start: number; end: number }>
  | Readonly<{ kind: 'contrast'; excluded: TermRef; chosen: TermRef; start: number; end: number }>
  | Readonly<{ kind: 'identity' | 'encloses'; subject: TermRef; object: TermRef; negated: boolean; start: number; end: number }>
  | Readonly<{ kind: 'conjoined_negation'; positive: TermRef; negative: TermRef; start: number; end: number }>;

const ARTICLES = new Set(['der', 'die', 'das', 'den', 'dem', 'ein', 'eine', 'einen']);
const NEGATIONS = new Set(['nicht', 'kein', 'keine', 'keinen']);
const QUOTES: Readonly<Record<string, string>> = Object.freeze({ '„': '“', '‚': '‘', '«': '»', '"': '"', "'": "'", '“': '”' });
const HEDGES = [
  ['ich', 'bin', 'mir', 'nicht', 'sicher', ',', 'aber'],
  ['meiner', 'meinung', 'nach'], ['ich', 'wuerde', 'sagen'],
  ['ich', 'denke'], ['ich', 'glaube'], ['ich', 'vermute'],
  ['vielleicht'], ['wahrscheinlich'], ['vermutlich'], ['eventuell'],
] as const;
const FRAMES = [
  ['die', 'membran', ',', 'die', 'die', 'vakuole', 'umschliesst', ',', 'heisst'],
  ['die', 'membran', 'um', 'die', 'vakuole', 'heisst'],
  ['der', 'gesuchte', 'begriff', 'ist'], ['die', 'gesuchte', 'membran', 'heisst'],
  ['die', 'membran', 'nennt', 'man'], ['die', 'membran', 'heisst'],
  ['die', 'membran', 'wird'], ['sie', 'wird'],
  ['diese', 'membran', 'heisst'], ['die', 'membran', 'ist'],
  ['meine', 'antwort', 'ist'], ['die', 'bezeichnung', 'ist'], ['der', 'name', 'ist'],
  ['das', 'muesste'], ['das', 'ist'], ['es', 'ist'], ['ist', 'es'],
  ['gemeint', 'ist'], ['gesucht', 'ist'], ['ich', 'meine'], ['sie', 'heisst'],
] as const;
const TAIL_HEDGES = [['denke', 'ich'], ['glaube', 'ich'], ['vermute', 'ich']] as const;
interface ReadTerm { readonly term: TermRef; readonly next: number }
type Connector = 'single' | 'or' | 'and' | 'alias';

/** Finite T1 grammar. Complete consumption is mandatory; unknown text stays unknown. */
export function parseTermAnswer(tokens: readonly TextToken[], meanings: readonly TermMeaning[]): Readonly<{
  clauses: readonly TermClause[]; complete: boolean;
}> {
  const at = (index: number) => tokens[index]?.word;
  const sequence = (index: number, words: readonly string[]) => words.every((word, offset) => at(index + offset) === word);

  function term(index: number): ReadTerm | null {
    if (ARTICLES.has(at(index) ?? '')) index++;
    const close = QUOTES[at(index) ?? ''];
    if (close) index++;
    const first = tokens[index];
    if (!first) return null;
    let ref: TermRef | null = null;
    let next = index;
    // Every known correct/partial/wrong form is checked before spelling similarity.
    for (const meaning of meanings) for (const form of meaning.forms) {
      if (sequence(index, form) && form.length > next - index) {
        next = index + form.length;
        ref = { id: meaning.id, start: first.start, end: tokens[next - 1]!.end, typo: false };
      }
    }
    if (!ref && /^[a-z]+$/.test(first.word) && first.word.length >= 8) {
      for (const meaning of meanings) for (const target of meaning.spellingTargets ?? []) {
        if (!isLimitedTypo(first.word, target)) continue;
        const distance = editDistance(first.word, target);
        const competitors = meanings.filter((other) => other.id !== meaning.id)
          .flatMap((other) => other.forms.filter((form) => form.length === 1).map((form) => editDistance(first.word, form[0]!)));
        if (competitors.every((other) => other - distance >= 2)) {
          if (ref && ref.id !== meaning.id) return null;
          ref = { id: meaning.id, start: first.start, end: first.end, typo: true };
          next = index + 1;
        }
      }
    }
    if (!ref) return null;
    if (close) { if (at(next) !== close) return null; next++; }
    return { term: ref, next };
  }

  function clause(start: number): Readonly<{ value: TermClause; next: number }> | null {
    let index = start;
    // At most two explicit harmless hedges; never strip arbitrary introductory text.
    for (let count = 0; count < 2; count++) {
      const hedge = HEDGES.find((words) => sequence(index, words));
      if (!hedge) break;
      index += hedge.length;
      if (at(index) === ',') index++;
    }
    const frame = FRAMES.find((words) => sequence(index, words));
    if (frame) index += frame.length;
    const needsSein = frame?.[1] === 'muesste';
    const needsGenannt = frame?.at(-1) === 'wird';
    if (frame) {
      const hedge = HEDGES.filter((words) => words.length === 1 || words[0] === 'meiner').find((words) => sequence(index, words));
      if (hedge) index += hedge.length;
    }
    const negated = NEGATIONS.has(at(index) ?? '');
    if (negated) index++;
    const first = term(index);
    if (!first) return null;
    index = first.next;
    let value: TermClause;
    let contrastIndex = index;
    if (at(contrastIndex) === ',') contrastIndex++;
    if (negated && at(contrastIndex) === 'sondern') {
      const chosen = term(contrastIndex + 1);
      if (!chosen) return null;
      value = { kind: 'contrast', excluded: first.term, chosen: chosen.term, start: tokens[start]!.start, end: tokens[chosen.next - 1]!.end };
      index = chosen.next;
    } else if (at(index) === 'ist' || at(index) === 'heisst' || at(index) === '=' || at(index) === 'umschliesst') {
      if (negated || frame) return null;
      const kind = at(index) === 'umschliesst' ? 'encloses' : 'identity';
      index++;
      const relationNegated = NEGATIONS.has(at(index) ?? '');
      if (relationNegated) index++;
      const object = term(index);
      if (!object) return null;
      value = { kind, subject: first.term, object: object.term, negated: relationNegated,
        start: tokens[start]!.start, end: tokens[object.next - 1]!.end };
      index = object.next;
    } else if (at(index) === 'wird' && !negated && !frame) {
      index++;
      const relationNegated = at(index) === 'nicht';
      if (relationNegated) index++;
      if (at(index) !== 'vom' && at(index) !== 'von') return null;
      const subject = term(index + 1);
      if (!subject || at(subject.next) !== 'umschlossen') return null;
      index = subject.next + 1;
      value = { kind: 'encloses', subject: subject.term, object: first.term, negated: relationNegated,
        start: tokens[start]!.start, end: tokens[index - 1]!.end };
    } else if (at(index) === 'und' && at(index + 1) === 'nicht') {
      const negative = term(index + 2);
      if (!negative || negated) return null;
      value = { kind: 'conjoined_negation', positive: first.term, negative: negative.term, start: tokens[start]!.start, end: tokens[negative.next - 1]!.end };
      index = negative.next;
    } else {
      const terms = [first.term];
      let connector: Connector = 'single';
      while (!negated) {
        let next = index;
        let current: Connector;
        if (at(next) === 'oder') { current = 'or'; next++; }
        else if (at(next) === 'und') { current = 'and'; next++; }
        else if (at(next) === 'beziehungsweise' || at(next) === 'bzw') {
          current = 'alias'; next++; if (at(next) === '.') next++;
        } else if (at(next) === ',' && at(next + 1) === 'also') { current = 'alias'; next += 2; }
        else break;
        const hedge = HEDGES.find((words) => words.length === 1 && sequence(next, words));
        if (hedge) next += hedge.length;
        const other = term(next);
        if (!other) break; // Leave separator untouched; the root must still consume it.
        terms.push(other.term); index = other.next; connector = current;
      }
      value = { kind: 'name', terms, connector, negated, start: tokens[start]!.start, end: tokens[index - 1]!.end };
    }
    if (needsSein) { if (at(index) !== 'sein') return null; index++; }
    if (needsGenannt) { if (at(index) !== 'genannt') return null; index++; }
    if (at(index) === ',') {
      const tail = TAIL_HEDGES.find((words) => sequence(index + 1, words));
      if (tail) index += tail.length + 1;
    }
    return { value, next: index };
  }

  const clauses: TermClause[] = [];
  let index = 0;
  while (index < tokens.length) {
    if (clauses.length > 0 && at(index) === 'danke') {
      index++;
      while (['.', '!', '?'].includes(at(index) ?? '')) index++;
      return { clauses, complete: index === tokens.length };
    }
    const parsed = clause(index);
    if (!parsed) return { clauses, complete: false };
    clauses.push(parsed.value);
    index = parsed.next;
    if (index === tokens.length) break;
    if (['.', '!', '?', ';'].includes(at(index) ?? '')) {
      while (['.', '!', '?', ';'].includes(at(index) ?? '')) index++;
    } else if (at(index) === 'und' || at(index) === 'aber') {
      // No guessed negation scope across noun fragments. Only complete predicates
      // on BOTH sides may form a clause chain; name lists are handled above.
      const following = clause(index + 1);
      if (!following || !['identity', 'encloses'].includes(parsed.value.kind)
        || !['identity', 'encloses'].includes(following.value.kind)) return { clauses, complete: false };
      index++;
      if (index === tokens.length) return { clauses, complete: false };
    }
    else return { clauses, complete: false };
  }
  return { clauses, complete: clauses.length > 0 };
}
