import { describe, expect, it } from 'vitest';
import fixtures from '../fixtures/m604-cases.json';
import contract from '../../contracts/m604-investigation-1.0.0.json';
import { evaluateM604, parseM604Answer } from '../../src/assessment/m604.ts';
import { createM604Context, readM604Material } from '../../src/content/m604-materials.ts';
import { m604Fields } from '../../src/content/m604-learning.ts';
import { M604_CASE_IDS, M604_FIELDS, M604_VERSIONS } from '../../src/domain/m604-contract.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';
import type { M604CaseId, M604Field } from '../../src/domain/m604-contract.ts';

function complete(caseId: M604CaseId) { return { ...fixtures.complete, ...(caseId === 'limited' ? fixtures.limitedOverrides : {}) }; }
for (const caseId of M604_CASE_IDS) describe(`preimplementation biological cases: ${caseId}`, () => {
  const context = createM604Context(caseId, 'own-biological-tests');
  for (const fixture of fixtures.cases.filter(c => c.scenario === 'both' || c.scenario === caseId)) it(`${fixture.id} → ${fixture.status}`, () => {
    const base = fixture.base === 'empty' ? Object.fromEntries(M604_FIELDS.map(id => [id, []])) : complete(caseId);
    const result = evaluateM604(context, { ...base, ...fixture.changes });
    expect(result.status).toBe(fixture.status);
    if (fixture.criterion) expect(result.criteria.find(c => c.field === fixture.criterion)?.status).toBe(fixture.criterionStatus);
    expect(result.binding?.contextHash).toBe(context.contextHash); expect(Object.isFrozen(result.criteria)).toBe(true);
    if (result.status === 'incorrect') expect(result.criteria.some(c => c.status === 'incorrect' && c.evidence.length && c.decisions.some(d => d.status === 'incorrect' && d.reason.length > 30))).toBe(true);
  });
  for (const definition of contract.fields) for (const wrong of definition.contradictions) it(`counterexample ${definition.id}/${wrong} cannot be hidden by complete other fields`, () => {
    const input = { ...complete(caseId), [definition.id]: [wrong] };
    const result = evaluateM604(context, input);
    expect(result.status).toBe('incorrect');
    expect(result.criteria.find(c => c.field === definition.id)?.decisions[0]?.status).toBe('incorrect');
  });
  it('accepts every valid control ordering and alternative measurement without changing the biological meaning', () => {
    const controls = ['water','handling','times','fresh'];
    function permutations(items: string[]): string[][] { return items.length ? items.flatMap((v,i) => permutations(items.filter((_,j) => i !== j)).map(rest => [v,...rest])) : [[]]; }
    for (const control of permutations(controls)) for (const dependent of ['relative_volume','detached_fraction']) for (const design of ['parallel_pairs','staggered_pairs']) {
      expect(evaluateM604(context, { ...complete(caseId), control, dependent: [dependent], design: [design] }).status).toBe('correct');
    }
  });
  it('does not turn a valid unconfirmed prediction into a false hypothesis', () => {
    expect(evaluateM604(context, { ...complete(caseId), hypothesis: ['return_prediction'] }).criteria.find(c => c.field === 'hypothesis')?.status).toBe('correct');
  });
  it('preserves independently correct decisions within an incorrect multi-selection', () => {
    const result = evaluateM604(context, { ...complete(caseId), control: [...controlsForTest, 'none'] });
    const field = result.criteria.find(c => c.field === 'control')!;
    expect(field.status).toBe('incorrect'); expect(field.decisions.filter(d => d.status === 'correct')).toHaveLength(4);
    expect(result.criteria.filter(c => c.field !== 'control').every(c => c.status === 'correct')).toBe(true);
  });
});
const controlsForTest = ['water','handling','times','fresh'];

