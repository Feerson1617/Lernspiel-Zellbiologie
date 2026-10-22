import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ASSISTANCE_KINDS, STATUSES } from '../../src/domain/contracts.ts';
import { appendAttempt, createAttemptRecord, getAttemptOutcome, parseProgress, ProgressContractError, snapshotProgress } from '../../src/domain/progress.ts';
import type { AttemptRecord, AssessmentHandoff } from '../../src/domain/progress.ts';
import type { AttemptRecord as DesignAttempt } from '../../spec/contracts.d.ts';
import { createContextBinding, createTaskContext } from '../../src/domain/task-context.ts';

const context = createTaskContext({ taskId: 'M6.02', taskVersion: 'task-test', rubricVersion: 'rubric-test', contentVersion: 'content-test', modelVersion: 'model-test', instanceId: 'case-1', seed: 'seed', phase: 'predict', material: { concentration: 300 }, modelState: { profile: 'onion_epidermis' } });
const empty = () => parseProgress({ schemaVersion: 1, contentVersion: 'content-test', attempts: [] });
const handoff = (status: AssessmentHandoff['status'] = 'correct', assistance: AssessmentHandoff['assistance'] = 'independent'): AssessmentHandoff => ({ ...createContextBinding(context), status, assistance });
const attempt = () => createAttemptRecord('attempt-1', handoff(), context);
const example = () => ({ schemaVersion: 1, contentVersion: 'content-test', attempts: [{ ...attempt() }], selectedMissionId: 'M6', recommendedMissionIds: ['Z1', 'M5'] });

