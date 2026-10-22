import { describe, expect, it } from 'vitest';
import { ASSISTANCE_KINDS } from '../../src/domain/contracts.ts';
import { createTaskContext, isResultForContext } from '../../src/domain/task-context.ts';
import { createOsmosisEvaluator } from '../../src/assessment/osmosis.ts';
import { getOsmosisFeedback } from '../../src/assessment/osmosis-feedback.ts';
import { createEvaluatedAttempt, IncompleteTaskAssessmentError } from '../../src/assessment/progress.ts';
import { AssessmentContractError } from '../../src/assessment/result.ts';
import { TEST_CONTEXT, TEST_EVALUATOR } from '../helpers/tonoplast.ts';
import { OSMOSIS_TEST_CONTEXT as CONTEXT, OSMOSIS_TEST_EVALUATOR as EVALUATOR, OSMOSIS_TEST_MATERIAL as MATERIAL, OSMOSIS_TEST_VERSIONS as VERSIONS } from '../helpers/osmosis.ts';
import { OSMOSIS_ADVERSARIAL_CASES, OSMOSIS_CASES, OSMOSIS_RECOGNITION_CASES } from '../fixtures/osmosis-cases.ts';
const evaluate = (text: unknown) => EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text }, 'independent');
const { contextHash: _hash, ...CONTEXT_INPUT } = CONTEXT;

describe('M6.02/process fixed rubric corpus, self-check only', () => {
  it('exceeds every required minimum with distinct reasoned inputs', () => {
    for (const [status, min] of Object.entries({ correct: 24, incorrect: 24, partial: 12, clarify: 12, technical: 8 })) {
      expect(OSMOSIS_CASES.filter(({ expected }) => expected === status).length).toBeGreaterThanOrEqual(min);
    }
    expect(new Set(OSMOSIS_CASES.map(({ id }) => id)).size).toBe(OSMOSIS_CASES.length);
  });
  for (const fixture of [...OSMOSIS_CASES, ...OSMOSIS_ADVERSARIAL_CASES]) it(`${fixture.id}: ${fixture.expected} — ${fixture.reason}`, () => {
    const result = evaluate(fixture.input);
    expect(result.status).toBe(fixture.expected);
    expect(result.criteria).toHaveLength(1);
    expect(result.criteria[0]).toMatchObject({ id: 'M6.02.C01', status: fixture.expected, reasonCode: result.feedbackCode });
    expect(isResultForContext(result, CONTEXT)).toBe(true);
    expect(getOsmosisFeedback(result.feedbackCode).length).toBeGreaterThan(20);
    if (result.status === 'correct') expect(result.unassessedRelevantText).toBe(false);
    if (result.status === 'incorrect') expect(result.criteria[0]!.evidence.length).toBeGreaterThan(0);
    for (const span of result.criteria[0]!.evidence) {
      expect(span.kind).toBe('input_span');
      if (span.kind === 'input_span') expect((fixture.input as string).slice(span.start, span.end)).toBe(span.value);
    }
  });
});
describe('additional natural correct answers including language stress, self-check only', () => {
  for (const fixture of OSMOSIS_RECOGNITION_CASES) it(`${fixture.id}: ${fixture.group} — ${fixture.input}`, () => {
    expect(evaluate(fixture.input)).toMatchObject({ status: 'correct', unassessedRelevantText: false });
  });
  it('counts every complete correct answer, including any unnecessary yellow, and separates groups', () => {
    expect(OSMOSIS_RECOGNITION_CASES.length).toBeGreaterThanOrEqual(40);
    for (const group of ['short_naming', 'language_stress', 'all']) {
      const fixtures = OSMOSIS_RECOGNITION_CASES.filter((f) => group === 'all' || f.group === group);
      expect(fixtures.length).toBeGreaterThan(0);
      const results = fixtures.map(({ input }) => evaluate(input));
      expect(results.filter(({ status }) => status === 'correct').length / results.length, group).toBeGreaterThanOrEqual(0.95);
      expect(results.some(({ status }) => status === 'incorrect')).toBe(false);
    }
  });
});

