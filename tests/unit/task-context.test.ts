import { createHash } from 'node:crypto';
import { expect, expectTypeOf, it } from 'vitest';
import { ContextContractError, readDataRecord, snapshotContextData } from '../../src/domain/context-data.ts';
import { capturePredictionContext, createContextBinding, createTaskContext, isResultForContext, parseTaskContext } from '../../src/domain/task-context.ts';
import type { TaskContext, TaskContextInput } from '../../src/domain/task-context.ts';
import type { TaskContext as DesignContext } from '../../spec/contracts.d.ts';
import { toSI } from '../../src/domain/units.ts';

/** Synthetic version labels are test inputs, not released biological versions. */
function fixture(): TaskContextInput {
  return {
    taskId: 'M6.02', taskVersion: 'test-task', rubricVersion: 'test-rubric', contentVersion: 'test-content', modelVersion: 'test-model',
    instanceId: 'test-instance', seed: 'test-seed', phase: 'predict',
    material: { waterPermeable: true, external: toSI('concentration', 0.5, 'mol/L'), phaseNote: 'early-phase' },
    modelState: { modelVersion: 'test-model', profile: 'onion_epidermis', cytosol: { concentration: toSI('concentration', 0.3, 'mol/L'), pressure: toSI('pressure', 0.2, 'MPa') }, vacuole: { volume: toSI('volume', 90, 'pL') } },
  };
}

it('narrows task identities while preserving the complete design interface', () => {
  expectTypeOf<TaskContext>().toMatchTypeOf<DesignContext>();
  expect(createTaskContext(fixture()).taskId).toBe('M6.02');
});

it('matches an independently specified canonical JSON string and the Node SHA-256 oracle', () => {
  const input: TaskContextInput = { taskId: 'Z1.01', taskVersion: 't', rubricVersion: 'r', contentVersion: 'c', modelVersion: 'm', instanceId: 'i', seed: 's', phase: 'predict', material: { z: true, a: 'ä' }, modelState: {} };
  const canonical = '{"contentVersion":"c","instanceId":"i","material":{"a":"ä","z":true},"modelState":{},"modelVersion":"m","phase":"predict","rubricVersion":"r","seed":"s","taskId":"Z1.01","taskVersion":"t"}';
  const expected = `sha256-v1:${createHash('sha256').update('zelllabor11.task-context.v1\n' + canonical, 'utf8').digest('hex')}`;
  expect(createTaskContext(input).contextHash).toBe(expected);
});

it('canonicalizes root, nested, Unicode and integer-like object keys without locale dependence', () => {
  const input = fixture();
  const reordered = Object.fromEntries(Object.entries(input).reverse()) as unknown as TaskContextInput;
  const first = { ...input, material: { z: { '2': 2, '10': 10, 'ä': true, a: false }, a: [1, { b: 2, a: 1 }] } };
  const second = { ...reordered, material: { a: [1, { a: 1, b: 2 }], z: { a: false, 'ä': true, '10': 10, '2': 2 } } };
  expect(createTaskContext(first).contextHash).toBe(createTaskContext(second).contextHash);
  expect(snapshotContextData({ '2': 2, '10': 10 }).json).toBe('{"10":10,"2":2}');
});

it.each(['taskVersion', 'rubricVersion', 'contentVersion', 'modelVersion', 'instanceId', 'seed', 'phase', 'taskId'] as const)('binds the independent %s field', (field) => {
  const input = fixture();
  const changed = { ...input, [field]: field === 'phase' ? 'investigate' : field === 'taskId' ? 'M6.01' : 'test-changed' };
  if (field === 'modelVersion') changed.modelState = { ...input.modelState, modelVersion: 'test-changed' };
  expect(createTaskContext(changed as TaskContextInput).contextHash).not.toBe(createTaskContext(input).contextHash);
});

