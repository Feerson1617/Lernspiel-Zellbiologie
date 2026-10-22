/** Only TERM_TONOPLAST messages; no renderer, pupil text interpolation or other rubric. */
export const TONOPLAST_FEEDBACK = Object.freeze({
  TONOPLAST_CORRECT: 'Richtig: Der Tonoplast grenzt den Vakuolenraum vom Cytosol ab.',
  TONOPLAST_TYPO: 'Gemeint ist der Tonoplast beziehungsweise die Vakuolenmembran. Die Benennung der Grenze ist richtig.',
  TONOPLAST_PARTIAL: 'Du benennst eine Grenze, aber noch nicht die gesuchte Vakuolenmembran. Ergänze den passenden Namen.',
  TONOPLAST_EXCLUDED_OTHER: 'Du schließt eine andere Struktur aus. Benenne jetzt die Membran um die Vakuole.',
  TONOPLAST_WRONG_CELL_WALL: 'Die Zellwand ist die feste äußere Hülle der Pflanzenzelle. Gesucht ist die Membran unmittelbar um den Vakuolenraum.',
  TONOPLAST_WRONG_CELL_MEMBRANE: 'Die Zellmembran begrenzt den Protoplasten nach außen. Gesucht ist hier die Membran um die Vakuole.',
  TONOPLAST_WRONG_VACUOLE: 'Die Vakuole ist der Raum. Gesucht ist der Name seiner Membran.',
  TONOPLAST_WRONG_NUCLEAR_ENVELOPE: 'Die Kernhülle umgibt den Zellkern. Gefragt ist die Membran um die Vakuole.',
  TONOPLAST_WRONG_NUCLEUS: 'Der Zellkern ist eine andere Zellstruktur. Gefragt ist die Membran um den Vakuolenraum.',
  TONOPLAST_NEGATED: 'Du schließt den gesuchten Namen aus. Die markierte Membran heißt Tonoplast oder gleichwertig Vakuolenmembran.',
  TONOPLAST_FALSE_SYNONYMY: 'Tonoplast und Vakuolenmembran bezeichnen hier dieselbe Membran. Ihre Gleichbedeutung zu verneinen ist fachlich falsch.',
  TONOPLAST_NOT_BOUNDARY: 'Der Tonoplast ist die Membran um die Vakuole. Er ist damit eine Membrangrenze; diese Eigenschaft wird in deiner Aussage verneint.',
  TONOPLAST_FALSE_ENCLOSURE: 'Der Tonoplast umschließt den Vakuolenraum. Die Aussage, dass er die Vakuole nicht umschließt, widerspricht dieser Zuordnung.',
  TONOPLAST_WRONG_ENCLOSURE: 'Die Zuordnung der direkten Grenze ist falsch: Der Tonoplast umschließt die Vakuole; die Kernhülle umschließt den Zellkern. Die äußere Zellmembran ist nicht die direkte Vakuolengrenze.',
  TONOPLAST_FALSE_SEPARATION: 'Der Tonoplast trennt Vakuolenraum und Cytosol. Diese Grenzbeziehung zu verneinen ist fachlich falsch.',
  TONOPLAST_FALSE_IDENTITY: 'Die gleichgesetzten Strukturen sind nicht dieselbe Grenze. Tonoplast bezeichnet die Vakuolenmembran, nicht eine andere Zellstruktur.',
  TONOPLAST_CONTRADICTION: 'Du bestätigst und verneinst dieselbe Benennung beziehungsweise dieselbe Membranbeziehung. Gib eine widerspruchsfreie Antwort für die markierte Grenze.',
  TONOPLAST_COMPETING: 'Du nennst verschiedene Strukturen ohne eindeutige Zuordnung. Entscheide dich für die Membran um die Vakuole.',
  TONOPLAST_NO_POSITIVE_NAME: 'Du beschreibst einen Unterschied oder eine allgemeine Membran. Daraus wird nicht eindeutig, welchen Namen du der markierten Vakuolenmembran gibst. Nenne diesen Namen direkt.',
  TONOPLAST_UNASSESSED: 'Diese Formulierung oder ihr Zusatz lässt sich in diesem Benennungsfeld nicht vollständig prüfen. Nenne die Membran kurz; der ungeprüfte Teil erhält keine fachliche Zustimmung.',
  TONOPLAST_EMPTY: 'Trage einen Begriff ein oder nutze die Hilfe. Es liegt noch keine bewertbare Antwort vor.',
  TONOPLAST_TECHNICAL_INPUT: 'Die Eingabe hat kein unterstütztes Textformat. Sie wird nicht fachlich bewertet; der ursprüngliche Text muss erhalten bleiben.',
  TONOPLAST_TOO_LONG: 'Die Eingabe überschreitet die technische Grenze von 4096 Zeichen. Es wird kein gekürzter Anfang bewertet. Antworte bitte kurz auf die Benennungsfrage.',
  TONOPLAST_WRONG_FIELD: 'Diese Auswertung ist nur für das Feld term der Aufgabe Z1.02 vorgesehen. Es erfolgt keine fachliche Bewertung.',
  TONOPLAST_VERSION: 'Aufgaben-, Rubrik-, Inhalts- oder Modellfassung passt nicht zu dieser Korrektorfassung. Eine neue passende Prüfung ist erforderlich; dies ist kein fachlicher Fehler.',
  TONOPLAST_CONTEXT: 'Der Kontext bestätigt nicht die für Z1.02 festgelegte Markierung der Vakuolenmembran. Die Materialzuordnung muss geprüft werden; die Antwort wird nicht fachlich bewertet.',
});
export type TonoplastFeedbackCode = keyof typeof TONOPLAST_FEEDBACK;
export function getTonoplastFeedback(code: string): string {
  if (!Object.hasOwn(TONOPLAST_FEEDBACK, code)) throw new Error('Unknown Tonoplast feedback code.');
  return TONOPLAST_FEEDBACK[code as TonoplastFeedbackCode];
}