describe('explicit context prerequisites and changes', () => {
  for (const key of Object.keys(MATERIAL)) it(`requires explicit material.${key}`, () => {
    const material: Record<string, unknown> = { ...MATERIAL }; delete material[key];
    const context = createTaskContext({ ...CONTEXT_INPUT, material: material as never });
    expect(EVALUATOR.evaluate(context, { fieldId: 'process', text: 'Osmose' }, 'independent')).toMatchObject({ status: 'technical', feedbackCode: 'OSMOSIS_CONTEXT' });
  });
  const invalid = [
    {}, { concentration_mol_per_L: 0.5 },
    { ...MATERIAL, cellProfile: 'animal_epithelial' }, { ...MATERIAL, cellIntegrity: 'damaged' },
    { ...MATERIAL, observationPhase: 'exact_solution_exchange' },
    { ...MATERIAL, sucroseRetention: 'permeates' }, { ...MATERIAL, otherTransport: 'active' },
    { ...MATERIAL, waterPermeability: { cellMembrane: false, tonoplast: true } },
    { ...MATERIAL, waterPermeability: { cellMembrane: true, tonoplast: false } },
    { ...MATERIAL, waterPermeability: { cellMembrane: true } },
    { ...MATERIAL, waterPermeability: { cellMembrane: 'true', tonoplast: true } },
    { ...MATERIAL, waterPotential: { unit: 'Pa', vacuole: -300_000, cytosol: -300_000, external: -700_000 } },
    { ...MATERIAL, waterPotential: { unit: 'Pa', vacuole: -100_000, cytosol: -300_000, external: -300_000 } },
    { ...MATERIAL, waterPotential: { unit: 'Pa', vacuole: -700_000, cytosol: -300_000, external: -100_000 } },
    { ...MATERIAL, waterPotential: { unit: 'Pa', vacuole: '-100000', cytosol: -300_000, external: -700_000 } },
    { ...MATERIAL, waterPotential: { unit: 'MPa', vacuole: -0.1, cytosol: -0.3, external: -0.7 } },
    { ...MATERIAL, waterPotential: { vacuole: -100_000, cytosol: -300_000, external: -700_000 } },
    { ...MATERIAL, waterPotential: null },
    { ...MATERIAL, addedAssumption: true },
  ];
  for (const [index, material] of invalid.entries()) it(`rejects unsupported/contradictory material ${index + 1} without an inferred biological default`, () => {
    const context = createTaskContext({ ...CONTEXT_INPUT, material: material as never });
    for (const text of ['Osmose', 'Diffusion', 'Plasmolyse']) expect(EVALUATOR.evaluate(context, { fieldId: 'process', text }, 'independent')).toMatchObject({ status: 'technical', feedbackCode: 'OSMOSIS_CONTEXT' });
  });
  for (const key of ['taskVersion', 'rubricVersion', 'contentVersion', 'modelVersion'] as const) it(`binds ${key} separately and rejects obsolete handoff`, () => {
    const changed = createTaskContext({ ...CONTEXT_INPUT, [key]: 'changed' });
    const old = evaluate('Osmose');
    expect(isResultForContext(old, changed)).toBe(false);
    expect(() => createEvaluatedAttempt('stale', old, changed)).toThrow();
    expect(EVALUATOR.evaluate(changed, { fieldId: 'process', text: 'Osmose' }, 'independent')).toMatchObject({ status: 'technical', feedbackCode: 'OSMOSIS_VERSION' });
    expect(createOsmosisEvaluator({ ...VERSIONS, [key]: 'changed' }).evaluate(changed, { fieldId: 'process', text: 'Osmose' }, 'independent').status).toBe('correct');
  });
  it('invalidates old results after valid new potential/profile/phase/instance/seed, and forbids a second model truth source', () => {
    const old = evaluate('Osmose');
    for (const change of [{ material: { ...MATERIAL, waterPotential: { ...MATERIAL.waterPotential, vacuole: -120_000 } } }, { phase: 'predict' as const }, { seed: 'other' }, { instanceId: 'other' }]) {
      const next = createTaskContext({ ...CONTEXT_INPUT, ...change });
      expect(isResultForContext(old, next)).toBe(false);
      expect(EVALUATOR.evaluate(next, { fieldId: 'process', text: 'Osmose' }, 'independent').status).toBe('correct');
    }
    const unsupported = createTaskContext({ ...CONTEXT_INPUT, modelState: { cellProfile: 'animal_epithelial' } });
    expect(EVALUATOR.evaluate(unsupported, { fieldId: 'process', text: 'Osmose' }, 'independent')).toMatchObject({ status: 'technical', feedbackCode: 'OSMOSIS_CONTEXT' });
  });
  it('rejects nonfinite/invalid snapshots and forged hashes instead of inventing a bound result', () => {
    for (const value of [NaN, Infinity, -Infinity]) expect(() => createTaskContext({ ...CONTEXT_INPUT, material: { ...MATERIAL, waterPotential: { ...MATERIAL.waterPotential, vacuole: value } } })).toThrow();
    expect(() => EVALUATOR.evaluate({ ...CONTEXT, contextHash: 'sha256-v1:forged' }, { fieldId: 'process', text: 'Osmose' }, 'independent')).toThrow();
  });
});

