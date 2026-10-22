import { describe, expect, it } from 'vitest';
import { getTonoplastFeedback } from '../../src/assessment/feedback.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { createEvaluatedAttempt } from '../../src/assessment/progress.ts';
import { appendAttempt, getAttemptOutcome, parseProgress } from '../../src/domain/progress.ts';
import { NEW_CORRECT_CASES, NEW_SAFETY_CASES, REVIEW_REGRESSIONS } from '../fixtures/tonoplast-revision-cases.ts';
import { TEST_CONTEXT, TEST_EVALUATOR } from '../helpers/tonoplast.ts';

for (const [name, fixtures] of [['supplied review regressions', REVIEW_REGRESSIONS], ['new correct self-check', NEW_CORRECT_CASES], ['new safety self-check', NEW_SAFETY_CASES]] as const) {
  describe(name, () => {
    for (const fixture of fixtures) it(`${fixture.id} ${fixture.expected}: ${fixture.input}`, () => {
      const result = TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: fixture.input }, 'independent');
      expect(result.status).toBe(fixture.expected);
      expect(result.criteria[0]).toMatchObject({ id: 'Z1.02.C01', status: fixture.expected, reasonCode: result.feedbackCode });
      expect(isResultForContext(result, TEST_CONTEXT)).toBe(true);
      expect(getTonoplastFeedback(result.feedbackCode).length).toBeGreaterThan(20);
      if (fixture.expected === 'correct') expect(result.unassessedRelevantText).toBe(false);
      if (fixture.expected === 'incorrect') expect(result.criteria[0]!.evidence.length).toBeGreaterThan(0);
      for (const span of result.criteria[0]!.evidence) {
        expect(span.kind).toBe('input_span');
        if (span.kind === 'input_span') expect(fixture.input.slice(span.start, span.end)).toBe(span.value);
      }
    });
  });
}
it('measures all new complete correct answers, including any yellow results in the denominator', () => {
  expect(NEW_CORRECT_CASES.length).toBeGreaterThanOrEqual(40);
  const results = NEW_CORRECT_CASES.map(({ input }) => TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: input }, 'independent'));
  const green = results.filter(({ status }) => status === 'correct').length;
  expect(green / results.length).toBeGreaterThanOrEqual(0.95);
  expect(results.some(({ status }) => status === 'incorrect')).toBe(false);
  const inputs = [...REVIEW_REGRESSIONS, ...NEW_CORRECT_CASES, ...NEW_SAFETY_CASES];
  expect(new Set(inputs.map(({ input }) => input)).size).toBe(inputs.length);
});

