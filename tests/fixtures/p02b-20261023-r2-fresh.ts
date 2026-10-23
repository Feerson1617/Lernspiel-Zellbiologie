import type { SuppliedCase } from './p02b-20261023-cases.ts';

// Self-check, fixed before the first execution and before this revision's code edits.
// Each sentence answers only M6.02/process; no direction, volume or causal claim.
const short = [
  'Für die Bezeichnung dieses Vorgangs würde ich das Wort Osmose verwenden.',
  'Ich würde meine Antwort mit dem Begriff Osmose formulieren.',
  'Bei der Benennung entscheide ich mich für Osmose.',
  'Hier gebe ich als gesuchten Namen Osmose an.',
  'Den dargestellten Prozess würde ich als Osmose benennen.',
  'Ich beantworte diese Teilfrage mit dem Fachbegriff Osmose.',
  'Die passende Benennung für diesen Transport wäre Osmose.',
  'Als meinen Lösungsvorschlag trage ich hier Osmose ein.',
  'Ich wähle für die Benennung dieses Wassertransports Osmose.',
  'Der Begriff Osmose passt hier als Antwort.',
  'Meine Antwort zu dieser Teilfrage wäre das Wort Osmose.',
  'Ich möchte hier Osmose als Bezeichnung verwenden.',
  'Ich würde den Namen Osmose für diesen Prozess wählen.',
  'Diesen Wassertransport benenne ich mit Osmose.',
  'Hier würde ich den gesuchten Vorgang Osmose nennen.',
  'Mit dem Begriff Osmose würde ich hier antworten.',
  'Die Benennung, die ich hier wählen würde, ist Osmose.',
  'Ich würde als Bezeichnung dieses Wassertransports Osmose eintragen.',
  'Osmose wäre meine Antwort auf diese Teilfrage.',
  'Als passende Bezeichnung fällt mir hier Osmose ein.',
  'Ich denke, der beschriebene Prozess lässt sich Osmose nennen.',
  'Ich würde sagen, die gesuchte Bezeichnung lautet Osmose.',
  'Ich gebe hier den Fachausdruck Osmose als Antwort an.',
  'Das Wort Osmose würde ich für die Benennung nehmen.',
  'Für diesen Wassertransport passt die Bezeichnung Osmose.',
  'Ich würde bei dieser Benennung den Namen Osmose angeben.',
  'Ich schlage für den dargestellten Vorgang die Bezeichnung Osmose vor.',
  'Ich würde meine Lösung hier Osmose nennen.',
  'Meine Wahl für den Namen dieses Vorgangs ist Osmose.',
  'Osmose ist hier das Wort, mit dem ich antworten würde.',
  'Ich möchte diese Frage mit Osmose beantworten.',
  'Ich halte Osmose für den passenden Namen dieses Vorgangs.',
  'Den Wassertransport bezeichne ich hier mit dem Wort Osmose.',
  'Als Fachnamen würde ich für diesen Prozess Osmose nennen.',
  'Ich nehme hier Osmose als meinen Lösungsvorschlag.',
  'Die Bezeichnung für diesen Prozess müsste Osmose lauten.',
  'Ich würde für diesen Wassertransport bei der Bezeichnung Osmose bleiben.',
  'Ich würde meine Antwort hier mit Osmose angeben.',
  'Der Ausdruck Osmose passt für die Benennung dieses Vorgangs.',
  'Ich würde auf diese Teilfrage mit Osmose antworten.',
] as const;

export const FOURTH_FRESH: readonly SuppliedCase[] = short.map((text, i) => ({
  id: `r2-fresh-short-${i + 1}`, group: 'fresh-short', field: 'osmosis', text, expected: ['correct'],
}));
export const FOURTH_METAMORPHIC: readonly SuppliedCase[] = short.flatMap((text, i) => [
  ...['Endocytose', 'Exocytose', 'Plasmolyse', 'aktiven Transport'].map((term, j): SuppliedCase => ({
    id: `r2-fresh-wrong-${i + 1}-${j + 1}`, group: 'fresh-wrong', field: 'osmosis',
    text: text.replace('Osmose', term), expected: ['incorrect'],
  })),
  { id: `r2-fresh-partial-${i + 1}`, group: 'fresh-partial', field: 'osmosis', text: text.replace('Osmose', 'Diffusion'), expected: ['partial'] },
  { id: `r2-fresh-alternative-${i + 1}`, group: 'fresh-alternative', field: 'osmosis', text: text.replace('Osmose', 'Osmose oder Exocytose'), expected: ['clarify'] },
  { id: `r2-fresh-contradiction-${i + 1}`, group: 'fresh-contradiction', field: 'osmosis', text: `${text} Osmose ist keine Diffusion.`, expected: ['incorrect'] },
  { id: `r2-fresh-unassessed-${i + 1}`, group: 'fresh-unassessed', field: 'osmosis', text: `${text} Alle Organellen sind Zellwände.`, expected: ['clarify'] },
]);
