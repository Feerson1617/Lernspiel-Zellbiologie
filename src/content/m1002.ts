import { createTaskContext, parseTaskContext } from '../domain/task-context.ts';
import { snapshotContextData } from '../domain/context-data.ts';
import { M1001_ROWS } from './m1001.ts';
export const M1002_VERSIONS = Object.freeze({ taskVersion:'M10.02@1', rubricVersion:'M10.02.C01-C03@1.0.0', contentVersion:'m1002-content/1.0.0', modelVersion:'m1002-diagram/1.0.0' });
export const M1002_POINTS = Object.freeze(M1001_ROWS.map(r=>Object.freeze({ x:r.concentration.replace(',','.'), y:r.expected })));
const material = Object.freeze({ source:'didactic_not_measured', coordinateContract:'coordinate-decimal/1.0.0', points:M1002_POINTS, xTolerance:'0.005', yTolerance:'0.2' });
export function createM1002Context(instanceId: string) {
  return createTaskContext({ taskId:'M10.02', ...M1002_VERSIONS, instanceId, phase:'explain', seed:'fixed/1', material, modelState:{} });
}
export function validateM1002Context(input: unknown) {
  const c = parseTaskContext(input);
  if (c.taskId!=='M10.02' || c.phase!=='explain' || c.seed!=='fixed/1' || Object.keys(c.modelState).length
    || Object.entries(M1002_VERSIONS).some(([k,v])=>c[k as keyof typeof M1002_VERSIONS]!==v)
    || snapshotContextData(c.material).json!==snapshotContextData(material).json) throw new Error('Unvalidated diagram material or version.');
  return c;
}