const NAMING_FRAMES = [
  (name: string) => `Ich vermute: ${name}.`,
  (name: string) => `Das ist doch ${name}.`,
  (name: string) => `Es handelt sich um ${name}.`,
  (name: string) => `Meines Wissens ist es ${name}.`,
  (name: string) => `Ich glaube, die heißt ${name}.`,
  (name: string) => `Das könnte ${name} sein.`,
  (name: string) => `Es müsste ${name} sein.`,
  (name: string) => `Die Vakuole besitzt eine Membran namens ${name}.`,
  (name: string) => `Die Membran um das Vakuoleninnere ist ${name}.`,
  (name: string) => `Die Membran zwischen Cytosol und Vakuole heißt ${name}.`,
] as const;
for (const [index, frame] of NAMING_FRAMES.entries()) it(`new naming rule ${index + 1}: exact wrong concepts stay wrong before spelling similarity`, () => {
  for (const name of ['Zellwand', 'Zellmembran', 'Plasmamembran', 'Plasmalemma', 'Kernhülle', 'Kernmembran', 'Vakuole', 'Zellkern']) {
    const result = TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: frame(name) }, 'independent');
    expect(result.status, frame(name)).toBe('incorrect');
    expect(result.criteria[0]!.evidence.length).toBeGreaterThan(0);
  }
});
for (const correct of NEW_CORRECT_CASES) it(`${correct.id}: does not discard a relevant suffix and keeps every original evidence offset`, () => {
  for (const suffix of [' Außerdem besitzen alle Membranen DNA.', ' Nicht die Vakuolenmembran.', ' Tonoplast ist die Zellwand.']) {
    const text = correct.input + suffix;
    const result = TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text }, 'hint');
    expect(result.status, text).toBe(suffix.startsWith(' Außerdem') ? 'clarify' : 'incorrect');
    expect(result.assistance).toBe('hint');
    for (const span of result.criteria[0]!.evidence) if (span.kind === 'input_span') expect(text.slice(span.start, span.end)).toBe(span.value);
  }
});
it('keeps newly recognized wording supported after a viewed solution, without storing its text', () => {
  const result = TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: REVIEW_REGRESSIONS[12]!.input }, 'solution_viewed');
  expect(result.status).toBe('correct');
  const progress = appendAttempt(parseProgress({ schemaVersion: 1, contentVersion: TEST_CONTEXT.contentVersion, attempts: [] }), createEvaluatedAttempt('revision', result, TEST_CONTEXT));
  expect(getAttemptOutcome(progress, 'revision', TEST_CONTEXT)).toMatchObject({ successful: false, independent: false, assistance: 'solution_viewed' });
  expect(JSON.stringify(progress)).not.toMatch(/Tonoplast|evidence|contextHash|text/);
});
for (const [active, passive] of [['umschließt', 'umschlossen'], ['begrenzt', 'begrenzt'], ['umgibt', 'umgeben']]) {
  it(`scopes active/passive ${active} to the named owner and retains explicit negation`, () => {
    const evaluate = (text: string) => TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text }, 'independent');
    expect(evaluate(`Der Tonoplast ${active} die Vakuole.`).status).toBe('correct');
    expect(evaluate(`Die Vakuole wird vom Tonoplasten ${passive}.`).status).toBe('correct');
    expect(evaluate(`Der Tonoplast ${active} nicht die Vakuole.`).status).toBe('incorrect');
    expect(evaluate(`Die Vakuole wird nicht vom Tonoplasten ${passive}.`).status).toBe('incorrect');
    expect(evaluate(`Die Plasmamembran ${active} die Vakuole.`).status).toBe('incorrect');
    expect(evaluate(`Die Vakuole wird von der Kernhülle ${passive}.`).status).toBe('incorrect');
    expect(evaluate(`Der Tonoplast ${active} den Zellkern.`).status).toBe('incorrect');
    expect(evaluate(`Der Tonoplast ${active} zuerst die Vakuole und später den Zellkern.`).status).toBe('clarify');
  });
}
for (const connect of [
  (other: string) => `Tonoplast (${other}).`,
  (other: string) => `Tonoplast / ${other}.`,
  (other: string) => `Tonoplast – also ${other}.`,
  (other: string) => `Tonoplast, das heißt ${other}.`,
]) it(`distinguishes equivalent/competing appositions: ${connect('X')}`, () => {
  for (const [other, expected] of [['Vakuolenmembran', 'correct'], ['Plasmamembran', 'clarify'], ['Kernmembran', 'clarify'], ['Protoplast', 'clarify']]) {
    expect(TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text: connect(other!) }, 'independent').status).toBe(expected);
  }
});
it('keeps complete original modal and parenthetical spans, including punctuation inside the claim', () => {
  for (const text of ['  Es müsste der Tonoplast sein. ', ' Vakuolenmembran (Tonoplast).', ' Die Vakuole besitzt eine Membran namens Tonoplast.']) {
    const result = TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text }, 'independent');
    expect(result.status).toBe('correct');
    expect(result.criteria[0]!.evidence).toEqual([{ kind: 'input_span', value: text.trim().slice(0, -1), start: text.indexOf(text.trim()), end: text.lastIndexOf('.') }]);
  }
});
it('does not turn a general membrane class into a strict synonym or skip naming words inside an enclosure relation', () => {
  for (const text of ['Tonoplast ist ein anderer Name für Membran.', 'Tonoplast umschließt ein anderer Name für Vakuole.']) {
    expect(TEST_EVALUATOR.evaluate(TEST_CONTEXT, { fieldId: 'term', text }, 'independent').status, text).toBe('clarify');
  }
});
