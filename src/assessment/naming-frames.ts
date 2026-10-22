/** Sentence fragments only: no biological concepts or complete answer strings. */
export interface NamingFrame {
  readonly words: readonly string[];
  readonly endings?: readonly (readonly string[])[];
  readonly negated?: true;
  readonly contrastPreposition?: string;
  /** Only these explicitly lexicalised naming modifiers may occupy word gaps. */
  readonly insertions?: true;
}
export type NamingFrameInput = readonly string[] | NamingFrame;

const SUBJECTS = [
  ['die', 'antwort'], ['die', 'richtige', 'antwort'], ['meine', 'antwort'],
  ['meine', 'vermutung'], ['mein', 'vorschlag'], ['mein', 'tipp'],
  ['die', 'bezeichnung'], ['die', 'richtige', 'bezeichnung'], ['die', 'gesuchte', 'bezeichnung'],
  ['der', 'begriff'], ['der', 'gesuchte', 'begriff'], ['der', 'fachbegriff'],
  ['der', 'name'], ['die', 'loesung'], ['das', 'wort', 'dafuer'],
];

/** These phrases express naming/stance, never a biological condition or negation.
 * They are matched only inside a recognised naming construction, not removed
 * from the answer or from scientific predicates. */
export const NAMING_MODIFIERS: readonly (readonly string[])[] = [
  ['meiner', 'meinung', 'nach'], ['meiner', 'ansicht', 'nach'], ['aus', 'meiner', 'sicht'],
  ['fuer', 'mich'], ['hier'], ['dabei'], ['dafuer'], ['dazu'], ['also'], ['wohl'], ['doch'],
  ['vermutlich'], ['wahrscheinlich'], ['vielleicht'], ['eventuell'], ['dann'],
];
const FRONTINGS = [
  ['hier'], ['dabei'], ['fuer', 'mich'], ['meiner', 'ansicht', 'nach'],
  ['meiner', 'meinung', 'nach'], ['aus', 'meiner', 'sicht'],
];
const NAMING_SUBJECTS = [
  ...SUBJECTS,
  ...[['die', 'antwort'], ['die', 'bezeichnung'], ['der', 'begriff'], ['der', 'fachbegriff'], ['der', 'name'], ['das', 'fachwort'], ['das', 'wort']]
    .flatMap(([article, noun]) => ['richtige', 'gesuchte', 'passende', 'korrekte'].map(adjective => [article!, adjective, noun!])),
  ['das', 'fachwort'], ['mein', 'ergebnis'], ['mein', 'loesungsvorschlag'], ['mein', 'begriff'],
  ['mein', 'fachbegriff'], ['meine', 'bezeichnung'],
];

/** Subject + naming predicate, including finite-verb inversion after a fronting.
 * The caller owns the subjects: osmosis never inherits membrane-specific ones. */
export function namingSubjectFrames(subjects: readonly (readonly string[])[]): NamingFrame[] {
  return subjects.flatMap(subject => ['ist', 'waere', 'heisst', 'lautet', ':'].flatMap(verb => [
    { words: [...subject, verb], insertions: true as const },
    ...(verb === ':' ? [] : FRONTINGS.map(front => ({ words: [...front, verb, ...subject], insertions: true as const }))),
  ]));
}

