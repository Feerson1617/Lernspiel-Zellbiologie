import { describe, expect, it } from 'vitest';
import cases from '../fixtures/m603-cases.json';
import { evaluateM603, parseM603Answer } from '../../src/assessment/m603.ts';
import { createM603Context } from '../../src/content/m603-materials.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';
import { M603_NODES, M603_RELATIONS } from '../../src/domain/m603-contract.ts';
import type { M603Edge } from '../../src/domain/m603-contract.ts';

const context = createM603Context(0, 'own-m603-tests');
const core = cases.cases[0]!.answer!.edges;
describe('pre-implementation biological cases through the actual pure checker', () => {
  for (const index of [0, 1]) it.each(cases.cases)('case '+index+' / $id → $status', fixture => {
    const result = evaluateM603(createM603Context(index, 'matrix'), fixture.answer);
    expect(result.status).toBe(fixture.status);
    if ('criterionStatuses' in fixture) expect(result.criteria.map(item => item.status)).toEqual(fixture.criterionStatuses);
    expect(Object.isFrozen(result)).toBe(true);
    if (result.status === 'incorrect') expect([...result.edges, ...result.claims].some(item => item.status === 'incorrect' && item.text.length > 40)).toBe(true);
  });
});

const correct = new Set(['A:B:causes', 'A:C:causes', 'B:D:enables_if', 'C:D:requires_zero', 'B:C:coupled', 'C:B:coupled', 'A:D:possible_together']);
const incorrect = new Set(['B:A:causes', 'C:A:causes', 'D:B:enables_if', 'D:C:requires_zero',
  'A:B:prevents', 'A:C:prevents', 'B:D:prevents', 'C:D:prevents',
  'A:D:causes', 'B:D:causes', 'C:D:causes', 'B:C:strictly_before', 'C:B:strictly_before']);
const combinations = M603_NODES.flatMap(from => M603_NODES.filter(to => to !== from).flatMap(to => M603_RELATIONS.map(relation => ({ from, to, relation }))));
describe('own finite semantic audit of all 84 non-self node/type combinations', () => {
  it.each(combinations)('$from → $to / $relation', edge => {
    const key = `${edge.from}:${edge.to}:${edge.relation}`;
    expect(evaluateM603(context, { edges: [edge], claims: [] }).edges[0]?.status).toBe(correct.has(key) ? 'correct' : incorrect.has(key) ? 'incorrect' : 'clarify');
  });
  it('recognizes every permutation without relying on layout or order', () => {
    function permutations<T>(items: readonly T[]): T[][] { return items.length ? items.flatMap((item, i) => permutations(items.filter((_e, j) => i !== j)).map(rest => [item, ...rest])) : [[]]; }
    for (const edges of permutations(core)) expect(evaluateM603(context, { edges, claims: [] }).status).toBe('correct');
  });
  it('credits the two D parts only jointly, without asserting observation', () => {
    const one = evaluateM603(context, { edges: [core[2]], claims: [] });
    expect(one.edges[0]?.status).toBe('correct'); expect(one.criteria[2]?.status).toBe('partial');
    expect(one.messages.map(item => item.text).join(' ')).toContain('UND');
    const both = evaluateM603(context, { edges: core.slice(2), claims: [] });
    expect(both.status).toBe('partial'); expect(both.criteria.slice(2).every(item => item.status === 'correct')).toBe(true);
  });
  it('never hides a contradiction behind correct parts, duplicates or an unassessed relation', () => {
    const result = evaluateM603(context, { edges: [...core, core[0], { from: 'A', to: 'B', relation: 'prevents' }, { from: 'A', to: 'D', relation: 'coupled' }], claims: [] });
    expect(result.status).toBe('incorrect'); expect(result.criteria[0]?.status).toBe('incorrect'); expect(result.criteria[1]?.status).toBe('correct');
    expect(result.messages.some(item => item.code === 'CONTRADICTORY_RELATIONS')).toBe(true);
  });
});

describe('technical and context boundary, no partial parsing', () => {
  const answer = { edges: core, claims: [] };
  it.each(['taskVersion', 'rubricVersion', 'contentVersion', 'modelVersion', 'taskId', 'phase', 'seed'] as const)('rejects a rehashed wrong %s', field => {
    const { contextHash: _hash, ...input } = context;
    const changed = createTaskContext({ ...input, [field]: field === 'taskId' ? 'M6.02' : field === 'phase' ? 'transfer' : 'outdated' });
    expect(evaluateM603(changed, answer).status).toBe('technical');
  });
  it('rejects altered hashes, assumptions, potential signs and model state', () => {
    const { contextHash: _hash, ...input } = context;
    for (const changed of [{ ...context, contextHash: 'sha256-v1:fake' }, createTaskContext({ ...input, modelState: { simulated: true } }),
      createTaskContext({ ...input, material: { ...context.material, waterPermeability: { cellMembrane: true, tonoplast: false } } }),
      createTaskContext({ ...input, material: { ...context.material, waterPotential: { unit: 'Pa', vacuole: -900000, cytosol: -300000, external: -100000, includesPressure: true } } })]) {
      expect(evaluateM603(changed, answer).status).toBe('technical');
    }
  });
  it('rejects accessors, prototypes, sparse arrays and hidden extras without invoking them', () => {
    let called = false;
    const accessor = Object.defineProperty({}, 'edges', { enumerable: true, get() { called = true; return core; } });
    const hidden = Object.defineProperty({ ...answer }, 'extra', { value: 'unreviewed' });
    const sparse = new Array<M603Edge>(3); sparse[2] = { from: 'A', to: 'B', relation: 'causes' };
    for (const invalid of [accessor, hidden, Object.assign(Object.create({ injected: true }), answer), { edges: sparse, claims: [] }, { edges: [Object.assign({}, core[0], { extra: true })], claims: [] }, { edges: core, claims: [Symbol('claim')] }]) {
      expect(evaluateM603(context, invalid).status).toBe('technical');
      expect(() => parseM603Answer(invalid)).toThrow();
    }
    expect(called).toBe(false);
  });
  it('freezes fresh copies and rejects oversized answers rather than grading a prefix', () => {
    const input = structuredClone(answer), snapshot = parseM603Answer(input);
    expect(Object.isFrozen(snapshot.edges)).toBe(true); input.edges[0]!.from = 'D'; expect(snapshot.edges[0]?.from).toBe('A');
    expect(evaluateM603(context, { edges: Array.from({ length: 24 }, () => core[0]), claims: [] }).status).toBe('clarify');
    expect(evaluateM603(context, { edges: Array.from({ length: 25 }, () => core[0]), claims: [] }).status).toBe('technical');
    expect(evaluateM603(context, { edges: core, claims: Array(9).fill('wall_stable') }).status).toBe('technical');
  });
});
