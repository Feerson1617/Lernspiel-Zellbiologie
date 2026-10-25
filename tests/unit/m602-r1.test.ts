import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, it } from 'vitest';
import { evaluateM602 } from '../../src/assessment/m602.ts';
import { m602Input, M602_SUPPORT } from '../helpers/m602.ts';
interface Case { field: 'direction' | 'volume'; text: string; expected: string; group?: string; extra?: string[] }
const corpus = JSON.parse(readFileSync('tests/fixtures/p02c-r1-cases.json', 'utf8')) as { cases: Case[]; systematic: Case[] };
const own = JSON.parse(readFileSync('tests/fixtures/p02c-r1-own.json', 'utf8')) as Case[];
const evaluate = (c: Case) => evaluateM602(m602Input({ [c.field]: c.text }, c.extra ?? []), M602_SUPPORT);
it('retains all supplied expectations and own pre-run cases byte-for-byte', () => {
  const freeze = JSON.parse(readFileSync('qa/p02c-r1-freeze.json', 'utf8')) as { files: Record<string, string> };
  for (const [file, sha] of Object.entries(freeze.files)) expect(createHash('sha256').update(readFileSync(file)).digest('hex')).toBe(sha);
  expect(corpus.cases).toHaveLength(282); expect(corpus.systematic).toHaveLength(360); expect(own).toHaveLength(34);
});
for (const field of ['direction', 'volume'] as const) it(`${field}: full short denominator >=95%; original long gaps retained, no critical colors in all 642`, () => {
  const rows = [...corpus.cases, ...corpus.systematic].filter(c => c.field === field);
  const short = rows.filter(c => c.group === 'short-correct'); expect(short).toHaveLength(60);
  expect(short.filter(c => evaluate(c).fields[field].result.status === 'correct').length / short.length).toBeGreaterThanOrEqual(.95);
  for (const c of rows) {
    const o = evaluate(c), status = o.fields[field].result.status;
    if (status === 'correct' || status === 'incorrect') expect(status, c.text).toBe(c.expected);
    // Original long Soll is NOT changed: raw report counts each unresolved gap.
    if (c.group !== 'longer-correct') expect(status, c.text).toBe(c.expected);
    for (const e of o.fields[field].result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(c.text.slice(e.start, e.end)).toBe(e.value);
    if (c.extra?.length) expect(o.overallStatus).not.toBe('correct');
  }
});
for (const c of own) it(`new predeclared ${c.field}: ${c.text}`, () => expect(evaluate(c).fields[c.field].result.status).toBe(c.expected));
it('feedback confirms movement only when it was said; mechanism alone never implies individual exchange', () => {
  for (const text of ['Osmose', 'Wasser bewegt sich', 'Wasser fließt']) {
    const o = evaluate({ field: 'direction', text, expected: 'partial' }).fields.direction;
    expect(o.result.status).toBe('partial'); expect(o.result.criteria[0]!.reasonCode).toBe('movement');
    expect(o.feedback.recognized).not.toMatch(/Einzel|beide Richtungen/);
    expect(o.feedback.next).toContain('Richtung');
  }
  for (const text of ['in beide Richtungen', 'Einzelne Wassermoleküle gehen nach innen']) expect(evaluate({ field: 'direction', text, expected: 'partial' }).fields.direction.result.criteria[0]!.reasonCode).toBe('individual');
});
