import { createTaskContext, parseTaskContext } from '../domain/task-context.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { ContextContractError, snapshotContextData } from '../domain/context-data.ts';
import { requireProgressLabel } from '../domain/progress.ts';
import { M603_VERSIONS } from '../domain/m603-contract.ts';

export const M603_CASES = Object.freeze([
  Object.freeze({ id: 'water-loss-a', title: 'Materialfall A', vacuole: -120_000, cytosol: -300_000, external: -700_000 }),
  Object.freeze({ id: 'water-loss-b', title: 'Materialfall B', vacuole: -200_000, cytosol: -450_000, external: -900_000 }),
] as const);

function material(index: number) {
  const item = M603_CASES[index];
  if (!item) throw new ContextContractError('INVALID_DATA');
  return {
    caseId: item.id, cellProfile: 'onion_epidermis', cellIntegrity: 'intact',
    observationPhase: 'early_water_loss_after_solution_change',
    waterPotential: { unit: 'Pa', vacuole: item.vacuole, cytosol: item.cytosol, external: item.external, includesPressure: true },
    waterPermeability: { cellMembrane: true, tonoplast: true },
    sucroseRetention: 'largely_retained', otherTransport: 'excluded',
    detachment: 'possible_not_observed', wall: 'comparatively_stable',
  } as const;
}
export type M603Material = ReturnType<typeof material>;
export function createM603Context(index: number, instanceKey: string): TaskContext {
  requireProgressLabel(instanceKey);
  const data = material(index), instanceId = `${instanceKey}:${data.caseId}`;
  requireProgressLabel(instanceId);
  return createTaskContext({ ...M603_VERSIONS, taskId: 'M6.03', instanceId,
    seed: `${data.caseId}/1.0.0`, phase: 'explain', material: data, modelState: {} });
}

/** Exact finite static cases, including every biological assumption. Rehash first. */
export function readM603Material(input: unknown): M603Material {
  const context = parseTaskContext(input);
  const index = M603_CASES.findIndex(item => item.id === context.material['caseId']);
  if (context.taskId !== 'M6.03' || context.phase !== 'explain' || index < 0
    || Object.entries(M603_VERSIONS).some(([key, value]) => context[key as keyof typeof M603_VERSIONS] !== value)
    || context.seed !== `${M603_CASES[index]!.id}/1.0.0` || Object.keys(context.modelState).length
    || snapshotContextData(context.material).json !== snapshotContextData(material(index)).json) {
    throw new ContextContractError('INVALID_DATA');
  }
  return context.material as unknown as M603Material;
}
