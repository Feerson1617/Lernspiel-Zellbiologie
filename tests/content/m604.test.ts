import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, it } from 'vitest';
import contract from '../../contracts/m604-investigation-1.0.0.json';
import { M604_CASE_IDS, M604_CONTRACT, M604_FIELDS, M604_VERSIONS } from '../../src/domain/m604-contract.ts';
import { createM604Context, readM604Material } from '../../src/content/m604-materials.ts';
import { m604Fields, M604_STEPS, M604_WRITING_RUBRIC, M604_WRITTEN_PROMPT } from '../../src/content/m604-learning.ts';

it('binds the independently specified scenario records and versions without runtime editorial imports', () => {
  expect(M604_CONTRACT).toBe(contract.contractVersion); expect(M604_VERSIONS).toEqual(contract.versions);
  for (const id of M604_CASE_IDS) {
    const material = readM604Material(createM604Context(id,'content-audit'));
    const { finding: _, ...records } = contract.observations[id];
    expect(material.records).toEqual(records); expect(Object.isFrozen(material.records)).toBe(true);
    expect(material.initialIntegrity).toBe('intact'); expect(material.laterIntegrity).toBe('not_measured');
    expect(material.returnPotential).toBe('not_measured'); expect(material.wall).toBe('comparatively_stable');
    expect(material.uncertaintyPercentagePoints).toBe(4); expect(material.pairedRuns).toBe(3);
  }
});
it('supports the stated limited biological conclusions with the actual data rather than labels', () => {
  for (const id of M604_CASE_IDS) {
    const m = readM604Material(createM604Context(id,'biological-data-audit'));
    for (let i = 0; i < 3; i++) {
      const [before,loss,after] = m.records.treatmentVolume[i]!, detached = m.records.treatmentDetached[i]!;
      expect(before).toBe(100); expect(loss).toBeLessThan(before); expect(after).toBeLessThan(before);
      if (id === 'recovery') {
        expect(after - loss).toBeGreaterThan(2 * m.uncertaintyPercentagePoints);
        expect(detached[2]).toBeLessThan(detached[1]);
      } else {
        expect(Math.abs(after - loss)).toBeLessThanOrEqual(m.uncertaintyPercentagePoints);
        expect(detached[2]).toBe(detached[1]);
      }
      expect(m.records.controlVolume[i]!.every(v => Math.abs(v - 100) <= 1)).toBe(true);
      expect(m.records.controlDetached[i]).toEqual([0,0,0]);
    }
  }
});
it('has a complete bounded input and reason for every field and allows all declared design families', () => {
  expect(M604_STEPS.flatMap(s => s.fields).sort()).toEqual([...M604_FIELDS].sort());
  for (const id of M604_CASE_IDS) for (const f of m604Fields(id)) {
    expect(new Set(f.options.map(o => o.id)).size).toBe(f.options.length);
    expect(f.options.some(o => o.status === 'correct')).toBe(true);
    expect(f.options.every(o => o.label.length > 5 && o.reason.length > 30)).toBe(true);
  }
  const fields = m604Fields('limited');
  for (const id of ['parallel_pairs','staggered_pairs']) expect(fields.find(f => f.id === 'design')!.options.find(o => o.id === id)?.status).toBe('correct');
  for (const id of ['relative_volume','detached_fraction']) expect(fields.find(f => f.id === 'dependent')!.options.find(o => o.id === id)?.status).toBe('correct');
  expect(fields.find(f => f.id === 'hypothesis')!.options.find(o => o.id === 'return_prediction')?.status).toBe('correct');
});
it('keeps free written planning out of the assessor and provides criteria for justification, not word naming', () => {
  expect(M604_WRITTEN_PROMPT).toBe(contract.writtenTask); expect(M604_WRITING_RUBRIC).toHaveLength(5);
  expect(M604_WRITING_RUBRIC.every(c => c.evidence.length > 90 && c.incomplete.length > 35)).toBe(true);
  const assessor = readFileSync('src/assessment/m604.ts','utf8');
  expect(assessor).not.toMatch(/from\s+['"][^'"]*m602|localStorage|sessionStorage|fetch\(|\.writing\b|\.predictionBeforeData\b/);
  expect(readFileSync('src/application/m604-learning.ts','utf8')).not.toMatch(/localStorage|sessionStorage|indexedDB|fetch\(/);
  expect(readFileSync('src/ui/m604-learning.ts','utf8')).not.toMatch(/innerHTML|insertAdjacentHTML|fetch\(/);
});
it('preserves all 79 catalog entries and both prior grading contracts byte for byte', () => {
  const baseline: Record<string,string> = {
    'contracts/m603-causal-map.material-1.0.0.json':'8bfa740061ed5ec77f8ec0d9887fecf93b72eaed7558488937e092acb80541bd',
    'tests/fixtures/m603-cases.json':'a1eee3f60345eb33f5b86c1662bfc8500309ba246082004c3dc447fd22e0374a',
  };
  for (const [path,sha] of Object.entries(baseline)) expect(createHash('sha256').update(readFileSync(path)).digest('hex')).toBe(sha);
  expect(JSON.parse(readFileSync('spec/tasks.json','utf8')).tasks).toHaveLength(79);
});