describe('progress contract and orthogonal result/assistance', () => {
  it('matches the design attempt contract and exact schema fields', () => {
    const record: DesignAttempt = attempt();
    const typed: AttemptRecord = record as AttemptRecord;
    expect(typed.taskId).toBe('M6.02');
    const schema = JSON.parse(readFileSync(new URL('../../spec/progress.schema.json', import.meta.url), 'utf8'));
    expect(Object.keys(example()).sort()).toEqual(Object.keys(schema.properties).sort());
    expect(Object.keys(attempt()).sort()).toEqual(schema.properties.attempts.items.required.toSorted());
    expect(STATUSES).toEqual(schema.properties.attempts.items.properties.status.enum);
    expect(ASSISTANCE_KINDS).toEqual(schema.properties.attempts.items.properties.assistance.enum);
  });
  for (const status of STATUSES) for (const assistance of ASSISTANCE_KINDS) {
    it(`keeps ${status} separate from ${assistance}`, () => {
      const progress = appendAttempt(empty(), createAttemptRecord('attempt-1', handoff(status, assistance), context));
      const outcome = getAttemptOutcome(progress, 'attempt-1', context);
      expect(outcome).toEqual({ validity: 'current', status, assistance,
        successful: status === 'correct' && assistance !== 'solution_viewed',
        independent: status === 'correct' && assistance === 'independent' });
    });
  }
  it('adds a later independent attempt without rewriting previous assistance', () => {
    const first = createAttemptRecord('hinted', handoff('correct', 'hint'), context);
    const { contextHash: _hash, ...input } = context;
    const nextExample = createTaskContext({ ...input, instanceId: 'new-example' });
    const progress = appendAttempt(appendAttempt(empty(), first), createAttemptRecord('independent', { ...handoff(), ...createContextBinding(nextExample) }, nextExample));
    expect(progress.attempts.map((item) => item.assistance)).toEqual(['hint', 'independent']);
    expect(getAttemptOutcome(progress, 'hinted', context).independent).toBe(false);
    expect(getAttemptOutcome(progress, 'independent', nextExample).independent).toBe(true);
  });
  for (const prior of ['hint', 'wordbank', 'clarified', 'solution_viewed'] as const) {
    it(`never relabels the same instance as independent after ${prior}`, () => {
      const progress = appendAttempt(empty(), createAttemptRecord('prior', handoff('empty', prior), context));
      expect(() => appendAttempt(progress, createAttemptRecord('later', handoff(), context))).toThrow(ProgressContractError);
    });
  }
  it('retains solution_viewed even if the later attempt claims only a hint', () => {
    const progress = appendAttempt(empty(), createAttemptRecord('viewed', handoff('empty', 'solution_viewed'), context));
    expect(() => appendAttempt(progress, createAttemptRecord('later', handoff('correct', 'hint'), context))).toThrow(ProgressContractError);
    expect(getAttemptOutcome(appendAttempt(progress, createAttemptRecord('later', handoff('correct', 'solution_viewed'), context)), 'later', context).successful).toBe(false);
  });
  it('restores metadata but never manufactures context trust from JSON', () => {
    const live = appendAttempt(empty(), attempt());
    expect(getAttemptOutcome(snapshotProgress(live), 'attempt-1', context).successful).toBe(true);
    for (const loaded of [parseProgress(live), parseProgress(JSON.parse(JSON.stringify(live)))]) {
      expect(getAttemptOutcome(loaded, 'attempt-1', context)).toMatchObject({ validity: 'context_unverified', successful: false, independent: false });
    }
  });
  for (const field of ['contentVersion', 'taskVersion', 'rubricVersion', 'modelVersion'] as const) {
    it(`invalidates a previous success after a ${field} change`, () => {
      const { contextHash: _hash, ...input } = context;
      const changed = createTaskContext({ ...input, [field]: 'changed' });
      expect(getAttemptOutcome(appendAttempt(empty(), attempt()), 'attempt-1', changed)).toMatchObject({ validity: 'version_mismatch', successful: false });
    });
  }
  for (const change of [{ material: { concentration: 301 } }, { modelState: { profile: 'plant_leaf' } }, { instanceId: 'another-instance' }, { seed: 'another-seed' }]) {
    it(`invalidates changed context ${Object.keys(change)[0]}`, () => {
      const { contextHash: _hash, ...input } = context;
      const changed = createTaskContext({ ...input, ...change });
      expect(getAttemptOutcome(appendAttempt(empty(), attempt()), 'attempt-1', changed)).toMatchObject({ validity: 'context_mismatch', successful: false });
      expect(() => createAttemptRecord('stale', handoff(), changed)).toThrow(ProgressContractError);
    });
  }
  it('rejects moving a session receipt to a different content envelope', () => {
    expect(() => appendAttempt(parseProgress({ schemaVersion: 1, contentVersion: 'changed', attempts: [] }), attempt())).toThrow(ProgressContractError);
  });
  it('deep copies/freezes all arrays and records without freezing the caller', () => {
    const input = example();
    const result = parseProgress(input);
    input.attempts[0]!.status = 'incorrect';
    input.recommendedMissionIds.push('M6');
    expect(result.attempts[0]?.status).toBe('correct');
    expect(result.recommendedMissionIds).toEqual(['Z1', 'M5']);
    expect(Object.isFrozen(result.attempts[0])).toBe(true);
    expect(Object.isFrozen(result.attempts)).toBe(true);
    expect(Object.isFrozen(result.recommendedMissionIds)).toBe(true);
  });

  const invalid: [string, () => unknown][] = [
    ['null', () => null], ['array', () => []], ['unknown schema', () => ({ ...example(), schemaVersion: 2 })],
    ['missing schema', () => { const { schemaVersion: _v, ...other } = example(); return other; }],
    ['missing attempts', () => ({ schemaVersion: 1, contentVersion: 'content-test' })],
    ['unknown task', () => ({ ...example(), attempts: [{ ...attempt(), taskId: 'M6.99' }] })],
    ['missing instance', () => { const { instanceId: _i, ...item } = attempt(); return { ...example(), attempts: [item] }; }],
    ['duplicate attempt', () => ({ ...example(), attempts: [attempt(), attempt()] })],
    ['invalid status', () => ({ ...example(), attempts: [{ ...attempt(), status: 'passed' }] })],
    ['invalid assistance', () => ({ ...example(), attempts: [{ ...attempt(), assistance: 'none' }] })],
    ['unknown mission', () => ({ ...example(), selectedMissionId: 'M99' })],
    ['duplicate recommendation', () => ({ ...example(), recommendedMissionIds: ['Z1', 'Z1'] })],
    ['raw response', () => ({ ...example(), attempts: [{ ...attempt(), rawAnswer: 'PRIVATE_TEST_MARKER' }] })],
    ['name', () => ({ ...example(), name: 'PRIVATE_TEST_MARKER' })],
    ['forged context', () => ({ ...example(), attempts: [{ ...attempt(), contextHash: context.contextHash }] })],
    ['sparse array', () => ({ ...example(), attempts: new Array(1) })],
    ['hidden data', () => Object.defineProperty(example(), 'secret', { value: 'PRIVATE_TEST_MARKER' })],
    ['symbol field', () => ({ ...example(), [Symbol('secret')]: true })],
    ['class object', () => new Date()],
    ['null content version', () => ({ ...example(), contentVersion: null })],
    ['empty content version', () => ({ ...example(), contentVersion: '' })],
    ['NaN schema', () => ({ ...example(), schemaVersion: NaN })],
    ['infinite version', () => ({ ...example(), attempts: [{ ...attempt(), modelVersion: Infinity }] })],
  ];
  for (const [name, input] of invalid) it(`rejects ${name}`, () => {
    expect(() => parseProgress(input())).toThrow(ProgressContractError);
    try { parseProgress(input()); } catch (error) { expect(String(error)).not.toContain('PRIVATE_TEST_MARKER'); }
  });
  for (const field of ['attemptId', 'instanceId', 'taskVersion', 'rubricVersion', 'modelVersion'] as const) {
    for (const value of ['', ' leading', 'line\nbreak', 1, null, 'x'.repeat(257)]) {
      it(`rejects invalid ${field}: ${JSON.stringify(value).slice(0, 30)}`, () => {
        expect(() => parseProgress({ ...example(), attempts: [{ ...attempt(), [field]: value }] })).toThrow(ProgressContractError);
      });
    }
  }
  it('does not execute supplied accessors or toJSON hooks', () => {
    let called = false;
    const input = Object.defineProperty(example(), 'contentVersion', { enumerable: true, get() { called = true; return 'x'; } });
    expect(() => parseProgress(input)).toThrow(ProgressContractError);
    expect(() => parseProgress({ ...example(), toJSON() { called = true; return {}; } })).toThrow(ProgressContractError);
    expect(called).toBe(false);
  });
  it('does not accept raw response fields in the P02 handoff', () => {
    expect(() => createAttemptRecord('bad', { ...handoff(), rawAnswer: 'PRIVATE_TEST_MARKER' } as AssessmentHandoff, context)).toThrow(ProgressContractError);
    expect(() => createAttemptRecord('bad', { ...handoff(), status: 'passed' } as unknown as AssessmentHandoff, context)).toThrow(ProgressContractError);
  });
  it('rejects unknown attempt lookup and duplicate append', () => {
    expect(() => getAttemptOutcome(empty(), 'missing', context)).toThrow(ProgressContractError);
    expect(() => appendAttempt(appendAttempt(empty(), attempt()), attempt())).toThrow(ProgressContractError);
  });
});
