/** Only M6.02/process. Never interpolates pupil text or confirms the other two fields. */
export const OSMOSIS_FEEDBACK = Object.freeze({
  OSMOSIS_CORRECT: 'Der Wassertransport durch die selektive Grenze heißt hier Osmose. Das bestätigt die Benennung, nicht die übrigen Teilantworten.',
  OSMOSIS_TYPO: 'Gemeint ist Osmose. Diese eindeutig zugeordnete Schreibvariante ändert die richtige Benennung des Wassertransportvorgangs nicht.',
  OSMOSIS_PARTIAL_DIFFUSION: 'Diffusion ist der übergeordnete Zusammenhang. Ergänze den speziellen Namen für den Wassertransport durch die selektive Membran.',
  OSMOSIS_PARTIAL_WATER: 'Du benennst Wasserbewegung oder Wassertransport. Ergänze den speziellen Namen des Vorgangs durch die selektive Membran.',
  OSMOSIS_WRONG_ACTIVE: 'Hier wird Wasser nicht durch einen aktiven, energiegekoppelten Transport befördert. Gesucht ist der passive Wassertransport durch die selektive Grenze.',
  OSMOSIS_WRONG_ENDOCYTOSIS: 'Endocytose bezeichnet eine vesikuläre Aufnahme. Der beschriebene Wassertransport durch die durchlässigen Membranen ist keine Endocytose.',
  OSMOSIS_WRONG_EXOCYTOSIS: 'Exocytose bezeichnet die Abgabe durch Vesikelfusion. Das ist nicht der beschriebene Wassertransport durch die selektive Grenze.',
  OSMOSIS_WRONG_PLASMOLYSIS: 'Plasmolyse beschreibt die Zellreaktion auf Wasserverlust, nicht den Namen des eigentlichen Wassertransportvorgangs. Unterscheide Transport und Zellfolge.',
  OSMOSIS_NEGATED: 'Du verneinst Osmose als gesuchten Vorgang. Unter den ausdrücklich gegebenen Bedingungen heißt der Wassertransport Osmose.',
  OSMOSIS_FALSE_PROPERTY: 'Osmose gehört hier zur passiven Wasserbewegung und zum übergeordneten Zusammenhang der Diffusion. Diese Eigenschaft zu verneinen ist fachlich falsch.',
  OSMOSIS_CONTRADICTION: 'Deine Aussagen bestätigen und verneinen denselben Vorgang oder eine seiner geprüften Eigenschaften. Gib eine widerspruchsfreie Benennung an.',
  OSMOSIS_COMPETING: 'Du nennst mehrere unterschiedliche Begriffe ohne eindeutige Entscheidung. Benenne nur den hier gefragten Wassertransportvorgang.',
  OSMOSIS_NO_NAME: 'Die Abgrenzung oder allgemeine Beschreibung ist noch keine eindeutige Benennung dieses Wassertransportvorgangs. Gib den speziellen Namen an.',
  OSMOSIS_UNASSESSED: 'Die Formulierung oder ein relevanter Zusatz lässt sich in diesem Benennungsfeld nicht vollständig prüfen. Präzisiere die Benennung; ungeprüfte Aussagen werden nicht bestätigt.',
  OSMOSIS_EMPTY: 'Trage den Namen des Wassertransportvorgangs ein oder nutze die Hilfe. Es liegt noch keine bewertbare Antwort vor.',
  OSMOSIS_TECHNICAL_INPUT: 'Die Eingabe hat kein unterstütztes Textformat. Sie wird nicht fachlich bewertet; der ursprüngliche Text muss erhalten bleiben.',
  OSMOSIS_TOO_LONG: 'Die vollständige Eingabe überschreitet die technische Grenze von 4096 Zeichen. Kein gekürzter Anfang wird bewertet. Antworte bitte auf die einzelne Benennungsfrage.',
  OSMOSIS_WRONG_FIELD: 'Diese Auswertung gilt ausschließlich für M6.02/process. Andere Aufgaben und die Felder direction und volume werden hier nicht fachlich bewertet.',
  OSMOSIS_VERSION: 'Aufgaben-, Rubrik-, Inhalts- oder Modellversion passt nicht zu dieser Korrektorfassung. Es ist eine neue passende Prüfung nötig, kein fachlicher Fehlversuch.',
  OSMOSIS_CONTEXT: 'Der Kontext bestätigt die fachlichen Voraussetzungen von M6.02 nicht vollständig. Prüfe Zellprofil, Phase, Wasserpotenziale und Membranbedingungen; es erfolgt keine fachliche Bewertung.',
});
export type OsmosisFeedbackCode = keyof typeof OSMOSIS_FEEDBACK;
export function getOsmosisFeedback(code: string): string {
  if (!Object.hasOwn(OSMOSIS_FEEDBACK, code)) throw new Error('Unknown osmosis feedback code.');
  return OSMOSIS_FEEDBACK[code as OsmosisFeedbackCode];
}
