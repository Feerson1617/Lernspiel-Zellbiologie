import type { Status } from '../../src/domain/contracts.ts';
export interface OsmosisRevisionCase { readonly id: string; readonly input: string; readonly expected: Status; readonly reason: string }
const cases = (prefix: string, expected: Status, reason: string, inputs: readonly string[]): OsmosisRevisionCase[] =>
  inputs.map((input, i) => ({ id: `${prefix}${String(i + 1).padStart(2, '0')}`, input, expected, reason }));

/** Exactly the supplied examples, not a reconstruction of the undisclosed external corpus. */
export const OSMOSIS_REVIEW_CASES = [
  ...cases('RV-C', 'correct', 'Übermittelter Gegenprüffall: klarer Vorgangsname mit harmlosem Benennungs- oder Unsicherheitsrahmen.', [
    'Die Antwort ist Osmose.', 'Das nennt man Osmose.', 'Ich tippe auf Osmose.',
    'Ich denke an Osmose.', 'Osmose, denke ich mal.', 'Das ist wohl Osmose.',
    'Der Begriff lautet Osmose.', 'Die richtige Bezeichnung ist Osmose.',
    'Den Vorgang nennt man Osmose.', 'Der Transport wird Osmose genannt.',
    'Das Wort dafür ist Osmose.', 'Die gesuchte Transportart ist Osmose.',
    'Ich würde auf Osmose tippen.', 'Der Name lautet Osmose.',
  ]),
  ...cases('RV-W', 'incorrect', 'Übermittelter Gegenprüffall: falsche Benennung oder ausdrückliche falsche Klassifikation/Gleichsetzung.', [
    'Das heißt Plasmolyse.', 'Die richtige Antwort lautet Endocytose.', 'Eine ATP-Pumpe.',
    'Die Osmose ist eine Form des aktiven Transports.', 'Osmose ist ein anderer Name für Plasmolyse.',
  ]),
] as const;

/** Additional short natural answers. Includes decisions, personal hypotheses, conversational
 * particles, subordinate naming and afterthoughts; not just swapping nouns in the 14 examples. */
export const OSMOSIS_NEW_SHORT = cases('NS', 'correct', 'Neue kurze Antwort benennt Osmose eindeutig; kein konkurrierender Name oder biologischer Zusatz.', [
  'Ich würde Osmose sagen.',
  'Für mich ist das Osmose.',
  'Ich halte das für Osmose.',
  'Ich vermute, dass es Osmose ist.',
  'Mir fällt Osmose ein.',
  'Meine Vermutung ist Osmose.',
  'Als Antwort würde ich Osmose angeben.',
  'Auf Osmose würde ich mich festlegen.',
  'Als Fachbegriff passt Osmose.',
  'Hier würde ich von Osmose sprechen.',
  'Mir kommt Osmose in den Sinn.',
  'Ich nehme Osmose als Antwort.',
  'Mein Vorschlag: Osmose.',
  'Ich nenne als Vorgang Osmose.',
  'Das müsste wohl Osmose sein.',
  'Vermutlich nennt man das Osmose.',
  'Meine Wahl fällt auf Osmose.',
  'Es dürfte Osmose sein.',
  'Das wäre dann Osmose.',
  'Da würde ich Osmose nennen.',
  'Die Lösung lautet wohl Osmose.',
  'Ich bin für Osmose.',
  'Am ehesten würde ich Osmose sagen.',
  'Ich nehme an, es ist Osmose.',
  'Das ist, glaube ich, Osmose.',
  'Osmose, würde ich sagen.',
  'Osmose, wenn ich mich nicht irre.',
  'Ich glaube mal, das ist Osmose.',
  'Ich meine hier Osmose.',
  'Ich denke, gemeint ist Osmose.',
  'Ich komme auf Osmose.',
  'Spontan würde ich Osmose sagen.',
  'Osmose wäre meine Antwort.',
  'Osmose, so würde ich es nennen.',
  'Ich wähle Osmose.',
  'Meine Antwort wäre Osmose.',
  'Ich tendiere zu Osmose.',
  'Osmose ist meine Vermutung.',
  'Ich würde hier Osmose antworten.',
  'Ich sage Osmose.',
]);

/** Same newly introduced frames, with false concepts. No runtime answer whitelist. */
export const OSMOSIS_NEW_WRONG: readonly OsmosisRevisionCase[] = OSMOSIS_NEW_SHORT.slice(0, 10).flatMap((f, i) =>
  ['aktiver Transport', 'Endocytose', 'Exocytose', 'Plasmolyse'].map((term, j) => ({
    id: `NW${i + 1}-${j + 1}`, input: f.input.replace('Osmose', term), expected: 'incorrect',
    reason: 'Derselbe neue Benennungsrahmen muss den bekannten falschen Vorgang mit konkretem Gegenbeleg erkennen.',
  })));
