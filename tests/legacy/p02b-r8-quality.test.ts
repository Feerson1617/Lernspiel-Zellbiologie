import { expect, it } from 'vitest';
import { executeR8, R8_CORPUS } from '../helpers/p02b-r8.ts';

for (const [group, total] of [['short-correct', 60], ['tonoplast-correct', 20]] as const) {
  it(`R8 LEGACY 95% ${group}, unchanged original expectations and denominator ${total}`, () => {
    const list = R8_CORPUS.groups.main.filter(c => c.group === group);
    expect(list).toHaveLength(total);
    const results = list.map(c => executeR8(c).result);
    expect(results.filter(r => r.status === 'correct').length / total).toBeGreaterThanOrEqual(.95);
    expect(results.some(r => r.status === 'incorrect')).toBe(false);
  });
}
