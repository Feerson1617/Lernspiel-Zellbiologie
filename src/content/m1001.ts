import { createTaskContext, parseTaskContext } from '../domain/task-context.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { snapshotContextData } from '../domain/context-data.ts';
export const M1001_VERSIONS = Object.freeze({ taskVersion:'M10.01@1', rubricVersion:'M10.01.C01-C05@1.0.0', contentVersion:'m1001-content/1.0.0', modelVersion:'m1001-didactic-mass/1.0.0' });
export const M1001_ROWS = Object.freeze([
  { field:'c0', criterion:'M10.01.C01', concentration:'0,00', initial:'3,00', final:'3,24', expected:'8' },
  { field:'c10', criterion:'M10.01.C02', concentration:'0,10', initial:'3,00', final:'3,09', expected:'3' },
  { field:'c20', criterion:'M10.01.C03', concentration:'0,20', initial:'3,00', final:'2,97', expected:'-1' },
  { field:'c30', criterion:'M10.01.C04', concentration:'0,30', initial:'3,00', final:'2,85', expected:'-5' },
  { field:'c40', criterion:'M10.01.C05', concentration:'0,40', initial:'3,00', final:'2,76', expected:'-8' },
].map(row=>Object.freeze(row)));
const material = Object.freeze({ version:'m1001-material/1.0.0', source:'didactic_not_measured', rows:M1001_ROWS });
export function createM1001Context(instanceId: string): TaskContext {
  return createTaskContext({ taskId:'M10.01', ...M1001_VERSIONS, instanceId, phase:'explain', seed:'fixed/1', material, modelState:{} });
}
export function validateM1001Context(input: unknown): TaskContext {
  const c=parseTaskContext(input);
  if (c.taskId!=='M10.01' || c.phase!=='explain' || c.seed!=='fixed/1' || Object.keys(c.modelState).length
    || Object.entries(M1001_VERSIONS).some(([k,v])=>c[k as keyof typeof M1001_VERSIONS]!==v)
    || snapshotContextData(c.material).json!==snapshotContextData(material).json) throw new Error('Unvalidated mass material or version.');
  return c;
}
