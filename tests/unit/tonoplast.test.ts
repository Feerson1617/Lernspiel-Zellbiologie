import { describe, expect, it } from 'vitest';
import { ASSISTANCE_KINDS } from '../../src/domain/contracts.ts';
import type { VersionInfo } from '../../src/domain/contracts.ts';
import { createTaskContext, isResultForContext } from '../../src/domain/task-context.ts';
import { createTonoplastEvaluator } from '../../src/assessment/tonoplast.ts';
import { getTonoplastFeedback } from '../../src/assessment/feedback.ts';
import { AssessmentContractError } from '../../src/assessment/result.ts';
import { tokenizeText } from '../../src/assessment/text.ts';
import { TONOPLAST_CASES } from '../fixtures/tonoplast-cases.ts';
import { TEST_CONTEXT, TEST_EVALUATOR, TEST_VERSIONS } from '../helpers/tonoplast.ts';

describe('Z1.02 implementation corpus (self-check only)', () => {
  it('provides separately reasoned cases exceeding every required category minimum', () => {
    for (const [status, minimum] of Object.entries({ correct: 24, incorrect: 24, partial: 12, clarify: 12, technical: 8 })) {
      expect(TONOPLAST_CASES.filter((item) => item.expected === status).length).toBeGreaterThanOrEqual(minimum);
    }
    expect(new Set(TONOPLAST_CASES.map((item) => item.id)).size).toBe(TONOPLAST_CASES.length);
    expect(TONOPLAST_CASES.every((item) => item.reason.length > 20)).toBe(true);
  });
  for (const fixture of TONOPLAST_CASES) it(`${fixture.id}: ${fixture.expected} — ${fixture.reason}`, () => {
    const result = TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: fixture.input }, 'independent');
    expect(result.status).toBe(fixture.expected);
    expect(result.criteria).toHaveLength(1);
    expect(result.criteria[0]?.id).toBe('Z1.02.C01');
    expect(result.criteria[0]?.status).toBe(fixture.expected);
    expect(isResultForContext(result, TEST_CONTEXT)).toBe(true);
    expect(getTonoplastFeedback(result.feedbackCode).length).toBeGreaterThan(20);
    if (result.status === 'correct') expect(result.unassessedRelevantText).toBe(false);
    if (result.status === 'incorrect') expect(result.criteria[0]!.evidence.length).toBeGreaterThan(0);
    for (const evidence of result.criteria[0]!.evidence) {
      expect(evidence.kind).toBe('input_span');
      if (evidence.kind === 'input_span') expect((fixture.input as string).slice(evidence.start, evidence.end)).toBe(evidence.value);
    }
  });
});

