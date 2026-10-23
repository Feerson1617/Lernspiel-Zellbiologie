import type { TextToken } from './text.ts';
import { NAMING_MODIFIERS } from './naming-frames.ts';

/** Nouns refer to the question's object, never to an accepted biological answer.
 * Profiles own these references; a process cannot become a membrane reference. */
export type NamingNoun = readonly [gender: 'm' | 'f' | 'n', nominative: string, genitive: string];
export interface NamingReferences { readonly nouns: readonly NamingNoun[] }
type Case = 'nom' | 'acc' | 'dat' | 'gen';
type Slot = 'subject' | 'fieldNom' | 'fieldAcc' | 'fieldDat' | 'metaNom' | 'metaAcc' | 'metaDat' | 'asMeta' | 'asField' | 'reference' | 'optionalReference' | 'front';
type Part = string | Readonly<{ slot: Slot }>;
interface Pattern { readonly before: readonly Part[]; readonly after: readonly (readonly Part[])[] }
export interface SyntaxFrame {
  readonly words: readonly string[];
  readonly next: number;
  readonly close: (index: number) => number | null;
}
const s = (slot: Slot): Part => ({ slot });
const META: readonly NamingNoun[] = [
  ['m', 'begriff', 'begriffs'], ['m', 'fachbegriff', 'fachbegriffs'], ['m', 'fachausdruck', 'fachausdrucks'],
  ['m', 'ausdruck', 'ausdrucks'], ['m', 'name', 'namens'], ['m', 'vorschlag', 'vorschlags'],
  ['m', 'loesungsvorschlag', 'loesungsvorschlags'], ['m', 'tipp', 'tipps'],
  ['f', 'antwort', 'antwort'], ['f', 'bezeichnung', 'bezeichnung'], ['f', 'benennung', 'benennung'],
  ['f', 'vermutung', 'vermutung'], ['f', 'loesung', 'loesung'], ['f', 'wahl', 'wahl'],
  ['n', 'wort', 'wortes'], ['n', 'fachwort', 'fachwortes'], ['n', 'ergebnis', 'ergebnisses'],
];
const QUESTIONS: readonly NamingNoun[] = [['f', 'frage', 'frage'], ['f', 'benennungsfrage', 'benennungsfrage'], ['f', 'benennung', 'benennung'], ['f', 'antwort', 'antwort']];
const ARTICLES: Readonly<Record<Case, Readonly<Record<NamingNoun[0], readonly string[]>>>> = {
  nom: { m: ['der', 'dieser', 'mein'], f: ['die', 'diese', 'meine'], n: ['das', 'dieses', 'mein'] },
  acc: { m: ['den', 'diesen', 'meinen'], f: ['die', 'diese', 'meine'], n: ['das', 'dieses', 'mein'] },
  dat: { m: ['dem', 'diesem', 'meinem'], f: ['der', 'dieser', 'meiner'], n: ['dem', 'diesem', 'meinem'] },
  gen: { m: ['des', 'dieses', 'meines'], f: ['der', 'dieser', 'meiner'], n: ['des', 'dieses', 'meines'] },
};
const META_ADJECTIVES = ['richtig', 'gesucht', 'passend', 'korrekt', 'fachlich', 'endgueltig', 'aktuell'];
const FIELD_ADJECTIVES = ['gesucht', 'beschrieben', 'gezeigt', 'genannt', 'gemeint', 'markiert', 'hervorgehoben'];
const isAdjective = (word: string | undefined, stems: readonly string[]) => stems.some(stem => ['', 'e', 'en', 'er', 'es', 'em'].some(end => word === stem + end));
const pattern = (before: readonly Part[], ...after: readonly Part[][]): Pattern => ({ before, after: after.length ? after : [[]] });

/** Finite constituent grammar. Slots match explicit noun phrases/references,
 * not arbitrary text. Required closing verbs are never optional filler. */
