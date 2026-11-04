import { expect, it } from 'vitest';
import fixtures from '../fixtures/m604-cases.json';
import { createM604Learning } from '../../src/application/m604-learning.ts';
import type { M604LearningController } from '../../src/application/m604-learning.ts';
import { M604_FIELDS } from '../../src/domain/m604-contract.ts';
import { evaluateM604 } from '../../src/assessment/m604.ts';

function fresh(resumed = false) { return createM604Learning({ idPrefix: 'm604-session-tests', resumed }); }
function complete(app: M604LearningController) {
  app.revealObservations();
  const input = { ...fixtures.complete, ...(app.getState().caseId === 'limited' ? fixtures.limitedOverrides : {}) };
  for (const field of M604_FIELDS) app.edit(field, input[field]);
  return app.submit();
}
it('starts empty, requires actual data opening for data decisions and issues one current result-bound session receipt', () => {
  const app = fresh(); expect(app.submit().status).toBe('empty');
  expect(() => app.edit('observation',['volume_rises'])).toThrow();
  const result = complete(app), receipt = app.confirm(result);
  expect(app.submit()).toBe(result); expect(app.confirm(result)).toBe(receipt); expect(Object.isFrozen(receipt)).toBe(true);
  expect(receipt.assistance).toBe('independent'); expect(receipt.taskId).toBe('M6.04');
});
it('rejects copies, pure-checker results, altered bindings and foreign session outcomes', () => {
  const app = fresh(), result = complete(app), other = fresh();
  for (const forged of [structuredClone(result), evaluateM604(app.getState().context,app.getState().answer), complete(other), { ...result, binding: null }]) expect(() => app.confirm(forged)).toThrow();
  expect(app.confirm(result)).toBe(app.getState().receipt);
});
it('invalidates old green evidence after real edits, retains correct parts and supports self revision', () => {
  const app = fresh(), result = complete(app); app.edit('interpretation',['death_proven']);
  expect(app.getState().stale).toBe(true); expect(app.getState().receipt).toBeNull(); expect(() => app.confirm(result)).toThrow();
  const wrong = app.submit(); expect(wrong.status).toBe('incorrect'); expect(wrong.criteria.find(c => c.field === 'control')?.status).toBe('correct');
  app.edit('interpretation',['recovery_compatible']); expect(app.submit().status).toBe('correct'); expect(app.getState().revisedAfterFeedback).toBe(true);
});
it('freezes the actual pre-data prediction and distinguishes later revisions without grading a free sentence', () => {
  const app = fresh(); app.edit('hypothesis',['return_prediction']); app.editPrediction('Eigene vorherige Überlegung.'); app.revealObservations();
  const before = app.getState().predictionBeforeData!; app.editPrediction('Überarbeitung nach Daten.'); app.edit('hypothesis',['loss_prediction']);
  expect(before.text).toBe('Eigene vorherige Überlegung.'); expect(before.hypothesis).toEqual(['return_prediction']);
  expect(app.getState().predictionAfterData).toBe(true); expect(Object.isFrozen(before)).toBe(true);
});
it('never certifies free writing or changes a bounded result because of unassessed statements', () => {
  const app = fresh(), result = complete(app), receipt = app.getState().receipt;
  const text = 'Freier ungeprüfter Text <img src=x onerror=alert(1)>: alle Zellen sind sicher tot.';
  app.editPrediction(text); app.editWriting(text.repeat(100)); app.setStep(6);
  expect(app.submit()).toBe(result); expect(app.getState().receipt).toBe(receipt); expect(app.getState().writing).toBe(text.repeat(100));
  expect(JSON.stringify(result)).not.toContain(text); expect(Object.keys(app.getState().answer)).not.toContain('writing');
});
it('records every actual help source and level, invalidates evidence and retains solution disclosure across cases', () => {
  const app = fresh(), result = complete(app);
  for (const level of [1,2,3] as const) app.help('planning',level);
  expect(app.getState().receipt).toBeNull(); expect(() => app.confirm(result)).toThrow();
  expect(app.getState().help.map(e => e.level)).toEqual([1,2,3]);
  expect(app.submit().status).toBe('correct'); expect(app.getState().receipt?.assistance).toBe('solution_viewed');
  app.activateCase('limited'); expect(complete(app).status).toBe('correct'); expect(app.getState().receipt?.assistance).toBe('solution_viewed');
});
it('does not turn a context switch or reset into an unseen first prediction or restore old success', () => {
  const app = fresh(), old = complete(app); app.editWriting('Entwurf'); app.activateCase('limited');
  expect(app.getState().writing).toBe(''); expect(app.getState().outcome).toBeNull(); expect(app.getState().observationsVisible).toBe(false);
  expect(() => app.confirm(old)).toThrow(); app.activateCase('recovery'); app.revealObservations();
  expect(app.getState().predictionAfterData).toBe(true); expect(app.getState().predictionBeforeData).toBeNull();
  app.help('limits',3); app.reset(); expect(app.getState().assistance).toBe('solution_viewed'); expect(app.getState().receipt).toBeNull();
  expect(app.getState().predictionAfterData).toBe(true);
});
it('imports actual prior M6.02/M6.03 disclosures once and conservatively carries unknown history', () => {
  const app = fresh(), old = complete(app);
  const event = { id: 'prior-event', taskId: 'M6.03' as const, source: 'detachment', contextHash: old.binding!.contextHash, kind: 'solution_viewed' as const };
  app.syncPriorHelp([event], false); app.syncPriorHelp([event], false);
  expect(app.getState().help).toHaveLength(1); expect(app.getState().stale).toBe(true); expect(() => app.confirm(old)).toThrow();
  expect(app.submit().status).toBe('correct'); expect(app.getState().receipt?.assistance).toBe('solution_viewed');
  app.syncPriorHelp([],true); expect(app.submit().status).toBe('correct'); expect(app.getState().receipt).toBeNull();
});
it('reload cannot invent verified assistance history or issue a receipt in either case', () => {
  const app = fresh(true);
  for (const id of ['recovery','limited'] as const) { app.activateCase(id); expect(complete(app).status).toBe('correct'); expect(app.getState().receipt).toBeNull(); }
});
it('invalid controller operations are atomic and preserve the current verified draft', () => {
  const app = fresh(), old = complete(app), state = app.getState();
  for (const action of [() => app.edit('control',['water','water']), () => app.setStep(7), () => app.activateCase('other' as 'recovery'),
    () => app.help('comparison',1), () => app.syncPriorHelp([{ id: 'x', taskId: 'M6.03', source:'help', contextHash:'invalid', kind:'hint' }],false)]) expect(action).toThrow();
  expect(app.getState().answer).toBe(state.answer); expect(app.confirm(old)).toBe(state.receipt);
});

