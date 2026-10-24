import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { afterAll, expect, it } from 'vitest';
import { R4_CASES, R4_KNOWN, executeR4, expectedRuntimeR4, acceptedKnownR4, R4_OSMOSIS_CONTEXT, R4_TONOPLAST_CONTEXT, R4_UNRESOLVED } from '../helpers/p02b-r4.ts';
import { R5_QUESTION_READINGS } from '../fixtures/p02b-r5-boundaries.ts';
import { R4_MAIN, R4_SYSTEMATIC, R4_TARGETED } from '../fixtures/p02b-r4-cases.ts';
import { R3_MAIN, R3_SYSTEMATIC, R3_TARGETED, R3_KNOWN } from '../fixtures/p02b-r3-cases.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { createEvaluatedAttempt, IncompleteTaskAssessmentError } from '../../src/assessment/progress.ts';

const cases = R4_CASES.map(f => ({ ...f, expectedRuntime: expectedRuntimeR4(f), ...executeR4(f) }));
const knownCases = R4_KNOWN.map(f => ({ ...f, expectedRuntime: acceptedKnownR4(f), ...executeR4(f) }));
afterAll(() => writeFileSync('qa/generated/p02b-r4-results.json', JSON.stringify({ cases, knownCases }, null, 2) + '\n'));
for (const f of [...cases, ...knownCases]) it(`${f.id}: ${R4_UNRESOLVED.includes(f.id) ? 'records unresolved original Soll; no acceptance' : 'regression'} — ${f.text}`, () => {
  expect(f.expectedRuntime, f.id).toContain(f.result.status);
  expect(isResultForContext(f.result, f.field === 'osmosis' ? R4_OSMOSIS_CONTEXT : R4_TONOPLAST_CONTEXT)).toBe(true);
  expect(f.result.criteria).toHaveLength(1);
  expect(f.result.criteria[0]!.id).toBe(f.field === 'osmosis' ? 'M6.02.C01' : 'Z1.02.C01');
  expect(f.feedback.length).toBeGreaterThan(20);
  if (f.result.status === 'correct') expect(f.result.unassessedRelevantText).toBe(false);
  for (const e of f.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
  if (f.field === 'osmosis') expect(() => createEvaluatedAttempt(`r4-${f.id}`, f.result, R4_OSMOSIS_CONTEXT)).toThrow(IncompleteTaskAssessmentError);
});

it('preserves all four supplied corpora and the separately frozen new self-check', () => {
  const hash = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
  expect([R4_MAIN.length, R4_SYSTEMATIC.length, R4_TARGETED.length, R4_KNOWN.length]).toEqual([183, 290, 32, 1021]);
  expect([R4_MAIN, R4_SYSTEMATIC, R4_TARGETED, R4_KNOWN].map(hash)).toEqual([
    '8f52cddf4b2f986956486d936bd109491238079386dec0c78c517da66520f1d7',
    '7619d0de0965f583e877b2f467a54114088948d951ba170e4488586c80d86aec',
    '4202993bf79619606ac573be22ea6d2c21a2bc294d42bfd58f95c837a808b87c',
    'e121ae8296d687bc2155a37ff2c3c7aa26149bb5aee39d2660c81cbc3fb6e0c0',
  ]);
  expect(R4_KNOWN).toEqual([R3_KNOWN, R3_MAIN, R3_SYSTEMATIC, R3_TARGETED].flatMap((list, i) => list.map(f => ({ ...f, id: `previous${i}-${f.id}`, group: `previous${i}-${f.group}` }))));
  expect(createHash('sha256').update(readFileSync('tests/fixtures/p02b-r4-fresh.ts')).digest('hex')).toBe('7e2fab84acb08cc254cb50881e389c33090a4eae28af5d294ad325d4d4411ef1');
  expect(R4_UNRESOLVED).toHaveLength(51);
});

for (const f of R4_MAIN.filter(f => f.group === 'short-correct')) it(`${f.id}: consumes the entire new frame with wrong, partial, alternative, negative and added claims`, () => {
  const evaluate = (text: string) => executeR4({ field: 'osmosis', text }).result.status;
  for (const [name, status] of [['Exocytose', 'incorrect'], ['Diffusion', 'partial'], ['Osmose oder Exocytose', 'clarify'], ['nicht Osmose', 'incorrect']] as const) expect(evaluate(f.text.replace('Osmose', name)), name).toBe(status);
  expect(evaluate(f.text + ' Osmose ist keine Diffusion.')).toBe('incorrect');
  expect(evaluate(f.text + ' Wasser kann immer nur nach innen fließen.')).toBe('clarify');
});

for (const [field, target, synonym, wrong, predicate] of [
  ['osmosis', 'Osmose', 'Osmosse', 'Endocytose', 'Osmose ist passive Wasserbewegung.'],
  ['tonoplast', 'Tonoplast', 'Vakuolenmembran', 'Zellwand', 'Tonoplast ist eine Membran.'],
] as const) it(`${field}: preserves exclusions, open questions and mandatory sentence endings`, () => {
  const evaluate = (text: string) => executeR4({ field, text }).result.status;
  expect(evaluate(`Nicht ${target} und nicht ${synonym}. ${predicate}`)).toBe('incorrect');
  expect(evaluate(`Nicht ${target} und nicht ${wrong}. ${predicate}`)).toBe('clarify');
  expect(evaluate(`Vielleicht doch keine ${target}? Vielleicht ${wrong}?`)).toBe('clarify');
  // R5 explicitly revises the prior literal-exclusion reading; preserve its
  // original own Soll beside the symmetric tentative-question decision.
  const reading = R5_QUESTION_READINGS.find(r => r.field === field)!;
  expect(reading.text).toBe(`Vielleicht doch keine ${target}? Vielleicht ${synonym}?`);
  expect(reading.originalExpected).toEqual(['incorrect']);
  expect(evaluate(reading.text)).toBe(reading.decidedExpected[0]);
  expect(evaluate(`Vielleicht doch keine ${target}. Vielleicht ${wrong}?`)).toBe('incorrect');
  expect(evaluate(`Nicht ${target}? Vielleicht ${wrong}?`)).toBe('incorrect');
  expect(evaluate(`Vielleicht ${wrong}?`)).toBe('incorrect');
  expect(evaluate(`Vielleicht keine ${target}?`)).toBe('incorrect');
  expect(evaluate(`Vielleicht keine ${target}? Vielleicht ${wrong}? ${predicate}`)).toBe('incorrect');
  expect(evaluate(`Vielleicht keine ${target}? Vielleicht ${wrong}? Unbekannte Behauptung.`)).toBe('clarify');
  for (const text of [`Ich würde mich auf ${target}.`, `Ich würde in das Feld ${target}.`, `Der Name ist vielleicht nicht ${target}.`, `Ich bin mir beim Namen nicht ganz sicher: nicht ${target}.`]) expect(evaluate(text)).not.toBe('correct');
  expect(evaluate(`Ich bin mir bei der Konzentration nicht ganz sicher: ${target}.`)).toBe('clarify');
  expect(evaluate(`Ich bin mir beim Namen nicht ganz sicher: ${target}. Die Konzentration wächst immer.`)).toBe('clarify');
});

it('keeps field-specific naming nouns and scientific references in their own profile', () => {
  expect(executeR4({ field: 'tonoplast', text: 'Der Vorgangsname ist Tonoplast.' }).result.status).toBe('clarify');
  expect(executeR4({ field: 'osmosis', text: 'Der Membranname ist Osmose.' }).result.status).toBe('clarify');
  expect(executeR4({ field: 'osmosis', text: 'Die Membran heißt Osmose.' }).result.status).toBe('clarify');
  expect(executeR4({ field: 'tonoplast', text: 'Der Wassertransport heißt Tonoplast.' }).result.status).toBe('clarify');
});
