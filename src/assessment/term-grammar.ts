import { resolveNamingChoices } from './naming-choice.ts';
import { editDistance, isLimitedTypo } from './text.ts';
import type { TextToken } from './text.ts';
import { CERTAINTY_TAILS, COMMON_NAMING_FRAMES, NAMING_MODIFIERS, POST_NAMING_FRAMES } from './naming-frames.ts';
import type { NamingFrame, NamingFrameInput } from './naming-frames.ts';
import { createNamingSyntax } from './naming-syntax.ts';
import type { NamingReferences } from './naming-syntax.ts';

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
  | Readonly<{ kind: 'name'; terms: readonly TermRef[]; negated: boolean; connector: 'single' | 'or' | 'and' | 'alias' | 'explanation'; correctsPrevious?: true; tentativeQuestion?: true; start: number; end: number }>
  | Readonly<{ kind: 'contrast'; excluded: TermRef; chosen: TermRef; start: number; end: number }>
  | Readonly<{ kind: 'identity' | 'synonymy' | 'encloses'; subject: TermRef; object: TermRef; negated: boolean; relation?: 'property' | 'classification' | 'equivalence' | 'designation'; start: number; end: number }>
  | Readonly<{ kind: 'separates'; subject: TermRef; first: TermRef; second: TermRef; negated: boolean; start: number; end: number }>
  | Readonly<{ kind: 'has_named_boundary'; owner: TermRef; terms: readonly TermRef[]; start: number; end: number }>
  | Readonly<{ kind: 'conjoined_negation'; positive: TermRef; negative: TermRef; start: number; end: number }>;

const ARTICLES = new Set(['der', 'die', 'das', 'den', 'dem', 'ein', 'eine', 'einen']);
const NEGATIONS = new Set(['nicht', 'kein', 'keine', 'keinen']);
const QUOTES: Readonly<Record<string, string>> = Object.freeze({ '„': '“', '‚': '‘', '«': '»', '"': '"', "'": "'", '“': '”' });
const HEDGES = [
  ['ich', 'bin', 'nicht', 'ganz', 'sicher', ',', 'aber'],
  ['ich', 'bin', 'nicht', 'sicher', ',', 'aber'],
  ['nach', 'meinem', 'wissen'],
  ['soweit', 'ich', 'mich', 'erinnere'], ['soweit', 'ich', 'weiss'],
  ['also', 'ich', 'wuerde', 'sagen'],
  ['ich', 'bin', 'mir', 'nicht', 'ganz', 'sicher', ',', 'aber'],
  ['ich', 'glaub'], ['ich', 'denke', 'mal'], ['ich', 'finde'],
  ['ich', 'bin', 'mir', 'nicht', 'sicher', ',', 'aber'],
  ['meiner', 'meinung', 'nach'], ['ich', 'wuerde', 'sagen'],
  ['meines', 'wissens'], ['meiner', 'ansicht', 'nach'], ['aus', 'meiner', 'sicht'],
  ['ich', 'nehme', 'an'], ['ich', 'glaube', 'mal'],
  ['ich', 'denke'], ['ich', 'glaube'], ['ich', 'vermute'],
  ['ich', 'meine'], ['ich', 'bin', 'der', 'ansicht'],
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
  ['ich', 'wuerde', 'die', 'grenze'],
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
  /** When supplied, replaces the default membrane frames; never appends them. */
  readonly frames?: readonly NamingFrameInput[];
  readonly namingReferences?: NamingReferences;
  readonly contextAdverbs?: readonly string[];
  readonly postFrames?: readonly (readonly string[])[];
  readonly certaintyTails?: readonly (readonly string[])[];
}