it('changes identity for a concentration, pressure, cell profile or model-stage change', () => {
  const input = fixture();
  const original = createTaskContext(input).contextHash;
  for (const modelState of [
    { ...input.modelState, profile: 'plant_leaf' },
    { ...input.modelState, cytosol: { concentration: toSI('concentration', 0.31, 'mol/L'), pressure: toSI('pressure', 0.2, 'MPa') } },
    { ...input.modelState, cytosol: { concentration: toSI('concentration', 0.3, 'mol/L'), pressure: toSI('pressure', 0.21, 'MPa') } },
    { ...input.modelState, modelTime_s: 0.01 },
  ]) expect(createTaskContext({ ...input, modelState }).contextHash).not.toBe(original);
  expect(createTaskContext({ ...input, material: { ...input.material, external: toSI('concentration', 0.6, 'mol/L') } }).contextHash).not.toBe(original);
});

it('preserves array order, primitive types, tiny values and negative potentials', () => {
  const make = (value: unknown) => createTaskContext({ ...fixture(), material: { value } } as TaskContextInput).contextHash;
  const values = [null, false, 0, '0', [], {}, [1, 2], [2, 1], 1e-15, 2e-15, -100_000, 100_000];
  expect(new Set(values.map(make)).size).toBe(values.length);
  expect(make(-0)).toBe(make(0));
});

it('deep-copies and freezes shared nested objects and arrays without changing caller data', () => {
  const shared = { values: [1, { volume_m3: 9e-14 }] };
  const input = { ...fixture(), material: { left: shared, right: shared } };
  const context = createTaskContext(input);
  const hash = context.contextHash;
  shared.values.push(3); (shared.values[1] as { volume_m3: number }).volume_m3 = 1;
  expect(context.material).toEqual({ left: { values: [1, { volume_m3: 9e-14 }] }, right: { values: [1, { volume_m3: 9e-14 }] } });
  expect(Object.isFrozen(context)).toBe(true);
  expect(Object.isFrozen(context.material['left'])).toBe(true);
  expect(Object.isFrozen((context.material['left'] as { values: readonly unknown[] }).values)).toBe(true);
  expect(Object.isFrozen(shared)).toBe(false);
  expect(parseTaskContext(context).contextHash).toBe(hash);
});

it('captures prediction conditions before mutating an active model input', () => {
  const state = { concentration_mol_m3: 300, profile: 'onion_epidermis' };
  const input = { ...fixture(), phase: 'predict' as const, modelState: state };
  const prediction = capturePredictionContext(input);
  const binding = createContextBinding(prediction);
  state.concentration_mol_m3 = 500;
  const active = createTaskContext({ ...input, phase: 'investigate' });
  expect(prediction.modelState['concentration_mol_m3']).toBe(300);
  expect(isResultForContext(binding, prediction)).toBe(true);
  expect(isResultForContext(binding, active)).toBe(false);
  expect(() => capturePredictionContext({ ...fixture(), phase: 'investigate' } as unknown as TaskContextInput & { phase: 'predict' })).toThrow(ContextContractError);
});

it('checks binding only and rejects a stale result after any relevant context change', () => {
  const initial = createTaskContext(fixture());
  const binding = createContextBinding(initial);
  expect(isResultForContext(binding, initial)).toBe(true);
  expect(isResultForContext({ ...binding, status: 'technical', criteria: [] }, initial)).toBe(true);
  expect(isResultForContext(binding, createTaskContext({ ...fixture(), rubricVersion: 'test-next-rubric' }))).toBe(false);
  expect(isResultForContext({ ...binding, taskId: 'M6.01' }, initial)).toBe(false);
  expect(isResultForContext({ ...binding, taskVersion: 'test-other' }, initial)).toBe(false);
  expect(isResultForContext({ ...binding, rubricVersion: 'test-other' }, initial)).toBe(false);
  expect(isResultForContext({ ...binding, contentVersion: 'contradictory-extra' }, initial)).toBe(false);
  expect(isResultForContext({}, initial)).toBe(false);
  expect(isResultForContext(null, initial)).toBe(false);
});

