/** Sentence fragments only: no biological concepts or complete answer strings. */
export interface NamingFrame {
  readonly words: readonly string[];
  readonly endings?: readonly (readonly string[])[];
  readonly negated?: true;
  readonly contrastPreposition?: string;
}
export type NamingFrameInput = readonly string[] | NamingFrame;

const SUBJECTS = [
  ['die', 'antwort'], ['die', 'richtige', 'antwort'], ['meine', 'antwort'],
  ['meine', 'vermutung'], ['mein', 'vorschlag'], ['mein', 'tipp'],
  ['die', 'bezeichnung'], ['die', 'richtige', 'bezeichnung'], ['die', 'gesuchte', 'bezeichnung'],
  ['der', 'begriff'], ['der', 'gesuchte', 'begriff'], ['der', 'fachbegriff'],
  ['der', 'name'], ['die', 'loesung'], ['das', 'wort', 'dafuer'],
];
export const COMMON_NAMING_FRAMES: readonly NamingFrame[] = [
  ...SUBJECTS.flatMap(words => ['ist', 'lautet', 'heisst', 'waere', ':'].map(verb => ({ words: [...words, verb] }))),
  ...[
    ['das', 'nennt', 'man'], ['nennt', 'man', 'das'], ['das', 'heisst'], ['ich', 'tippe', 'auf'], ['ich', 'denke', 'an'],
    ['fuer', 'mich', 'ist', 'das'], ['fuer', 'mich', 'ist', 'es'], ['ich', 'halte', 'das', 'fuer'],
    ['als', 'fachbegriff', 'passt'], ['ich', 'nenne', 'als', 'vorgang'], ['man', 'nennt', 'das'],
    ['meine', 'wahl', 'faellt', 'auf'], ['das', 'waere', 'dann'], ['ich', 'bin', 'fuer'],
    ['ich', 'komme', 'auf'], ['ich', 'waehle'], ['ich', 'tendiere', 'zu'], ['ich', 'sage'],
    ['ich', 'entscheide', 'mich', 'fuer'],
  ].map(words => ({ words })),
  { words: ['ich', 'wuerde'], endings: [['sagen']] },
  { words: ['ich', 'wuerde', 'hier'], endings: [['antworten'], ['sagen']] },
  { words: ['ich', 'wuerde', 'auf'], endings: [['tippen']] },
  { words: ['mir', 'faellt'], endings: [['ein']] },
  { words: ['als', 'antwort', 'wuerde', 'ich'], endings: [['angeben'], ['nennen']] },
  { words: ['auf'], endings: [['wuerde', 'ich', 'mich', 'festlegen']] },
  { words: ['hier', 'wuerde', 'ich', 'von'], endings: [['sprechen']] },
  { words: ['mir', 'kommt'], endings: [['in', 'den', 'sinn']] },
  { words: ['ich', 'nehme'], endings: [['als', 'antwort']] },
  { words: ['da', 'wuerde', 'ich'], endings: [['nennen'], ['sagen']] },
  { words: ['am', 'ehesten', 'wuerde', 'ich'], endings: [['sagen']] },
  { words: ['spontan', 'wuerde', 'ich'], endings: [['sagen']] },
  { words: ['es', 'duerfte'], endings: [['sein']] },
  ...[['ich', 'denke'], ['ich', 'glaube'], ['ich', 'vermute'], ['ich', 'nehme', 'an']].flatMap(prefix =>
    ['es', 'das'].flatMap(pronoun => [
      { words: [...prefix, ',', 'dass', pronoun], endings: [['ist']] },
      { words: [...prefix, 'dass', pronoun], endings: [['ist']] },
    ])),
  ...[['ich', 'tippe', 'nicht', 'auf'], ['ich', 'denke', 'nicht', 'an']].map(words =>
    ({ words, negated: true as const, contrastPreposition: words.at(-1)! })),
];

export const POST_NAMING_FRAMES = [
  ['waere', 'meine', 'antwort'], ['ist', 'meine', 'antwort'],
  ['ist', 'meine', 'vermutung'], ['ist', 'mein', 'tipp'],
] as const;

export const CERTAINTY_TAILS: readonly (readonly string[])[] = [
  ...['denke', 'glaube', 'vermute', 'meine'].flatMap(verb => [[verb, 'ich', 'mal'], [verb, 'ich']]),
  ['wuerde', 'ich', 'sagen'], ['so', 'wuerde', 'ich', 'es', 'nennen'],
  ['wenn', 'ich', 'mich', 'nicht', 'irre'],
];
