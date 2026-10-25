import { ContextContractError, readDataRecord } from '../domain/context-data.ts';
import type { TaskContext } from '../domain/task-context.ts';

/** Explicit material for the fixed M6.02 case, not a simulated state or inferred concentration rule. */
export type OsmosisMaterial = Readonly<{
  cellProfile: 'onion_epidermis';
  cellIntegrity: 'intact';
  observationPhase: 'early_water_loss_after_solution_change';
  waterPotential: Readonly<{ unit: 'Pa'; vacuole: number; cytosol: number; external: number }>;
  waterPermeability: Readonly<{ cellMembrane: true; tonoplast: true }>;
  sucroseRetention: 'largely_retained';
  otherTransport: 'excluded';
}>;

function hasFields(value: Readonly<Record<string, unknown>>, keys: readonly string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

/** The evaluator calls this after P01b snapshot validation. No defaults, computations or renderer lookups. */
export function supportsOsmosisContext(context: TaskContext): boolean {
  try {
    const material = readDataRecord(context.material);
    if (Object.keys(readDataRecord(context.modelState)).length !== 0) return false;
    if (!hasFields(material, ['cellProfile', 'cellIntegrity', 'observationPhase', 'waterPotential', 'waterPermeability', 'sucroseRetention', 'otherTransport'])) return false;
    if (material['cellProfile'] !== 'onion_epidermis' || material['cellIntegrity'] !== 'intact'
      || material['observationPhase'] !== 'early_water_loss_after_solution_change'
      || material['sucroseRetention'] !== 'largely_retained' || material['otherTransport'] !== 'excluded') return false;
    const potential = readDataRecord(material['waterPotential']);
    const permeability = readDataRecord(material['waterPermeability']);
    if (!hasFields(potential, ['unit', 'vacuole', 'cytosol', 'external']) || potential['unit'] !== 'Pa'
      || !['vacuole', 'cytosol', 'external'].every((key) => typeof potential[key] === 'number' && Number.isFinite(potential[key]))) return false;
    if (!((potential['vacuole'] as number) > (potential['cytosol'] as number) && (potential['cytosol'] as number) > (potential['external'] as number))) return false;
    return hasFields(permeability, ['cellMembrane', 'tonoplast']) && permeability['cellMembrane'] === true && permeability['tonoplast'] === true;
  } catch (error) {
    if (error instanceof ContextContractError) return false;
    throw error;
  }
}