it('recomputes supplied hashes and never accepts an edited context with a stale copied hash', () => {
  const context = createTaskContext(fixture());
  const tampered = { ...context, modelState: { changed: true } };
  expect(() => parseTaskContext(tampered)).toThrow('HASH_MISMATCH');
  expect(isResultForContext(createContextBinding(context), tampered)).toBe(false);
  expect(() => createContextBinding(tampered)).toThrow('HASH_MISMATCH');
  expect(() => parseTaskContext({ ...context, contextHash: 'unknown-format' })).toThrow('HASH_MISMATCH');
  expect(parseTaskContext(JSON.parse(JSON.stringify(context)))).toEqual(context);
});

it.each(['taskId', 'taskVersion', 'rubricVersion', 'contentVersion', 'modelVersion', 'instanceId', 'seed', 'phase', 'material', 'modelState'])('rejects missing %s without inventing defaults', (field) => {
  const input = { ...fixture() } as Record<string, unknown>; delete input[field];
  expect(() => createTaskContext(input as unknown as TaskContextInput)).toThrow('INVALID_SHAPE');
});

it.each(['', ' ', ' v1', 'v1 ', 'a\nb', null, undefined, 1])('rejects an invalid version label: %s', (value) => {
  expect(() => createTaskContext({ ...fixture(), contentVersion: value } as TaskContextInput)).toThrow('INVALID_LABEL');
});

it('rejects unknown IDs/phases, contradictory version copies and user-provided hashes', () => {
  expect(() => createTaskContext({ ...fixture(), taskId: 'Z1.99' } as unknown as TaskContextInput)).toThrow('INVALID_ID');
  expect(() => createTaskContext({ ...fixture(), phase: 'unknown' } as unknown as TaskContextInput)).toThrow('INVALID_PHASE');
  expect(() => createTaskContext({ ...fixture(), modelState: { modelVersion: 'test-other-model' } })).toThrow('VERSION_MISMATCH');
  expect(() => createTaskContext({ ...fixture(), contextHash: 'copied' } as TaskContextInput)).toThrow('INVALID_SHAPE');
  expect(() => createTaskContext({ ...fixture(), material: [] } as unknown as TaskContextInput)).toThrow(ContextContractError);
});

it.each([NaN, Infinity, -Infinity, undefined, 1n, Symbol('synthetic'), () => 1, new Date(), new Map(), new Set(), new Uint8Array(2)])('rejects unsupported or nonfinite material data: %s', (value) => {
  expect(() => createTaskContext({ ...fixture(), material: { value } } as TaskContextInput)).toThrow(ContextContractError);
});

it('rejects cycles, sparse arrays, hidden fields and executable accessors without invoking them', () => {
  const cycle: Record<string, unknown> = {}; cycle['self'] = cycle;
  expect(() => snapshotContextData(cycle)).toThrow('CYCLIC_DATA');
  expect(() => snapshotContextData({ sparse: new Array(2) })).toThrow('INVALID_DATA');
  expect(() => readDataRecord(Object.defineProperty({}, 'hidden', { value: 1 }))).toThrow('INVALID_DATA');
  expect(() => snapshotContextData({ [Symbol('hidden')]: 1 })).toThrow('INVALID_DATA');
  let called = false;
  const getters = { get field() { called = true; return 1; } };
  expect(() => snapshotContextData(getters)).toThrow('INVALID_DATA');
  expect(called).toBe(false);
  let nested: Record<string, unknown> = {};
  for (let i = 0; i < 70; i++) nested = { nested };
  expect(() => snapshotContextData(nested)).toThrow('DATA_TOO_DEEP');
});

it('preserves literal prototype-looking keys as data without prototype mutation', () => {
  const value: unknown = JSON.parse('{"__proto__":{"safe":true},"constructor":5}');
  const snapshot = snapshotContextData(value);
  expect(Object.hasOwn(snapshot.value, '__proto__')).toBe(true);
  expect(Object.getPrototypeOf(snapshot.value)).toBe(Object.prototype);
  expect(snapshot.json).toBe('{"__proto__":{"safe":true},"constructor":5}');
});

function checkReadonly(context: TaskContext): void {
  // @ts-expect-error Phase and material snapshots must be immutable.
  context.phase = 'explain';
  // @ts-expect-error Nested data remains readonly.
  context.material['external'] = 1;
}
void checkReadonly;
