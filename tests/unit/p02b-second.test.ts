import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { afterAll, expect, it } from 'vitest';
import { COUNTERCHECK_CASES } from '../fixtures/p02b-countercheck-cases.ts';
import { FRESH_SHORT } from '../fixtures/p02b-second-language.ts';
import { REVIEW_OSMOSIS_CONTEXT, REVIEW_TONOPLAST_CONTEXT, SECOND_CASES, runSecondCase } from '../helpers/p02b-second.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { getOsmosisFeedback } from '../../src/assessment/osmosis-feedback.ts';
import { getTonoplastFeedback } from '../../src/assessment/feedback.ts';

const actual = SECOND_CASES.map(f => ({ ...f, result: runSecondCase(f.field, f.text) }));
afterAll(() => writeFileSync('qa/generated/p02b-second-results.json', JSON.stringify(actual, null, 2) + '\n'));
for (const { result, ...f } of actual) it(`${f.id}: ${f.expected.join('|')} — ${f.text}`, () => {
  expect(f.expected).toContain(result.status);
  expect(isResultForContext(result, f.field === 'osmosis' ? REVIEW_OSMOSIS_CONTEXT : REVIEW_TONOPLAST_CONTEXT)).toBe(true);
  expect(result.criteria).toHaveLength(1);
  expect(result.criteria[0]!.id).toBe(f.field === 'osmosis' ? 'M6.02.C01' : 'Z1.02.C01');
  expect((f.field === 'osmosis' ? getOsmosisFeedback : getTonoplastFeedback)(result.feedbackCode).length).toBeGreaterThan(20);
  if (result.status === 'correct') expect(result.unassessedRelevantText).toBe(false);
  for (const e of result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
});

it('preserves every supplied field, expected set and rationale byte for byte as canonical JSON', () => {
  // Calculated directly from the supplied cases.mjs before editing runtime code.
  expect(COUNTERCHECK_CASES).toHaveLength(156);
  expect(createHash('sha256').update(JSON.stringify(COUNTERCHECK_CASES)).digest('hex')).toBe('bd09056c7312a1761dea347e838762b58e5a211e2336dfd8c12013eaa933a123');
  expect(createHash('sha256').update(readFileSync('tests/fixtures/p02b-second-language.ts')).digest('hex')).toBe('a79851273a4277eb5394ae58fa604108899d9a31ffbf5a9edd2b1ca17bf88017');
});

for (const f of [...COUNTERCHECK_CASES.filter(f => f.group === 'short-correct'), ...FRESH_SHORT]) it(`${f.id}: substitute false/partial/alternative names and preserve later assertions`, () => {
  const evaluate = (text: string) => runSecondCase('osmosis', text);
  for (const word of ['aktiver Transport', 'Endocytose', 'Exocytose', 'Plasmolyse']) {
    const text = f.text.replace('Osmose', word);
    expect(evaluate(text).status, text).toBe('incorrect');
  }
  expect(evaluate(f.text.replace('Osmose', 'Diffusion')).status).toBe('partial');
  for (const word of ['Osmose oder Plasmolyse', 'Osmose beziehungsweise Endocytose', 'Osmose / aktiver Transport']) {
    expect(evaluate(f.text.replace('Osmose', word)).status, f.id).toBe('clarify');
  }
  for (const suffix of [' Osmose ist eine Form des aktiven Transports.', ' Danke! Osmose ist keine Diffusion von Wasser.']) {
    expect(evaluate(f.text + suffix).status, f.id).toBe('incorrect');
  }
  expect(evaluate(f.text + ' Danke! Alle Organellen sind Bakterien.')).toMatchObject({ status: 'clarify', unassessedRelevantText: true });
});

const commonFrames = [...COUNTERCHECK_CASES.filter(f => f.group === 'short-correct'), ...FRESH_SHORT]
  .filter(f => !/Vorgang|Prozess|Wassertransport|Transportart|Transport/iu.test(f.text));
for (const f of commonFrames) it(`${f.id}: common construction retains the separate tonoplast rubric`, () => {
  for (const [word, expected] of [
    ['Tonoplast', 'correct'], ['Vakuolenmembran', 'correct'], ['Zellwand', 'incorrect'],
    ['Kernhülle', 'incorrect'], ['Membran', 'partial'], ['Tonoplast oder Zellmembran', 'clarify'],
  ] as const) {
    const text = f.text.replace('Osmose', word);
    expect(runSecondCase('tonoplast', text).status, text).toBe(expected);
  }
  const text = f.text.replace('Osmose', 'Tonoplast');
  expect(runSecondCase('tonoplast', text + ' Danke! Tonoplast ist keine Membran.').status).toBe('incorrect');
  expect(runSecondCase('tonoplast', text + ' Danke! Alle Organellen sind Bakterien.').status).toBe('clarify');
});

it('keeps unknown insertions, negation scopes, incomplete endings and competing corrections uncertain', () => {
  for (const text of [
    'Ich würde das Osmose nicht nennen.', 'Ich würde das nicht keine Osmose nennen.',
    'Hier ist Osmose nicht gemeint.', 'Osmose wäre nicht meine Antwort.',
    'Ich würde das Osmose nennen, wenn Wasser aktiv gepumpt wird.',
    'Ich würde den Vorgang Osmose', 'Als Antwort gebe ich Osmose',
    'Hier ist Osmose gemeint oder aktiver Transport.', 'Ich tippe auf Osmose. Danke! Oder Plasmolyse.',
    'Ich würde das Osmose nennen. Nein, Osmose oder Endocytose.',
  ]) expect(runSecondCase('osmosis', text).status, text).toBe('clarify');
});

it('handles explicit neutral-frame negation and corrective negation without guessing alternatives', () => {
  for (const [text, expected] of [
    ['Ich würde das nicht Osmose nennen.', 'incorrect'],
    ['Ich würde das nicht Endocytose, sondern Osmose nennen.', 'correct'],
    ['Ich würde das nicht Osmose, sondern Endocytose nennen.', 'incorrect'],
    ['Ich würde das nicht Endocytose, sondern Osmose oder Plasmolyse nennen.', 'clarify'],
    ['Hier ist nicht Osmose gemeint.', 'incorrect'],
    ['Hier ist nicht Exocytose, sondern Osmose gemeint.', 'correct'],
    ['Ich tippe hier nicht auf Endocytose, sondern auf Osmose.', 'correct'],
    ['Ich tippe hier nicht auf Osmose, sondern auf Endocytose.', 'incorrect'],
    ['Ich meine hier nicht Endocytose, sondern Osmose.', 'correct'],
    ['Ich meine hier nicht Osmose, sondern Plasmolyse.', 'incorrect'],
    ['Nicht Plasmolyse, sondern Osmose. Danke! Osmose ist keine Diffusion.', 'incorrect'],
    ['Nicht Endocytose, sondern Osmose. Danke! Alle Organellen sind Bakterien.', 'clarify'],
  ] as const) expect(runSecondCase('osmosis', text).status, text).toBe(expected);
});
