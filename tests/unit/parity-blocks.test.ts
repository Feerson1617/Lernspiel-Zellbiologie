import { expect, it } from 'vitest';
import { assertParityCoverage, parityBlocks } from '../helpers/parity-blocks.ts';
it('partitions at200 without dropping repeated IDs, positions or original objects', () => {
  const rows = Array.from({ length: 401 }, (_, index) => ({ id: `same-${index % 2}`, text: `original-${index}` }));
  const blocks = parityBlocks(rows, rows.length);
  expect(blocks.map(b => b.cases.length)).toEqual([200, 200, 1]);
  blocks.flatMap(b => b.cases).forEach((row, index) => expect(row).toBe(rows[index]));
  expect(() => assertParityCoverage(rows, blocks.flatMap(b => b.positions))).not.toThrow();
  expect(parityBlocks([], 0)).toEqual([]);
});
it('rejects holes, duplicates, reordering and an incorrect ID despite unchanged counts', () => {
  const rows = [{ id: 'duplicate' }, { id: 'duplicate' }, { id: 'other' }];
  const positions = parityBlocks(rows, rows.length).flatMap(b => b.positions);
  for (const bad of [positions.slice(1), [...positions, positions[0]!], [positions[1]!, positions[0]!, positions[2]!], [positions[0]!, positions[0]!, positions[2]!], [positions[0]!, positions[1]!, { index: 2, id: 'wrong' }]]) {
    expect(() => assertParityCoverage(rows, bad)).toThrow();
  }
});

import type { ParityEnvelope } from '../helpers/parity-blocks.ts';
import { STATUS_PRESENTATION } from '../../src/ui/feedback-presentation.ts';
import { assertParity } from '../helpers/parity-blocks.ts';
import { FOURTH_CASES, executeFourth, acceptedFourth } from '../helpers/p02b-fourth.ts';
type Mutable<T> = { -readonly [K in keyof T]: T[K] extends object ? Mutable<T[K]> : T[K] };
it('rejects corrupted status, feedback, binding, evidence and presentation in full data comparisons', () => {
  const f = FOURTH_CASES.find(c => executeFourth(c).result.criteria[0]!.evidence.length > 0)!;
  const node = executeFourth(f), actual: ParityEnvelope = { ...node, bound: true, display: STATUS_PRESENTATION[node.result.status] }, position = { index: 0, id: f.id };
  expect(() => assertParity(actual, node, acceptedFourth(f), f.text, position)).not.toThrow();
  for (const change of [
    (v: Mutable<ParityEnvelope>) => { v.result.status = 'technical' as never; },
    (v: Mutable<ParityEnvelope>) => { v.feedback = 'corrupted'; },
    (v: Mutable<ParityEnvelope>) => { v.result.contextHash = 'forged' as never; },
    (v: Mutable<ParityEnvelope>) => { v.result.criteria[0]!.evidence = [] as never; },
    (v: Mutable<ParityEnvelope>) => { v.display.color = 'corrupted' as never; },
  ]) {
    const corrupted = JSON.parse(JSON.stringify(actual)) as Mutable<ParityEnvelope>;
    change(corrupted);
    expect(() => assertParity(corrupted, node, acceptedFourth(f), f.text, position)).toThrow();
  }
});
