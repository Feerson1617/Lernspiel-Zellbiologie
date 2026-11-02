import { expect, it } from 'vitest';
import own from '../fixtures/m604-r1-cases.json';
import original from '../fixtures/m604-cases.json';
import historical from '../../contracts/m604-investigation-1.0.0.json';
import { evaluateM604 } from '../../src/assessment/m604.ts';
import { createM604Context } from '../../src/content/m604-materials.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';
import { createM604Learning } from '../../src/application/m604-learning.ts';
import { M604_FIELDS } from '../../src/domain/m604-contract.ts';
import type { M604CaseId, M604Outcome } from '../../src/domain/m604-contract.ts';

for (const row of own.cases) it(row.id, () => {
  const context = createM604Context(row.caseId as M604CaseId, row.id);
  const answer = { ...original.complete, ...(row.caseId === 'limited' ? original.limitedOverrides : {}), hypothesis: row.hypothesis, dependent: row.dependent };
  const result = evaluateM604(context, answer);
  expect(result.contractVersion).toBe(own.contractVersion);
  expect(result.status).toBe(row.expected);
  expect(result.criteria).toHaveLength(18);
  for (const [id, status] of [['M6.04.C04',row.hypothesisStatus],['M6.04.C07',row.dependentStatus],['M6.04.C18',row.coherenceStatus]]) {
    expect(result.criteria.find(c => c.id === id)?.status).toBe(status);
  }
  const coherence = result.criteria.find(c => c.id === 'M6.04.C18')!;
  expect(coherence.evidence.map(e => e.value)).toEqual([...row.hypothesis.map(id => `hypothesis/${id}`),...row.dependent.map(id => `dependent/${id}`)]);
  if (row.dependent.length === 1 && row.dependent[0] === 'detached_fraction') {
    expect(coherence.text).toContain('Ergänze das relative Protoplastvolumen');
    expect(coherence.text).toContain('Ablösungsanteil');
    expect(result.criteria.filter(c => c.id !== 'M6.04.C18').every(c => c.status === 'correct')).toBe(true);
  }
});
for (const key of ['taskVersion','rubricVersion','contentVersion'] as const) it(`M604R1-old-${key}`, () => {
  const { contextHash: _, ...context } = createM604Context('recovery','old-versions');
  expect(evaluateM604(createTaskContext({...context,[key]:historical.versions[key]}),original.complete).status).toBe('technical');
});
it('M604R1-changed-material', () => {
  const { contextHash: _, ...context } = createM604Context('recovery','changed-material');
  expect(evaluateM604(createTaskContext({...context,material:{...context.material,uncertaintyPercentagePoints:0}}),original.complete).status).toBe('technical');
});
function completed() {
  const app = createM604Learning({idPrefix:'r1-receipts',resumed:false}); app.revealObservations();
  for (const field of M604_FIELDS) app.edit(field,original.complete[field]);
  const outcome = app.submit(); return {app,outcome,receipt:app.confirm(outcome)};
}
it('M604R1-old-result', () => {
  const {app,outcome} = completed();
  const old = {...outcome,contractVersion:historical.contractVersion,binding:{...outcome.binding,...historical.versions}} as unknown as M604Outcome;
  expect(() => app.confirm(old)).toThrow();
  expect(app.confirm(outcome).outcome.contractVersion).toBe(own.contractVersion);
});
it('M604R1-old-receipt', () => {
  const {app,outcome,receipt} = completed(); app.edit('dependent',['detached_fraction']);
  expect(app.getState().receipt).toBeNull(); expect(() => app.confirm(receipt.outcome)).toThrow();
  expect(app.submit().status).toBe('partial'); expect(app.getState().receipt).toBeNull();
  app.edit('dependent',['relative_volume','detached_fraction']);
  const fresh = app.submit(); expect(fresh.status).toBe('correct'); expect(app.confirm(fresh)).not.toBe(receipt);
  expect(() => app.confirm(outcome)).toThrow();
});
it('M604R1-changed-context', () => {
  const {app,receipt} = completed(); app.activateCase('limited');
  expect(() => app.confirm(receipt.outcome)).toThrow(); expect(app.getState().receipt).toBeNull();
});