export function namingObjectFrames(objects: readonly (readonly string[])[]): NamingFrame[] {
  return objects.flatMap(object => [
    { words: ['ich', 'wuerde', ...object], endings: [['nennen']] },
    { words: ['ich', 'wuerde', ...object, 'als'], endings: [['bezeichnen']] },
    { words: [...object, 'wuerde', 'ich'], endings: [['nennen']] },
    { words: ['hier', 'wuerde', 'ich', ...object, 'als'], endings: [['bezeichnen']] },
    { words: [...object, 'bezeichne', 'ich', 'als'] },
    { words: ['ich', 'bezeichne', ...object, 'als'] },
  ].map(frame => ({ ...frame, insertions: true as const })));
}
export function asNamingFrames(nouns: readonly string[]): NamingFrame[] {
  return nouns.flatMap(noun => [
    { words: ['als', noun, 'wuerde', 'ich'], endings: [['nennen'], ['angeben']] },
    { words: ['als', noun, 'nenne', 'ich'] },
    { words: ['als', noun, 'nehme', 'ich'] },
    { words: ['als', noun, 'gebe', 'ich'], endings: [['an']] },
  ].map(frame => ({ ...frame, insertions: true as const })));
}
const COMPOSED_FRAMES: readonly NamingFrame[] = [
  ...namingSubjectFrames(NAMING_SUBJECTS),
  ...['das', 'es'].flatMap(subject => namingSubjectFrames([[subject]]).filter(frame => frame.words.at(-1) !== ':')),
  ...namingObjectFrames([['das'], ['es']]),
  ...asNamingFrames(['antwort', 'begriff', 'fachbegriff', 'fachwort', 'bezeichnung']),
  ...['das', 'es'].flatMap(subject => [
    { words: [subject, 'wuerde', 'ich', 'als'], endings: [['bezeichnen']] },
    { words: [subject, 'wird', 'als'], endings: [['bezeichnet']] },
    { words: ['es', 'geht', 'um'] },
    { words: ['hier', 'geht', 'es', 'um'] },
  ]),
  { words: ['ich', 'wuerde'], endings: [['angeben'], ['sagen'], ['antworten'], ['nennen']] },
  { words: ['ich', 'wuerde', 'mit'], endings: [['antworten']] },
  { words: ['mit'], endings: [['wuerde', 'ich', 'antworten']] },
  { words: ['ich', 'bleibe', 'bei'] },
  { words: ['ich', 'meine'] },
  { words: ['das', 'heisst'] },
  ...['gemeint', 'gesucht'].flatMap(participle => [
    { words: [participle, 'ist'] }, { words: [participle, 'waere'] },
    ...['hier', 'dabei'].map(front => ({ words: [front, 'ist'], endings: [[participle]] })),
  ]),
  ...['ziemlich', 'recht', 'ganz'].map(degree => ({ words: ['ich', 'bin', 'mir', degree, 'sicher', ':'] })),
];

const NAMING_FRAMES: readonly NamingFrame[] = [
  ...COMPOSED_FRAMES.map(frame => ({ ...frame, insertions: true as const })),
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
    [[], [',']].flatMap(comma => [
      ...[['es'], ['das'], ['der', 'vorgang']].map(subject => ({ words: [...prefix, ...comma, 'dass', ...subject], endings: [['ist'], ['heisst']], insertions: true as const })),
      { words: [...prefix, ...comma, 'dass'], endings: [['gemeint', 'ist'], ['gesucht', 'ist']], insertions: true as const },
      { words: [...prefix, ...comma, 'dass', 'es', 'sich', 'um'], endings: [['handelt']], insertions: true as const },
    ])),
  ...[['ich', 'tippe', 'nicht', 'auf'], ['ich', 'denke', 'nicht', 'an']].map(words =>
    ({ words, negated: true as const, contrastPreposition: words.at(-1)!, insertions: true as const })),
];

export const COMMON_NAMING_FRAMES: readonly NamingFrame[] = NAMING_FRAMES.flatMap(frame => [
  { ...frame, insertions: true as const },
  ...(frame.words[0] === 'ich' && frame.words.length > 1 ? FRONTINGS.map(front => ({
    ...frame, words: [...front, frame.words[1]!, 'ich', ...frame.words.slice(2)], insertions: true as const,
  })) : []),
]);

export const POST_NAMING_FRAMES: readonly (readonly string[])[] = NAMING_SUBJECTS.flatMap(subject =>
  ['ist', 'waere', 'lautet'].map(verb => [verb, ...subject]));

export const CERTAINTY_TAILS: readonly (readonly string[])[] = [
  ...['denke', 'glaube', 'vermute', 'meine'].flatMap(verb => [[verb, 'ich', 'mal'], [verb, 'ich']]),
  ['wuerde', 'ich', 'sagen'], ['so', 'wuerde', 'ich', 'es', 'nennen'],
  ['wenn', 'ich', 'mich', 'nicht', 'irre'],
  ['wenn', 'ich', 'richtig', 'liege'], ['wenn', 'ich', 'mich', 'richtig', 'erinnere'],
  ...['vorgang', 'prozess'].flatMap(noun => [['so', 'heisst', 'der', noun], ['so', 'wuerde', 'ich', 'den', noun, 'nennen']]),
  ['das', 'waere', 'mein', 'vorschlag'], ['das', 'ist', 'meine', 'antwort', 'dazu'],
];