const PATTERNS: readonly Pattern[] = [
  ...['ist', 'waere', 'heisst', 'lautet', ':'].flatMap(verb => [
    pattern([s('subject'), verb]), pattern([s('front'), verb, s('subject')]),
  ]),
  ...['nennt', 'benennt'].flatMap(verb => [pattern(['man', verb, s('fieldAcc')]), pattern([s('fieldAcc'), verb, 'man'])]),
  pattern(['man', 'bezeichnet', s('fieldAcc'), 'als']), pattern(['man', 'benennt', s('fieldAcc'), 'mit']),
  pattern([s('fieldAcc'), 'benennt', 'man', 'mit']),
  pattern([s('fieldNom'), 'wird'], ['genannt']),
  pattern([s('fieldNom'), 'wird', 'als'], ['bezeichnet'], ['benannt']),
  pattern([s('fieldNom'), 'laesst', 'sich', 'als'], ['bezeichnen'], ['benennen']),
  pattern([s('fieldNom'), 'laesst', 'sich'], ['nennen']),
  pattern(['mit', s('fieldDat'), 'ist'], ['gemeint']),
  ...['ich', 'man'].flatMap(pronoun => ['nenne', 'nennt'].map(verb => pattern([pronoun, verb, s('fieldAcc')]))),
  ...['ich', 'man'].flatMap(pronoun => ['bezeichne', 'bezeichnet'].map(verb => pattern([pronoun, verb, s('fieldAcc'), 'als']))),
  pattern(['ich', 'meine', s('fieldAcc')]),
  pattern(['ich', 'denke', 'an', s('metaAcc')]),
  pattern(['ich', 'verwende', s('metaAcc')]), pattern(['ich', 'nehme', s('metaAcc')]),
  pattern(['ich', 'waehle', s('optionalReference')]),
  pattern(['ich', 'waehle', s('optionalReference'), s('metaAcc')]),
  pattern(['ich', 'trage'], ['ein']), pattern(['ich', 'antworte', s('optionalReference'), 'mit']),
  pattern(['ich', 'gebe', s('asMeta')], ['an']),
  pattern(['ich', 'habe', s('optionalReference'), s('asMeta')], ['gewaehlt'], ['genommen'], ['angegeben']),
  pattern(['ich', 'habe', s('optionalReference'), s('metaAcc')], ['gewaehlt'], ['genommen'], ['angegeben']),
  pattern(['ich', 'habe', 'mich', 'fuer', s('metaAcc')], ['entschieden']),
  pattern([s('asMeta'), 'habe', 'ich'], ['gewaehlt'], ['genommen'], []),
  ...['nehme', 'nenne', 'waehle', 'sehe'].map(verb => pattern([s('asMeta'), verb, 'ich'])),
  pattern([s('asMeta'), 'gebe', 'ich'], ['an']), pattern([s('asField'), 'nenne', 'ich']),
  pattern(['ich', 'entscheide', 'mich', s('asMeta'), 'fuer']),
  pattern(['ich', 'entscheide', 'mich', 'fuer', s('metaAcc')]),
  pattern(['ich', 'entscheide', 'mich', 'fuer']),
  pattern(['ich', 'halte'], ['fuer', s('metaNom')]),
  pattern(['fuer', s('fieldAcc'), 'passt', s('metaNom')]),
  pattern(['dazu', 'faellt', 'mir', s('asMeta')], ['ein']),
  pattern(['ich', 'bin', 'mir', 'sicher', ':']),
  ...['ist', 'waere'].flatMap(verb => [pattern([s('front'), verb], [s('metaNom')]), pattern(['hier', verb], ['gemeint'], ['gesucht'])]),
  ...['wuerde', 'moechte'].flatMap(modal => [
    ...['das', 'es'].flatMap(pronoun => [
      pattern([pronoun, modal, 'ich', 'als'], ['bezeichnen'], ['benennen']),
      pattern(['ich', modal, pronoun], ['nennen'], ['benennen']),
    ]),
    pattern(['ich', modal, s('optionalReference'), s('fieldAcc')], ['nennen'], ['benennen']),
    pattern(['ich', modal, s('fieldAcc'), 'als'], ['bezeichnen'], ['benennen']),
    pattern(['ich', modal, s('optionalReference'), s('metaAcc')], ...['verwenden', 'nehmen', 'waehlen', 'angeben', 'nennen'].map(verb => [s('optionalReference'), verb])),
    pattern(['ich', modal, s('metaAcc'), 'mit'], ['angeben']),
    pattern(['ich', modal, s('asMeta')], ['waehlen'], ['angeben'], ['nennen']),
    pattern(['ich', modal, 'fuer', s('metaAcc')], ['nehmen']),
    pattern(['ich', modal, s('reference'), 'als', s('metaAcc')], ['waehlen'], ['nennen'], ['angeben']),
    pattern([s('fieldAcc'), modal, 'ich'], ['nennen'], ['benennen']),
    pattern([s('fieldAcc'), modal, 'ich', 'als'], ['bezeichnen'], ['benennen']),
    pattern([s('metaAcc'), modal, 'ich', 'mit'], ['angeben']),
    pattern([s('asMeta'), modal, 'ich'], ['nennen'], ['angeben'], ['waehlen']),
    pattern([s('asField'), modal, 'ich'], ['nennen'], ['angeben']),
    pattern(['ich', modal, s('reference'), 'mit'], ['antworten']),
    pattern(['ich', modal, 'bei', s('fieldDat'), 'von'], ['sprechen']),
    pattern(['mit', s('metaDat')], [modal, 'ich', 'antworten']),
    pattern(['mit'], [modal, 'ich', s('fieldAcc'), 'benennen']),
    pattern(['fuer', s('fieldAcc'), modal, 'ich', s('metaAcc')], ['verwenden'], ['nehmen']),
  ]),
  pattern(['ich', 'habe', s('optionalReference')], [s('asMeta'), 'gewaehlt']),
  pattern(['es', 'sollte', 'sich', 'um'], ['handeln']),
  ...['muesste', 'sollte'].map(modal => pattern(['hier', modal, s('metaNom')], ['passen'])),
];
// Fronting changes finite verb position, never the biological relation or name.
const INVERTED: readonly Pattern[] = PATTERNS.filter(p => ['ich', 'man'].includes(p.before[0] as string) && typeof p.before[1] === 'string')
  .map(p => ({ ...p, before: [s('front'), p.before[1]!, p.before[0]!, ...p.before.slice(2)] }));

