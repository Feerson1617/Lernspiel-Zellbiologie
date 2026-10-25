import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, it } from 'vitest';
import { evaluateM602 } from '../../src/assessment/m602.ts';
import { createM602Session } from '../../src/application/m602-session.ts';
import { parseVolumeAtom } from '../../src/assessment/m602-semantics.ts';
import { m602Input, M602_SUPPORT } from '../helpers/m602.ts';
type Case = { id: string; text: string; accepted?: string[]; expected?: string };
const read = (f: string) => JSON.parse(readFileSync(f, 'utf8'));
const coordination = read('tests/fixtures/p02c-r3-coordination-cases.json').cases as Case[];
const own = read('tests/fixtures/p02c-r3-own.json') as Case[];
it('keeps R3 and own cases frozen with all original expectations', () => {
  const x = read('qa/p02c-r3-freeze.json') as { files: Record<string,string> };
  for (const [p,sha] of Object.entries(x.files)) expect(createHash('sha256').update(readFileSync(p)).digest('hex')).toBe(sha);
  expect(coordination).toHaveLength(10); expect(own).toHaveLength(33); expect(read('tests/fixtures/p02c-r3-cases.json')).toHaveLength(156);
});
for (const c of [...coordination, ...own]) it(`${c.id}: ${c.text}`, () => {
  const input = m602Input({ volume: c.text }), o = evaluateM602(input, M602_SUPPORT), f = o.fields.volume;
  expect(c.accepted ?? [c.expected]).toContain(f.result.status);
  expect(f.result.criteria[0]!.evidence).toEqual([{ kind: 'input_span', value: c.text, start: 0, end: c.text.length }]);
  if (f.result.status === 'clarify') expect(o.notAssessed.some(e => e.field === 'volume' && e.value === c.text)).toBe(true);
  const s = createM602Session(input.context, { idPrefix: c.id, resumed: false, loadedAttempts: [] });
  const live = s.submit(s.makeSubmission(input.answers, []));
  if (f.result.status === 'correct') {
    expect(o.overallStatus).toBe('correct'); const receipt = s.record(live);
    expect(receipt.status).toBe('correct'); expect(receipt.assistance).toBe('independent'); expect(Object.keys(receipt)).toHaveLength(8);
  } else { expect(o.overallStatus).not.toBe('correct'); expect(() => s.record(live)).toThrow(); }
  if (['C01','C02','C05'].includes(c.id)) { expect(f.feedback.recognized).toContain('Zellwand'); expect(f.feedback.difference).toContain('formstabil'); expect(f.feedback.next).toContain('Vakuolenraum'); }
  if (['C03','C04'].includes(c.id)) { expect(f.feedback.recognized).toContain('Protoplasten'); expect(f.feedback.next).toContain('Vakuolenraum'); }
});
it('retains the explicit quantity, predicate, local negation, phase and origin in its intermediate meaning', () => {
  expect(parseVolumeAtom('die zellwand bleibt gleich')?.volume).toEqual({ referent: 'wall', change: 'same', negative: false, phase: 'given_early_state', origin: 'explicit', gender: 'feminine' });
  expect(parseVolumeAtom('das volumen schrumpft nicht','wall')?.volume).toEqual({ referent: 'wall', change: 'down', negative: true, phase: 'given_early_state', origin: 'inherited', gender: 'neuter' });
  expect(parseVolumeAtom('die vakuole schrumpft','wall')?.volume?.referent).toBe('vacuole');
});

it('keeps the existing unambiguous possessive profile but does not pick between two feminine antecedents', () => {
  for (const text of ['Die Vakuole schrumpft und ihr Volumen sinkt.', 'Die Zellwand bleibt gleich und ihr Volumen schrumpft.']) {
    const o = evaluateM602(m602Input({ volume: text }), M602_SUPPORT);
    expect(o.fields.volume.result.status).toBe(text.startsWith('Die Vakuole') ? 'correct' : 'incorrect');
  }
  const text = 'Die Zellwand bleibt gleich und die Vakuole schrumpft und ihr Volumen sinkt.';
  const o = evaluateM602(m602Input({ volume: text }), M602_SUPPORT);
  expect(o.fields.volume.result.status).toBe('clarify'); expect(o.notAssessed[0]!.value).toBe(text);
});

it('binds existing neuter quantity pronouns without confusing a feminine wall with its volume', () => {
  for (const [text, status] of [
    ['Das Vakuolenvolumen sinkt, aber es sinkt nicht.', 'incorrect'],
    ['Das Volumen der Zellwand bleibt gleich und es nimmt ab.', 'incorrect'],
    ['Die Zellwand bleibt gleich und es nimmt ab.', 'clarify'],
    ['Die Vakuole gibt Wasser ab und es wird kleiner.', 'clarify'],
    ['Die Zellmembran löst sich von der Zellwand und es wird kleiner.', 'clarify'],
  ] as const) expect(evaluateM602(m602Input({ volume: text }), M602_SUPPORT).fields.volume.result.status).toBe(status);
});
