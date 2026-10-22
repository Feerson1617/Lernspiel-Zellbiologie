import { editDistance, isLimitedTypo } from './text.ts';
import type { TextToken } from './text.ts';
import { CERTAINTY_TAILS, COMMON_NAMING_FRAMES, POST_NAMING_FRAMES } from './naming-frames.ts';
import type { NamingFrame, NamingFrameInput } from './naming-frames.ts';

export interface TermMeaning {
  readonly id: string;
  readonly forms: readonly (readonly string[])[];
  readonly spellingTargets?: readonly string[];
  /** Explicit field-reviewed spellings; known scientific concepts still take precedence. */
  readonly spellingVariants?: readonly string[];
}
export interface TermRef {
  readonly id: string;
  readonly start: number;
  readonly end: number;
  readonly typo: boolean;
}
export type TermClause =
  | Readonly<{ kind: 'name'; terms: readonly TermRef[]; negated: boolean; connector: 'single' | 'or' | 'and' | 'alias' | 'explanation'; start: number; end: number }>
  | Readonly<{ kind: 'contrast'; excluded: TermRef; chosen: TermRef; start: number; end: number }>
  | Readonly<{ kind: 'identity' | 'synonymy' | 'encloses'; subject: TermRef; object: TermRef; negated: boolean; relation?: 'property' | 'equivalence'; start: number; end: number }>
  | Readonly<{ kind: 'separates'; subject: TermRef; first: TermRef; second: TermRef; negated: boolean; start: number; end: number }>
  | Readonly<{ kind: 'has_named_boundary'; owner: TermRef; terms: readonly TermRef[]; start: number; end: number }>
  | Readonly<{ kind: 'conjoined_negation'; positive: TermRef; negative: TermRef; start: number; end: number }>;

const ARTICLES = new Set(['der', 'die', 'das', 'den', 'dem', 'ein', 'eine', 'einen']);
const NEGATIONS = new Set(['nicht', 'kein', 'keine', 'keinen']);
const QUOTES: Readonly<Record<string, string>> = Object.freeze({ '„': '“', '‚': '‘', '«': '»', '"': '"', "'": "'", '“': '”' });
const HEDGES = [
  ['ich', 'bin', 'mir', 'nicht', 'sicher', ',', 'aber'],
  ['meiner', 'meinung', 'nach'], ['ich', 'wuerde', 'sagen'],
  ['meines', 'wissens'],
  ['ich', 'nehme', 'an'], ['ich', 'glaube', 'mal'],
  ['ich', 'denke'], ['ich', 'glaube'], ['ich', 'vermute'],
  ['vielleicht'], ['wahrscheinlich'], ['vermutlich'], ['eventuell'],
] as const;
const FRAMES = [
  ['die', 'membran', ',', 'die', 'die', 'vakuole', 'umschliesst', ',', 'heisst'],
  ['die', 'membran', 'um', 'die', 'vakuole', 'heisst'],
  ['der', 'gesuchte', 'begriff', 'ist'], ['die', 'gesuchte', 'membran', 'heisst'],
  ['die', 'markierte', 'membran', 'heisst'], ['die', 'markierte', 'membran', 'ist'],
  ['die', 'hervorgehobene', 'grenze', 'heisst'], ['der', 'fachbegriff', 'ist'],
  ['die', 'gesuchte', 'struktur', 'nennt', 'man'], ['diese', 'grenze', 'wird'],
  ['die', 'bezeichnung', 'lautet'], ['meine', 'antwort', ':'], ['gesucht', 'wird'],
  ['ich', 'wuerde', 'die', 'membran'],
  ['die', 'membran', 'nennt', 'man'], ['die', 'membran', 'heisst'],
  ['die', 'membran', 'wird'], ['sie', 'wird'],
  ['diese', 'membran', 'heisst'], ['die', 'membran', 'ist'],
  ['meine', 'antwort', 'ist'], ['die', 'bezeichnung', 'ist'], ['der', 'name', 'ist'],
  ['das', 'muesste'], ['es', 'muesste'], ['das', 'koennte'], ['es', 'koennte'],
  ['das', 'ist'], ['es', 'ist'], ['ist', 'es'],
  ['gemeint', 'ist'], ['gesucht', 'ist'], ['ich', 'meine'], ['sie', 'heisst'], ['die', 'heisst'],
] as const;
interface ReadTerm { readonly term: TermRef; readonly next: number }
type Connector = 'single' | 'or' | 'and' | 'alias' | 'explanation';
export interface TermGrammarProfile {
  /** Replaces the default membrane naming frames; never silently appends them. */
  readonly frames: readonly NamingFrameInput[];
  readonly contextAdverbs?: readonly string[];
}