export const OSMOSIS_NEW_UNCERTAIN = [
  ...cases('NP', 'partial', 'Dokumentierter übergeordneter oder unvollständiger Teilansatz trotz neuem Satzrahmen.', [
    'Die Antwort ist Diffusion.', 'Das nennt man Wassertransport.', 'Ich tippe auf Wasserbewegung.',
    'Für mich ist das Diffusion.', 'Mir fällt Wassertransport ein.', 'Mein Vorschlag: Wasserbewegung.',
  ]),
  ...cases('NA', 'clarify', 'Unentschiedene Benennung, unklarer Negationsbereich oder unbekannter relevanter Zusatz bleibt ungeklärt.', [
    'Ich tippe auf Osmose oder Plasmolyse.', 'Die Antwort ist Osmose und Endocytose.',
    'Mir fällt Osmose oder aktiver Transport ein.', 'Meine Wahl fällt auf Osmose oder Exocytose.',
    'Das ist wohl Osmose, aber die Zellwand transportiert Wasser aktiv.',
    'Ich sage Osmose, weil alle Membranen Energie herstellen.',
    'Osmose wäre meine Antwort, wenn Zucker alles zerdrückt.',
    'Nicht Osmose und nicht Diffusion.', 'Eine Pumpe.', 'Osmose, denke ich niemals.',
  ]),
];
export const OSMOSIS_NEW_NEGATION = [
  ...cases('NC', 'correct', 'Explizite korrigierende Benennung oder zutreffende Abgrenzung des Wassertransportvorgangs.', [
    'Die Antwort ist nicht Plasmolyse, sondern Osmose.',
    'Ich tippe nicht auf Endocytose, sondern auf Osmose.',
    'Nicht aktiver Transport, die Antwort ist Osmose.',
    'Das nennt man nicht Exocytose, sondern Osmose.',
    'Der Name lautet nicht Plasmolyse, sondern Osmose.',
    'Den Vorgang nennt man nicht Endocytose, sondern Osmose.',
    'Die Osmose ist keine Form des aktiven Transports.',
    'Osmose ist keine ATP-Pumpe.',
    'Osmose ist eine Form des passiven Transports.',
    'Die richtige Bezeichnung ist Osmose und nicht Plasmolyse.',
  ]),
  ...cases('NI', 'incorrect', 'Die gefragte Benennung oder eine bekannte Eigenschaft wird sicher verneint bzw. falsch festgelegt.', [
    'Die Antwort ist nicht Osmose.', 'Das nennt man nicht Osmose.',
    'Der Begriff lautet nicht Osmose, sondern Plasmolyse.',
    'Das Wort dafür ist nicht Osmose, sondern aktiver Transport.',
    'Osmose ist keine Form der Wasserbewegung.',
    'Osmose ist eine Form der Endocytose.',
  ]),
  ...cases('NU', 'clarify', 'Negationsbereich oder zeitliche Korrektur ist nicht sicher gebunden; keine erfundene Entscheidung.', [
    'Die Antwort ist nicht Osmose oder Plasmolyse.',
    'Ich denke an Osmose und nicht Diffusion.',
    'Erst dachte ich an Plasmolyse, jetzt vielleicht Osmose.',
    'Nicht Plasmolyse und Osmose wäre meine Antwort.',
  ]),
];

/** Correct biological statements outside free-essay scope stay in the denominator here. */
export const OSMOSIS_NEW_STRESS: readonly OsmosisRevisionCase[] = [
  ...cases('SC', 'correct', 'Eindeutiger Name und vollständig verstandene weitere Benennung/Eigenschaft/Abgrenzung.', [
    'Die Antwort ist Osmose. Osmose ist kein aktiver Transport.',
    'Das nennt man Osmose. Osmose ist Diffusion von Wasser.',
    'Ich tippe auf Osmose. Osmose ist keine Plasmolyse.',
    'Die Osmose ist eine Form des passiven Transports und Osmose ist nicht Exocytose.',
    'Der Begriff lautet Osmose. Den Vorgang nennt man Osmose.',
    'Mir fällt Osmose ein. Osmose ist Wassertransport.',
  ]),
  ...cases('SB', 'clarify', 'Fachlich richtige breitere Antwort mit hier ausdrücklich ungeprüftem Richtungs-, Volumen- oder allgemeinem Erklärungsinhalt.', [
    'Osmose: Wasser bewegt sich netto aus der Zelle in die Außenlösung.',
    'Osmose. In dieser Phase nimmt das Vakuolenvolumen ab.',
    'Ich nenne Osmose. Der Tonoplast ist für Wasser durchlässig.',
    'Der Vorgang heißt Osmose; die Saccharose wird weitgehend zurückgehalten.',
  ]),
];

export const OSMOSIS_CONTRADICTIONS: readonly OsmosisRevisionCase[] = OSMOSIS_NEW_SHORT.slice(0, 25).flatMap((f, i) => [
  'Die Antwort ist nicht Osmose.', 'Osmose ist aktiver Transport.',
  'Osmose ist Plasmolyse.', 'Osmose ist keine Diffusion.',
].map((suffix, j) => ({ id: `CX${i + 1}-${j + 1}`, input: `${f.input} ${suffix}`, expected: 'incorrect',
  reason: 'Eine richtige Anfangsantwort hebt einen späteren sicheren Widerspruch oder Fachfehler nicht auf.',
})));

export const OSMOSIS_REVISION_CASES: readonly OsmosisRevisionCase[] = [
  ...OSMOSIS_REVIEW_CASES, ...OSMOSIS_NEW_SHORT, ...OSMOSIS_NEW_WRONG, ...OSMOSIS_NEW_UNCERTAIN,
  ...OSMOSIS_NEW_NEGATION, ...OSMOSIS_NEW_STRESS, ...OSMOSIS_CONTRADICTIONS,
];
