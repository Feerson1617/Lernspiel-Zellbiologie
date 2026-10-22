import { expect, it } from 'vitest';
import { OSMOSIS_REVIEW_CASES, OSMOSIS_NEW_NEGATION, OSMOSIS_NEW_SHORT, OSMOSIS_NEW_STRESS, OSMOSIS_NEW_UNCERTAIN, OSMOSIS_NEW_WRONG, OSMOSIS_CONTRADICTIONS, OSMOSIS_REVISION_CASES } from '../fixtures/osmosis-revision-cases.ts';
import { OSMOSIS_TEST_CONTEXT as CONTEXT, OSMOSIS_TEST_EVALUATOR as EVALUATOR } from '../helpers/osmosis.ts';
import { getOsmosisFeedback } from '../../src/assessment/osmosis-feedback.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { TEST_CONTEXT as TONOPLAST_CONTEXT, TEST_EVALUATOR as TONOPLAST_EVALUATOR } from '../helpers/tonoplast.ts';
for (const f of OSMOSIS_REVISION_CASES) it(`${f.id}: ${f.expected} — ${f.input}`, () => {
  const r = EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text: f.input }, 'independent');
  expect(r.status).toBe(f.expected);
  expect(r.criteria).toHaveLength(1);
  expect(r.criteria[0]).toMatchObject({ id: 'M6.02.C01', status: f.expected, reasonCode: r.feedbackCode });
  expect(isResultForContext(r, CONTEXT)).toBe(true);
  expect(getOsmosisFeedback(r.feedbackCode).length).toBeGreaterThan(20);
  if (r.status === 'correct') expect(r.unassessedRelevantText).toBe(false);
  if (r.status === 'incorrect') expect(r.criteria[0]!.evidence.length).toBeGreaterThan(0);
  for (const s of r.criteria[0]!.evidence) if (s.kind === 'input_span') expect(f.input.slice(s.start, s.end)).toBe(s.value);
});

for (const f of [...OSMOSIS_REVIEW_CASES.filter(f => f.expected === 'correct'), ...OSMOSIS_NEW_SHORT]) it(`new frame ${f.id}: false names, alternatives, partials and unknown additions`, () => {
  const evaluate = (text: string) => EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text }, 'hint');
  for (const term of ['aktiver Transport', 'Endocytose', 'Exocytose', 'Plasmolyse']) {
    const text = f.input.replace('Osmose', term);
    expect(evaluate(text).status, text).toBe('incorrect');
  }
  const ambiguous = f.input.replace('Osmose', 'Osmose oder Plasmolyse');
  expect(evaluate(ambiguous).status, ambiguous).toBe('clarify');
  const suffix = `${f.input} Außerdem besitzen alle Membranen Ribosomen.`;
  expect(evaluate(suffix)).toMatchObject({ status: 'clarify', unassessedRelevantText: true, assistance: 'hint' });
});

it('keeps required frame endings, uncertainty negation and unrecognized internal text intact', () => {
  for (const text of [
    'Mir fällt Osmose nicht ein.', 'Ich nehme Osmose zurück.', 'Ich würde auf Osmose nicht tippen.',
    'Ich vermute, dass es Osmose nicht ist.', 'Das ist, weil Wasser verschwindet, Osmose.',
    'Osmose, wenn die Zellwand schrumpft.', 'Ich denke nicht nicht an Osmose.',
    'Als Antwort würde ich Osmose', 'Auf Osmose würde ich', 'Osmose, denke ich mal nicht.',
  ]) expect(EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text }, 'independent').status, text).toBe('clarify');
});

