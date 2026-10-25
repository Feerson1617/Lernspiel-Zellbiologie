import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { afterAll, expect, it } from 'vitest';
import { THIRD_CASES, executeThird, acceptedThird, THIRD_OSMOSIS_CONTEXT, THIRD_TONOPLAST_CONTEXT } from '../helpers/p02b-third.ts';
import { SUPPLIED_MAIN, SUPPLIED_DIAGNOSTIC, SUPPLIED_DIAGNOSTIC2 } from '../fixtures/p02b-20261023-cases.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { parseTermAnswer } from '../../src/assessment/term-grammar.ts';
import { tokenizeText } from '../../src/assessment/text.ts';

const actual = THIRD_CASES.map(f => ({ ...f, accepted: acceptedThird(f), ...executeThird(f) }));
afterAll(() => writeFileSync('qa/generated/p02b-third-results.json', JSON.stringify(actual, null, 2) + '\n'));
for (const f of actual) it(`${f.id}: ${f.accepted.join('|')} — ${f.text}`, () => {
  expect(f.accepted, f.text).toContain(f.result.status);
  expect(isResultForContext(f.result, f.field === 'osmosis' ? THIRD_OSMOSIS_CONTEXT : THIRD_TONOPLAST_CONTEXT)).toBe(true);
  expect(f.result.criteria).toHaveLength(1);
  expect(f.result.criteria[0]!.id).toBe(f.field === 'osmosis' ? 'M6.02.C01' : 'Z1.02.C01');
  expect(f.feedback.length).toBeGreaterThan(20);
  if (f.result.status === 'correct') expect(f.result.unassessedRelevantText).toBe(false);
  for (const e of f.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
});
it('preserves the 180 + 24 + 8 raw records and pre-run own language fixture exactly', () => {
  expect([SUPPLIED_MAIN.length, SUPPLIED_DIAGNOSTIC.length, SUPPLIED_DIAGNOSTIC2.length]).toEqual([180, 24, 8]);
  const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
  expect([hash(SUPPLIED_MAIN), hash(SUPPLIED_DIAGNOSTIC), hash(SUPPLIED_DIAGNOSTIC2)]).toEqual(["ebb149e39e612a39043630eede68a172c9faa7d56969565d509cb553722fd9e6","efd77936d633261cd1398ffeb39b0db9e61dc1fbc189e364288fc6197c29417e","d9d5a59e075bd60156bb56989b9368d7ec4e75e14460e20ac17127b2fc003720"]);
  expect(createHash('sha256').update(readFileSync('tests/fixtures/p02b-20261023-fresh.ts')).digest('hex')).toBe('1a5da4bab4eaee97d4bc4664e771614b58e38cbfbbcd0d306bf4538ed63a38e2');
});

it('preserves designation, synonymy, classification and property relations including their negation', () => {
  const meanings = [{ id: 'osmosis', forms: [['osmose']] }, { id: 'diffusion', forms: [['diffusion']] }];
  for (const [phrase, kind, relation] of [
    ['der Name der Diffusion', 'synonymy', 'designation'],
    ['ein anderer Name für Diffusion', 'synonymy', 'equivalence'],
    ['eine Form der Diffusion', 'identity', 'classification'],
    ['Diffusion', 'identity', 'property'],
  ]) for (const negation of ['', 'nicht ']) {
    const parsed = parseTermAnswer(tokenizeText(`Osmose ist ${negation}${phrase}.`), meanings);
    expect(parsed.complete).toBe(true);
    expect(parsed.clauses[0]).toMatchObject({ kind, relation, negated: negation !== '' });
  }
  for (const phrase of ['der Name der Diffusion', 'der Name der Wasserbewegung', 'ein anderer Name für Diffusion']) {
    for (const negation of ['', 'nicht ']) {
      const evaluated = executeThird({ field: 'osmosis', text: `Osmose. Osmose ist ${negation}${phrase}.` });
      expect(evaluated.result.status).toBe('clarify');
      expect(evaluated.result.feedbackCode).toBe('OSMOSIS_UNASSESSED');
      expect(evaluated.feedback).not.toContain('verneinst');
    }
  }
  for (const phrase of ['der Name des Wassertransports', 'der Name des Transports von Wasser', 'der Name von Diffusion', 'der Name für Diffusion']) {
    for (const negation of ['', 'nicht ']) expect(executeThird({ field: 'osmosis', text: `Osmose. Osmose ist ${negation}${phrase}.` }).result.status).toBe('clarify');
  }
  for (const phrase of ['hier der Name des Wassertransports', 'der hier korrekte Name des Wassertransports', 'die Bezeichnung des Wassertransports', 'der Begriff des Transports von Wasser']) {
    expect(executeThird({ field: 'osmosis', text: `Osmose ist ${phrase}.` }).result.status).toBe('clarify');
  }
});

it('does not turn an unqualified membrane name equivalence into a property or its negation', () => {
  for (const text of [
    'Tonoplast heißt Membran.', 'Tonoplast heißt nicht Membran.',
    'Tonoplast ist der Name der Membran.', 'Tonoplast ist nicht der Name der Membran.',
    'Tonoplast und Membran sind dieselbe Membran.', 'Mit Tonoplast meine ich die Membran.',
  ]) expect(executeThird({ field: 'tonoplast', text }).result.status, text).toBe('clarify');
  for (const [text, expected] of [
    ['Tonoplast ist eine Membran.', 'correct'], ['Tonoplast ist keine Membran.', 'incorrect'],
    ['Tonoplast ist der Name der Membran um die Vakuole.', 'correct'],
    ['Mit Tonoplast meine ich die Vakuolenmembran.', 'correct'],
  ] as const) expect(executeThird({ field: 'tonoplast', text }).result.status, text).toBe(expected);
});

it('limits explicit later corrections to prior single names and preserves scientific contradictions and alternatives', () => {
  for (const [text, expected] of [
    ['Plasmolyse. Danke! Es ist in Wirklichkeit Osmose.', 'correct'],
    ['Osmose. Danke! Es ist in Wirklichkeit Endocytose.', 'incorrect'],
    ['Osmose ist aktiver Transport. Es ist in Wirklichkeit Osmose.', 'incorrect'],
    ['Osmose oder Plasmolyse. Es ist in Wirklichkeit Osmose.', 'clarify'],
    ['Osmose. Es ist in Wirklichkeit Osmose oder Endocytose.', 'clarify'],
    ['Osmose. Es ist in Wirklichkeit Osmose. Wasser ist eine Bakterie.', 'clarify'],
  ] as const) expect(executeThird({ field: 'osmosis', text }).result.status, text).toBe(expected);
});

it('does not guess missing closing verbs, negate a neutral frame or discard unknown insertions', () => {
  for (const text of [
    'Ich habe als Antwort Osmose verworfen.', 'Ich habe als Antwort Osmose nicht gewählt.',
    'Ich würde diesen Wassertransport Osmose', 'Man bezeichnet diesen Vorgang nicht als Osmose.',
    'Ich würde hier den Begriff Osmose vermeiden.', 'Ich trage Osmose nicht ein.',
    'Osmose lautet meine Antwort, wenn es eine ATP-Pumpe ist.',
    'Der aktiv gepumpte Wassertransport heißt Osmose.',
    'Die ATP-verbrauchende Membran heißt Tonoplast.',
  ]) {
    const field = text.includes('Tonoplast') ? 'tonoplast' : 'osmosis';
    expect(executeThird({ field, text }).result.status, text).toBe('clarify');
  }
});

for (const f of SUPPLIED_MAIN.filter(f => f.group === 'short-correct')) it(`${f.id}: new construction distinguishes wrong/partial/alternative terms and complete later claims`, () => {
  const evaluate = (text: string) => executeThird({ field: 'osmosis', text }).result;
  for (const word of ['Endocytose', 'Exocytose', 'Plasmolyse', 'aktiver Transport']) expect(evaluate(f.text.replace('Osmose', word)).status, word).toBe('incorrect');
  expect(evaluate(f.text.replace('Osmose', 'Diffusion')).status).toBe('partial');
  for (const word of ['Osmose oder Plasmolyse', 'Osmose beziehungsweise Endocytose', 'Osmose / aktiver Transport']) expect(evaluate(f.text.replace('Osmose', word)).status, word).toBe('clarify');
  expect(evaluate(f.text + ' Danke! Osmose ist kein passiver Transport.').status).toBe('incorrect');
  expect(evaluate(f.text + ' Wasser bewegt sich stets zum höheren Wasserpotenzial.').status).toBe('clarify');
  expect(evaluate(f.text.replace('Osmose', 'nicht Osmose')).status).not.toBe('correct');
});

for (const f of SUPPLIED_MAIN.filter(f => f.group === 'tonoplast-correct' && !/grenzt|umschließt/u.test(f.text))) it(`${f.id}: new common naming retains the tonoplast criterion and field meanings`, () => {
  const evaluate = (text: string) => executeThird({ field: 'tonoplast', text }).result;
  for (const word of ['Zellwand', 'Zellmembran', 'Kernhülle', 'Vakuole']) expect(evaluate(f.text.replace(/Tonoplast|Vakuolenmembran/gu, word)).status, word).toBe('incorrect');
  expect(evaluate(f.text.replace(/Tonoplast|Vakuolenmembran/gu, 'Membran')).status).toBe('partial');
  expect(evaluate(f.text.replace(/Tonoplast|Vakuolenmembran/gu, 'Tonoplast oder Zellmembran')).status).toBe('clarify');
  expect(evaluate(f.text + ' Danke! Tonoplast ist keine Membran.').status).toBe('incorrect');
  expect(evaluate(f.text + ' Alle Organellen sind Bakterien.').status).toBe('clarify');
});
