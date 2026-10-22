import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { EvaluationResult as DesignResult } from '../../spec/contracts.d.ts';
import { AssessmentContractError, parseEvaluationResult } from '../../src/assessment/result.ts';
import { ASSISTANCE_LABELS, STATUS_PRESENTATION } from '../../src/ui/feedback-presentation.ts';
import { getTonoplastFeedback } from '../../src/assessment/feedback.ts';
import { editDistance, isLimitedTypo } from '../../src/assessment/text.ts';
import { TEST_CONTEXT, TEST_EVALUATOR } from '../helpers/tonoplast.ts';

const result = () => TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: 'Tonoplast' }, 'hint');
const criterion = () => ({ ...result().criteria[0]! });
describe('runtime result refinement and separate presentation', () => {
  it('matches the design result type and the exact schema fields', () => {
    const typed: DesignResult = result();
    const schema = JSON.parse(readFileSync(new URL('../../spec/result.schema.json', import.meta.url), 'utf8'));
    expect(Object.keys(typed).sort()).toEqual(schema.required.toSorted());
    expect(parseEvaluationResult(typed)).toEqual(typed);
  });
  const invalid: [string, () => unknown][] = [
    ['missing field', () => { const { criteria: _c, ...other } = result(); return other; }],
    ['extra raw answer', () => ({ ...result(), rawAnswer: 'PRIVATE_TEST_MARKER' })],
    ['unknown task', () => ({ ...result(), taskId: 'Z1.99' })],
    ['unknown status', () => ({ ...result(), status: 'passed' })],
    ['unknown assistance', () => ({ ...result(), assistance: 'none' })],
    ['empty version', () => ({ ...result(), rubricVersion: '' })],
    ['invalid hash', () => ({ ...result(), contextHash: 'copied-hash' })],
    ['empty feedback', () => ({ ...result(), feedbackCode: '' })],
    ['green with unassessed text', () => ({ ...result(), unassessedRelevantText: true })],
    ['green without criteria', () => ({ ...result(), criteria: [] })],
    ['green with technical criterion', () => ({ ...result(), criteria: [{ ...criterion(), status: 'technical' }] })],
    ['red without red criterion', () => ({ ...result(), status: 'incorrect' })],
    ['red without evidence', () => ({ ...result(), status: 'incorrect', criteria: [{ ...criterion(), status: 'incorrect', evidence: [] }] })],
    ['duplicate criterion', () => ({ ...result(), criteria: [criterion(), criterion()] })],
    ['unknown criterion status', () => ({ ...result(), criteria: [{ ...criterion(), status: 'passed' }] })],
    ['empty reason', () => ({ ...result(), criteria: [{ ...criterion(), reasonCode: '' }] })],
    ['unknown evidence kind', () => ({ ...result(), criteria: [{ ...criterion(), evidence: [{ kind: 'guess', value: 'x' }] }] })],
    ['reversed span', () => ({ ...result(), criteria: [{ ...criterion(), evidence: [{ kind: 'input_span', value: 'x', start: 2, end: 1 }] }] })],
    ['negative span', () => ({ ...result(), criteria: [{ ...criterion(), evidence: [{ kind: 'input_span', value: 'x', start: -1, end: 0 }] }] })],
    ['incomplete span', () => ({ ...result(), criteria: [{ ...criterion(), evidence: [{ kind: 'input_span', value: 'x', start: 0 }] }] })],
    ['span length mismatch', () => ({ ...result(), criteria: [{ ...criterion(), evidence: [{ kind: 'input_span', value: 'x', start: 0, end: 2 }] }] })],
    ['nonfinite span', () => ({ ...result(), criteria: [{ ...criterion(), evidence: [{ kind: 'input_span', value: 'x', start: 0, end: Infinity }] }] })],
  ];
  for (const [name, input] of invalid) it(`rejects ${name}`, () => {
    expect(() => parseEvaluationResult(input())).toThrow(AssessmentContractError);
    try { parseEvaluationResult(input()); } catch (error) { expect(String(error)).not.toContain('PRIVATE_TEST_MARKER'); }
  });
  it('keeps status, presentation, feedback and support independent', () => {
    expect(STATUS_PRESENTATION.correct).toEqual({ color: 'green', symbol: '✓', label: 'Richtig' });
    expect(STATUS_PRESENTATION.incorrect.color).toBe('red');
    for (const status of ['partial', 'clarify', 'technical'] as const) expect(STATUS_PRESENTATION[status].color).toBe('yellow');
    expect(STATUS_PRESENTATION.empty.color).toBe('neutral');
    expect(new Set(Object.values(STATUS_PRESENTATION).map((value) => value.label)).size).toBe(6);
    expect(ASSISTANCE_LABELS.hint).not.toEqual(ASSISTANCE_LABELS.independent);
    expect(ASSISTANCE_LABELS.solution_viewed).toBe('Lösung angesehen');
    expect(getTonoplastFeedback(result().feedbackCode)).toContain('Cytosol');
    expect(() => getTonoplastFeedback('invented-green')).toThrow();
  });
  it('copies/freeze results before later caller changes', () => {
    const input = JSON.parse(JSON.stringify(result()));
    const parsed = parseEvaluationResult(input);
    input.status = 'incorrect'; input.criteria[0].evidence[0].value = 'changed';
    expect(parsed.status).toBe('correct');
    expect(parsed.criteria[0]?.evidence[0]?.value).toBe('Tonoplast');
    expect(Object.isFrozen(parsed.criteria[0]?.evidence)).toBe(true);
  });
  it('tests spelling distance independently and disallows substitutions/short fragments', () => {
    expect(editDistance('kitten', 'sitting')).toBe(3);
    expect(editDistance('', 'abc')).toBe(3);
    expect(editDistance('abc', '')).toBe(3);
    expect(editDistance('tonoplast', 'tonoplat')).toBe(1);
    expect(editDistance('tonoplsat', 'tonoplast')).toBe(2);
    expect(isLimitedTypo('tonoplsat', 'tonoplast')).toBe(true);
    expect(isLimitedTypo('tonoblast', 'tonoplast')).toBe(false);
    expect(isLimitedTypo('tono', 'tonoplast')).toBe(false);
  });
});
