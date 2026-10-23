import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { afterAll, expect, it } from 'vitest';
import { FOURTH_CASES, FOURTH_RETRACTION_CASES, executeFourth, acceptedFourth, FOURTH_OSMOSIS_CONTEXT, FOURTH_TONOPLAST_CONTEXT } from '../helpers/p02b-fourth.ts';
import { FOURTH_MAIN, FOURTH_TARGETED, FOURTH_KNOWN } from '../fixtures/p02b-20261023-r2-cases.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { parseTermAnswer } from '../../src/assessment/term-grammar.ts';
import { tokenizeText } from '../../src/assessment/text.ts';
import { COUNTERCHECK_CASES } from '../fixtures/p02b-countercheck-cases.ts';
import { SUPPLIED_MAIN, SUPPLIED_DIAGNOSTIC, SUPPLIED_DIAGNOSTIC2 } from '../fixtures/p02b-20261023-cases.ts';

const actual = FOURTH_CASES.map(f => ({ ...f, accepted: acceptedFourth(f), ...executeFourth(f) }));
afterAll(() => writeFileSync('qa/generated/p02b-fourth-results.json', JSON.stringify(actual, null, 2) + '\n'));
afterAll(() => writeFileSync('qa/generated/p02b-fourth-retraction-results.json', JSON.stringify(FOURTH_RETRACTION_CASES.map(f => ({ ...f, ...executeFourth(f) })), null, 2) + '\n'));
for (const f of actual) it(`${f.id}: ${f.accepted.join('|')} — ${f.text}`, () => {
  expect(f.accepted, f.text).toContain(f.result.status);
  expect(isResultForContext(f.result, f.field === 'osmosis' ? FOURTH_OSMOSIS_CONTEXT : FOURTH_TONOPLAST_CONTEXT)).toBe(true);
  expect(f.result.criteria).toHaveLength(1);
  expect(f.result.criteria[0]!.id).toBe(f.field === 'osmosis' ? 'M6.02.C01' : 'Z1.02.C01');
  expect(f.feedback.length).toBeGreaterThan(20);
  if (f.result.status === 'correct') expect(f.result.unassessedRelevantText).toBe(false);
  for (const e of f.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
});

it('binds every original raw record and both pre-run self-check files without changing expectations', () => {
  const hash = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
  expect([FOURTH_MAIN.length, FOURTH_TARGETED.length, FOURTH_KNOWN.length]).toEqual([176, 34, 368]);
  expect([hash(FOURTH_MAIN), hash(FOURTH_TARGETED), hash(FOURTH_KNOWN)]).toEqual([
    '8b6e7c72a8fdbe6100cfa49951a8db2b2809384ea863fe19df4848ffcfec82d8',
    'd84a09438344bd8197ba4b58f229ea730efdf209bb156663d6030ef5d62ea005',
    '0e656ff78c16db50e523f1b1388317f7054163cfe7d1a0e91badc5b185a81e4e',
  ]);
  const fileHash = (name: string) => createHash('sha256').update(readFileSync(name)).digest('hex');
  expect(fileHash('tests/fixtures/p02b-20261023-r2-fresh.ts')).toBe('0a06125b2b61fc04deaacaa4c7ca5522ad7b8a117450cb9b7898ce480a15fae3');
  expect(fileHash('tests/fixtures/p02b-20261023-r2-additions.ts')).toBe('ffcbd4070e7c23bf50f0ebc238f148f746852810dff55ffe18faec27e992c28d');
  expect(new Set(FOURTH_CASES.map(f => f.id)).size).toBe(956);
  expect(FOURTH_KNOWN).toEqual([COUNTERCHECK_CASES, SUPPLIED_MAIN, SUPPLIED_DIAGNOSTIC, SUPPLIED_DIAGNOSTIC2]
    .flatMap((list, i) => list.map(f => ({ ...f, id: `known${i}-${f.id}`, group: `known${i}-${f.group}` }))));
});

for (const f of FOURTH_TARGETED.filter(f => f.group.startsWith('reaffirm-'))) it(`${f.id}: retains both original positive evidence spans, never inventing a negation`, () => {
  const { result, feedback } = executeFourth(f);
  expect(result.status).toBe('correct');
  const evidence = result.criteria[0]!.evidence.filter(e => e.kind === 'input_span');
  expect(evidence).toHaveLength(2);
  expect(evidence[0]!.start).toBe(0);
  expect(evidence[1]!.value).toMatch(/(?:Es|Das) ist in Wirklichkeit/u);
  expect(feedback).not.toMatch(/widerspr|vernein/iu);
});

for (const [field, target, synonym, wrong] of [
  ['osmosis', 'Osmose', 'Osmosse', 'Plasmolyse'],
  ['tonoplast', 'Tonoplast', 'Vakuolenmembran', 'Zellwand'],
] as const) it(`${field}: repetition, synonym, correction, exclusion and unassessed content stay distinct`, () => {
  const evaluate = (text: string) => executeFourth({ field, text }).result;
  for (const text of [`${target}. Das ist in Wirklichkeit ${target}.`, `${synonym}. Es ist in Wirklichkeit ${target}.`]) expect(evaluate(text).status).toBe('correct');
  expect(evaluate(`${wrong}. Das ist in Wirklichkeit ${target}.`).status).toBe('correct');
  expect(evaluate(`${wrong}. Das ist in Wirklichkeit ${wrong}.`).status).toBe('incorrect');
  for (const text of [`Nicht ${target}, sondern ${target}.`, `Nicht ${target}, sondern ${synonym}.`, `${target}. Das ist in Wirklichkeit nicht ${target}.`]) expect(evaluate(text).status).toBe('incorrect');
  expect(evaluate(`${target} oder ${wrong}. Es ist in Wirklichkeit ${target}.`).status).toBe('clarify');
  expect(evaluate(`${target}. Es ist in Wirklichkeit ${target}. Alle Organellen sind Zellwände.`)).toMatchObject({ status: 'clarify', unassessedRelevantText: true });
  const meanings = [{ id: 'target', forms: [[target.toLowerCase()], [synonym.toLowerCase()]] }, { id: 'wrong', forms: [[wrong.toLowerCase()]] }];
  const repeated = parseTermAnswer(tokenizeText(`${target}. Es ist in Wirklichkeit ${synonym}.`), meanings);
  expect(repeated.complete).toBe(true); expect(repeated.clauses.map(c => c.kind)).toEqual(['name', 'name']);
  const excluded = parseTermAnswer(tokenizeText(`Nicht ${target}, sondern ${synonym}.`), meanings);
  expect(excluded.clauses[0]).toMatchObject({ kind: 'contrast', excluded: { id: 'target' }, chosen: { id: 'target' } });
});

for (const f of FOURTH_MAIN.filter(f => f.group === 'short-correct')) it(`${f.id}: new construction applies to wrong/partial/alternative names and retains every relevant ending`, () => {
  const evaluate = (text: string) => executeFourth({ field: 'osmosis', text }).result;
  for (const word of ['Endocytose', 'Exocytose', 'Plasmolyse', 'aktiven Transport']) expect(evaluate(f.text.replace('Osmose', word)).status, word).toBe('incorrect');
  expect(evaluate(f.text.replace('Osmose', 'Diffusion')).status).toBe('partial');
  for (const word of ['Osmose oder Plasmolyse', 'Osmose beziehungsweise Endocytose', 'Osmose / aktiver Transport']) expect(evaluate(f.text.replace('Osmose', word)).status, word).toBe('clarify');
  expect(evaluate(f.text.replace('Osmose', 'nicht Osmose')).status).not.toBe('correct');
  expect(evaluate(f.text + ' Osmose ist keine Diffusion.').status).toBe('incorrect');
  expect(evaluate(f.text + ' Die Zellwand ist ein Protein.').status).toBe('clarify');
});

for (const f of FOURTH_MAIN.filter(f => f.group === 'tonoplast-correct' && !/Tonoplasten|ist eine Membran/u.test(f.text))) it(`${f.id}: shared syntax preserves separate membrane meanings`, () => {
  const evaluate = (word: string) => executeFourth({ field: 'tonoplast', text: f.text.replace(/Tonoplast|Vakuolenmembran/gu, word) }).result;
  for (const word of ['Zellwand', 'Zellmembran', 'Kernhülle', 'Vakuole']) expect(evaluate(word).status, word).toBe('incorrect');
  expect(evaluate('Membran').status).toBe('partial');
  expect(evaluate('Tonoplast oder Zellmembran').status).toBe('clarify');
});

it('keeps word choice separate from scientific equivalence and never drops a negative or mandatory verb', () => {
  for (const text of [
    'Ich gebe Osmose nicht als Bezeichnung an.', 'Ich würde Osmose als Bezeichnung vermeiden.',
    'Ich beantworte die Teilfrage nicht mit Osmose.', 'Die Bezeichnung Osmose passt nicht zu diesem Transport.',
    'Die Bezeichnung Osmose passt zu diesem aktiven Transport.', 'Ich würde hier als Lösung Osmose.',
    'Ich würde den Vorgang mit Osmose benennen, wenn Wasser aktiv gepumpt wird.',
    'Osmose ist der Fachname des Wassertransports.', 'Osmose ist die richtige Bezeichnung der Diffusion.',
    'Osmose ist nicht der Name der Wasserbewegung.',
    'Ich würde Osmose als Diffusion bezeichnen.', 'Ich würde Diffusion als Osmose bezeichnen.',
  ]) expect(executeFourth({ field: 'osmosis', text }).result.status, text).toBe('clarify');
  expect(executeFourth({ field: 'tonoplast', text: 'Ich würde den Tonoplasten als Zellwand bezeichnen.' }).result.status).toBe('incorrect');
  expect(executeFourth({ field: 'tonoplast', text: 'Ich würde den Tonoplasten als Membran bezeichnen.' }).result.status).toBe('clarify');
});

for (const [field, first, second, target] of [
  ['osmosis', 'Endocytose', 'Exocytose', 'Osmose'],
  ['tonoplast', 'Zellwand', 'Zellmembran', 'Tonoplast'],
] as const) it(`${field}: repeated changes request clarification instead of diagnosing a withdrawn intermediate name`, () => {
  for (const text of [
    `${first}. Es ist in Wirklichkeit ${second}. Es ist in Wirklichkeit ${target}.`,
    `${first}. Es ist in Wirklichkeit ${second}. Es ist in Wirklichkeit ${second}. Es ist in Wirklichkeit ${target}.`,
    `Nicht ${first}, sondern ${second}. Es ist in Wirklichkeit ${target}.`,
    `${target}. Es ist in Wirklichkeit ${first}. Es ist in Wirklichkeit ${target}.`,
  ]) {
    const { result, feedback } = executeFourth({ field, text });
    expect(result).toMatchObject({ status: 'clarify', unassessedRelevantText: true });
    expect(result.criteria[0]!.evidence).toEqual([{ kind: 'input_span', start: 0, end: text.length, value: text }]);
    expect(feedback).not.toMatch(/vernein|widerspr/iu);
  }
  expect(executeFourth({ field, text: `${first}. Es ist in Wirklichkeit ${target}. Es ist in Wirklichkeit ${target}.` }).result.status).toBe('correct');
  expect(executeFourth({ field, text: `Nicht ${target}, sondern ${target}. Es ist in Wirklichkeit ${target}.` }).result.status).toBe('incorrect');
});
