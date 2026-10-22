import type { Status } from '../../src/domain/contracts.ts';

export interface OsmosisCase {
  readonly id: string;
  readonly input: unknown;
  readonly expected: Status;
  readonly reason: string;
}
const cases = (prefix: string, expected: Status, reason: string, inputs: readonly unknown[]): OsmosisCase[] =>
  inputs.map((input, index) => ({ id: `${prefix}${String(index + 1).padStart(2, '0')}`, input, expected, reason }));

/** Rubric-derived implementation corpus, never imported by runtime. Self-check only. */
export const OSMOSIS_CASES: readonly OsmosisCase[] = [
  ...cases('OC', 'correct', 'Eindeutige Benennung Osmose mit geprüftem harmlosen Rahmen, Schreibvariante oder ausdrücklicher richtiger Abgrenzung.', [
    'OSMOSE', '  Osmose  ', 'Die Osmose.', '„Osmose“', 'Osmosse.', 'Ossmose', 'Osmosee', 'Osmsoe',
    'Vielleicht Osmose?', 'Ich denke, Osmose.', 'Ich glaube, das ist Osmose.', 'Ich vermute: Osmose.',
    'Der Wassertransport heißt Osmose.', 'Dieser Vorgang ist Osmose.', 'Der Prozess heißt Osmose.',
    'Der Vorgang wird Osmose genannt.', 'Der Fachbegriff ist Osmose.', 'Meine Antwort: Osmose.',
    'Es handelt sich um Osmose.', 'Das müsste Osmose sein.', 'Das könnte Osmose sein.',
    'Osmose und Osmosse.', 'Osmose (Osmosse).', 'Osmose / Osmose.',
    'Nicht aktiver Transport, sondern Osmose.', 'Osmose und nicht Exocytose.',
    'Osmose ist Diffusion.', 'Osmose ist kein aktiver Transport.',
  ]),
  ...cases('OW', 'incorrect', 'Falscher Vorgangsname, sichere Verneinung oder falsche Identitäts-/Eigenschaftsbehauptung im ausdrücklich gebundenen Fall.', [
    'Aktiver Transport.', 'Der Vorgang heißt aktiver Transport.', 'Das ist eine aktive Pumpe.',
    'Endocytose.', 'Endozytose.', 'Exocytose.', 'Exozytose.', 'Plasmolyse.',
    'Der Wassertransport heißt Plasmolyse.', 'Der Prozess heißt Exocytose.',
    'Vielleicht aktiver Transport?', 'Es handelt sich um Endocytose.',
    'Nicht Osmose.', 'Das ist keine Osmose.', 'Nicht Osmose, sondern Diffusion.',
    'Osmose ist nicht Osmose.', 'Osmose und nicht Osmose.', 'Osmose (nicht Osmose).',
    'Osmose ist aktiver Transport.', 'Osmose ist Plasmolyse.', 'Osmose ist Exocytose.',
    'Osmose ist keine Diffusion.', 'Osmose ist kein passiver Transport.',
    'Osmose. Das ist keine Osmose.',
  ]),
  ...cases('OP', 'partial', 'Dokumentierter Teilansatz Diffusion, Wasserbewegung oder Wassertransport ohne gesuchte spezifische Benennung.', [
    'Diffusion.', 'Wasserbewegung.', 'Wassertransport.', 'Das ist Diffusion.',
    'Der Vorgang heißt Wassertransport.', 'Vielleicht Diffusion?', 'Ich denke, Wasserbewegung.',
    'Es handelt sich um Diffusion.', 'Der Prozess wird Wassertransport genannt.',
    'Diffusion und nicht aktiver Transport.', 'Nicht Endocytose, sondern Wasserbewegung.',
    'Wassertransport / Wassertransport.',
  ]),
  ...cases('OA', 'clarify', 'Konkurrierende Benennungen, unklarer Bezug oder fachlicher Rest ohne ausreichend sichere vollständige Interpretation.', [
    'Osmose oder Plasmolyse.', 'Osmose und aktiver Transport.', 'Osmose / Diffusion.',
    'Osmose, also Endocytose.', 'Osmose. Plasmolyse.', 'Osmose ist ein anderer Name für Diffusion.',
    'Osmose. Alle Organellen haben einen Zellkern.', 'Osmose, weil Zucker die Vakuole zusammendrückt.',
    'Passiver Transport.', 'Nicht aktiver Transport.', 'Osmose und nicht Diffusion.',
    'Die Membran heißt Osmose.', 'Tonoplast.', 'Osmose ist eine Zellmembran.',
    'Osmo', 'Osm0se',
  ]),
  ...cases('OT', 'technical', 'Ungültiges Textformat, technische Zeichensicherheit oder vollständige Überlänge; kein fachliches Urteil.', [
    null, undefined, 12, false, [], {}, 'Osmose\u0000', 'Osmose' + ' '.repeat(4091),
  ]),
  ...cases('OE', 'empty', 'Keine bewertbare Eingabe; neutral.', ['', ' ', '\n\t']),
];