/** Finite T1 grammar. Complete consumption is mandatory; unknown text stays unknown. */
export function parseTermAnswer(tokens: readonly TextToken[], meanings: readonly TermMeaning[], profile?: TermGrammarProfile): Readonly<{
  clauses: readonly TermClause[]; complete: boolean; evidence: readonly Readonly<{ start: number; end: number }>[];
}> {
  const at = (index: number) => tokens[index]?.word;
  const syntax = createNamingSyntax(tokens, profile?.namingReferences ?? { nouns: [] });
  const sequence = (index: number, words: readonly string[]) => words.every((word, offset) => at(index + offset) === word);
  const shortHedge = (index: number) => HEDGES.find((words) => words.length === 1 && sequence(index, words));
  const certaintyTails = [...CERTAINTY_TAILS, ...(profile?.certaintyTails ?? [])];
  const skipContextAdverb = (index: number) => profile?.contextAdverbs?.includes(at(index) ?? '') ? index + 1 : index;
  const skipNamingModifiers = (start: number) => {
    let index = start;
    for (let count = 0; count < 3; count++) {
      const words = NAMING_MODIFIERS.find(words => sequence(index, words));
      if (!words) break;
      index += words.length;
    }
    return index;
  };
  // Optional modifiers occupy explicit gaps in naming constructions only.
  // The original tokens/offsets remain intact; no general text filtering occurs.
  const matchNaming = (start: number, words: readonly string[], insertions = true): number | null => {
    let index = start;
    for (const [offset, word] of words.entries()) {
      if (at(index) !== word && insertions && offset > 0) index = skipNamingModifiers(index);
      if (at(index) !== word) return null;
      index++;
    }
    return index;
  };
  const inputs: readonly NamingFrame[] = [...COMMON_NAMING_FRAMES, ...(profile?.frames ?? FRAMES).map(input => {
    if (!Array.isArray(input)) return input as NamingFrame;
    const words = input as readonly string[];
    const ending = words[1] === 'muesste' || words[1] === 'koennte' ? 'sein'
      : words.at(-1) === 'wird' && words[0] !== 'gesucht' ? 'genannt'
        : words[0] === 'ich' && words[1] === 'wuerde' ? 'nennen' : null;
    return { words, endings: ending ? [[ending]] : [[]], insertions: true as const };
  })];
  // Equal prefixes may offer distinct *required* endings. Keep all alternatives
  // instead of selecting the first prefix and silently losing another ending.
  const unique = new Map<string, NamingFrame>();
  for (const frame of inputs) {
    const key = JSON.stringify([frame.words, frame.negated, frame.contrastPreposition, frame.insertions, frame.correctsPrevious]);
    const previous = unique.get(key);
    unique.set(key, previous ? { ...frame, endings: [...(previous.endings ?? [[]]), ...(frame.endings ?? [[]])] } : frame);
  }
  const frames = [...unique.values()].sort((a, b) => b.words.length - a.words.length);
  type MatchedFrame = NamingFrame & { readonly next: number; readonly close?: (index: number) => number | null };
  const frameAt = (index: number): MatchedFrame | undefined => {
    let legacy: MatchedFrame | undefined;
    for (const frame of frames) {
      const next = matchNaming(index, frame.words, frame.insertions === true);
      if (next === null) continue;
      // A bare preposition is less specific than the existing explicit
      // metanaming relation "mit <name> meine ich <description>".
      if (frame.words.length === 1 && frame.words[0] === 'mit') {
        const named = term(next);
        if (named && sequence(named.next, ['meine', 'ich'])) continue;
      }
      legacy = { ...frame, next }; break;
    }
    const composed = syntax.frameAt(index);
    if (composed && (!legacy || composed.next > legacy.next)) {
      if (composed.words.length === 1 && composed.words[0] === 'mit') {
        const named = term(composed.next);
        if (named && sequence(named.next, ['meine', 'ich'])) return legacy;
      }
      return composed;
    }
    if (composed && legacy && composed.next === legacy.next) {
      return { ...legacy, close: at => {
        const old = (legacy.endings ?? [[]]).map(words => matchNaming(at, words)).filter(n => n !== null);
        const next = composed.close(at);
        return Math.max(...old, next ?? -1) < 0 ? null : Math.max(...old, next ?? -1);
      } };
    }
    return legacy;
  };

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
      if (naming && (!hedge || naming.words.length > hedge.length
        || (naming.words.length === hedge.length && ![',', ':', 'dass'].includes(at(index + hedge.length) ?? '')))) break;
      if (!hedge) break;
      index += hedge.length;
      if (at(index) === ',' || at(index) === ':') index++;
      if (!frameAt(index)) index = skipNamingModifiers(index);
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
    // A named subject is a scientific relation, not expendable naming filler.
    // Preserve both concepts for the field evaluator (also for wrong synonyms).
    const renamePrefix = ['wuerde', 'moechte'].find(modal => sequence(index, ['ich', modal]));
    if (renamePrefix && (frameAt(index)?.next ?? index) <= index + 2) {
      const subject = term(skipNamingModifiers(index + 2));
      if (subject && at(skipNamingModifiers(subject.next)) === 'als') {
        const object = term(skipNamingModifiers(subject.next) + 1);
        const end = object ? skipNamingModifiers(object.next) : -1;
        if (object && ['bezeichnen', 'benennen'].includes(at(end) ?? '')) {
          return { value: { kind: 'identity', subject: subject.term, object: object.term, negated: false,
            relation: 'equivalence', start: tokens[start]!.start, end: tokens[end]!.end }, next: end + 1 };
        }
      }
    }
    const frame = frameAt(index);
    if (frame) index = frame.next;
    const framed = !!frame || existential;
    if (frame) {
      index = skipNamingModifiers(index);
      if (at(index) === ',') {
        const aside = certaintyTails.find(words => sequence(index + 1, words) && at(index + words.length + 1) === ',');
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
    index = framed ? skipNamingModifiers(first.next) : skipContextAdverb(first.next);
    let value: TermClause;
    const span = () => ({ start: tokens[start]!.start, end: tokens[index - 1]!.end });
    function finish(value: TermClause): Readonly<{ value: TermClause; next: number }> | null {
      const ending = frame?.close ? frame.close(index) : (frame?.endings ?? [[]]).map(words => matchNaming(index, words)).find(next => next !== null);
      if (ending === undefined || ending === null) return null;
      index = ending;
      if ([',', '–', '—', '-'].includes(at(index) ?? '')) {
        const tail = certaintyTails.find(words => sequence(index + 1, words));
        const composed = syntax.tail(index + 1);
        if (tail) index += tail.length + 1;
        else if (composed !== null) index = composed;
      }
      const named = frame?.correctsPrevious && value.kind === 'name' ? { ...value, correctsPrevious: true as const } : value;
      return { value: { ...named, end: tokens[index - 1]!.end }, next: index };
    }
    // In a subordinate naming frame the final "ist" closes the frame; it does
    // not open a second biological identity assertion after the selected name.
    if (frame?.endings?.some(words => words.length > 0 && matchNaming(index, words) !== null)
      || (frame?.close && (frame.close(index) ?? index) > index)) {
      return finish({ kind: 'name', terms: [first.term], connector: 'single', negated, ...span() });
    }
    if (!framed) {
      const oldPost = [...POST_NAMING_FRAMES, ...(profile?.postFrames ?? [])].map(words => matchNaming(index, words)).filter(next => next !== null).sort((a, b) => b - a)[0];
      const composedPost = syntax.post(index);
      const post = Math.max(oldPost ?? -1, composedPost ?? -1);
      const namingRelation = syntax.designationAt(index);
      if (post >= 0 && !namingRelation) {
        index = skipNamingModifiers(post);
        return finish({ kind: 'name', terms: [first.term], connector: 'single', negated, ...span() });
      }
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
      value = { kind: 'identity', subject: first.term, object: other.term, negated: false, relation: 'designation', ...span() };
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
      let relation: 'property' | 'classification' | 'equivalence' | 'designation' = verb === 'ist' ? 'property' : 'equivalence';
      let kind: 'encloses' | 'identity' | 'synonymy' = ['umschliesst', 'begrenzt', 'umgibt'].includes(verb!) ? 'encloses' : 'identity';
      index++;
      if (verb === 'nennt') { if (at(index) !== 'man') return null; index++; }
      index = skipContextAdverb(index);
      const relationNegated = NEGATIONS.has(at(index) ?? '');
      if (relationNegated) index++;
      // Names for the boundary, rather than generic identity of the word "Name".
      if (kind === 'identity' && sequence(index, ['der', 'name']) && ['der', 'des', 'von', 'fuer'].includes(at(index + 2) ?? '')) {
        index += 3; kind = 'synonymy'; relation = 'designation';
      }
      else if (kind === 'identity' && sequence(index, ['ein', 'anderer', 'name', 'fuer'])) { index += 4; kind = 'synonymy'; }
      else if (kind === 'identity' && verb === 'ist') {
        const classification = [['eine', 'form', 'des'], ['eine', 'form', 'der'], ['form', 'des'], ['form', 'der'], ['eine', 'art', 'von'], ['art', 'von']]
          .find(words => sequence(index, words));
        if (classification) { index += classification.length; relation = 'classification'; }
      }
      const object = term(index);
      if (!object) return null;
      value = { kind, subject: first.term, object: object.term, negated: relationNegated,
        ...(kind === 'encloses' ? {} : { relation: kind === 'synonymy' && relation !== 'designation' ? 'equivalence' as const : relation }),
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
    } else if (!negated && at(index) === 'und' && at(index + 1) === 'nicht') {
      const negative = term(index + 2);
      if (!negative) return null;
      value = { kind: 'conjoined_negation', positive: first.term, negative: negative.term, start: tokens[start]!.start, end: tokens[negative.next - 1]!.end };
      index = negative.next;
    } else {
      const terms = [first.term];
      let connector: Connector = 'single';
      // Repeating an exclusion through synonymous alternatives does not create
      // a positive name. Mixed concepts and mixed negation scopes stay unknown.
      while (negated && ['oder', 'und'].includes(at(index) ?? '') && NEGATIONS.has(at(index + 1) ?? '')) {
        const other = term(index + 2);
        if (!other || other.term.id !== first.term.id) return null;
        connector = at(index) === 'oder' ? 'or' : 'and';
        terms.push(other.term); index = other.next;
      }
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
        return finish({ kind: 'identity', subject: terms[0]!, object: terms[1]!, negated: false, relation: 'equivalence', ...span() });
      }
      value = { kind: 'name', terms, connector, negated, start: tokens[start]!.start, end: tokens[index - 1]!.end };
    }
    return finish(value);
  }

  const clauses: TermClause[] = [];
  const finishParsing = (complete: boolean) => ({
    // Two tentative questions leave contradictory/competing proposals open,
    // irrespective of their order or whether the names are synonymous.
    // Single questions, definite exclusions, scientific predicates and
    // unconsumed suffixes do not get this exception.
    ...(complete && !(clauses.length === 2 && clauses.every(c => c.kind === 'name' && c.tentativeQuestion)
      && (new Set(clauses.flatMap(c => c.kind === 'name' ? c.terms.map(t => t.id) : [])).size > 1
        || new Set(clauses.flatMap(c => c.kind === 'name' ? [c.negated] : [])).size > 1))
      ? resolveNamingChoices(clauses) : { clauses, complete: false }),
    evidence: clauses.map(({ start, end }) => ({ start, end })),
  });
  let index = 0;
  while (index < tokens.length) {
    if (clauses.length > 0 && at(index) === 'danke') {
      index++;
      if (index < tokens.length && !['.', '!', '?'].includes(at(index) ?? '')) return finishParsing(false);
      while (['.', '!', '?'].includes(at(index) ?? '')) index++;
      if (index === tokens.length) return finishParsing(true);
      continue; // Harmless courtesy never hides a later assertion or contradiction.
    }
    const parsed = clause(index);
    if (!parsed) return finishParsing(false);
    clauses.push(parsed.value.kind === 'name' && at(index) === 'vielleicht' && at(parsed.next) === '?'
      ? { ...parsed.value, tentativeQuestion: true } : parsed.value);
    index = parsed.next;
    if (index === tokens.length) break;
    if (['.', '!', '?', ';'].includes(at(index) ?? '')) {
      while (['.', '!', '?', ';'].includes(at(index) ?? '')) index++;
    } else if (at(index) === 'und' || at(index) === 'aber'
      || (at(index) === ',' && ['und', 'aber'].includes(at(index + 1) ?? ''))) {
      // No guessed negation scope across noun fragments. Only complete predicates
      // on BOTH sides may form a clause chain; name lists are handled above.
      const followingStart = index + (at(index) === ',' ? 2 : 1);
      const following = clause(followingStart);
      if (!following || !['identity', 'synonymy', 'encloses', 'separates'].includes(parsed.value.kind)
        || !['identity', 'synonymy', 'encloses', 'separates'].includes(following.value.kind)) return finishParsing(false);
      index = followingStart;
      if (index === tokens.length) return finishParsing(false);
    }
    else return finishParsing(false);
  }
  return finishParsing(true);
}
