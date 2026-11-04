import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import cases from '../fixtures/m1002-r1-cases.json';
import { assessDiagram } from '../../src/assessment/diagram.ts';

for (const c of cases.rows) it(`M1002-R1 frozen row: ${c.id}`, () => {
  const answer = structuredClone(cases.base);
  if ('firstY' in c && c.firstY) answer.points[0]!.y = c.firstY;
  answer.points.push(...c.extra);
  const outcome = assessDiagram(answer);
  expect(outcome.status).toBe(c.status);
  expect(outcome.criteria[2]!.status).toBe(c.criterion);
  expect(outcome.points.map(p => p.status)).toEqual(c.rows);
  if (c.id === 'x-only') expect(outcome.points[5]!.message).toContain('y-Koordinate');
  if (c.id === 'y-only') expect(outcome.points[5]!.message).toContain('x-Koordinate');
});
it('keeps the original 102 diagram expectations byte-identical', () => {
  expect(createHash('sha256').update(readFileSync('tests/fixtures/m1002-diagram-cases.json')).digest('hex')).toBe(cases.originalFixtureSha256);
});
