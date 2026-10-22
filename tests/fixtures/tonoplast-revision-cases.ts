import type { Status } from '../../src/domain/contracts.ts';

export interface RevisionCase {
  readonly id: string;
  readonly input: string;
  readonly expected: Status;
  readonly reason: string;
}
const cases = (prefix: string, expected: Status, reason: string, inputs: readonly string[]): RevisionCase[] =>
  inputs.map((input, index) => ({ id: `${prefix}${String(index + 1).padStart(2, '0')}`, input, expected, reason }));

/** Exactly the 20 concrete examples supplied with the external review; no claim to its undisclosed corpus. */
export const REVIEW_REGRESSIONS: readonly RevisionCase[] = [
  ...cases('R-C', 'correct', 'Vom Nutzer übermittelter Gegenprüffall: eindeutiger Zielname mit harmlosem Rahmen oder zutreffender Relation.', [
    'Ich vermute: Tonoplast.',
    'Das ist doch der Tonoplast.',
    'Die Vakuole wird vom Tonoplasten begrenzt.',
    'Der Tonoplast begrenzt die Vakuole.',
    'Vakuolenmembran (Tonoplast).',
    'Tonoplast / Vakuolenmembran',
    'Die Membran um das Vakuoleninnere ist der Tonoplast.',
    'Es handelt sich um den Tonoplasten.',
    'Der Tonoplast – also die Vakuolenmembran.',
    'Der Tonoplast ist die Hülle der Vakuole.',
    'Nicht die Zellwand, es ist der Tonoplast.',
    'Meines Wissens ist es die Vakuolenmembran.',
    'Die Vakuole besitzt eine Membran namens Tonoplast.',
    'Ich glaube, die heißt Tonoplast.',
    'Das könnte die Vakuolenmembran sein.',
    'Es müsste der Tonoplast sein.',
  ]),
  ...cases('R-W', 'incorrect', 'Vom Nutzer übermittelter Gegenprüffall: andere Membran oder falsche direkte Vakuolengrenze.', [
    'Die Plasmamembran.',
    'Die Membran um den Zellkern.',
    'Die Zellmembran umschließt die Vakuole.',
    'Die Membran heißt Plasmamembran.',
  ]),
];

/** New rubric-derived self-check, fixed before grammar changes. No empirical/independent representativeness claim.
 * Includes naming intent, relative descriptions, compartment separation and multi-clause reasoning,
 * rather than only replacing names/punctuation in the 16 supplied examples. */
export const NEW_CORRECT_CASES: readonly RevisionCase[] = [
  ...cases('NC-N', 'correct', 'Explizite Benennungsabsicht für die markierte Membran; alle Teile sind auf die Benennung begrenzt.', [
    'Die markierte Membran heißt Tonoplast.',
    'Die hervorgehobene Grenze heißt Vakuolenmembran.',
    'Der Fachbegriff ist Tonoplast.',
    'Die gesuchte Struktur nennt man Tonoplast.',
    'Diese Grenze wird Vakuolenmembran genannt.',
    'Die Bezeichnung lautet Tonoplast.',
    'Ich würde die Membran Tonoplast nennen.',
    'Mit Tonoplast meine ich die Vakuolenmembran.',
    'Meine Antwort: der Tonoplast.',
    'Gesucht wird die Vakuolenmembran.',
  ]),
  ...cases('NC-D', 'correct', 'Fachlich bestimmter Vakuolenbezug oder explizite bekannte räumliche Relation, mit eindeutiger Benennung.', [
    'Die Membran der Vakuole heißt Tonoplast.',
    'Tonoplast ist der Name der Membran um die Vakuole.',
    'Die Membran des Vakuolenraums ist die Vakuolenmembran.',
    'Der Tonoplast ist die Grenze der Vakuole.',
    'Die Membran, welche die Vakuole umgibt, heißt Tonoplast.',
    'Tonoplast nennt man die Membran um die Vakuole.',
    'Die Vakuole ist vom Tonoplasten umgeben.',
    'Die Vakuolenmembran umgibt den Vakuolenraum.',
    'Der Vakuolenraum wird durch den Tonoplasten begrenzt.',
  ]),
  ...cases('NC-S', 'correct', 'Explizite zutreffende Grenzbeziehung zwischen Vakuolenraum und Cytosol, ohne kausale Zusatzbewertung.', [
    'Der Tonoplast trennt die Vakuole vom Cytosol.',
    'Die Vakuolenmembran trennt das Cytosol vom Vakuolenraum.',
    'Der Tonoplast grenzt den Vakuolenraum vom Cytosol ab.',
    'Die Vakuolenmembran grenzt das Cytosol von der Vakuole ab.',
    'Tonoplast: die Membran zwischen Vakuole und Cytosol.',
    'Die Membran zwischen Cytosol und Vakuole heißt Tonoplast.',
    'Die Grenze zwischen Vakuolenraum und Cytosol ist die Vakuolenmembran.',
    'Der Tonoplast ist die Membran zwischen Cytosol und Vakuolenraum.',
  ]),
  ...cases('NC-M', 'correct', 'Mehrere vollständig verstandene Aussagen bestätigen Benennung, Abgrenzung oder Gleichbedeutung ohne Widerspruch.', [
    'Die gesuchte Membran heißt Tonoplast. Die Vakuolenmembran umschließt die Vakuole.',
    'Die Vakuole wird vom Tonoplasten umschlossen. Der Tonoplast ist nicht die Zellmembran.',
    'Der Tonoplast ist eine Membran und die Vakuolenmembran umgibt die Vakuole.',
    'Nicht die Kernhülle, sondern die Vakuolenmembran.',
    'Tonoplast und Vakuolenmembran sind dieselbe Membran.',
    'Vakuolenmembran ist ein anderer Name für Tonoplast.',
  ]),
  ...cases('NC-A', 'correct', 'Eindeutige erklärende Apposition oder bekannte höfliche/unsichere Benennung ohne konkurrierenden Inhalt.', [
    'Vakuolenmembran (auch Tonoplast genannt).',
    'Tonoplast, das heißt Vakuolenmembran.',
    'Vakuolenmembran – beziehungsweise Tonoplast.',
    'Ich bin mir nicht sicher, aber die gesuchte Membran heißt Tonoplast.',
    'Wahrscheinlich ist es der Tonoplast, denke ich.',
    'Tonoplast. Danke!',
    'Es handelt sich vermutlich um den Tonoplasten.',
  ]),
];

