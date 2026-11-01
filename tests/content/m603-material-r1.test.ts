import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import materialContract from '../../contracts/m603-material-1.1.0.json';
import contract from '../../contracts/m603-causal-map.json';
import historical from '../../contracts/m603-causal-map.material-1.0.0.json';
import { M603_CONTRACT, M603_VERSIONS } from '../../src/domain/m603-contract.ts';
import { createM603Context, readM603Material } from '../../src/content/m603-materials.ts';

it('R1: binds the qualitative material contract while preserving every grading rule of 1.0.1', () => {
  expect(M603_VERSIONS).toEqual(materialContract.versions); expect(contract.versions).toEqual(materialContract.versions);
  expect(M603_CONTRACT).toBe(materialContract.assessmentContractUnchanged);
  const { versions: _old, ...oldRules } = historical;
  const { versions: _new, materialContract: _reference, ...newRules } = contract;
  expect(newRules).toEqual(oldRules);
  for (const index of [0, 1]) {
    const context = createM603Context(index, 'r1-material-contract'), data = readM603Material(context);
    expect(data).toMatchObject(materialContract.qualitativeConditions); expect(data.materialVersion).toBe(materialContract.materialVersion);
    expect(context.seed).toBe(`${data.caseId}/${materialContract.seedVersion}`);
  }
});
it('R1: preserves the historical material contract and all 49 pre-implementation answer expectations byte for byte', () => {
  const hash = (path: string) => createHash('sha256').update(readFileSync(new URL(path, import.meta.url))).digest('hex');
  expect(hash('../../contracts/m603-causal-map.material-1.0.0.json')).toBe('8bfa740061ed5ec77f8ec0d9887fecf93b72eaed7558488937e092acb80541bd');
  expect(hash('../fixtures/m603-cases.json')).toBe('a1eee3f60345eb33f5b86c1662bfc8500309ba246082004c3dc447fd22e0374a');
});
