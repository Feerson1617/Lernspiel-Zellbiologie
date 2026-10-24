import type { Status } from '../domain/contracts.ts';
import type { NamingTaskId } from '../domain/naming-contract.ts';

export interface NamingConcept {
  readonly id: string;
  readonly status: Status;
  readonly names: readonly string[];
}
/** Finite concept vocabulary derived from the unchanged C01 rubrics, not a sentence corpus. */
const tone: readonly NamingConcept[] = [
  { id: 'target', status: 'correct', names: ['Tonoplast', 'Tonoplasten', 'Vakuolenmembran', 'Vakuolen-Membran', 'Vakuolen Membran'] },
  { id: 'membrane', status: 'partial', names: ['Membran', 'Hülle', 'Vakuolenhülle', 'innere Grenze', ...['Membran', 'Hülle', 'Grenze'].flatMap(n => [`${n} der Vakuole`, `${n} um die Vakuole`])] },
  { id: 'cell_wall', status: 'incorrect', names: ['Zellwand'] },
  { id: 'cell_boundary', status: 'incorrect', names: ['Zellmembran', 'Plasmamembran', 'Plasmalemma'] },
  { id: 'nuclear', status: 'incorrect', names: ['Kernhülle', 'Kernmembran', 'Membran um den Zellkern', 'Membran des Zellkerns'] },
  { id: 'space', status: 'incorrect', names: ['Vakuole', 'Vakuolenraum', 'Vakuoleninnere'] },
  { id: 'nucleus', status: 'incorrect', names: ['Zellkern'] },
];
const osmosis: readonly NamingConcept[] = [
  { id: 'target', status: 'correct', names: ['Osmose'] },
  { id: 'diffusion', status: 'partial', names: ['Diffusion', 'Diffusion von Wasser', 'Diffusion des Wassers'] },
  { id: 'transport', status: 'partial', names: ['Wassertransport', 'Transport von Wasser', 'Wasserbewegung', 'Bewegung von Wasser', 'passiver Transport', 'passiver Wassertransport', 'passive Wasserbewegung'] },
  { id: 'plasmolysis', status: 'incorrect', names: ['Plasmolyse'] },
  { id: 'active', status: 'incorrect', names: ['aktiver Transport', 'aktiver Wassertransport', 'aktive Pumpe', 'ATP-Pumpe'] },
  { id: 'endo', status: 'incorrect', names: ['Endocytose', 'Endozytose'] },
  { id: 'exo', status: 'incorrect', names: ['Exocytose', 'Exozytose'] },
];
export const NAMING_CONCEPTS = Object.freeze({ 'Z1.02': Object.freeze(tone.map(c => Object.freeze({ ...c, names: Object.freeze(c.names) }))), 'M6.02': Object.freeze(osmosis.map(c => Object.freeze({ ...c, names: Object.freeze(c.names) }))) });
export const NAMING_SPELLINGS: Readonly<Record<NamingTaskId, readonly string[]>> = Object.freeze({ 'Z1.02': Object.freeze([]), 'M6.02': Object.freeze(['Osmosse', 'Osmosee', 'Ossmose', 'Osmsoe']) });