it('uses common naming grammar with separate task meanings and original evidence in both correctors', () => {
  for (const frame of ['Die richtige Antwort lautet X.', 'Ich tippe auf X.', 'Ich halte das für X.', 'X wäre meine Antwort.']) {
    for (const [evaluator, context, fieldId, term, wrong] of [
      [EVALUATOR, CONTEXT, 'process', 'Osmose', 'Plasmolyse'],
      [TONOPLAST_EVALUATOR, TONOPLAST_CONTEXT, 'term', 'Tonoplast', 'Zellwand'],
    ] as const) {
      for (const [word, expected] of [[term, 'correct'], [wrong, 'incorrect']] as const) {
        const text = `\t${frame.replace('X', word)}`;
        const result = evaluator.evaluate(context, { fieldId, text }, 'independent');
        expect(result.status, text).toBe(expected);
        for (const s of result.criteria[0]!.evidence) if (s.kind === 'input_span') expect(text.slice(s.start, s.end)).toBe(s.value);
      }
    }
  }
  expect(EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text: 'Ich tippe auf Tonoplast.' }, 'independent').status).toBe('clarify');
  expect(TONOPLAST_EVALUATOR.evaluate(TONOPLAST_CONTEXT, { fieldId: 'term', text: 'Ich tippe auf Osmose.' }, 'independent').status).toBe('clarify');
});

it('binds the parallel preposition to the explicit corrective negation without collapsing alternatives', () => {
  for (const [text, status] of [
    ['Ich tippe nicht auf Osmose, sondern auf Plasmolyse.', 'incorrect'],
    ['Ich tippe nicht auf Plasmolyse, sondern auf Osmose.', 'correct'],
    ['Ich denke nicht an Endocytose, sondern an Osmose.', 'correct'],
    ['Ich denke nicht an Osmose, sondern an Osmose.', 'incorrect'],
    ['Ich tippe nicht auf Endocytose, sondern auf Osmose oder Plasmolyse.', 'clarify'],
    ['Ich denke nicht nicht an Osmose.', 'clarify'],
  ]) expect(EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text }, 'independent').status, text).toBe(status);
});
it('composes subordinate naming with certainty verbs/pronouns but keeps negation and scientific suffixes', () => {
  for (const verb of ['Ich denke', 'Ich glaube', 'Ich vermute', 'Ich nehme an']) for (const pronoun of ['es', 'das']) {
    for (const [term, status] of [['Osmose', 'correct'], ['Endocytose', 'incorrect'], ['nicht Osmose', 'incorrect'], ['Osmose oder Plasmolyse', 'clarify']]) {
      const text = `${verb}, dass ${pronoun} ${term} ist.`;
      expect(EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text }, 'independent').status, text).toBe(status);
      if (term === 'Osmose') expect(EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text: text + ' Alle Zellen sind ATP-Pumpen.' }, 'independent').status).toBe('clarify');
    }
  }
});
it('measures all new short correct answers and preserves every requested category minimum', () => {
  expect(OSMOSIS_NEW_SHORT.length).toBeGreaterThanOrEqual(40);
  expect(OSMOSIS_NEW_WRONG.length).toBeGreaterThanOrEqual(20);
  expect(OSMOSIS_NEW_UNCERTAIN.length).toBeGreaterThanOrEqual(12);
  expect(OSMOSIS_NEW_NEGATION.length).toBeGreaterThanOrEqual(20);
  expect(OSMOSIS_CONTRADICTIONS.length).toBeGreaterThanOrEqual(100);
  const r = OSMOSIS_NEW_SHORT.map(f => EVALUATOR.evaluate(CONTEXT, { fieldId: 'process', text: f.input }, 'independent'));
  expect(r.filter(x => x.status === 'correct').length / r.length).toBeGreaterThanOrEqual(0.95);
  expect(r.filter(x => x.status === 'incorrect')).toEqual([]);
  expect(new Set(OSMOSIS_REVISION_CASES.map(f => f.id)).size).toBe(OSMOSIS_REVISION_CASES.length);
  expect(OSMOSIS_NEW_STRESS).toHaveLength(10); // All ten stay in its separate recognition denominator, including yellow.
});
