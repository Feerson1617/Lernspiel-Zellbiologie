import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { afterAll, expect, it } from 'vitest';
import { R3_CASES, R3_KNOWN, executeR3, acceptedR3, acceptedKnown, R3_OSMOSIS_CONTEXT, R3_TONOPLAST_CONTEXT } from '../helpers/p02b-r3.ts';
import { R3_MAIN, R3_SYSTEMATIC, R3_TARGETED } from '../fixtures/p02b-r3-cases.ts';
import { FOURTH_MAIN, FOURTH_TARGETED, FOURTH_KNOWN } from '../fixtures/p02b-20261023-r2-cases.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { parseTermAnswer } from '../../src/assessment/term-grammar.ts';
import { tokenizeText } from '../../src/assessment/text.ts';

const actual = R3_CASES.map(f => ({ ...f, accepted: acceptedR3(f), ...executeR3(f) }));
const known = R3_KNOWN.map(f => ({ ...f, accepted: acceptedKnown(f), ...executeR3(f) }));
afterAll(() => writeFileSync('qa/generated/p02b-r3-results.json', JSON.stringify({ cases: actual, knownCases: known }, null, 2) + '\n'));
for (const f of [...actual, ...known]) it(`${f.id}: ${f.accepted.join('|')} — ${f.text}`, () => {
  expect(f.accepted, f.text).toContain(f.result.status);
  expect(isResultForContext(f.result, f.field === 'osmosis' ? R3_OSMOSIS_CONTEXT : R3_TONOPLAST_CONTEXT)).toBe(true);
  expect(f.result.criteria).toHaveLength(1);
  expect(f.result.criteria[0]!.id).toBe(f.field === 'osmosis' ? 'M6.02.C01' : 'Z1.02.C01');
  expect(f.feedback.length).toBeGreaterThan(20);
  if (f.result.status === 'correct') expect(f.result.unassessedRelevantText).toBe(false);
  for (const e of f.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
});

it('retains the raw supplied records, original known identities and the frozen 60-sentence self-check', () => {
  const hash = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
  expect([R3_MAIN.length, R3_SYSTEMATIC.length, R3_TARGETED.length, R3_KNOWN.length]).toEqual([183, 240, 20, 578]);
  expect([hash(R3_MAIN), hash(R3_SYSTEMATIC), hash(R3_TARGETED)]).toEqual([
    '1b43c41bbf46c1da368c662d2b09e21b131c30d8c01bc8654513baab7abd7de1',
    '971e89ee67db9fa7c8f6344fdee9694c831e672e9dcfc7fe35c732847516c9c7',
    'cb2d55092ebd74dc4d404fdeda5f6fbcc869df1b5b5df0d2bc5579942c321d72',
  ]);
  expect(R3_KNOWN).toEqual([FOURTH_KNOWN, FOURTH_MAIN, FOURTH_TARGETED].flatMap((list, i) => list.map(f => ({ ...f, id: `previous${i}-${f.id}`, group: `previous${i}-${f.group}` }))));
  expect(createHash('sha256').update(readFileSync('tests/fixtures/p02b-r3-fresh.ts')).digest('hex')).toBe('0914edb1a426dffb9693803687a2a9c2412f75a7265a08911bdc81fe6ec53758');
  const normal = (s: string) => s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const main = new Set(R3_MAIN.map(f => normal(f.text)));
  expect(R3_SYSTEMATIC.filter(f => main.has(normal(f.text)))).toHaveLength(4);
});

for (const f of R3_TARGETED.slice(0, 12)) it(`${f.id}: retracts one repeated choice and retains every original naming span`, () => {
  const result = executeR3(f).result;
  expect(result.status).toBe('correct');
  expect(result.criteria[0]!.evidence).toHaveLength(3);
  const first = result.criteria[0]!.evidence[0]!;
  expect(first.kind).toBe('input_span');
  if (first.kind === 'input_span') expect(first.start).toBe(0);
});

it('separates active naming clauses from all original evidence without mutating the token input', () => {
  const meanings = [{ id: 'old', forms: [['altname']] }, { id: 'new', forms: [['neuname']] }];
  const tokens = tokenizeText('Altname. Altname ist Neuname. Altname. Das ist in Wirklichkeit Neuname.');
  const before = JSON.stringify(tokens);
  const parsed = parseTermAnswer(tokens, meanings);
  expect(parsed.complete).toBe(true);
  expect(parsed.evidence).toHaveLength(4);
  expect(parsed.clauses.map(c => c.kind)).toEqual(['identity', 'name']);
  expect(parsed.clauses[1]).toMatchObject({ kind: 'name', terms: [{ id: 'new' }] });
  expect(JSON.stringify(tokens)).toBe(before);
});

for (const [field, wrong, target, synonym, predicate] of [
  ['osmosis', 'Endocytose', 'Osmose', 'Osmosse', 'Osmose ist keine Diffusion.'],
  ['tonoplast', 'Zellwand', 'Tonoplast', 'Vakuolenmembran', 'Tonoplast ist keine Membran.'],
] as const) for (const repetitions of [1, 2, 3, 5]) it(`${field}: repeated choice ${repetitions}, independent predicates and explicit negations`, () => {
  const prefix = `${wrong}. `.repeat(repetitions);
  const evaluate = (text: string) => executeR3({ field, text }).result;
  expect(evaluate(`${prefix}Das ist in Wirklichkeit ${target}.`).status).toBe('correct');
  expect(evaluate(`${prefix}Es ist in Wirklichkeit ${wrong}. Das ist in Wirklichkeit ${target}.`).status).toBe('correct');
  expect(evaluate(`${prefix}${predicate} Das ist in Wirklichkeit ${target}.`).status).toBe('incorrect');
  expect(evaluate(`${prefix}Nicht ${target}, sondern ${synonym}.`).status).toBe('incorrect');
  expect(evaluate(`${prefix}Das ist in Wirklichkeit ${target}. Alle Organellen sind Zellwände.`).status).toBe('clarify');
  expect(evaluate(`${prefix}${target}.`).status).toBe('clarify');
  expect(evaluate(`Nicht ${target} oder nicht ${synonym}.`).status).toBe('incorrect');
  expect(evaluate(`Nicht ${target} oder nicht ${wrong}.`).status).toBe('clarify');
});

for (const f of R3_MAIN.filter(f => f.group === 'short-correct')) it(`${f.id}: complete construction preserves false/partial/alternative terms and negative scope`, () => {
  for (const [word, status] of [['Exocytose', 'incorrect'], ['Diffusion', 'partial'], ['Osmose oder Exocytose', 'clarify']] as const) expect(executeR3({ field: 'osmosis', text: f.text.replace('Osmose', word) }).result.status, word).toBe(status);
  expect(executeR3({ field: 'osmosis', text: f.text.replace('Osmose', 'nicht Osmose') }).result.status).not.toBe('correct');
  expect(executeR3({ field: 'osmosis', text: f.text + ' Osmose ist keine Diffusion.' }).result.status).toBe('incorrect');
  expect(executeR3({ field: 'osmosis', text: f.text + ' Wasser muss immer zum höheren Wasserpotenzial fließen.' }).result.status).toBe('clarify');
});
