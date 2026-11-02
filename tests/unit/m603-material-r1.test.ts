import { expect, it } from 'vitest';
import historical from '../../contracts/m603-causal-map.material-1.0.0.json';
import cases from '../fixtures/m603-cases.json';
import { createM603Context, readM603Material } from '../../src/content/m603-materials.ts';
import { createM602MaterialContext } from '../../src/content/m602-materials.ts';
import { createTaskContext, createContextBinding, isResultForContext } from '../../src/domain/task-context.ts';
import type { TaskContextInput } from '../../src/domain/task-context.ts';
import { evaluateM603 } from '../../src/assessment/m603.ts';
import { createM603Learning } from '../../src/application/m603-learning.ts';
import { M603_REQUIRED } from '../../src/domain/m603-contract.ts';

const answer = { edges: M603_REQUIRED.map(({ from, to, relation }) => ({ from, to, relation })), claims: [] };
function input(index: number): TaskContextInput {
  const { contextHash: _hash, ...value } = createM603Context(index, 'r1-version-binding'); return value;
}
function oldInput(index: number): TaskContextInput {
  const value = input(index);
  const { materialVersion: _v, initialTurgor: _t, consideredTurgorPhase: _p, ...material } = value.material;
  return { ...value, ...historical.versions, seed: `${material['caseId']}/1.0.0`, material };
}
for (const index of [0, 1]) {
  it(`R1 case ${index}: positive initial turgor is qualitative; every historical answer keeps its expected status`, () => {
    const context = createM603Context(index, 'r1-version-binding'), material = readM603Material(context);
    expect(material.initialTurgor).toBe('positive'); expect(material.consideredTurgorPhase).toBe('before_or_until_complete_loss');
    expect(material.waterPotential.includesPressure).toBe(true); expect(material.detachment).toBe('possible_not_observed');
    expect(material.wall).toBe('comparatively_stable'); expect(context.modelState).toEqual({});
    // There is no pressure value or numerical/dynamic state added to the data.
    expect(Object.entries(material).filter(([, value]) => typeof value === 'number')).toEqual([]);
    for (const fixture of cases.cases) expect(evaluateM603(context, fixture.answer).status).toBe(fixture.status);
  });
  it(`R1 case ${index}: a fully rehashed historical context cannot produce a current result`, () => {
    const old = createTaskContext(oldInput(index)), current = createM603Context(index, 'r1-version-binding');
    expect(old.contextHash).not.toBe(current.contextHash); expect(evaluateM603(old, answer).status).toBe('technical');
    expect(isResultForContext(createContextBinding(old), current)).toBe(false);
    expect(() => readM603Material(old)).toThrow();
  });
  it(`R1 case ${index}: new version labels cannot legitimize the incomplete old material`, () => {
    const current = input(index), old = oldInput(index);
    const relabeled = createTaskContext({ ...current, material: old.material });
    expect(evaluateM603(relabeled, answer).status).toBe('technical');
  });
  const mutations: [string, (data: Record<string, unknown>) => void][] = [
    ['missing initial turgor', data => { delete data['initialTurgor']; }],
    ['already zero', data => { data['initialTurgor'] = 'zero'; }],
    ['negative', data => { data['initialTurgor'] = 'negative'; }],
    ['unknown', data => { data['initialTurgor'] = 'unknown'; }],
    ['invented pressure number', data => { data['initialTurgor'] = 100000; }],
    ['additional absolute pressure', data => { data['turgorPa'] = 100000; }],
    ['missing considered phase', data => { delete data['consideredTurgorPhase']; }],
    ['after complete loss', data => { data['consideredTurgorPhase'] = 'after_complete_loss'; }],
    ['old material version', data => { data['materialVersion'] = 'm603-water-loss-material/1.0.0'; }],
  ];
  it.each(mutations)(`R1 case ${index}: rejects rehashed %s without assessing the map`, (_name, mutate) => {
    const value = input(index), material: Record<string, unknown> = structuredClone(value.material);
    mutate(material);
    const changed = createTaskContext({ ...value, material: material as TaskContextInput['material'] });
    const result = evaluateM603(changed, answer);
    expect(result.status).toBe('technical'); expect(result.binding).toBeNull();
  });
  it(`R1 case ${index}: the old seed and an unrecomputed hash are rejected`, () => {
    const value = input(index), old = createTaskContext(oldInput(index));
    expect(evaluateM603(createTaskContext({ ...value, seed: old.seed }), answer).status).toBe('technical');
    expect(evaluateM603({ ...createM603Context(index, 'r1-version-binding'), contextHash: old.contextHash }, answer).status).toBe('technical');
  });
}
it('R1: historical result bindings cannot be laundered into a new receipt or erase inherited assistance', () => {
  const app = createM603Learning({ idPrefix: 'r1-version-binding' });
  for (const edge of answer.edges) app.addEdge(edge);
  const current = app.submit(), oldBinding = createContextBinding(createTaskContext(oldInput(0)));
  expect(() => app.confirm({ ...current, binding: oldBinding })).toThrow();
  const prior = createM602MaterialContext('water-loss-a', 'prior-session');
  app.syncPriorHelp([{ id: 'historical-help', source: 'M6.02/direction/solution_viewed', kind: 'solution_viewed', contextHash: prior.contextHash }], false);
  expect(app.getState().receipt).toBeNull(); expect(() => app.confirm(current)).toThrow();
  expect(app.submit().status).toBe('correct'); expect(app.getState().receipt?.assistance).toBe('solution_viewed');
  app.activateCase(1); for (const edge of answer.edges) app.addEdge(edge);
  expect(app.submit().status).toBe('correct'); expect(app.getState().receipt?.assistance).toBe('solution_viewed');
  const resumed = createM603Learning({ idPrefix: 'r1-resumed', resumed: true });
  for (const edge of answer.edges) resumed.addEdge(edge);
  expect(resumed.submit().status).toBe('correct'); expect(resumed.getState().receipt).toBeNull();
  expect(resumed.getState().historyUnverified).toBe(true);
});
