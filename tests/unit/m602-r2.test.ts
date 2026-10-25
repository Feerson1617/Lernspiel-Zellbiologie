import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { evaluateM602 } from '../../src/assessment/m602.ts';
import { createM602Session } from '../../src/application/m602-session.ts';
import { parseWaterRelation, compareWaterRelations } from '../../src/assessment/m602-semantics.ts';
import { m602Input, M602_SUPPORT } from '../helpers/m602.ts';
type Case = { id: string; field: 'direction' | 'volume'; text: string; expected?: string; accepted?: string[]; extra?: string[] };
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const targeted = read('tests/fixtures/p02c-r2-targeted.json').cases as Case[];
const supplied = read('tests/fixtures/p02c-r2-cases.json') as Case[], own = read('tests/fixtures/p02c-r2-own.json') as Case[];
it('preserves all R2 Soll values and all pre-run own inputs; missing recognition stays in raw report', () => {
  const freeze = read('qa/p02c-r2-freeze.json') as { files: Record<string, string> };
  for (const [file, sha] of Object.entries(freeze.files)) expect(createHash('sha256').update(readFileSync(file)).digest('hex')).toBe(sha);
  expect(supplied).toHaveLength(180); expect(targeted).toHaveLength(12); expect(own).toHaveLength(82);
});
for (const c of targeted) it(`${c.id}: actual result, evidence, explanation and whole-task receipt`, () => {
  const input = m602Input({ direction: c.text }), o = evaluateM602(input, M602_SUPPORT), f = o.fields.direction;
  expect(c.accepted).toContain(f.result.status);
  expect(f.result.criteria[0]!.evidence[0]).toEqual({ kind: 'input_span', value: c.text, start: 0, end: c.text.length });
  const s = createM602Session(input.context, { idPrefix: c.id, resumed: false, loadedAttempts: [] });
  const live = s.submit(s.makeSubmission(input.answers, []));
  if (['X01', 'X02', 'X03', 'X04'].includes(c.id)) {
    expect(o.overallStatus).toBe('clarify'); expect(o.notAssessed[0]!.value).toBe(c.text);
    expect(f.result.criteria[0]!.reasonCode).toBe('comparison_scope');
    expect(f.feedback.recognized).toBe('Du vergleichst zwei Bewegungsangaben.');
    expect(f.feedback.difference).toContain('dieselbe Membran'); expect(f.feedback.next).toContain('Quelle, Ziel und Membran');
    expect(() => s.record(live)).toThrow(); expect(s.getState().outcomes).toHaveLength(1);
  } else if (o.overallStatus === 'correct') expect(s.record(live).status).toBe('correct');
  else expect(() => s.record(live)).toThrow();
  if (['X07','X08'].includes(c.id)) expect(f.result.criteria[0]!.reasonCode).toBe('contradiction');
  if (['X09','X10'].includes(c.id)) expect(f.feedback.recognized).not.toMatch(/Einzel|beide Richtungen/);
});
it('never certifies a new critical color across supplied and own complete runtime cases', () => {
  for (const c of [...supplied, ...own]) {
    const o = evaluateM602(m602Input({ [c.field]: c.text }, c.extra ?? []), M602_SUPPORT), f = o.fields[c.field];
    if (['correct','incorrect'].includes(f.result.status)) expect(f.result.status, c.id).toBe(c.expected);
    if (f.result.status === 'clarify') expect(o.notAssessed.some(e => e.value === c.text)).toBe(true);
    if (c.extra?.length) expect(o.overallStatus).not.toBe('correct');
    for (const e of f.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(c.text.slice(e.start,e.end)).toBe(e.value);
  }
});
it('joins only reverse paths of the same substance, membrane, quantity, phase and scale', () => {
  const paths = ['nach außen', 'nach innen', 'aus der Vakuole ins Cytosol', 'aus dem Cytosol in die Vakuole'];
  for (const a of paths) for (const b of paths) for (const substance of ['Wasser','Saccharose']) {
    const left = parseWaterRelation(`wasser fliesst ${a.toLowerCase().replace('außen','aussen')}`)!, right = parseWaterRelation(`${substance.toLowerCase()} fliesst ${b.toLowerCase().replace('außen','aussen')}`)!;
    expect(left).not.toBeNull(); expect(right).not.toBeNull();
    const expected = substance === 'Wasser' && left.membrane === 'cell_membrane' && right.membrane === left.membrane && left.source === right.target && left.target === right.source;
    expect(compareWaterRelations(left,right) !== null).toBe(expected);
    expect(compareWaterRelations(left,{ ...right, phase: 'future' as typeof right.phase })).toBeNull();
    expect(compareWaterRelations(left,{ ...right, scale: 'individual' })).toBeNull();
    expect(compareWaterRelations(left,{ ...right, negative: true })).toBeNull();
  }
});

it('does not attribute the opposite inner-membrane direction to a newly recognized reverse path', () => {
  const text = 'Wasser fließt aus dem Cytosol in die Vakuole';
  const o = evaluateM602(m602Input({ direction: text }), M602_SUPPORT);
  expect(o.fields.direction.result.status).toBe('clarify');
  expect(o.fields.direction.feedback.recognized).not.toContain('von der Vakuole');
  expect(o.notAssessed[0]!.value).toBe(text);
});