it('comparison disclosure freezes the actual first prediction before marking findings seen', () => {
  const app=fresh(); app.editPrediction('Synthetische ursprüngliche Erwartung'); app.edit('hypothesis',['loss_prediction']);
  app.help('comparison',3);
  const original=app.getState().predictionBeforeData!;
  expect(app.getState()).toMatchObject({observationsVisible:true,seenDataBefore:true,assistance:'solution_viewed'});
  expect(original.text).toBe('Synthetische ursprüngliche Erwartung'); expect(original.hypothesis).toEqual(['loss_prediction']);
  app.editPrediction('Spätere Erklärung'); app.help('comparison',3);
  expect(app.getState().predictionBeforeData).toBe(original); expect(app.getState().predictionAfterData).toBe(true);
  app.reset(); expect(app.getState().seenDataBefore).toBe(true); app.editPrediction('Nach Rücksetzen'); app.revealObservations();
  expect(app.getState().predictionBeforeData).toBeNull(); expect(app.getState().predictionAfterData).toBe(true);
});
it('disclosure without prediction and returning to a seen case cannot invent a first prediction', () => {
  const app=fresh(); app.revealObservations(); expect(app.getState().predictionBeforeData?.text).toBe('');
  app.editPrediction('Nach den Daten'); expect(app.getState().predictionAfterData).toBe(true);
  app.activateCase('limited'); expect(app.getState().seenDataBefore).toBe(false); app.help('comparison',3);
  app.activateCase('recovery'); expect(app.getState().seenDataBefore).toBe(true); app.help('comparison',3);
  expect(app.getState().predictionBeforeData).toBeNull(); expect(app.getState().help).toHaveLength(2);
});
it('open planning is volatile and does not grade text or replace structured evidence', () => {
  const app=fresh(); app.editPlanning('Synthetischer erster Plan'); app.help('planning',2);
  expect(app.getState().seenDataBefore).toBe(false); expect(app.getState().planning).toBe('Synthetischer erster Plan');
  expect(app.submit().status).toBe('empty'); app.setStep(2); expect(app.getState().planning).toBe('Synthetischer erster Plan');
  app.activateCase('limited'); expect(app.getState().planning).toBe('');
  app.editPlanning('Zweiter Plan'); app.reset(); expect(app.getState().planning).toBe('');
});