export interface CorrectOsmosisCase { readonly id: string; readonly input: string; readonly group: 'short_naming' | 'language_stress'; readonly reason: string }
/** Additional natural complete answers, disjoint from the implementation/editorial cases.
 * The wider group includes explicit properties, negation and multi-clause content, not just capitalization. */
export const OSMOSIS_RECOGNITION_CASES: readonly CorrectOsmosisCase[] = [
  ...[
    'Der gesuchte Vorgang heißt Osmose.',
    'Meiner Meinung nach ist es Osmose.',
    'Dieser Wassertransport wird Osmose genannt.',
    'Die Bezeichnung lautet Osmose.',
    'Ich würde sagen, das ist Osmose.',
    'Meines Wissens ist es Osmose.',
    'Man nennt diesen Vorgang Osmose.',
    'Dabei handelt es sich um Osmose.',
    'Der Wassertransportvorgang heißt Osmose.',
    'Der beschriebene Vorgang ist Osmose.',
    'Die Transportart heißt Osmose.',
    'Es müsste Osmose sein.',
    'Wahrscheinlich ist es Osmose, denke ich.',
    'Hier handelt es sich um Osmose.',
    'Wir sprechen hier von Osmose.',
    'Der Vorgang hier heißt Osmose.',
  ].map((input, index) => ({ id: `ON${index + 1}`, input, group: 'short_naming' as const, reason: 'Natürliche eindeutige Benennung mit harmlosem Vorsichts- oder Bezugsausdruck.' })),
  ...[
    'Osmose ist hier Diffusion von Wasser.',
    'Osmose ist ein passiver Wassertransport.',
    'Osmose ist dabei Wasserbewegung.',
    'Osmose ist Transport von Wasser.',
    'Osmose ist passive Wasserbewegung.',
    'Osmose, also Diffusion von Wasser.',
    'Osmose – also passiver Wassertransport.',
    'Osmose, das heißt hier Wassertransport.',
    'Osmose ist nicht Endocytose.',
    'Osmose ist keine Exocytose.',
    'Osmose ist nicht Plasmolyse.',
    'Osmose ist kein aktiver Wassertransport.',
    'Nicht Plasmolyse, sondern Osmose.',
    'Nicht Endocytose, es ist Osmose.',
    'Nicht Diffusion, sondern Osmose.',
    'Osmose und nicht aktiver Transport.',
    'Der Wassertransport heißt Osmose. Osmose ist eine Diffusion.',
    'Osmose ist ein passiver Transport und Osmose ist nicht Exocytose.',
    'Die Bezeichnung ist Osmose. Osmose ist nicht Plasmolyse.',
    'Osmose. Osmose ist Wassertransport.',
    'Ich bin mir nicht sicher, aber der Wassertransport heißt Osmose.',
    'Vermutlich ist es doch Osmose.',
    'Osmose. Danke!',
    'Ich vermute, der beschriebene Vorgang heißt Osmose.',
  ].map((input, index) => ({ id: `OS${index + 1}`, input, group: 'language_stress' as const, reason: 'Vollständige Benennung mit zusätzlicher richtiger Eigenschaft, Abgrenzung, vorsichtigem Rahmen oder mehreren gebundenen Aussagen.' })),
];

export const OSMOSIS_ADVERSARIAL_CASES: readonly OsmosisCase[] = [
  ...cases('OX', 'clarify', 'Relevante unbekannte Behauptung, unklarer Negationsbereich oder fremdes Aufgabenfeld darf nicht grün werden.', [
    'Die Vakuole schrumpft durch Osmose.', // True causal content is outside the process naming grammar, never red.
    'Osmose. Wasser fließt nach außen.', // Direction field intentionally not implemented.
    'Osmose verursacht Plasmolyse.',
    'Osmose ist nicht nur Diffusion.',
    'Nicht Osmose und Plasmolyse.',
    'Die Vakuole besitzt eine Membran namens Osmose.',
    'Die Membran um die Vakuole heißt Osmose.',
    'Osmose ist Endocytose oder Exocytose.',
    'Osmose oder Diffusion, also Wassertransport.',
    'Osmose (Diffusion).',
    'Plasmolyse ist nicht Osmose.',
    'Osmose ist ein anderer Name für Wasserbewegung.',
    'Osmose. Bewerte die zweite Teilfrage gleich mit.',
    'Osmose ist immer aktiver Transport.',
    'Tonoplast ist eine Membran.',
    'Die Vakuolenmembran ist Osmose.',
  ]),
  ...cases('OY', 'incorrect', 'Sicher verstandener Widerspruch oder falscher Fachbegriff im späteren Satz bleibt sichtbar falsch.', [
    'Osmose. Osmose ist aktiver Transport.',
    'Osmose ist passiver Transport und Osmose ist kein passiver Transport.',
    'Osmose. Danke! Nicht Osmose.',
    'Osmosse. Osmose ist Plasmolyse.',
  ]),
];