export function createNamingSyntax(tokens: readonly TextToken[], references: NamingReferences) {
  const at = (index: number) => tokens[index]?.word;
  const exact = (index: number, words: readonly string[]) => words.every((word, offset) => at(index + offset) === word);
  const modifiers = (start: number) => {
    let index = start;
    for (let count = 0; count < 3; count++) {
      const found = NAMING_MODIFIERS.find(words => exact(index, words));
      if (!found) break;
      index += found.length;
    }
    return index;
  };
  function noun(start: number, nouns: readonly NamingNoun[], grammaticalCase: Case, bare = false, adjectives = nouns === META ? META_ADJECTIVES : FIELD_ADJECTIVES): number | null {
    let best: number | null = null;
    for (const [gender, nominative, genitive] of nouns) {
      let index = start;
      const article = ARTICLES[grammaticalCase][gender].includes(at(index) ?? '');
      if (article) index++; else if (!bare) continue;
      index = modifiers(index);
      for (let count = 0; count < 2 && isAdjective(at(index), adjectives); count++) index++;
      const inflected = nominative === 'name' && ['acc', 'dat'].includes(grammaticalCase) ? 'namen' : nominative;
      const words = (grammaticalCase === 'gen' ? genitive : inflected).split(' ');
      if (exact(index, words)) best = Math.max(best ?? 0, index + words.length);
    }
    return best;
  }
  function field(index: number, grammaticalCase: Case, bare = false) { return noun(index, references.nouns, grammaticalCase, bare); }
  function reference(start: number): number | null {
    let index = start;
    const prep = at(index);
    const contraction = prep === 'zur' || prep === 'zum';
    const grammaticalCase = prep === 'fuer' || prep === 'auf' ? 'acc' : contraction || prep === 'zu' || prep === 'nach' || prep === 'bei' ? 'dat' : null;
    if (!grammaticalCase) return null;
    index++;
    const named = field(index, grammaticalCase, contraction);
    const question = noun(index, QUESTIONS, grammaticalCase, contraction);
    let end = Math.max(named ?? 0, question ?? 0) || null;
    if (end !== null && at(end) === 'nach') end = field(end + 1, 'dat') ?? end;
    return end;
  }
  function meta(index: number, grammaticalCase: Case, bare = false): number | null {
    const end = noun(index, META, grammaticalCase, bare);
    if (end === null) return null;
    const asWord = at(end) === 'als' ? noun(end + 1, META, 'acc', true) : null;
    return field(end, 'gen') ?? reference(end) ?? asWord ?? end;
  }
  const longest = (...indices: (number | null)[]) => Math.max(...indices.map(i => i ?? 0)) || null;
  function slot(index: number, name: Slot): number | null {
    switch (name) {
      case 'metaNom': return meta(index, 'nom');
      case 'metaAcc': return meta(index, 'acc');
      case 'metaDat': return meta(index, 'dat');
      case 'fieldNom': return field(index, 'nom');
      case 'fieldAcc': return field(index, 'acc');
      case 'fieldDat': return field(index, 'dat');
      case 'subject': return longest(meta(index, 'nom'), field(index, 'nom'), ['das', 'es', 'er', 'sie', 'die'].includes(at(index) ?? '') ? index + 1 : null);
      case 'asMeta': return at(index) === 'als' ? meta(index + 1, 'acc', true) : null;
      case 'asField': return at(index) === 'als' ? field(index + 1, 'acc', true) : null;
      case 'reference': return reference(index);
      case 'optionalReference': return reference(index) ?? index;
      case 'front': return longest(
        modifiers(index) > index ? modifiers(index) : null,
        reference(index),
        exact(index, ['bei', 'meiner', 'antwort']) ? index + 3 : null,
      );
    }
  }
  function match(start: number, parts: readonly Part[]): number | null {
    let index = start;
    for (const [offset, part] of parts.entries()) {
      const read = (position: number) => typeof part === 'string' ? at(position) === part ? position + 1 : null : slot(position, part.slot);
      let next = read(index);
      if (next === null && offset > 0) next = read(modifiers(index));
      if (next === null) return null;
      index = next;
    }
    return index;
  }
  const post = (index: number) => longest(...['ist', 'waere', 'lautet'].map(verb => match(index, [verb, s('metaNom')])));
  const tail = (index: number) => longest(...[
    ['das', 'ist', s('metaNom')], ['das', 'waere', s('metaNom')], ['so', 'lautet', s('metaNom')],
    ['so', 'nennt', 'man', s('fieldAcc')], ['so', 'heisst', s('fieldNom')],
  ].map(parts => { const end = match(index, parts); return end === null ? null : modifiers(end); }));
  return {
    post, tail,
    designationAt(index: number): boolean {
      if (!['ist', 'heisst', '='].includes(at(index) ?? '')) return false;
      const start = modifiers(index + 1);
      // A reverse word-choice frame must not swallow a definitional name-of
      // relation, including a neutral insertion or inflected genitive.
      for (const head of META.filter(n => ['name', 'bezeichnung', 'benennung', 'begriff', 'fachbegriff', 'ausdruck', 'fachausdruck', 'wort', 'fachwort'].includes(n[1]))) {
        const end = noun(start, [head], 'nom', false, META_ADJECTIVES);
        if (end !== null && ['der', 'des', 'dieser', 'dieses', 'von', 'fuer'].includes(at(modifiers(end)) ?? '')) return true;
      }
      return false;
    },
    frameAt(start: number): SyntaxFrame | undefined {
      const found = [...PATTERNS, ...INVERTED].map(p => ({ p, next: match(start, p.before) })).filter((f): f is { p: Pattern; next: number } => f.next !== null);
      if (!found.length) return undefined;
      const next = Math.max(...found.map(f => f.next));
      const endings = found.filter(f => f.next === next).flatMap(f => f.p.after);
      return { words: tokens.slice(start, next).map(t => t.word), next, close: index => longest(...endings.map(parts => match(index, parts))) };
    },
  };
}