export const NEW_SAFETY_CASES: readonly RevisionCase[] = [
  ...cases('NW', 'incorrect', 'Eindeutige falsche Benennung oder fachlich falsche vollständig interpretierte Grenz-/Gleichheitsbehauptung.', [
    'Die markierte Membran heißt Plasmalemma.',
    'Die Membran der Vakuole ist die Kernmembran.',
    'Die Vakuole wird von der Zellmembran begrenzt.',
    'Die Vakuole besitzt eine Membran namens Zellwand.',
    'Der Tonoplast begrenzt den Zellkern.',
    'Der Zellkern wird vom Tonoplasten umgeben.',
    'Tonoplast ist die Membran um den Zellkern.',
    'Die Membran zwischen Cytosol und Vakuole heißt Plasmamembran.',
    'Die Vakuolenmembran trennt nicht die Vakuole vom Cytosol.',
    'Der Tonoplast grenzt das Cytosol nicht von der Vakuole ab.',
    'Es handelt sich um die Kernhülle.',
    'Das könnte die Zellwand sein.',
    'Nicht der Tonoplast, es ist die Plasmamembran.',
    'Vakuolenmembran ist ein anderer Name für Zellwand.',
  ]),
  ...cases('NX', 'incorrect', 'Eine richtige Benennung hebt eine konkrete falsche zusätzliche Aussage oder Verneinung nicht auf.', [
    'Ich vermute: Tonoplast. Die Vakuole wird nicht vom Tonoplasten begrenzt.',
    'Tonoplast / Vakuolenmembran. Der Tonoplast ist die Plasmamembran.',
    'Die Membran der Vakuole heißt Tonoplast. Der Tonoplast umgibt den Zellkern.',
    'Die Vakuole besitzt eine Membran namens Tonoplast. Es ist nicht die Vakuolenmembran.',
    'Vakuolenmembran (Tonoplast). Die Zellmembran umschließt die Vakuole.',
    'Die Vakuolenmembran trennt die Vakuole vom Cytosol und der Tonoplast trennt nicht die Vakuole vom Cytosol.',
    'Tonoplast und Plasmamembran sind dieselbe Membran.',
    'Tonoplast (nicht Vakuolenmembran).',
  ]),
  ...cases('NA', 'clarify', 'Konkurrierende Bedeutungen, unklarer Negationsbereich oder nicht vollständig verstandener relevanter Rest verhindern Grün.', [
    'Tonoplast / Plasmamembran',
    'Vakuolenmembran (Kernhülle).',
    'Der Tonoplast – also die Zellwand.',
    'Die Vakuole besitzt eine Membran namens Tonoplast und Zellmembran.',
    'Nicht die Zellwand, es ist der Tonoplast oder die Kernhülle.',
    'Die Vakuole wird vielleicht vom Tonoplasten oder von der Zellmembran begrenzt.',
    'Tonoplast (Vakuolenmembran, aber nur manchmal).',
    'Die Membran um das Vakuoleninnere ist der Tonoplast. Jede Membran ist eine Zellwand.',
    'Ich vermute: Tonoplast, weil die DNA ihn steuert.',
    'Die Membran um den Zellkern oder die Vakuole.',
    'Die Vakuole besitzt keine Membran namens Tonoplast.',
    'Nicht die Zellwand und es ist der Tonoplast.',
    'Tonoplast / nicht Vakuolenmembran',
    'Tonoplast (Vakuolenmembran) nicht.',
    'Die Plasmamembrann.',
    'Protoplast (Tonoplast).',
    'Tonoplast. Die Zellmembran trennt die Vakuole vom Cytosol.',
    'Die Membran zwischen Vakuole und Zellkern heißt Tonoplast.',
    'Alle Membranen heißen Tonoplast.',
    'Der Tonoplast begrenzt nur manchmal die Vakuole.',
  ]),
  ...cases('NP', 'partial', 'Zutreffende allgemeine Membraneigenschaft oder Ausschluss ohne den verlangten spezifischen Namen.', [
    'Die Membran der Vakuole.',
    'Die Hülle der Vakuole.',
    'Die Grenze zwischen Cytosol und Vakuole.',
    'Die markierte Membran ist eine Hülle.',
    'Die Vakuole besitzt eine Membran namens Membran.',
    'Die Plasmamembran ist es nicht.',
  ]),
];