describe('complete strict context and answer boundaries', () => {
  const context = createM604Context('recovery', 'boundaries');
  it.each(['taskId','taskVersion','rubricVersion','contentVersion','modelVersion','seed','phase'] as const)('rejects fully rehashed wrong %s', key => {
    const { contextHash: _, ...input } = context;
    const changed = createTaskContext({ ...input, [key]: key === 'taskId' ? 'M6.02' : key === 'phase' ? 'predict' : 'old' });
    expect(evaluateM604(changed, fixtures.complete).status).toBe('technical');
  });
  it('binds all data, uncertainty, membrane assumptions and initial-versus-later integrity', () => {
    const { contextHash: _, ...input } = context;
    const altered = [ { ...input.material, uncertaintyPercentagePoints: 0 }, { ...input.material, initialIntegrity: 'dead' },
      { ...input.material, laterIntegrity: 'intact_proven' }, { ...input.material, returnPotential: 'always_favors_uptake' },
      { ...input.material, waterPermeability: { cellMembrane: false, tonoplast: true } },
      { ...input.material, turgorPa: 100000 }, { ...input.material, records: {} } ];
    for (const material of altered) expect(evaluateM604(createTaskContext({ ...input, material }), fixtures.complete).status).toBe('technical');
    expect(evaluateM604(createTaskContext({ ...input, modelState: { simulated: true } }), fixtures.complete).status).toBe('technical');
    expect(evaluateM604({ ...context, contextHash: createM604Context('limited','boundaries').contextHash }, fixtures.complete).status).toBe('technical');
  });
  it('rejects executable, hidden, unknown, extra, sparse, duplicate, oversized and free-text input without truncation', () => {
    let invoked = false;
    const getter = Object.defineProperty({ ...fixtures.complete }, 'hypothesis', { enumerable: true, get() { invoked = true; return ['loss_prediction']; } });
    const sparse = new Array<string>(4); sparse[3] = 'water';
    for (const input of [getter, Object.assign(Object.create({ extra: true }), fixtures.complete),
      Object.defineProperty({ ...fixtures.complete }, 'hidden', { value: true }), { ...fixtures.complete, hypothesis: ['unknown'] },
      { ...fixtures.complete, ownText: 'Zellen sind sicher tot.' }, { ...fixtures.complete, control: sparse },
      { ...fixtures.complete, control: ['water','water'] }, { ...fixtures.complete, control: Array(100).fill('water') },
      { ...fixtures.complete, hypothesis: ['loss_prediction','return_prediction'] }, { ...fixtures.complete, hypothesis: 'loss_prediction' }]) {
      expect(() => parseM604Answer(input)).toThrow(); expect(evaluateM604(context,input).status).toBe('technical');
    }
    expect(invoked).toBe(false);
  });
  it('snapshots and freezes the complete answer, never a mutable caller reference', () => {
    const input = structuredClone(fixtures.complete), result = parseM604Answer(input); input.control.push('none');
    expect(result.control).toEqual(controlsForTest); expect(Object.isFrozen(result.control)).toBe(true);
  });
  it('has exactly the independently fixed contract fields, versions, option errors and required parts', () => {
    expect(M604_VERSIONS).toEqual(contract.versions);
    const fields = m604Fields('recovery'); expect(fields.map(f => f.id)).toEqual(M604_FIELDS);
    for (const expected of contract.fields) {
      const actual = fields.find(f => f.id === expected.id)!;
      expect(actual.criterion).toBe(expected.criterion); expect(actual.mode).toBe(expected.mode); expect(actual.required).toEqual(expected.required);
      for (const wrong of expected.contradictions) expect(actual.options.find(o => o.id === wrong)?.status).toBe('incorrect');
    }
    const { finding: _, ...records } = contract.observations.recovery;
    expect(readM604Material(context).records).toStrictEqual(records);
  });
  it.each(M604_FIELDS)('%s: empty and unsure are not biological errors', field => {
    const value = evaluateM604(context, { ...fixtures.complete, [field]: [] });
    expect(value.status).toBe('partial'); expect(value.criteria.find(c => c.field === field)?.status).toBe('empty');
    expect(evaluateM604(context, { ...fixtures.complete, [field]: ['unsure'] }).status).toBe('clarify');
  });
  it('keeps every field specific to M6.04 rather than silently enabling other catalog tasks', () => {
    const ids: readonly M604Field[] = M604_FIELDS;
    expect(ids).toHaveLength(17); expect(m604Fields('limited').every(f => f.criterion.startsWith('M6.04.'))).toBe(true);
  });
});
