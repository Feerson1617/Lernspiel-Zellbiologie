import { expect, it } from 'vitest';
import { R6_FRESH } from '../fixtures/p02b-r6-fresh.ts';
import { executeR6 } from '../helpers/p02b-r6.ts';

it('BLOCKED QUALITY GATE: requires 95 percent without dropping the four yellow self-check answers', () => {
  const r = R6_FRESH.map(f => executeR6(f).result);
  expect(r.filter(f => f.status === 'correct').length / r.length).toBeGreaterThanOrEqual(0.95);
  expect(r.some(f => f.status === 'incorrect')).toBe(false);
});
