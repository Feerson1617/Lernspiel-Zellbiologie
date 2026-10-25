import type { TextToken } from './text.ts';
import { NAMING_MODIFIERS } from './naming-frames.ts';

/** Nouns refer to the question's object, never to an accepted biological answer.
 * Profiles own these references; a process cannot become a membrane reference. */
export type NamingNoun = readonly [gender: 'm' | 'f' | 'n', nominative: string, genitive: string];
export interface NamingReferences { readonly nouns: readonly NamingNoun[]; readonly names?: readonly NamingNoun[]; readonly qualifiers?: readonly (readonly string[])[] }
type Case = 'nom' | 'acc' | 'dat' | 'gen';
type Slot = 'subject' | 'fieldNom' | 'fieldAcc' | 'fieldDat' | 'metaNom' | 'metaAcc' | 'metaDat' | 'questionAcc' | 'namingObject' | 'asMeta' | 'asField' | 'reference' | 'optionalReference' | 'front' | 'uncertain';
type Part = string | Readonly<{ slot: Slot }>;
interface Pattern { readonly before: readonly Part[]; readonly after: readonly (readonly Part[])[]; readonly negated?: true }
export interface SyntaxFrame {
  readonly words: readonly string[];
  readonly next: number;
  readonly close: (index: number) => number | null;
  readonly negated?: true;
}
const s = (slot: Slot): Part => ({ slot });
const META: readonly NamingNoun[] = [
  ['m', 'begriff', 'begriffs'], ['m', 'fachbegriff', 'fachbegriffs'], ['m', 'fachausdruck', 'fachausdrucks'],
  ['m', 'oberbegriff', 'oberbegriffs'], ['m', 'ansatz', 'ansatzes'],
  ['m', 'ausdruck', 'ausdrucks'], ['m', 'name', 'namens'], ['m', 'fachname', 'fachnamens'], ['m', 'vorschlag', 'vorschlags'],
  ['m', 'loesungsvorschlag', 'loesungsvorschlags'], ['m', 'antwortvorschlag', 'antwortvorschlags'], ['m', 'tipp', 'tipps'],
  ['f', 'antwort', 'antwort'], ['f', 'bezeichnung', 'bezeichnung'], ['f', 'benennung', 'benennung'],
  ['f', 'vermutung', 'vermutung'], ['f', 'loesung', 'loesung'], ['f', 'wahl', 'wahl'],
  ['f', 'fachbezeichnung', 'fachbezeichnung'],
  ['f', 'angabe', 'angabe'],
  ['n', 'wort', 'wortes'], ['n', 'fachwort', 'fachwortes'], ['n', 'ergebnis', 'ergebnisses'],
  ['n', 'loesungswort', 'loesungswortes'], ['n', 'antwortwort', 'antwortwortes'],
];
const QUESTIONS: readonly NamingNoun[] = [['f', 'frage', 'frage'], ['f', 'teilfrage', 'teilfrage'], ['f', 'namensfrage', 'namensfrage'], ['f', 'benennungsfrage', 'benennungsfrage'], ['f', 'benennung', 'benennung'], ['f', 'antwort', 'antwort'], ['n', 'antwortfeld', 'antwortfelds'], ['n', 'feld', 'felds'], ['n', 'namensfeld', 'namensfelds']];
const ARTICLES: Readonly<Record<Case, Readonly<Record<NamingNoun[0], readonly string[]>>>> = {
  nom: { m: ['der', 'dieser', 'mein'], f: ['die', 'diese', 'meine'], n: ['das', 'dieses', 'mein'] },
  acc: { m: ['den', 'diesen', 'meinen'], f: ['die', 'diese', 'meine'], n: ['das', 'dieses', 'mein'] },
  dat: { m: ['dem', 'diesem', 'meinem'], f: ['der', 'dieser', 'meiner'], n: ['dem', 'diesem', 'meinem'] },
  gen: { m: ['des', 'dieses', 'meines'], f: ['der', 'dieser', 'meiner'], n: ['des', 'dieses', 'meines'] },
};
const META_ADJECTIVES = ['richtig', 'gesucht', 'passend', 'korrekt', 'fachlich', 'endgueltig', 'aktuell', 'vorgeschlagen', 'gewaehlt', 'kurz', 'erst', 'biologisch', 'allgemein'];
const FIELD_ADJECTIVES = ['gesucht', 'beschrieben', 'gezeigt', 'dargestellt', 'genannt', 'gemeint', 'markiert', 'hervorgehoben', 'biologisch'];
const isAdjective = (word: string | undefined, stems: readonly string[]) => stems.some(stem => ['', 'e', 'en', 'er', 'es', 'em'].some(end => word === stem + end));
const pattern = (before: readonly Part[], ...after: readonly Part[][]): Pattern => ({ before, after: after.length ? after : [[]] });
const WRITING_VERBS = ['sagen', 'nennen', 'schreiben', 'hinschreiben', 'aufschreiben', 'dazuschreiben', 'eintragen', 'angeben', 'notieren', 'einsetzen', 'setzen', 'nehmen', 'waehlen', 'verwenden', 'benutzen', 'antworten'];
const PARTICIPLES = ['gesagt', 'genannt', 'geschrieben', 'hingeschrieben', 'eingetragen', 'angegeben', 'notiert', 'eingesetzt', 'genommen', 'gewaehlt', 'verwendet', 'benutzt'];
const ACTION_COMPLEMENTS: readonly (readonly Part[])[] = [
  [], [s('reference')], [s('asMeta')], [s('metaAcc')],
  [s('reference'), s('metaAcc')], [s('reference'), s('asMeta')],
  ['unter', 'antwort'], ['in', 'meiner', 'antwort'], ['in', s('questionAcc')],
];

