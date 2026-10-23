import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { afterAll, expect, it } from 'vitest';
import { R5_CASES, R5_KNOWN, executeR5, expectedRuntimeR5, acceptedKnownR5, R5_OSMOSIS_CONTEXT, R5_TONOPLAST_CONTEXT, R5_UNRESOLVED } from '../helpers/p02b-r5.ts';
import { R5_MAIN, R5_SYSTEMATIC, R5_TARGETED } from '../fixtures/p02b-r5-cases.ts';
import { R4_MAIN, R4_SYSTEMATIC, R4_TARGETED, R4_KNOWN } from '../fixtures/p02b-r4-cases.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { createEvaluatedAttempt, IncompleteTaskAssessmentError } from '../../src/assessment/progress.ts';

const cases = R5_CASES.map(f => ({ ...f, expectedRuntime: expectedRuntimeR5(f), ...executeR5(f) }));
const knownCases = R5_KNOWN.map(f => ({ ...f, expectedRuntime: acceptedKnownR5(f), ...executeR5(f) }));
afterAll(() => writeFileSync('qa/generated/p02b-r5-results.json', JSON.stringify({ cases, knownCases }, null, 2) + '\n'));
for (const f of [...cases, ...knownCases]) it(`${f.id}: ${R5_UNRESOLVED.includes(f.id) ? 'records unresolved original Soll; no acceptance' : 'regression'} — ${f.text}`, () => {
  expect(f.expectedRuntime, f.id).toContain(f.result.status);
  expect(isResultForContext(f.result, f.field === 'osmosis' ? R5_OSMOSIS_CONTEXT : R5_TONOPLAST_CONTEXT)).toBe(true);
  expect(f.result.criteria).toHaveLength(1);
  expect(f.result.criteria[0]!.id).toBe(f.field === 'osmosis' ? 'M6.02.C01' : 'Z1.02.C01');
  expect(f.feedback.length).toBeGreaterThan(20);
  if (f.result.status === 'correct') expect(f.result.unassessedRelevantText).toBe(false);
  for (const e of f.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
  if (f.field === 'osmosis') expect(() => createEvaluatedAttempt(`r4-${f.id}`, f.result, R5_OSMOSIS_CONTEXT)).toThrow(IncompleteTaskAssessmentError);
});

it('preserves all four supplied corpora and the separately frozen new self-check', () => {
  const hash = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
  expect([R5_MAIN.length, R5_SYSTEMATIC.length, R5_TARGETED.length, R5_KNOWN.length]).toEqual([183, 290, 24, 1526]);
  expect([R5_MAIN, R5_SYSTEMATIC, R5_TARGETED, R5_KNOWN].map(hash)).toEqual([
    '43f56178b2c2adb9634e4678eea911d396055e48eecdb8df60c9495e67448cce',
    '6bf1a0a694421b30259f1c03414a915cce3eaeea9c0169a5d23f6c49076a51b0',
    '20b64bd1f0a6f94b2794c16b144f67da7ec9f0d26624036e4159c2c24d86c5d0',
    '4fc1144b2716ddb22b8586cd95622c73ed630dd200d32a68cc9b9c63229b4e26',
  ]);
  expect(R5_KNOWN).toEqual([R4_KNOWN, R4_MAIN, R4_SYSTEMATIC, R4_TARGETED].flatMap((list, i) => list.map(f => ({ ...f, id: `previous${i}-${f.id}`, group: `previous${i}-${f.group}` }))));
  expect(createHash('sha256').update(readFileSync('tests/fixtures/p02b-r5-fresh.ts')).digest('hex')).toBe('7a18b4357986ffb6b786f06f4feea9d8c01e96ef5f1e91e460c6c9612355f197');
  expect(R5_UNRESOLVED).toHaveLength(48);
});

for (const f of R5_MAIN.filter(f => f.group === 'short-correct')) it(`${f.id}: consumes the entire new frame with wrong, partial, alternative, negative and added claims`, () => {
  const evaluate = (text: string) => executeR5({ field: 'osmosis', text }).result.status;
  for (const [name, status] of [['Exocytose', 'incorrect'], ['Diffusion', 'partial'], ['Osmose oder Exocytose', 'clarify'], ['nicht Osmose', 'incorrect']] as const) expect(evaluate(f.text.replace('Osmose', name)), name).toBe(status);
  expect(evaluate(f.text + ' Osmose ist keine Diffusion.')).toBe('incorrect');
  expect(evaluate(f.text + ' Wasser kann immer nur nach innen fließen.')).toBe('clarify');
});

for (const [field, target, synonym, wrong, predicate] of [
  ['osmosis', 'Osmose', 'Osmosse', 'Endocytose', 'Osmose ist passive Wasserbewegung.'],
  ['tonoplast', 'Tonoplast', 'Vakuolenmembran', 'Zellwand', 'Tonoplast ist eine Membran.'],
] as const) it(`${field}: preserves exclusions, open questions and mandatory sentence endings`, () => {
  const evaluate = (text: string) => executeR5({ field, text }).result.status;
  expect(evaluate(`Nicht ${target} und nicht ${synonym}. ${predicate}`)).toBe('incorrect');
  expect(evaluate(`Nicht ${target} und nicht ${wrong}. ${predicate}`)).toBe('clarify');
  expect(evaluate(`Vielleicht doch keine ${target}? Vielleicht ${wrong}?`)).toBe('clarify');
  expect(evaluate(`Vielleicht doch keine ${target}? Vielleicht ${synonym}?`)).toBe('clarify');
  expect(evaluate(`Vielleicht ${wrong}? Vielleicht nicht ${target}?`)).toBe('clarify');
  expect(evaluate(`Vielleicht ${target}? Vielleicht nicht ${target}?`)).toBe('clarify');
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
  expect(executeR5({ field: 'tonoplast', text: 'Der Vorgangsname ist Tonoplast.' }).result.status).toBe('clarify');
  expect(executeR5({ field: 'osmosis', text: 'Der Membranname ist Osmose.' }).result.status).toBe('clarify');
  expect(executeR5({ field: 'osmosis', text: 'Die Membran heißt Osmose.' }).result.status).toBe('clarify');
  expect(executeR5({ field: 'tonoplast', text: 'Der Wassertransport heißt Tonoplast.' }).result.status).toBe('clarify');
});
