import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { classifyM602CuedRelation } from '../../src/assessment/m602-cued-relations.ts';
import { evaluateM602Cued } from '../../src/assessment/m602-cued.ts';
import { createM602CuedSession } from '../../src/application/m602-session.ts';
import type { RelationField } from '../../src/assessment/m602-relations.ts';
import { m602CuedInput, M602_SUPPORT } from '../helpers/m602-cued.ts';
const rows = JSON.parse(readFileSync('tests/fixtures/m602-cued-r5-own.json', 'utf8')) as { id: string; field: RelationField; text: string; expected: string }[];
it('preserves the complete own counterprobe fixed before execution; no independent acceptance', () => {
  const f = JSON.parse(readFileSync('qa/m602-cued-r5-freeze.json', 'utf8')) as { files: Record<string, string> };
  for (const [p, sha] of Object.entries(f.files)) expect(createHash('sha256').update(readFileSync(p)).digest('hex')).toBe(sha);
  expect(rows).toHaveLength(33);
});
for (const c of rows) it(`${c.id}: ${c.field}`, () => {
  const input = m602CuedInput({ [c.field]: c.text }), outcome = evaluateM602Cued(input, M602_SUPPORT);
  expect(outcome.fields[c.field].result.status).toBe(c.expected);
  expect(outcome.fields[c.field].result.criteria[0]!.evidence).toEqual([{ kind: 'input_span', value: c.text, start: 0, end: c.text.length }]);
  if (c.expected === 'clarify') expect(outcome.notAssessed.some(n => n.value === c.text)).toBe(true);
  const s = createM602CuedSession(input.context, { idPrefix: c.id, resumed: false, loadedAttempts: [] });
  const issued = s.submit(s.makeSubmission(input.answers, []));
  if (c.expected === 'correct') expect(Object.keys(s.record(issued))).toHaveLength(8);
  else expect(() => s.record(issued)).toThrow();
});
it('keeps the two approved negation positions equivalent for finite volume predicates', () => {
  for (const [predicate, negative] of [['nimmt ab', 'nimmt nicht ab'], ['wird kleiner', 'wird nicht kleiner'], ['nimmt zu', 'nimmt nicht zu'], ['bleibt gleich', 'bleibt nicht gleich'], ['verringert sich', 'verringert sich nicht'], ['ändert sich', 'ändert sich nicht']] as const) {
    expect(classifyM602CuedRelation(negative, 'volume')).toEqual(classifyM602CuedRelation(`nicht ${predicate}`, 'volume'));
    expect(classifyM602CuedRelation(`nicht ${negative}`, 'volume').status).toBe('clarify');
    expect(classifyM602CuedRelation(`${negative} unbekannt`, 'volume').status).toBe('clarify');
  }
});
it('distinguishes net-zero contradictions from continuing individual crossings', () => {
  for (const direction of ['hinaus', 'hinein']) for (const zero of ['kein Nettostrom', 'kein Nettotransport']) {
    for (const text of [`${direction} und ${zero}`, `${zero} und ${direction}`]) expect(classifyM602CuedRelation(text, 'direction')).toEqual({ status: 'incorrect', reason: 'contradiction' });
  }
  const zero = evaluateM602Cued(m602CuedInput({ direction: 'kein Nettostrom' }), M602_SUPPORT).fields.direction;
  expect(zero.feedback.recognized).toContain('Nettowasserbilanz');
  expect(zero.feedback.difference).toContain('Einzelne Durchtritte');
  expect(classifyM602CuedRelation('in beide Richtungen', 'direction')).toEqual({ status: 'partial', reason: 'individual' });
  expect(classifyM602CuedRelation('kein Nettostrom und in beide Richtungen', 'direction')).toEqual({ status: 'clarify', reason: 'scope' });
  expect(classifyM602CuedRelation('kein Nettostrom und kein Nettotransport', 'direction')).toEqual({ status: 'incorrect', reason: 'net_zero' });
  expect(classifyM602CuedRelation('hinaus und unbekannt', 'direction').status).toBe('clarify');
});
