import { supportsM602CuedContext } from '../assessment/m602-cued.ts';
import type { OsmosisMaterial } from '../assessment/osmosis-context.ts';
import { ContextContractError } from '../domain/context-data.ts';
import { requireProgressLabel } from '../domain/progress.ts';
import { m602CuedVersions } from '../domain/m602-cued-contract.ts';
import { createTaskContext, parseTaskContext } from '../domain/task-context.ts';
import type { TaskContext } from '../domain/task-context.ts';

/** Version of these static, authored states. This is not a simulation release. */
export const M602_PREVIEW_VERSIONS = m602CuedVersions('m602-public-static-material/1.0.0');

/** Public didactic values in Pa, not measurements or imported reference answers.
 * Both cases repeat the same reviewed early-water-loss relationship. Neither is
 * a transfer case, an equilibrium state, or the instant of solution exchange.
 */
export const M602_MATERIAL_CASES = Object.freeze([
  Object.freeze({ id: 'water-loss-a', title: 'Materialfall A', waterPotential: Object.freeze({ unit: 'Pa', vacuole: -120_000, cytosol: -300_000, external: -700_000 }) }),
  Object.freeze({ id: 'water-loss-b', title: 'Materialfall B', waterPotential: Object.freeze({ unit: 'Pa', vacuole: -200_000, cytosol: -450_000, external: -900_000 }) }),
] as const);
export type M602MaterialCaseId = (typeof M602_MATERIAL_CASES)[number]['id'];

/** The caller supplies a session-unique identity; no browser state or RNG here.
 * Keep the returned context to revisit a case with session.activate(...,'return').
 * Re-labelling an already seen material as a new independent case is forbidden
 * by the existing session controller and is not a supported use of this factory.
 */
export function createM602MaterialContext(caseId: M602MaterialCaseId, instanceKey: string): TaskContext {
  const definition = M602_MATERIAL_CASES.find(candidate => candidate.id === caseId);
  if (!definition) throw new ContextContractError('INVALID_ID');
  // Validate before prefixing: whitespace or missing identities are not hidden.
  requireProgressLabel(instanceKey);
  const instanceId = `${instanceKey}:${definition.id}`, seed = `${definition.id}/1.0.0:${instanceKey}`;
  requireProgressLabel(instanceId);
  requireProgressLabel(seed);
  const context = createTaskContext({
    ...M602_PREVIEW_VERSIONS, taskId: 'M6.02', instanceId, seed, phase: 'explain', modelState: {},
    material: {
      cellProfile: 'onion_epidermis', cellIntegrity: 'intact',
      observationPhase: 'early_water_loss_after_solution_change',
      waterPotential: definition.waterPotential,
      waterPermeability: { cellMembrane: true, tonoplast: true },
      sucroseRetention: 'largely_retained', otherTransport: 'excluded',
    } satisfies OsmosisMaterial,
  });
  readM602Material(context);
  return context;
}

/** Read display values from the validated assessment context, never a parallel
 * UI calculation. Returns a frozen snapshot and rejects altered hashes, old
 * contracts, or states outside the existing biological validity boundary.
 */
export function readM602Material(input: unknown): OsmosisMaterial {
  const context = parseTaskContext(input);
  if (!supportsM602CuedContext(context)) throw new ContextContractError('INVALID_DATA');
  return context.material as OsmosisMaterial;
}
