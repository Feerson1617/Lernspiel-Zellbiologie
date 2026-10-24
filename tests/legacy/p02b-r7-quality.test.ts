import { expect, it } from 'vitest';
import { R7_MAIN } from '../fixtures/p02b-r7-cases.ts';
import { executeR7 } from '../helpers/p02b-r7.ts';

it('BLOCKED QUALITY GATE: R7 must still meet 95 percent with all 19 yellow answers in the denominator', () => {
  const r = R7_MAIN.filter(f => f.group === 'short-correct').map(f => executeR7(f).result);
  expect(r).toHaveLength(60);
  expect(r.filter(f => f.status === 'correct').length / r.length).toBeGreaterThanOrEqual(0.95);
  expect(r.some(f => f.status === 'incorrect')).toBe(false);
});
