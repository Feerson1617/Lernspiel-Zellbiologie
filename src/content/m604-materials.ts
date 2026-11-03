import { createTaskContext, parseTaskContext } from '../domain/task-context.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { snapshotContextData } from '../domain/context-data.ts';
import { requireProgressLabel } from '../domain/progress.ts';
import { M604_CASE_IDS, M604_VERSIONS } from '../domain/m604-contract.ts';
import type { M604CaseId } from '../domain/m604-contract.ts';

const records = {
  recovery: {
    treatmentVolume: [[100,61,89], [100,64,91], [100,60,86]], treatmentDetached: [[0,8,2], [0,7,1], [0,8,3]],
    controlVolume: [[100,99,100], [100,101,100], [100,100,99]], controlDetached: [[0,0,0], [0,0,0], [0,0,0]],
  },
  limited: {
    treatmentVolume: [[100,58,60], [100,63,65], [100,60,61]], treatmentDetached: [[0,8,8], [0,7,7], [0,8,8]],
    controlVolume: [[100,100,99], [100,99,100], [100,101,100]], controlDetached: [[0,0,0], [0,0,0], [0,0,0]],
  },
} as const;
function material(caseId: M604CaseId) {
  if (!M604_CASE_IDS.includes(caseId)) throw new Error('Unknown investigation case.');
  return {
    materialVersion: 'm604-observations/1.0.0', caseId, source: 'new_didactic_static_data', cellProfile: 'onion_epidermis',
    initialIntegrity: 'intact', laterIntegrity: 'not_measured', initialTurgor: 'positive_qualitative', wall: 'comparatively_stable',
    waterLossPotential: 'vacuole_gt_cytosol_gt_external_including_pressure',
    waterPermeability: { cellMembrane: true, tonoplast: true }, sucrose: 'largely_retained_in_observation_window',
    returnPotential: 'not_measured', returnExchangeCompleteness: 'not_measured', otherTransport: 'not_inferred',
    markedCellsPerField: 10, pairedRuns: 3, repeats: 'technical_from_one_onion',
    timesMinutes: [0,6,12], treatmentSequence: ['water','sucrose','water'], controlSequence: ['water','water','water'],
    measurement: 'mean_relative_protoplast_volume_from_hypothetical_image_stacks', volumeUnit: 'percent_of_own_baseline', uncertaintyPercentagePoints: 4,
    vacuoleAfterSucrose: 'smaller', wallChange: 'none_detected', records: records[caseId],
  } as const;
}
export type M604Material = ReturnType<typeof material>;
export function createM604Context(caseId: M604CaseId, instanceKey: string): TaskContext {
  requireProgressLabel(instanceKey);
  return createTaskContext({ taskId: 'M6.04', ...M604_VERSIONS, instanceId: `${instanceKey}/${caseId}`, seed: `${caseId}/1.0.0`,
    phase: 'explain', material: material(caseId), modelState: {} });
}
export function readM604Material(input: unknown): M604Material {
  const context = parseTaskContext(input), caseId = context.material['caseId'] as M604CaseId;
  if (context.taskId !== 'M6.04' || context.phase !== 'explain' || !M604_CASE_IDS.includes(caseId)
    || Object.entries(M604_VERSIONS).some(([key, value]) => context[key as keyof typeof M604_VERSIONS] !== value)
    || context.seed !== `${caseId}/1.0.0` || Object.keys(context.modelState).length
    || snapshotContextData(context.material).json !== snapshotContextData(material(caseId)).json) throw new Error('Invalid or outdated investigation material.');
  return context.material as unknown as M604Material;
}