describe('shared boundaries, complete evidence and assistance', () => {
  it('does not confuse fields, tasks, scientific concepts or membrane naming frames', () => {
    expect(EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'process', text: 'Osmose' }, 'independent').status).toBe('technical');
    expect(TEST_EVALUATOR.evaluate(CONTEXT, { fieldId: 'term', text: 'Tonoplast' }, 'independent').status).toBe('technical');
    for (const fieldId of ['term', 'direction', 'volume', 'other']) expect(EVALUATOR.evaluate(CONTEXT, { fieldId, text: 'Osmose' }, 'independent').status).toBe('technical');
    for (const text of ['Tonoplast', 'Die Membran heißt Osmose.', 'Die Vakuole wird von Osmose begrenzt.']) expect(evaluate(text).status).toBe('clarify');
    for (const text of ['Osmose', 'Der Vorgang heißt Tonoplast.', 'Osmose ist passiver Transport.']) expect(TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text }, 'independent').status).toBe('clarify');
  });
  it('checks complete input before normalizing, without grading a valid prefix', () => {
    expect(evaluate('Osmose' + ' '.repeat(4090)).status).toBe('correct');
    expect(evaluate('Osmose' + ' '.repeat(4091))).toMatchObject({ status: 'technical', feedbackCode: 'OSMOSIS_TOO_LONG' });
    expect(evaluate('Osmose' + ' '.repeat(4040) + ' und nicht Osmose').status).toBe('incorrect');
    for (const text of ['Osmose\u202e', 'Osmose\ud800', 'Osmose\u200b']) expect(evaluate(text).status).toBe('technical');
  });
  it('preserves original decomposed characters and both spans of an explicit contradiction', () => {
    const text = '\tDas ist Osmose.\nEs ist keine Osmose.';
    const result = evaluate(text);
    expect(result).toMatchObject({ status: 'incorrect', feedbackCode: 'OSMOSIS_CONTRADICTION' });
    expect(result.criteria[0]!.evidence).toEqual([
      { kind: 'input_span', start: 1, end: 15, value: 'Das ist Osmose' },
      { kind: 'input_span', start: 17, end: 36, value: 'Es ist keine Osmose' },
    ]);
    expect(evaluate('Das mu\u0308sste Osmose sein.').status).toBe('correct');
  });
  it('keeps orthogonal assistance and never turns a viewed solution into independent success', () => {
    for (const text of ['Osmose', 'Plasmolyse', 'Diffusion', 'Osmose oder Diffusion', '', null]) {
      const baseline = evaluate(text);
      for (const assistance of ASSISTANCE_KINDS) {
        const result = EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text }, assistance);
        expect(result).toEqual({ ...baseline, assistance });
      }
    }
    const viewed = EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text: 'Osmose' }, 'solution_viewed');
    expect(viewed).toMatchObject({ status: 'correct', assistance: 'solution_viewed' });
    expect(() => createEvaluatedAttempt('viewed', viewed, CONTEXT)).toThrow(IncompleteTaskAssessmentError);
  });
  it('rejects untrusted input records/accessors and invalid version/assistance contracts without coercion', () => {
    let called = false;
    const getter = Object.defineProperty({ fieldId: 'process' }, 'text', { enumerable: true, get() { called = true; return 'Osmose'; } });
    for (const response of [{}, 'Osmose', { fieldId: 'process' }, { fieldId: 'process', text: 'Osmose', raw: 'x' }, getter]) expect(EVALUATOR.evaluate(CONTEXT, response, 'independent').status).toBe('technical');
    expect(called).toBe(false);
    expect(() => EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text: 'Osmose' }, 'none' as never)).toThrow(AssessmentContractError);
    for (const value of ['', ' a ', 'x'.repeat(257)]) expect(() => createOsmosisEvaluator({ ...VERSIONS, rubricVersion: value })).toThrow();
    expect(() => getOsmosisFeedback('TONOPLAST_CORRECT')).toThrow();
  });
  it('snapshots version/input data, returns frozen results and retains no mutable response reference', () => {
    const versions = { ...VERSIONS } as Record<keyof typeof VERSIONS, string>;
    const evaluator = createOsmosisEvaluator(versions); versions.rubricVersion = 'changed';
    const response = { fieldId: 'process', text: 'Osmose' };
    const result = evaluator.evaluate(CONTEXT, response, 'independent'); response.text = 'Plasmolyse';
    expect(result.status).toBe('correct'); expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.criteria[0]!.evidence[0])).toBe(true);
    expect(result.criteria[0]!.evidence[0]!.value).toBe('Osmose');
  });
});

