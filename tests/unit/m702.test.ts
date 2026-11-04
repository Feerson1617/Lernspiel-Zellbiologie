import { describe, expect, it } from 'vitest';
import cases from '../fixtures/m702-cases.json';
import { evaluateM702 } from '../../src/assessment/m702.ts';
import { createM702Context } from '../../src/content/m702.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';
import { createM702Learning } from '../../src/application/m702-learning.ts';

describe('predeclared M7.02 evidence expectations', () => {
  for (const row of cases.cases) it(row.id, () => {
    const result = evaluateM702(createM702Context('case'), row.selected);
    expect(result.status).toBe(row.status);
    expect(Object.fromEntries(result.parts.map(p => [p.id, p.status]))).toEqual(row.parts);
    for (const feedback of [result.feedback, ...result.parts]) {
      expect(feedback.recognized.length).toBeGreaterThan(10); expect(feedback.reason.length).toBeGreaterThan(10); expect(feedback.next.length).toBeGreaterThan(10);
    }
  });
});
for (const changed of [{ taskVersion: 'foreign' }, { phase: 'predict' as const }, { material: { outside: 1, inside: 4 } }, { modelState: { energy: 'proven' } }]) it(`does not reuse correct answers under ${Object.keys(changed)[0]} changes`, () => {
  const { contextHash: _hash, ...base } = createM702Context('foreign-context');
  expect(evaluateM702(createTaskContext({ ...base, ...changed }), ['rate', 'energy_open']).status).toBe('technical');
});
it('does not evaluate a valid prefix of an oversized or malformed selection', () => {
  const c = createM702Context('invalid');
  for (const value of [null, {}, new Array(7).fill('rate'), ['rate', undefined], ['rate', '']]) expect(evaluateM702(c, value).status).toBe('technical');
});
it('never reads accessor-based answers as student claims', () => {
  let called = false; const selection: unknown[] = []; Object.defineProperty(selection, 0, { get() { called = true; return 'rate'; } });
  expect(evaluateM702(createM702Context('accessor'), selection).status).toBe('technical'); expect(called).toBe(false);
});
it('keeps a supported scientific result correct when history is unverified', () => {
  const model = createM702Learning({ resumed: true }); model.select('rate', true); model.select('energy_open', true); model.help(3);
  expect(model.submit().status).toBe('correct'); expect(model.getState()).toMatchObject({ historyUnverified: true, assistance: 'solution_viewed' });
  expect(model.getState()).not.toHaveProperty('receipt');
});
it('freezes the actual two drafts before criteria and preserves all later edits separately', () => {
  const model = createM702Learning({ resumed: false }); model.edit('argument', 'Mein erster Befund.'); model.edit('investigation', 'Mein erster Vorschlag.'); model.openReview();
  model.edit('argument', 'Neue Deutung.'); model.edit('investigation', 'Neuer Vorschlag.'); model.openReview(); model.help(3);
  const state = model.getState(); expect(state.firstDraft).toMatchObject({ argument: 'Mein erster Befund.', investigation: 'Mein erster Vorschlag.', assistance: 'independent', trigger: 'criteria' });
  expect(state.writing).toEqual({ argument: 'Neue Deutung.', investigation: 'Neuer Vorschlag.' }); expect(Object.isFrozen(state.firstDraft)).toBe(true);
});
it('an early comparison never invents a pre-help first answer', () => {
  const model = createM702Learning({ resumed: false }); model.help(3); model.edit('argument', 'Erst nach Lösung geschrieben.'); model.openReview();
  expect(model.getState().firstDraft).toMatchObject({ argument: '', investigation: '', hadWriting: false, trigger: 'comparison' }); expect(model.getState().assistance).toBe('solution_viewed');
});
it('captures existing writing before the early comparison is disclosed', () => {
  const model = createM702Learning({ resumed: false }); model.edit('argument', 'Vor dem Vergleich.'); model.help(3); model.edit('argument', 'Nach dem Vergleich.');
  expect(model.getState().firstDraft).toMatchObject({ argument: 'Vor dem Vergleich.', assistance: 'independent', hadWriting: true });
});
it('prior hints stay attached to the first draft and never insert text or choices', () => {
  const model = createM702Learning(); model.help(1); model.help(2); model.edit('argument', 'Eigener Entwurf.'); model.openReview();
  expect(model.getState().firstDraft?.assistance).toBe('hint'); expect(model.getState().selected).toEqual([]); expect(model.getState().writing.investigation).toBe('');
});
it('reset clears drafts but not the fact that a comparison was seen', () => {
  const model = createM702Learning(); const old = model.getState().context.contextHash; model.help(3); model.edit('argument', 'Vor Reset.'); model.reset(); model.edit('argument', 'Neuer Entwurf.'); model.openReview();
  expect(model.getState().context.contextHash).not.toBe(old); expect(model.getState().firstDraft).toMatchObject({ argument: 'Neuer Entwurf.', assistance: 'solution_viewed' });
  expect(model.getState().selected).toEqual([]); expect(model.getState().result).toBeNull();
});
it('editing unrelated free writing never changes a checked scientific choice', () => {
  const model = createM702Learning(); model.select('rate', true); model.select('energy_open', true); model.submit(); model.edit('argument', 'P ist bestimmt eine ATP-Pumpe! '.repeat(200));
  expect(model.getState().result?.status).toBe('correct'); expect(model.getState().stale).toBe(false); expect(model.getState().writing.argument.length).toBeGreaterThan(4096);
});
it('keeps correct parts beside a new contradiction and permits self revision', () => {
  const model = createM702Learning(); model.select('rate', true); model.submit(); model.select('atp_pump', true);
  expect(model.getState().stale).toBe(true); expect(model.getState().result?.parts[0]?.status).toBe('correct');
  const mixed = model.submit(); expect(mixed.status).toBe('incorrect'); expect(mixed.parts.find(p => p.id === 'rate')?.status).toBe('correct');
  model.select('atp_pump', false); model.select('energy_open', true); expect(model.submit().status).toBe('correct');
});
it('help changes provenance without changing existing scientific correctness', () => {
  const model = createM702Learning(); model.select('rate', true); model.select('energy_open', true); model.submit(); model.help(3);
  expect(model.getState().result?.status).toBe('correct'); expect(model.getState().stale).toBe(false); expect(model.getState().assistance).toBe('solution_viewed');
});
it('does not expose mutable live selection or draft objects', () => {
  const model = createM702Learning(); model.edit('argument', 'Entwurf'); model.select('rate', true); const state = model.getState();
  expect(Object.isFrozen(state.selected)).toBe(true); expect(Object.isFrozen(state.writing)).toBe(true);
  model.edit('argument', 'Überarbeitet'); expect(state.writing.argument).toBe('Entwurf');
});