/** Finite constituent grammar. Slots match explicit noun phrases/references,
 * not arbitrary text. Required closing verbs are never optional filler. */
const PATTERNS: readonly Pattern[] = [
  // R6: a bounded naming action with typed noun roles and required closers.
  // These frames neither contain answer terms nor consume scientific clauses.
  pattern([s('fieldNom'), 'ist', 'unter', s('metaDat')], ['bekannt']),
  pattern([s('metaAcc'), 'gebe', 'ich', 'mit'], ['an']),
  pattern(['ich', 'gebe', s('optionalReference'), s('metaAcc')], ['an']),
  ...['muesste', 'sollte', 'koennte', 'wuerde'].map(modal => pattern([s('front'), modal, s('metaNom')], ['lauten'], ['heissen'])),
  pattern([s('asMeta'), 'ist'], ['richtig']),
  pattern(['ist', s('metaNom')], ['gemeint']),
  pattern([s('front'), 'ist', s('metaNom')], ['gemeint']),
  pattern(['ich', 'wuerde', 'von'], ['sprechen']),
  pattern([s('fieldAcc'), 'habe', 'ich', 'mit', s('metaDat')], ['benannt']),
  pattern([s('namingObject'), 'wuerde', 'ich', 'unter'], ['einordnen']),
  pattern([s('metaAcc')], ...WRITING_VERBS.map(verb => ['wuerde', 'ich', s('optionalReference'), verb])),
  pattern([s('subject'), 'wuerde'], ['lauten'], ['heissen']),
  pattern(['ich', 'wuerde', s('namingObject'), s('asField')], ['nennen']),
  pattern(['ich', 'denke', 'an']), pattern(['ich', 'vermute']),
  pattern(['ich', 'tippe', 'auf']),
  pattern(['ich', 'wuerde', s('namingObject'), 'unter'], ['einordnen']),
  pattern(['das', 'bezeichnet', 'man', 'als']),
  pattern(['das', 'nennt', 'man', s('reference')]),
  pattern(['ich', 'schreibe', s('metaAcc')], [s('reference'), 'auf'], [s('asMeta'), 'auf']),
  pattern(['ich', 'schreibe'], [s('asMeta'), 'auf'], [s('asMeta'), 'hin']),
  pattern(['mit', s('metaDat')], ['wuerde', 'ich', s('questionAcc'), 'loesen']),
  pattern([s('asMeta'), 'habe', 'ich'], ['im', 'kopf']),
  pattern([s('fieldAcc'), 'wuerde', 'ich', 'mit'], ['benennen']),
  pattern([s('reference'), 'passt']),
  pattern([s('reference'), 'kenne', 'ich'], [s('asMeta')]),
  ...['nehme', 'verwende', 'nenne'].map(verb => pattern([s('asMeta'), verb, 'ich'])),
  ...['den', 'die', 'das'].flatMap(relative => ['benutze', 'verwende', 'nehme', 'kenne'].map(verb => pattern([s('metaNom'), ',', relative, 'ich', s('optionalReference'), verb, ',', 'ist']))),
  ...['benutzen', 'verwenden', 'nehmen', 'waehlen'].flatMap(verb => ['ist', 'heisst', 'lautet'].map(end =>
    pattern([s('metaNom'), ',', 'den', 'ich', s('optionalReference'), verb, 'wuerde', ',', end]))),
  pattern([s('subject'), 'wuerde', s('reference')], ['lauten']),
  // Naming is a finite action with explicit grammatical roles. These patterns
  // bind the question's object, a word-choice noun and the required particle.
  ...['ordne', 'gebe'].map(verb => pattern(['ich', verb, s('fieldDat'), s('metaAcc')], ...(verb === 'ordne' ? [['zu']] : [[]]))),
  pattern([s('fieldDat'), 'gebe', 'ich', s('metaAcc')]),
  ...['wuerde', 'moechte', 'koennte'].map(aux => pattern(['ich', aux, s('fieldDat'), s('metaAcc')], ['zuordnen'], ['geben'])),
  ...['benenne', 'bezeichne'].flatMap(verb => ['als', 'mit'].map(prep => pattern([s('fieldAcc'), verb, 'ich', prep]))),
  ...['nenne', 'benenne', 'bezeichne'].flatMap(verb => [
    pattern(['ich', verb, s('reference'), s('asMeta')]),
    pattern(['ich', verb, s('reference'), s('asMeta'), s('metaAcc')]),
  ]),
  pattern(['bei', s('fieldDat'), 'spricht', 'man', 'von']),
  pattern([s('reference'), 'spricht', 'man', 'von']),
  pattern(['man', 'spricht', s('reference'), 'von']),
  pattern(['nennt', 'sich', s('fieldNom')]),
  pattern(['das', 'bezeichnet', 'man', s('reference'), 'als']),
  pattern(['ich', 'denke', s('reference'), 'an']),
  pattern(['ich', 'kenne', s('asMeta')]),
  pattern(['ich', 'kenne', s('metaAcc'), 'als']),
  pattern([s('metaAcc'), 'kenne', 'ich', 'als']),
  pattern(['ich', 'kenne', s('reference')], [s('asMeta')]),
  pattern(['ich', 'komme', s('reference'), 'auf']),
  pattern(['ich', 'wuerde', s('optionalReference'), 'auf'], ['tippen']),
  pattern(['ich', 'wuerde', s('namingObject'), 'unter', s('metaDat')], ['benennen'], ['einordnen']),
  pattern(['ich', 'wuerde', s('namingObject'), 'mit', s('metaDat')], ['loesen']),
  pattern(['ich', 'wuerde', s('asField')], ['nennen']),
  ...['wuerde', 'haette'].map(aux => pattern(['mit'], [aux, 'ich', s('questionAcc'), ...(aux === 'haette' ? ['beantwortet'] : ['beantworten'])])),
  pattern([s('reference'), 'antworte', 'ich']),
  pattern([s('asMeta'), 'passt']),
  pattern([s('asMeta'), 'passt', s('reference')]),
  pattern([s('asField'), 'gebe', 'ich'], ['an']),
  pattern([s('fieldAcc'), 'benenne', 'ich']),
  pattern([s('fieldNom'), 'ist', 'mit', s('metaDat')], ['gemeint']),
  ...['ich', 'man'].map(pronoun => pattern([pronoun, 'nenne', s('fieldAcc'), 'als'])),
  pattern(['ich', 'nenne', s('fieldAcc'), 'mit', s('metaDat')]),
  // Word choice and explicit uncertainty about naming only. Negations in
  // these frames belong to the speaker's certainty, never to the answer.
  pattern(['ich', 'bin', s('reference'), s('uncertain'), ':']),
  pattern(['ich', 'bin', 'mir', s('reference'), s('uncertain'), ':']),
  pattern(['ich', 'habe', s('asMeta')], ['im', 'kopf'], [s('asMeta')]),
  pattern(['ich', 'habe', s('reference')], ['im', 'kopf'], [s('asMeta')]),
  pattern(['ich', 'habe', s('metaAcc')], ['im', 'kopf'], [s('reference'), 'gewaehlt']),
  pattern(['ich', 'habe', s('metaAcc')], [s('asMeta')]),
  pattern(['ich', 'habe', s('asMeta'), s('metaAcc')], ['im', 'kopf']),
  ...['denke', 'vermute', 'meine'].map(verb => pattern(['ich', verb, s('reference'), s('metaAcc')])),
  pattern(['ich', 'denke', 'an'], [s('asMeta')]),
  pattern(['ich', 'vermute', s('reference')]),
  pattern(['ich', 'lege', 'mich', s('optionalReference'), 'auf'], ['fest']),
  pattern(['ich', 'bleibe', s('optionalReference'), 'bei']),
  pattern([s('metaNom'), 'bleibt']),
  pattern(['mit'], ['bestaetige', 'ich', s('metaAcc')]),
  pattern(['mit'], ['ist', s('subject'), 'richtig', 'benannt'], ['ist', s('subject'), 'passend', 'benannt']),
  pattern([s('namingObject'), 'ist', 'mit'], ['richtig', 'benannt'], ['passend', 'benannt']),
  pattern([s('namingObject'), 'nennt', 'sich', 'in', 'der', 'biologie']),
  pattern(['hier', 'soll', 'man'], ['eintragen']),
  pattern(['ich', 'nenne', s('namingObject'), 'mit', s('metaDat')]),
  pattern([s('fieldNom'), 'wird', 'mit'], ['bezeichnet'], ['benannt']),
  pattern([s('fieldNom'), 'wird', 'mit', s('metaDat')], ['bezeichnet'], ['benannt']),
  pattern([s('fieldNom'), 'laesst', 'sich', 'mit'], ['bezeichnen'], ['benennen']),
  pattern(['ich', 'haette', s('namingObject'), 'mit'], ['bezeichnet'], ['benannt']),
  ...['muesste', 'sollte', 'koennte'].map(modal => pattern([s('subject'), modal], [s('asMeta'), 'passen'])),
  pattern([s('front'), 'kaeme', s('metaNom')]),
  pattern(['ich', 'schreibe', s('optionalReference')], ['hin'], ['in', s('questionAcc')]),
  ...ACTION_COMPLEMENTS.map(parts => pattern(['ich', 'schreibe', ...parts], ['hin'], [s('reference')])),
  pattern(['ich', 'setze', s('optionalReference')], ['ein'], []),
  pattern(['ich', 'setze', s('reference'), s('metaAcc')]),
  pattern(['ich', 'setze', s('metaAcc')], [s('reference')]),
  pattern(['ich', 'setze', s('asMeta')], ['ein']),
  pattern(['ich', 'nenne', s('namingObject')], ['mit', s('metaDat')]),
  pattern([s('reference'), 'habe', 'ich'], [s('asMeta')], ['im', 'kopf']),
  pattern([s('reference'), 'faellt', 'mir'], ['ein']),
  pattern([s('asMeta'), 'faellt', 'mir', s('reference')], ['ein']),
  ...['heisst', 'lautet'].map(verb => pattern([verb, s('subject')])),
  pattern(['nennt', 'man', s('namingObject')]),
  pattern(['mit', s('metaDat')], ['wuerde', 'ich', s('questionAcc'), 'beantworten']),
  pattern(['ich', 'kenne', 'nur', s('metaAcc')]),
  pattern([s('front'), 'kommt', s('metaNom')], ['infrage']),
  pattern([s('front'), 'wuerde', s('metaNom')], ['lauten'], ['heissen'], ['sein']),
  pattern([s('asMeta'), 'haette', 'ich'], ...PARTICIPLES.map(v => [v])),
  pattern([s('asMeta'), 'schlage', 'ich'], ['vor']),
  ...ACTION_COMPLEMENTS.map(parts => pattern(['ich', 'trage', ...parts], ['ein'])),
  ...['wuerde', 'moechte', 'kann'].flatMap(aux => [
    pattern([s('namingObject'), aux, 'ich'], ['nennen'], ['benennen']),
    pattern(['ich', aux, s('namingObject'), 'als'], ['benennen'], ['bezeichnen'], ['angeben']),
    pattern(['ich', aux, s('namingObject'), 'mit'], ['beantworten']),
  ]),
  ...['nenne', 'benenne', 'meine'].map(verb => pattern(['ich', verb, s('namingObject')])),
  ...['sage', 'schreibe', 'notiere', 'nehme', 'verwende', 'benutze'].flatMap(verb => ACTION_COMPLEMENTS.map(parts => pattern(['ich', verb, ...parts]))),
  ...['wuerde', 'moechte', 'koennte', 'kann', 'haette', 'habe'].flatMap(aux => {
    const endings = ['haette', 'habe'].includes(aux) ? PARTICIPLES : WRITING_VERBS;
    return ACTION_COMPLEMENTS.flatMap(parts => [
      pattern(['ich', aux, ...parts], ...endings.map(v => [s('optionalReference'), v])),
      pattern(['ich', aux, ...parts], ...endings.map(v => [s('asMeta'), v])),
      pattern(['ich', aux, s('namingObject')], ...(['haette', 'habe'].includes(aux) ? ['genannt', 'benannt'] : ['nennen', 'benennen', 'angeben']).map(v => [v])),
      pattern(['ich', aux, s('namingObject'), 'mit', s('metaDat')], ...(['haette', 'habe'].includes(aux) ? ['bezeichnet', 'beschrieben', 'benannt'] : ['bezeichnen', 'beschreiben', 'benennen', 'angeben']).map(v => [v])),
    ]);
  }),
  pattern(['ich', 'wuerde', 'mich', s('optionalReference'), 'fuer'], ['entscheiden']),
  pattern(['ich', 'wuerde', 'mich', s('optionalReference'), 'auf'], ['festlegen']),
  pattern(['ich', 'wuerde', s('metaAcc'), 'mit', s('metaDat')], ['geben']),
  pattern(['ich', 'wuerde', 'mit', s('metaDat')], ['antworten']),
  pattern(['ich', 'haette', s('questionAcc'), 'mit', s('metaDat')], ['beantwortet']),
  pattern(['ich', 'haette', s('reference')], [s('asMeta'), 'gewaehlt']),
  pattern(['ich', 'waere', 'fuer', s('metaAcc')]),
  pattern(['ich', 'bin', 'bei', s('metaDat'), 'fuer']),
  pattern(['ich', 'habe', s('reference'), s('metaAcc')], ['im', 'kopf']),
  pattern(['ich', 'tippe', s('reference'), 'auf']),
  pattern(['ich', 'kenne', s('namingObject'), 'unter', s('metaDat')]),
  pattern([s('namingObject'), 'kenne', 'ich', 'unter', s('metaDat')]),
  pattern([s('asMeta'), 'kenne', 'ich']),
  pattern(['ich', 'wuerde', s('namingObject'), 'unter', s('metaDat')], ['benennen']),
  pattern(['ich', 'wuerde', s('namingObject'), 'als', 'einen', 'fall', 'von'], ['benennen']),
  ...['hat', 'traegt'].map(verb => pattern([s('fieldNom'), verb, s('metaAcc')])),
  { ...pattern([s('fieldNom'), 'hat', 'nicht', s('metaAcc')]), negated: true },
  pattern([s('reference'), 'kommt', s('metaNom')], ['infrage']),
  pattern([s('front'), 'kommt', s('asMeta')], ['hin']),
  pattern([s('front'), 'passt'], [s('asMeta')]),
  pattern([s('front'), 'gehoert', s('metaNom')], ['hin']),
  pattern([s('front'), 'ist', s('metaNom')], ['gefragt']),
  pattern([s('asMeta'), 'wuerde', 'mir'], ['einfallen']),
  pattern([s('subject'), 'muesste', 'um'], ['gehen']),
  ...['duerfte', 'wuerde'].map(modal => pattern([s('subject'), modal], ['heissen'])),
  ...['in', 'bei'].map(prep => pattern([prep, s('metaDat'), 'wuerde', 'ich', 'auf'], ['kommen'])),
  pattern(['wenn', 'ich', 'einen', 'begriff', 'nennen', 'soll', ',', 'nehme', 'ich']),
  pattern([s('metaNom'), ',', 'der', 'mir', 'einfaellt', ',', 'lautet']),
  pattern([s('metaNom'), ',', 'das', 'ich', 'kenne', ',', 'ist']),
  pattern([s('metaNom'), ',', 'den', 'ich', s('optionalReference'), 'kenne', ',', 'ist']),
  ...['angeben', 'nehmen'].map(v => pattern([s('metaNom'), ',', 'den', 'ich', s('optionalReference'), v, 'wuerde', ',', 'lautet'])),
  pattern([s('metaNom'), ',', 'den', 'ich', s('reference'), 'nehmen', 'wuerde', ',', 'ist']),
  // Naming verbs have explicit complements and closing particles. None of
  // these rules contains an answer word or consumes an arbitrary text gap.
  pattern(['ich', 'gebe', s('optionalReference')], [s('asMeta'), 'an']),
  pattern(['ich', 'gebe', s('metaAcc')], [s('asMeta'), 'an']),
  pattern(['ich', 'trage', s('asMeta')], ['ein']),
  pattern([s('asMeta'), 'trage', 'ich'], ['ein']),
  pattern(['ich', 'nehme'], [s('asMeta')]),
  pattern(['ich', 'schlage', s('optionalReference'), s('metaAcc')], ['vor']),
  pattern(['ich', 'schlage', s('asMeta')], ['vor']),
  pattern(['ich', 'beantworte', s('questionAcc'), 'mit']),
  pattern(['ich', 'beantworte', s('questionAcc'), 'mit', s('metaDat')]),
  ...['benenne', 'bezeichne'].flatMap(verb => [
    pattern(['ich', verb, s('fieldAcc'), 'mit']),
    pattern(['ich', verb, s('fieldAcc'), 'mit', s('metaDat')]),
    pattern([s('fieldAcc'), verb, 'ich', 'mit']),
    pattern([s('fieldAcc'), verb, 'ich', 'mit', s('metaDat')]),
  ]),
  pattern([s('fieldNom'), 'laesst', 'sich', 'mit', s('metaDat')], ['benennen'], ['bezeichnen']),
  pattern([s('fieldAcc'), 'kann', 'man'], ['nennen'], ['benennen']),
  pattern([s('subject'), 'nennt', 'sich']),
  pattern([s('metaAcc'), 'sehe', 'ich', 'in']),
  pattern([s('front'), 'passt', s('metaNom')]),
  pattern([s('metaNom')], ['passt', s('reference')], ['passt', s('asMeta')]),
  pattern([s('metaNom')], ['wuerde', 'ich', s('reference'), 'nehmen']),
  pattern([s('reference'), 'faellt', 'mir', s('metaNom')], ['ein']),
  pattern([s('asMeta'), 'faellt', 'mir'], ['ein']),
  pattern(['ich', 'halte', s('metaAcc')], ['fuer', 'passend']),
  pattern(['ich', 'halte'], ['fuer', 'passend']),
  pattern(['ich', 'halte'], ['fuer', s('metaAcc')]),
  pattern(['ich', 'ordne', s('fieldAcc')], ['zu']),
  pattern(['gemeint', 'ist', s('fieldNom')]),
  pattern(['wenn', 'ich', s('fieldAcc'), 'benennen', 'soll', ',', 'sage', 'ich']),
  pattern(['dass', s('subject')], ['heisst'], ['ist'], ['lautet']),
  ...['muesste', 'sollte', 'koennte'].map(modal => pattern([s('subject'), modal], ['heissen'], ['lauten'], ['sein'])),
  // Relative clauses describe the speaker's word choice, never a new property.
  ...['den', 'die', 'das'].flatMap(relative => ['verwenden', 'waehlen', 'nennen'].map(verb =>
    pattern([s('metaNom'), ',', relative, 'ich', verb, 'wuerde', ',', 'ist']))),
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
  ...['ich', 'man'].flatMap(pronoun => ['nenne', 'nennt'].flatMap(verb => [pattern([pronoun, verb, s('fieldAcc')]), pattern([s('fieldAcc'), verb, pronoun])])),
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
    pattern(['ich', modal, s('optionalReference')], [s('asMeta'), 'nehmen'], [s('asMeta'), 'angeben'], [s('asMeta'), 'verwenden']),
    pattern(['ich', modal, s('optionalReference'), s('asMeta')], ...['eintragen', 'nehmen', 'hinschreiben', 'verwenden'].map(verb => [verb])),
    pattern(['ich', modal, s('optionalReference'), s('metaAcc')], ['eintragen'], [s('asMeta'), 'nehmen'], [s('optionalReference'), 'waehlen']),
    pattern(['ich', modal, s('optionalReference'), 'bei'], ['bleiben']),
    pattern(['ich', modal, s('optionalReference'), 'bei', s('metaDat')], ['bleiben']),
    pattern(['ich', modal, s('questionAcc'), 'mit'], ['beantworten']),
    pattern(['ich', modal, s('namingObject')], ['nennen']),
    pattern(['ich', modal, s('namingObject'), 'mit'], ['benennen'], ['angeben'], ['formulieren']),
    pattern(['ich', modal, s('namingObject'), 'mit', s('metaDat')], ['benennen'], ['angeben'], ['formulieren']),
    pattern(['ich', modal, s('namingObject'), 'als'], ['bezeichnen'], ['benennen']),
    pattern([s('reference'), modal, 'ich'], ['hinschreiben'], [s('asMeta'), 'nehmen']),
    pattern(['mit', s('metaDat')], [modal, 'ich', 'antworten']),
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
    pattern([s('asMeta'), modal, 'ich', s('optionalReference')], ...WRITING_VERBS.map(v => [v])),
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
const SUBORDINATE: readonly Pattern[] = ['denke', 'glaube', 'vermute', 'meine'].flatMap(verb =>
  [[], [',']].flatMap(comma => [pattern(['ich', verb, ...comma, 'dass', s('subject')], ['ist'], ['heisst'], ['lautet'])]));
// Optional word labels attach to the answer slot, without changing its meaning.
const CONSTRUCTIONS = [...PATTERNS, ...INVERTED, ...SUBORDINATE];
// A literal first token cannot match another token. Index only this exact
// syntactic fact; all slot-starting patterns remain candidates, with the same
// longest-prefix selection and all required endings as before.
const LITERAL_STARTS = new Map<string, Pattern[]>();
const SLOT_STARTS: Pattern[] = [];
for (const construction of CONSTRUCTIONS) {
  const first = construction.before[0];
  if (typeof first === 'string') {
    const list = LITERAL_STARTS.get(first) ?? [];
    list.push(construction); LITERAL_STARTS.set(first, list);
  } else SLOT_STARTS.push(construction);
}

export function createNamingSyntax(tokens: readonly TextToken[], references: NamingReferences) {
  const namingNouns = [...META, ...(references.names ?? [])];
  const at = (index: number) => tokens[index]?.word;
  const exact = (index: number, words: readonly string[]) => words.every((word, offset) => at(index + offset) === word);
  const modifierMemo = new Map<number, number>();
  const modifiers = (start: number) => {
    if (modifierMemo.has(start)) return modifierMemo.get(start)!;
    let index = start;
    for (let count = 0; count < 3; count++) {
      const found = NAMING_MODIFIERS.find(words => exact(index, words));
      if (!found) break;
      index += found.length;
    }
    modifierMemo.set(start, index); return index;
  };
  function noun(start: number, nouns: readonly NamingNoun[], grammaticalCase: Case, bare = false, adjectives = nouns === META ? META_ADJECTIVES : FIELD_ADJECTIVES): number | null {
    let best: number | null = null;
    for (const [gender, nominative, genitive] of nouns) {
      let index = start;
      const article = ARTICLES[grammaticalCase][gender].includes(at(index) ?? '');
      if (article) index++; else if (!bare) continue;
      index = modifiers(index);
      for (let count = 0; count < 2 && isAdjective(at(index), adjectives); count++) index++;
      const inflected = nominative.endsWith('name') && ['acc', 'dat'].includes(grammaticalCase) ? nominative + 'n' : nominative;
      const forms = [grammaticalCase === 'gen' ? genitive : inflected, ...(bare && !article ? [nominative] : [])];
      for (const form of forms) { const words = form.split(' '); if (exact(index, words)) best = Math.max(best ?? 0, index + words.length); }
    }
    return best;
  }
  function field(index: number, grammaticalCase: Case, bare = false, depth = 0): number | null {
    if (depth > 3) return null;
    const direct = noun(index, references.nouns, grammaticalCase, bare);
    if (direct !== null) {
      const qualifier = references.qualifiers?.filter(words => exact(direct, words)).sort((a, b) => b.length - a.length)[0];
      return direct + (qualifier?.length ?? 0);
    }
    const kind = noun(index, [['f', 'art', 'art']], grammaticalCase, bare);
    return kind === null ? null : at(kind) === 'von' ? field(kind + 1, 'dat', true, depth + 1) : field(kind, 'gen', false, depth + 1);
  }
  function question(index: number, grammaticalCase: Case, bare = false): number | null {
    const end = noun(index, QUESTIONS, grammaticalCase, bare, [...FIELD_ADJECTIVES, 'erst']);
    if (end === null) return null;
    return at(end) === 'nach' ? field(end + 1, 'dat') ?? meta(end + 1, 'dat') ?? end : end;
  }
  function reference(start: number, depth = 0): number | null {
    if (depth > 3) return null;
    let index = start;
    const prep = at(index);
    const contraction = ['zur', 'zum', 'beim', 'im'].includes(prep ?? '');
    const grammaticalCase = prep === 'fuer' || prep === 'auf' || prep === 'in' ? 'acc' : contraction || prep === 'zu' || prep === 'nach' || prep === 'bei' ? 'dat' : null;
    if (!grammaticalCase) return null;
    index++;
    const named = field(index, grammaticalCase, contraction) ?? (prep === 'in' ? field(index, 'dat') : null);
    const asked = question(index, grammaticalCase, contraction) ?? (prep === 'in' ? question(index, 'dat') : null);
    const wordChoice = meta(index, grammaticalCase, contraction, depth + 1);
    let end = Math.max(named ?? 0, asked ?? 0, wordChoice ?? 0) || null;
    if (end !== null) end = field(end, 'gen') ?? end;
    if (end !== null && at(end) === 'nach') end = field(end + 1, 'dat') ?? meta(end + 1, 'dat', false, depth + 1) ?? end;
    if (end !== null && asked === end && ['fuer', 'zum', 'zur'].includes(at(end) ?? '')) end = reference(end, depth + 1) ?? end;
    return end;
  }
  function meta(index: number, grammaticalCase: Case, bare = false, depth = 0): number | null {
    if (depth > 3) return null;
    const end = noun(index, namingNouns, grammaticalCase, bare, META_ADJECTIVES);
    if (end === null) return null;
    const asWord = at(end) === 'als' ? meta(end + 1, 'acc', true, depth + 1) : null;
    return field(end, 'gen') ?? reference(end, depth + 1) ?? asWord ?? end;
  }
  const longest = (...indices: (number | null)[]) => Math.max(...indices.map(i => i ?? 0)) || null;
  const slotMemo = new Map<string, number | null>();
  function slot(index: number, name: Slot): number | null {
    const key = `${name}:${index}`;
    if (slotMemo.has(key)) return slotMemo.get(key)!;
    const value = readSlot(index, name); slotMemo.set(key, value); return value;
  }
  const deictic = (index: number) => exact(index, ['das', 'ganze']) || exact(index, ['das', 'gesuchte']) ? index + 2 : ['es', 'das'].includes(at(index) ?? '') ? index + 1 : null;
  function readSlot(index: number, name: Slot): number | null {
    switch (name) {
      case 'metaNom': return meta(index, 'nom');
      case 'metaAcc': return meta(index, 'acc');
      case 'metaDat': return meta(index, 'dat');
      case 'fieldNom': return field(index, 'nom');
      case 'fieldAcc': return field(index, 'acc');
      case 'fieldDat': return field(index, 'dat');
      case 'questionAcc': return question(index, 'acc');
      case 'namingObject': return longest(field(index, 'acc'), meta(index, 'acc'), deictic(index));
      case 'subject': return longest(meta(index, 'nom'), field(index, 'nom'), deictic(index), ['er', 'sie', 'die'].includes(at(index) ?? '') ? index + 1 : null);
      case 'asMeta': return at(index) === 'als' ? meta(index + 1, 'acc', true) : null;
      case 'asField': return at(index) === 'als' ? field(index + 1, 'acc', true) : null;
      case 'reference': return reference(index);
      case 'optionalReference': return reference(index) ?? index;
      case 'front': return longest(
        modifiers(index) > index ? modifiers(index) : null,
        reference(index),
        exact(index, ['bei', 'meiner', 'antwort']) ? index + 3 : null,
      );
      case 'uncertain': return longest(...[
        ['nicht', 'ganz', 'sicher'], ['nicht', 'sicher'], ['noch', 'unsicher'], ['unsicher'],
      ].map(words => exact(index, words) ? index + words.length : null));
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
  const post = (index: number) => longest(...[
    ...['den', 'die', 'das'].flatMap(relative => ['verwende', 'nehme', 'benutze'].map(verb => ['ist', s('metaNom'), ',', relative, 'ich', s('optionalReference'), verb])),
    ['ist', s('metaNom'), ',', 'der', 'hier', 'gesucht', 'wird'],
    ...['heisst', 'waere'].map(verb => [verb, s('fieldNom')]),
    ...['ist', 'waere'].flatMap(verb => [
      [verb, s('metaNom'), ',', 'die', 'ich', s('optionalReference'), 'waehlen', 'wuerde'],
      [verb, s('metaNom'), ',', 'die', 'ich', s('reference'), 'verwenden', 'wuerde'],
      [verb, s('metaNom'), ',', 'die', 'mir', s('optionalReference'), 'einfaellt'],
      [verb, s('metaNom'), ',', 'das', 'ich', s('optionalReference'), 'nehmen', 'wuerde'],
      [verb, s('metaNom'), ',', 'den', 'ich', s('optionalReference'), 'waehlen', 'wuerde'],
      [verb, s('metaNom'), ',', 'mit', 'dem', 'ich', s('fieldAcc'), 'benenne'],
      [verb, s('metaNom'), ',', 'mit', 'dem', 'ich', s('fieldAcc'), 'bezeichne'],
    ]),
    ...['muesste', 'sollte', 'koennte'].map(modal => [modal, s('asMeta'), 'passen']),
    ['nehme', 'ich', s('optionalReference'), s('asMeta')],
    ['passt', s('asMeta'), s('optionalReference')],
    ...WRITING_VERBS.flatMap(verb => [
      ['wuerde', 'ich', s('optionalReference'), verb],
      ['wuerde', 'ich', s('optionalReference'), s('asMeta'), verb],
    ]),
    ...['ist', 'waere', 'lautet'].map(verb => [verb, s('metaNom')]),
    ...['muesste', 'sollte'].map(modal => [modal, s('metaNom'), 'sein']),
    ['wuerde', 'ich', s('asMeta'), 'hinschreiben'],
    ['wuerde', 'ich', s('reference'), 'nehmen'],
    ...['den', 'die', 'das'].map(relative => ['ist', s('metaNom'), ',', relative, 'ich', 'nennen', 'wuerde']),
    ['ist', s('metaNom'), ',', 'mit', 'dem', 'ich', 'antworten', 'wuerde'],
  ].map(parts => match(index, parts)));
  const tail = (index: number) => longest(...[
    ['das', 'ist', s('metaNom')], ['das', 'waere', s('metaNom')], ['so', 'lautet', s('metaNom')],
    ['so', 'nennt', 'man', s('fieldAcc')], ['so', 'heisst', s('fieldNom')],
  ].map(parts => { const end = match(index, parts); return end === null ? null : modifiers(end); }));
  const frameMemo = new Map<number, SyntaxFrame | undefined>();
  return {
    post, tail,
    designationAt(index: number): boolean {
      if (!['ist', 'heisst', '='].includes(at(index) ?? '')) return false;
      const start = modifiers(index + 1);
      // A reverse word-choice frame must not swallow a definitional name-of
      // relation, including a neutral insertion or inflected genitive.
      for (const head of META.filter(n => ['name', 'fachname', 'bezeichnung', 'benennung', 'begriff', 'fachbegriff', 'ausdruck', 'fachausdruck', 'wort', 'fachwort'].includes(n[1]))) {
        const end = noun(start, [head], 'nom', false, META_ADJECTIVES);
        if (end !== null && ['der', 'des', 'dieser', 'dieses', 'von', 'fuer'].includes(at(modifiers(end)) ?? '')) return true;
      }
      return false;
    },
    frameAt(start: number): SyntaxFrame | undefined {
      if (frameMemo.has(start)) return frameMemo.get(start);
      const candidates = [...(LITERAL_STARTS.get(at(start) ?? '') ?? []), ...SLOT_STARTS];
      const found = candidates.flatMap(p => {
        const next = match(start, p.before);
        if (next === null) return [];
        const labelAt = modifiers(next);
        const label = longest(meta(labelAt, 'nom'), meta(labelAt, 'acc'), meta(labelAt, 'dat'));
        return [{ p, next: Math.max(next, label ?? next) }];
      });
      if (!found.length) { frameMemo.set(start, undefined); return undefined; }
      const next = Math.max(...found.map(f => f.next));
      const selected = found.filter(f => f.next === next);
      const endings = selected.flatMap(f => f.p.after);
      const frame: SyntaxFrame = { words: tokens.slice(start, next).map(t => t.word), next,
        ...(selected.some(f => f.p.negated) ? { negated: true as const } : {}),
        close: index => longest(...endings.map(parts => match(index, parts))) };
      frameMemo.set(start, frame); return frame;
    },
  };
}