describe('new grammar safety combinations', () => {
  it('never records the process-only criterion as a complete M6.02 task', () => {
    for (const assistance of ASSISTANCE_KINDS) {
      for (const text of ['Osmose', 'Diffusion', 'Plasmolyse', '', null]) {
        expect(() => createEvaluatedAttempt('field-only', EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text }, assistance), CONTEXT)).toThrow(IncompleteTaskAssessmentError);
      }
    }
  });
  for (const frame of [
    (term: string) => `Der Wassertransport heißt ${term}.`,
    (term: string) => `Es handelt sich um ${term}.`,
    (term: string) => `Meines Wissens ist es ${term}.`,
    (term: string) => `Man nennt diesen Vorgang ${term}.`,
    (term: string) => `Der Vorgang wird ${term} genannt.`,
    (term: string) => `Dieser Vorgang ist ${term}.`,
    (term: string) => `Das könnte ${term} sein.`,
    (term: string) => `Ich vermute: ${term}.`,
  ]) it(`does not turn known wrong concepts into the target in frame ${frame('X')}`, () => {
    for (const wrong of ['aktiver Transport', 'aktive Pumpe', 'Endocytose', 'Endozytose', 'Exocytose', 'Exozytose', 'Plasmolyse']) {
      expect(evaluate(frame(wrong)).status, frame(wrong)).toBe('incorrect');
    }
  });
  for (const fixture of OSMOSIS_RECOGNITION_CASES) it(`preserves later relevant assertions after ${fixture.id}`, () => {
    for (const [suffix, expected] of [
      [' Außerdem steuert ein Zellkern jedes Organell.', 'clarify'],
      [' Osmose ist aktiver Transport.', 'incorrect'],
      [' Nicht Osmose.', 'incorrect'],
    ]) {
      expect(evaluate(fixture.input + suffix).status, fixture.input + suffix).toBe(expected);
    }
  });
  it('protects scientific distinctions and treats only explicit documented spellings as typos', () => {
    for (const text of ['Endocytose', 'Exocytose', 'Endozytose', 'Exozytose', 'Plasmolyse']) expect(evaluate(text).status).toBe('incorrect');
    for (const text of ['Osmo', 'Osnose', 'Osmosis', 'Osmosehydro', 'Osm0se', 'Exosmos e', 'Deplasmolyse', 'Hydrophob', 'Hypertonisch']) expect(evaluate(text).status).toBe('clarify');
    for (const text of ['Osmosse', 'Ossmose', 'Osmosee', 'Osmsoe']) expect(evaluate(text)).toMatchObject({ status: 'correct', feedbackCode: 'OSMOSIS_TYPO' });
  });
});
