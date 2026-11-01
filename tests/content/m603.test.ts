import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { M603_CONTRACT, M603_REQUIRED, M603_VERSIONS, M603_NODES, M603_RELATIONS, M603_CLAIMS } from '../../src/domain/m603-contract.ts';
import { M603_HELP, M603_HELP_TOPICS, M603_NODE_TEXT, M603_SELF_CHECK } from '../../src/content/m603-learning.ts';
import { createM603Context, readM603Material } from '../../src/content/m603-materials.ts';
const contract = JSON.parse(readFileSync(new URL('../../contracts/m603-causal-map.json', import.meta.url), 'utf8'));
it('matches the explicitly versioned contract without importing editorial data into runtime', () => {
  expect(M603_CONTRACT).toBe(contract.contractVersion); expect(M603_VERSIONS).toEqual(contract.versions);
  expect(M603_REQUIRED).toEqual(contract.requiredEdges); expect(M603_NODES).toEqual(contract.nodes); expect(M603_RELATIONS).toEqual(contract.relations);
  expect(M603_CLAIMS).toEqual([...contract.safeClaims, ...contract.falseClaims]);
  expect(contract.jointConditionCriteria).toEqual(['M6.03.C03', 'M6.03.C04']);
});
it('exposes the relevant limits and targeted help without a solution in the first hint', () => {
  expect(M603_NODE_TEXT.D).toContain('mögliche'); expect(M603_SELF_CHECK).toHaveLength(4);
  for (const topic of M603_HELP_TOPICS) {
    expect(M603_HELP[topic].hint).not.toMatch(/A → B|A → C|B → D|C → D/);
    expect(M603_HELP[topic].structure).not.toBe(M603_HELP[topic].hint); expect(M603_HELP[topic].solution).toMatch(/→/);
  }
  expect(M603_HELP.detachment.solution).toContain('Keine der beiden Kanten allein');
});
it('uses the same immutable, explicitly static biological material in both public cases', () => {
  for (const index of [0, 1]) {
    const context = createM603Context(index, 'material-test'), data = readM603Material(context);
    expect(context).toMatchObject(M603_VERSIONS); expect(context.taskId).toBe('M6.03'); expect(data.waterPotential.includesPressure).toBe(true);
    expect(data.waterPotential.vacuole).toBeGreaterThan(data.waterPotential.cytosol); expect(data.waterPotential.cytosol).toBeGreaterThan(data.waterPotential.external);
    expect(data.waterPermeability).toEqual({ cellMembrane: true, tonoplast: true }); expect(data.detachment).toBe('possible_not_observed');
    expect(Object.isFrozen(data)).toBe(true); expect(Object.isFrozen(data.waterPotential)).toBe(true);
  }
});