/** Finite T1 grammar. Complete consumption is mandatory; unknown text stays unknown. */
export function parseTermAnswer(tokens: readonly TextToken[], meanings: readonly TermMeaning[], profile?: TermGrammarProfile): Readonly<{
  clauses: readonly TermClause[]; complete: boolean;
}> {
  const at = (index: number) => tokens[index]?.word;
  const sequence = (index: number, words: readonly string[]) => words.every((word, offset) => at(index + offset) === word);
  const shortHedge = (index: number) => HEDGES.find((words) => words.length === 1 && sequence(index, words));
  const skipContextAdverb = (index: number) => profile?.contextAdverbs?.includes(at(index) ?? '') ? index + 1 : index;
  const frames: readonly NamingFrame[] = [...COMMON_NAMING_FRAMES, ...(profile?.frames ?? FRAMES).map(input => {
    if (!Array.isArray(input)) return input as NamingFrame;
    const words = input as readonly string[];
    const ending = words[1] === 'muesste' || words[1] === 'koennte' ? 'sein'
      : words.at(-1) === 'wird' && words[0] !== 'gesucht' ? 'genannt'
        : words[0] === 'ich' && words[1] === 'wuerde' ? 'nennen' : null;
    return { words, endings: ending ? [[ending]] : [[]] };
  })].sort((a, b) => b.words.length - a.words.length);
  const frameAt = (index: number) => frames.find(frame => sequence(index, frame.words));

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
    if (!ref) for (const meaning of meanings) {
      if (!meaning.spellingVariants?.includes(first.word)) continue;
      if (ref && ref.id !== meaning.id) return null;
      ref = { id: meaning.id, start: first.start, end: first.end, typo: true };
      next = index + 1;
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
      const naming = frameAt(index);
      if (naming && (!hedge || naming.words.length >= hedge.length)) break;
      if (!hedge) break;
      index += hedge.length;
      if (at(index) === ',' || at(index) === ':') index++;
    }
    // Existential naming frame. Only a harmless one-word hedge can occur before "um".
    let existential = false;
    if (sequence(index, ['es', 'handelt', 'sich'])) {
      index += 3;
      const hedge = shortHedge(index);
      if (hedge) index += hedge.length;
      if (at(index) !== 'um') return null;
      index++; existential = true;
    }
    const frame = frameAt(index);
    if (frame) index += frame.words.length;
    const framed = !!frame || existential;
    if (frame) {
      index = skipContextAdverb(index);
      if (at(index) === 'doch' || at(index) === 'wohl') index++;
      if (at(index) === ',') {
        const aside = CERTAINTY_TAILS.find(words => sequence(index + 1, words) && at(index + words.length + 1) === ',');
        if (aside) index += aside.length + 2;
      }
      const hedge = HEDGES.filter((words) => words.length === 1 || words[0] === 'meiner').find((words) => sequence(index, words));
      if (hedge) index += hedge.length;
    }
    const explicitNegation = NEGATIONS.has(at(index) ?? '');
    if (frame?.negated && explicitNegation) return null; // No guessed double-negation cancellation.
    const negated = !!frame?.negated || explicitNegation;
    if (explicitNegation) index++;
    const metaname = at(index) === 'mit';
    if (metaname) { if (framed || negated) return null; index++; }
    const first = term(index);
    if (!first) return null;
    index = skipContextAdverb(first.next);
    let value: TermClause;
    const span = () => ({ start: tokens[start]!.start, end: tokens[index - 1]!.end });
    function finish(value: TermClause): Readonly<{ value: TermClause; next: number }> | null {
      const ending = (frame?.endings ?? [[]]).find(words => sequence(index, words));
      if (!ending) return null;
      index += ending.length;
      if (at(index) === ',') {
        const tail = CERTAINTY_TAILS.find(words => sequence(index + 1, words));
        if (tail) index += tail.length + 1;
      }
      return { value: { ...value, end: tokens[index - 1]!.end }, next: index };
    }
    // In a subordinate naming frame the final "ist" closes the frame; it does
    // not open a second biological identity assertion after the selected name.
    if (frame?.endings?.some(words => words.length > 0 && sequence(index, words))) {
      return finish({ kind: 'name', terms: [first.term], connector: 'single', negated, ...span() });
    }
    if (!framed && !negated) {
      const post = POST_NAMING_FRAMES.find(words => sequence(index, words));
      if (post) { index += post.length; return finish({ kind: 'name', terms: [first.term], connector: 'single', negated: false, ...span() }); }
    }
    // A boundary is explicitly named by its owner, not inferred from occurrence of a target word.
    if (at(index) === 'besitzt' && !framed && !negated && !metaname) {
      if (!sequence(index + 1, ['eine', 'membran', 'namens'])) return null;
      const names = clause(index + 4);
      if (!names || names.value.kind !== 'name' || names.value.negated) return null;
      index = names.next;
      return finish({ kind: 'has_named_boundary', owner: first.term, terms: names.value.terms, ...span() });
    }
    if (metaname) {
      if (!sequence(index, ['meine', 'ich'])) return null;
      const other = term(index + 2);
      if (!other) return null;
      index = other.next;
      value = { kind: 'identity', subject: first.term, object: other.term, negated: false, ...span() };
      return finish(value);
    }
    if (at(index) === 'trennt' || at(index) === 'grenzt') {
      if (framed || negated) return null;
      const needsAb = at(index) === 'grenzt';
      index++;
      let relationNegated = at(index) === 'nicht';
      if (relationNegated) index++;
      const side = term(index);
      if (!side) return null;
      index = side.next;
      if (!relationNegated && at(index) === 'nicht') { relationNegated = true; index++; }
      if (at(index) !== 'vom' && at(index) !== 'von') return null;
      const other = term(index + 1);
      if (!other) return null;
      index = other.next;
      if (needsAb) { if (at(index) !== 'ab') return null; index++; }
      return finish({ kind: 'separates', subject: first.term, first: side.term, second: other.term, negated: relationNegated, ...span() });
    }
    if (!negated && !framed && sequence(index, ['ist', 'es', 'nicht'])) {
      index += 3;
      return finish({ kind: 'name', terms: [first.term], connector: 'single', negated: true, ...span() });
    }
    let contrastIndex = index;
    if (at(contrastIndex) === ',') contrastIndex++;
    if (negated && at(contrastIndex) === 'sondern') {
      let chosenIndex = contrastIndex + 1;
      if (frame?.contrastPreposition && at(chosenIndex) === frame.contrastPreposition) chosenIndex++;
      const chosen = term(chosenIndex);
      if (!chosen) return null;
      value = { kind: 'contrast', excluded: first.term, chosen: chosen.term, start: tokens[start]!.start, end: tokens[chosen.next - 1]!.end };
      index = chosen.next;
    } else if (negated && at(index) === ',' && frameAt(index + 1)) {
      const chosen = clause(index + 1);
      // A competing list on the chosen side must not be collapsed into its first name.
      if (!chosen || chosen.value.kind !== 'name' || chosen.value.negated || chosen.value.terms.length !== 1) return null;
      index = chosen.next;
      return finish({ kind: 'contrast', excluded: first.term, chosen: chosen.value.terms[0]!, ...span() });
    } else if (['ist', 'heisst', '=', 'umschliesst', 'begrenzt', 'umgibt', 'nennt'].includes(at(index) ?? '')
      && !(at(index) === 'ist' && (['vom', 'von', 'durch', 'es'].includes(at(index + 1) ?? '')
        || (at(index + 1) === 'nicht' && ['vom', 'von', 'durch'].includes(at(index + 2) ?? ''))))) {
      if (negated || framed) return null;
      const verb = at(index);
      let kind: 'encloses' | 'identity' | 'synonymy' = ['umschliesst', 'begrenzt', 'umgibt'].includes(verb!) ? 'encloses' : 'identity';
      index++;
      if (verb === 'nennt') { if (at(index) !== 'man') return null; index++; }
      index = skipContextAdverb(index);
      const relationNegated = NEGATIONS.has(at(index) ?? '');
      if (relationNegated) index++;
      // Names for the boundary, rather than generic identity of the word "Name".
      if (kind === 'identity' && sequence(index, ['der', 'name', 'der'])) index += 3;
      else if (kind === 'identity' && sequence(index, ['ein', 'anderer', 'name', 'fuer'])) { index += 4; kind = 'synonymy'; }
      else if (kind === 'identity' && verb === 'ist') {
        const classification = [['eine', 'form', 'des'], ['eine', 'form', 'der'], ['form', 'des'], ['form', 'der'], ['eine', 'art', 'von'], ['art', 'von']]
          .find(words => sequence(index, words));
        if (classification) index += classification.length;
      }
      const object = term(index);
      if (!object) return null;
      value = { kind, subject: first.term, object: object.term, negated: relationNegated, relation: verb === 'ist' && kind === 'identity' ? 'property' : 'equivalence',
        start: tokens[start]!.start, end: tokens[object.next - 1]!.end };
      index = object.next;
    } else if ((at(index) === 'wird' || at(index) === 'ist') && !negated && !framed) {
      index++;
      const relationNegated = at(index) === 'nicht';
      if (relationNegated) index++;
      if (at(index) !== 'vom' && at(index) !== 'von' && at(index) !== 'durch') return null;
      const subject = term(index + 1);
      if (!subject || !['umschlossen', 'begrenzt', 'umgeben'].includes(at(subject.next) ?? '')) return null;
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
        } else if (at(next) === ',' && at(next + 1) === 'also') { current = 'explanation'; next += 2; }
        else if (sequence(next, [',', 'das', 'heisst'])) { current = 'explanation'; next += 3; }
        else if (at(next) === '/' || at(next) === ':') { current = 'alias'; next++; }
        else if (['–', '—', '-'].includes(at(next) ?? '') && ['also', 'beziehungsweise'].includes(at(next + 1) ?? '')) { current = at(next + 1) === 'also' ? 'explanation' : 'alias'; next += 2; }
        else break;
        next = skipContextAdverb(next);
        const hedge = HEDGES.find((words) => words.length === 1 && sequence(next, words));
        if (hedge) next += hedge.length;
        const other = term(next);
        if (!other) break; // Leave separator untouched; the root must still consume it.
        terms.push(other.term); index = other.next; connector = current;
      }
      if (!negated && at(index) === '(') {
        let next = index + 1;
        const excluded = at(next) === 'nicht';
        if (excluded || at(next) === 'auch') next++;
        const other = term(next);
        if (!other) return null;
        next = other.next;
        if (!excluded && at(next) === 'genannt') next++;
        if (at(next) !== ')' || terms.length !== 1) return null;
        index = next + 1;
        if (excluded) return finish({ kind: 'conjoined_negation', positive: first.term, negative: other.term, ...span() });
        terms.push(other.term); connector = 'alias';
      }
      if (!negated && sequence(index, ['sind', 'dieselbe', 'membran']) && terms.length === 2) {
        index += 3;
        return finish({ kind: 'identity', subject: terms[0]!, object: terms[1]!, negated: false, ...span() });
      }
      value = { kind: 'name', terms, connector, negated, start: tokens[start]!.start, end: tokens[index - 1]!.end };
    }
    return finish(value);
  }

  const clauses: TermClause[] = [];
  let index = 0;
  while (index < tokens.length) {
    if (clauses.length > 0 && at(index) === 'danke') {
      index++;
      if (index < tokens.length && !['.', '!', '?'].includes(at(index) ?? '')) return { clauses, complete: false };
      while (['.', '!', '?'].includes(at(index) ?? '')) index++;
      if (index === tokens.length) return { clauses, complete: true };
      continue; // Harmless courtesy never hides a later assertion or contradiction.
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
      if (!following || !['identity', 'synonymy', 'encloses', 'separates'].includes(parsed.value.kind)
        || !['identity', 'synonymy', 'encloses', 'separates'].includes(following.value.kind)) return { clauses, complete: false };
      index++;
      if (index === tokens.length) return { clauses, complete: false };
    }
    else return { clauses, complete: false };
  }
  return { clauses, complete: clauses.length > 0 };
}
