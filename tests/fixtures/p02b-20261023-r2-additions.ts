import type { SuppliedCase } from './p02b-20261023-cases.ts';

// Fixed before these two inputs' first evaluation. The initial 40-sentence
// file remains byte-identical; its two novelty overlaps are reported separately.
export const FOURTH_ADDITIONS: readonly SuppliedCase[] = [
  { id: 'r2-fresh-short-41', group: 'fresh-short', field: 'osmosis', text: 'Für meine Benennung dieses Transports würde ich Osmose als Fachwort nehmen.', expected: ['correct'] },
  { id: 'r2-fresh-short-42', group: 'fresh-short', field: 'osmosis', text: 'Ich würde bei dieser Teilfrage den Fachausdruck Osmose eintragen.', expected: ['correct'] },
];
export const FOURTH_ADDITIONAL_NEGATIVES: readonly SuppliedCase[] = FOURTH_ADDITIONS.flatMap(f => [
  ...['Endocytose', 'Exocytose', 'Plasmolyse', 'aktiven Transport'].map((term, j): SuppliedCase => ({ ...f,
    id: `${f.id}-wrong-${j + 1}`, group: 'fresh-wrong', text: f.text.replace('Osmose', term), expected: ['incorrect'],
  })),
  { ...f, id: `${f.id}-partial`, group: 'fresh-partial', text: f.text.replace('Osmose', 'Diffusion'), expected: ['partial'] },
  { ...f, id: `${f.id}-alternative`, group: 'fresh-alternative', text: f.text.replace('Osmose', 'Osmose oder Exocytose'), expected: ['clarify'] },
  { ...f, id: `${f.id}-contradiction`, group: 'fresh-contradiction', text: `${f.text} Osmose ist keine Diffusion.`, expected: ['incorrect'] },
  { ...f, id: `${f.id}-unassessed`, group: 'fresh-unassessed', text: `${f.text} Alle Organellen sind Zellwände.`, expected: ['clarify'] },
]);
