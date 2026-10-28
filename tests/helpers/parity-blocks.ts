import { deepStrictEqual, strictEqual, ok } from 'node:assert';
import type { executeFourth } from './p02b-fourth.ts';
import { STATUS_PRESENTATION } from '../../src/ui/feedback-presentation.ts';

export interface ParityPosition { readonly index: number; readonly id: string }
/** Positions, not unique IDs: intentional duplicate cases remain separate inputs. */
export function assertParityCoverage(original: readonly { readonly id: string }[], positions: readonly ParityPosition[]): void {
  deepStrictEqual(positions, original.map((c, index) => ({ index, id: c.id })), 'Every original position and ID must occur exactly once, in order');
}
export function parityBlocks<T extends { readonly id: string }>(original: readonly T[], expectedCount: number) {
  strictEqual(original.length, expectedCount, "Original corpus size");
  const blocks = [];
  for (let start = 0; start < original.length; start += 200) {
    const cases = original.slice(start, start + 200);
    const positions = cases.map((c, offset) => ({ index: start + offset, id: c.id }));
    blocks.push({ start, cases, positions });
  }
  const flattened = blocks.flatMap(b => b.cases);
  flattened.forEach((c, index) => strictEqual(c, original[index], `Original object at position ${index}`));
  assertParityCoverage(original, blocks.flatMap(b => b.positions));
  return blocks;
}

type NodeResult = ReturnType<typeof executeFourth>;
export type ParityEnvelope = NodeResult & { bound: boolean; display: (typeof STATUS_PRESENTATION)[keyof typeof STATUS_PRESENTATION] };
/** Synchronous data assertions, stronger than the previous per-property checks. */
export function assertParity(actual: ParityEnvelope, node: NodeResult, accepted: readonly string[], text: string, position: ParityPosition): void {
  const label = `${position.index}:${position.id}`;
  deepStrictEqual(actual.result, node.result, label);
  strictEqual(actual.feedback, node.feedback, label);
  deepStrictEqual(actual.display, STATUS_PRESENTATION[node.result.status], label);
  ok(accepted.includes(actual.result.status), label);
  strictEqual(actual.bound, true, label);
  strictEqual(actual.display.color, actual.result.status === 'correct' ? 'green' : actual.result.status === 'incorrect' ? 'red' : 'yellow', label);
  ok(actual.display.symbol, label); ok(actual.display.label, label);
  for (const e of actual.result.criteria[0]!.evidence) if (e.kind === 'input_span') strictEqual(text.slice(e.start, e.end), e.value, label);
}
