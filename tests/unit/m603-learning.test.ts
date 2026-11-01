import { describe, expect, it } from 'vitest';
import { createM603Learning } from '../../src/application/m603-learning.ts';
import type { M603LearningController } from '../../src/application/m603-learning.ts';
import { evaluateM603 } from '../../src/assessment/m603.ts';
import { M603_REQUIRED } from '../../src/domain/m603-contract.ts';
import type { M603Outcome } from '../../src/domain/m603-contract.ts';

function fresh(resumed = false) { return createM603Learning({ idPrefix: 'session-tests', resumed }); }
function complete(app: M603LearningController) { for (const { from, to, relation } of M603_REQUIRED) app.addEdge({ from, to, relation }); return app.submit(); }
describe('causal-map session evidence and assistance', () => {
  it('starts empty and issues one immutable current-session receipt for actual success', () => {
    const app = fresh(); expect(app.submit().status).toBe('empty'); expect(app.getState().receipt).toBeNull();
    const result = complete(app), receipt = app.confirm(result);
    expect(app.submit()).toBe(result); expect(app.confirm(result)).toBe(receipt); expect(Object.isFrozen(receipt)).toBe(true);
    expect(receipt.assistance).toBe('independent');
    expect(app.getState().revisedAfterFeedback).toBe(true);
  });
  it('rejects copies, altered results, pure-checker results and results from another session', () => {
    const app = fresh(), result = complete(app), other = fresh();
    for (const forged of [structuredClone(result), { ...result, status: 'correct' } as M603Outcome,
      evaluateM603(app.getState().context, app.getState().answer), complete(other)]) expect(() => app.confirm(forged)).toThrow();
    expect(app.confirm(result).outcome).toBe(result);
  });
  it('invalidates on edits and help, retains feedback for revision and refuses old receipts', () => {
    const app = fresh(), old = complete(app); app.removeEdge(0);
    expect(app.getState().stale).toBe(true); expect(app.getState().receipt).toBeNull(); expect(() => app.confirm(old)).toThrow();
    expect(app.submit().status).toBe('partial'); app.addEdge({ from: 'A', to: 'B', relation: 'causes' }); const updated = app.submit();
    expect(updated.status).toBe('correct'); app.help('turgor', 1);
    expect(app.getState().receipt).toBeNull(); expect(() => app.confirm(updated)).toThrow();
    expect(app.submit().status).toBe('correct'); expect(app.getState().receipt?.assistance).toBe('hint');
  });
  it('keeps layout and unassessed free explanation outside the assessed answer', () => {
    const app = fresh(), result = complete(app), receipt = app.getState().receipt;
    app.setLayout('alternate'); app.editExplanation('Dies ist ein eigener unbewerteter Satz.');
    expect(app.submit()).toBe(result); expect(app.getState().receipt).toBe(receipt);
    expect(JSON.stringify(result)).not.toContain('Dies ist'); expect(Object.keys(app.getState().answer)).toEqual(['claims', 'edges']);
  });
  it('cannot launder solution disclosure by changing or returning to equivalent material', () => {
    const app = fresh(); app.help('comparison', 3); const old = complete(app);
    app.editExplanation('Entwurf'); app.activateCase(1);
    expect(app.getState().outcome).toBeNull(); expect(app.getState().explanation).toBe(''); expect(app.getState().answer.edges).toEqual([]);
    expect(() => app.confirm(old)).toThrow(); expect(complete(app).status).toBe('correct');
    expect(app.getState().receipt?.assistance).toBe('solution_viewed'); app.activateCase(0);
    expect(complete(app).status).toBe('correct'); expect(app.getState().receipt?.assistance).toBe('solution_viewed');
    expect(app.getState().help[0]?.source).toBe('comparison'); expect(app.getState().help[0]?.contextHash).toBe(old.binding?.contextHash);
  });
  it('retains every explicit source/stage and imports actual M6.02 events monotonically', () => {
    const app = fresh(), old = complete(app), event = { id: 'prior-help', source: 'M6.02/volume/solution_viewed', kind: 'solution_viewed' as const, contextHash: app.getState().context.contextHash };
    app.syncPriorHelp([event], false); expect(() => app.confirm(old)).toThrow(); app.syncPriorHelp([event], false);
    for (const level of [1, 2, 3] as const) app.help('detachment', level);
    expect(app.getState().help.map(e => e.level)).toEqual([3, 1, 2, 3]); expect(app.getState().help[0]?.taskId).toBe('M6.02');
    expect(app.submit().status).toBe('correct'); expect(app.getState().receipt?.assistance).toBe('solution_viewed');
  });
  it('reload or inherited unknown history never generates evidence or restores independence', () => {
    for (const resumed of [false, true]) {
      const app = fresh(resumed); if (!resumed) app.syncPriorHelp([], true);
      expect(complete(app).status).toBe('correct'); expect(app.getState().historyUnverified).toBe(true); expect(app.getState().receipt).toBeNull();
      app.activateCase(1); expect(complete(app).status).toBe('correct'); expect(app.getState().receipt).toBeNull();
    }
  });
  it('errors leave the existing answer and receipt intact', () => {
    const app = fresh(), old = complete(app);
    expect(() => app.addEdge({ from: 'A', to: 'A', relation: 'causes' })).toThrow();
    expect(() => app.removeEdge(99)).toThrow(); expect(() => app.replaceEdge(-1, { from: 'A', to: 'C', relation: 'causes' })).toThrow();
    expect(() => app.activateCase(8 as 0)).toThrow(); expect(app.confirm(old)).toBe(app.getState().receipt);
  });
});