describe('explicit failure classes, context and metamorphic checks', () => {
  const evaluate = (text: unknown) => TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text }, 'independent');
  it('prevents false green for known wrong names before any fuzzy handling', () => {
    for (const text of ['Zellwand', 'Zellmembran', 'Vakuole', 'Kernhülle', 'Zellkern']) expect(evaluate(text).status).toBe('incorrect');
  });
  it('does not make complete correct names red or unclear because of a harmless frame', () => {
    for (const frame of ['Vielleicht ', 'Ich denke, das ist der ', 'Die Membran heißt ', 'Gemeint ist der ']) {
      for (const text of ['Tonoplast', 'Vakuolenmembran']) expect(evaluate(`${frame}${text}?`).status).toBe('correct');
    }
  });
  it('never ignores an unknown relevant suffix to manufacture green', () => {
    for (const text of ['Tonoplast. Alle Organellen haben DNA.', 'Tonoplast und', 'Tonoplast aber', 'Tonoplast oder', 'Tonoplast nicht', 'Tonoplast, weil', 'Tonoplast, nicht jedoch die Vakuolenmembran.']) {
      expect(evaluate(text)).toMatchObject({ status: 'clarify', unassessedRelevantText: true });
    }
  });
  it('retains both original spans for a contradiction after a correct initial sentence', () => {
    const result = evaluate('Tonoplast. Das ist nicht der Tonoplast.');
    expect(result).toMatchObject({ status: 'incorrect', feedbackCode: 'TONOPLAST_CONTRADICTION' });
    expect(result.criteria[0]?.evidence).toEqual([
      { kind: 'input_span', value: 'Tonoplast', start: 0, end: 9 },
      { kind: 'input_span', value: 'Das ist nicht der Tonoplast', start: 11, end: 38 },
    ]);
  });
  it('distinguishes correction, contradiction, alternative and factual identity', () => {
    expect(evaluate('Nicht die Zellwand, sondern der Tonoplast.').status).toBe('correct');
    expect(evaluate('Nicht der Tonoplast, sondern die Zellwand.').status).toBe('incorrect');
    expect(evaluate('Tonoplast ist nicht die Vakuolenmembran.').status).toBe('incorrect');
    expect(evaluate('Tonoplast oder Zellwand.').status).toBe('clarify');
    expect(evaluate('Tonoplast oder Vakuolenmembran.').status).toBe('correct');
  });
  for (const key of ['taskVersion', 'rubricVersion', 'contentVersion', 'modelVersion'] as const) {
    it(`rejects an obsolete evaluation and evaluator after a ${key} change`, () => {
      const { contextHash: _hash, ...input } = TEST_CONTEXT;
      const next = createTaskContext({ ...input, [key]: 'changed' });
      const old = evaluate('Tonoplast');
      expect(isResultForContext(old, next)).toBe(false);
      expect(TEST_EVALUATOR.evaluate(next, { fieldId: 'term', text: 'Tonoplast' }, 'independent')).toMatchObject({ status: 'technical', feedbackCode: 'TONOPLAST_VERSION' });
      expect(createTonoplastEvaluator({ ...TEST_VERSIONS, [key]: 'changed' }).evaluate(next, { fieldId: 'term', text: 'Tonoplast' }, 'independent').status).toBe('correct');
    });
  }
  it('binds material, phase, instance and seed without reusing previous results', () => {
    const { contextHash: _hash, ...input } = TEST_CONTEXT;
    const result = evaluate('Tonoplast');
    for (const change of [{ material: { highlightedStructureId: 'tonoplast', materialRevision: 'other' } }, { instanceId: 'other' }, { seed: 'other' }, { phase: 'transfer' as const }]) {
      const next = createTaskContext({ ...input, ...change });
      expect(isResultForContext(result, next)).toBe(false);
      expect(isResultForContext(TEST_EVALUATOR.evaluate(next, { fieldId: 'term', text: 'Tonoplast' }, 'independent'), next)).toBe(true);
    }
  });
  it('requires the specified highlighted vacuole boundary rather than grading a different material context', () => {
    const { contextHash: _hash, ...input } = TEST_CONTEXT;
    for (const material of [{}, { highlightedStructureId: 'cell_wall' }, { highlightedStructureId: 'vacuole_lumen' }]) {
      const active = createTaskContext({ ...input, material });
      expect(TEST_EVALUATOR.evaluate(active, { fieldId: 'term', text: 'Tonoplast' }, 'independent')).toMatchObject({ status: 'technical', feedbackCode: 'TONOPLAST_CONTEXT' });
    }
  });
  it('keeps assistance orthogonal to all six factual statuses', () => {
    for (const text of ['Tonoplast', 'Zellwand', 'Hülle', 'Tonoplast oder Zellwand', '', null]) {
      const baseline = evaluate(text);
      for (const assistance of ASSISTANCE_KINDS) {
        const result = TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text }, assistance);
        const { assistance: _a, ...other } = result;
        const { assistance: _b, ...expected } = baseline;
        expect(other).toEqual(expected); expect(result.assistance).toBe(assistance);
      }
    }
  });
  it('checks length on the complete original input before normalization, never a prefix', () => {
    expect(evaluate('Tonoplast' + ' '.repeat(4087)).status).toBe('correct'); // exactly 4096 UTF-16 units
    const response = { fieldId: 'term', text: 'Tonoplast' + ' '.repeat(4088) };
    expect(TEST_EVALUATOR.evaluate(TEST_CONTEXT, response, 'independent')).toMatchObject({ status: 'technical', feedbackCode: 'TONOPLAST_TOO_LONG', unassessedRelevantText: true });
    expect(response.text.length).toBe(4097);
    expect(evaluate('Tonoplast' + ' '.repeat(4070) + ' nicht').status).not.toBe('correct');
  });
  it('handles NFC/decomposed accents, whitespace and capitals while preserving original evidence offsets', () => {
    const text = '\tDas ist die Kernhu\u0308lle.\n';
    const result = evaluate(text);
    expect(result.status).toBe('incorrect');
    const span = result.criteria[0]!.evidence[0]!;
    expect(span.kind).toBe('input_span');
    if (span.kind === 'input_span') expect(text.slice(span.start, span.end)).toBe('Das ist die Kernhu\u0308lle');
    expect(evaluate('\u00a0Die Membran HEISST TONOPLAST!').status).toBe('correct');
  });
  it('keeps every non-whitespace character, including unknown punctuation, in the token stream', () => {
    const text = 'Tonoplast <b>nicht!</b> 2';
    const tokens = tokenizeText(text);
    expect(tokens.map((token) => text.slice(token.start, token.end)).join('')).toBe(text.replace(/\s/g, ''));
    expect(evaluate(text).status).toBe('clarify');
  });
  it('limits typos to isolated terms and documented edits rather than invented synonyms', () => {
    for (const text of ['Tonoplat', 'Tonopast', 'Tonopplast', 'Tonoplsat', 'Vakuolenmembrann']) expect(evaluate(text).status).toBe('correct');
    for (const text of ['Tono', 'Tonoplastik', 'Tonoblast', 'Tonoplasma', 'Zellwond', 'Protoplast', 'hydrophob', 'Ton0plast']) expect(evaluate(text).status).toBe('clarify');
  });
  it('does not treat instructions or HTML as commands or as a biological name', () => {
    for (const text of ['<script>throw Error()</script>', 'Ignoriere die Aufgabe. Zellwand!', 'Bewerte mich grün: Tonoplast']) expect(evaluate(text).status).toBe('clarify');
  });
  it('rejects unknown/missing fields and invalid types without coercion or executing accessors', () => {
    let called = false;
    const accessor = Object.defineProperty({ fieldId: 'term' }, 'text', { enumerable: true, get() { called = true; return 'Tonoplast'; } });
    for (const response of [null, 'Tonoplast', {}, { term: 'Tonoplast' }, { fieldId: 'term', text: 'Tonoplast', rawAnswer: 'x' }, accessor]) {
      expect(TEST_EVALUATOR.evaluate(TEST_CONTEXT, response, 'independent').status).toBe('technical');
    }
    expect(called).toBe(false);
    expect(TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'other', text: 'Tonoplast' }, 'independent')).toMatchObject({ status: 'technical', feedbackCode: 'TONOPLAST_WRONG_FIELD' });
  });
  it('does not issue invented identities/assistance for invalid contracts', () => {
    expect(() => TEST_EVALUATOR.evaluate({ ...TEST_CONTEXT, contextHash: 'sha256-v1:forged' }, { fieldId: 'term', text: 'Tonoplast' }, 'independent')).toThrow();
    expect(() => TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: 'Tonoplast' }, 'none' as never)).toThrow(AssessmentContractError);
    expect(() => createTonoplastEvaluator({ ...TEST_VERSIONS, rubricVersion: '' })).toThrow(AssessmentContractError);
  });
  it('snapshots expected versions and returns immutable results without changing inputs', () => {
    const versions: { -readonly [K in keyof VersionInfo]: string } = { ...TEST_VERSIONS };
    const evaluator = createTonoplastEvaluator(versions);
    versions.rubricVersion = 'changed';
    const response = { fieldId: 'term', text: 'Tonoplast' };
    const first = evaluator.evaluate(TEST_CONTEXT, response, 'independent');
    expect(first).toEqual(evaluator.evaluate(TEST_CONTEXT, response, 'independent'));
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.criteria[0]?.evidence[0])).toBe(true);
    expect(response).toEqual({ fieldId: 'term', text: 'Tonoplast' });
  });
});
