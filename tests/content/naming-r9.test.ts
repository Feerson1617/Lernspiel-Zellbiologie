import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import type { TaskContext } from '../../src/domain/task-context.ts';
import { evaluateNaming } from '../../src/assessment/naming-v1.ts';
import { NAMING_CONTRACT } from '../../src/domain/naming-contract.ts';
import { INDEPENDENT_SUPPORT } from '../helpers/naming-v1.ts';
import { canonicalReviewData } from '../helpers/p02b-r7.ts';
const hash = (v: unknown) => createHash('sha256').update(JSON.stringify(canonicalReviewData(v))).digest('hex');
interface Case { id: string; task: 'Z1.02' | 'M6.02'; text: string; extra: string[]; expectedTerm: string; expectedOverall: string }
// Native JSON preserves deliberately invalid Unicode evidence in the supplied
// corpus; Vite's large-JSON transform rejects lone surrogates before evaluation.
const corpus = JSON.parse(readFileSync(new URL('../fixtures/p02b-r9-cases.json', import.meta.url), 'utf8')) as {
  groups: Record<'primary' | 'systematic', Case[]>; contexts: Record<Case['task'], TaskContext>;
  expectedInputHashes: Record<string, string>; expectedOutcomeHashes: Record<string, string>;
};
for (const group of ['primary', 'systematic'] as const) it(`keeps the ${group} original R9 cases, Soll and entire outcomes unchanged`, () => {
  const list = corpus.groups[group]; expect(hash(list)).toBe(corpus.expectedInputHashes[group]);
  const outcomes = list.map(c => evaluateNaming({ contractVersion: NAMING_CONTRACT, target: { taskId: c.task, fieldId: c.task === 'Z1.02' ? 'term' : 'process' },
    context: corpus.contexts[c.task as keyof typeof corpus.contexts], attemptId: c.id, revision: 1, predecessorId: null, termText: c.text, additionalStatements: c.extra }, INDEPENDENT_SUPPORT));
  expect(hash(outcomes)).toBe(corpus.expectedOutcomeHashes[group]);
  for (const [i, o] of outcomes.entries()) { expect(o.termResult.status).toBe(list[i]!.expectedTerm); expect(o.overallStatus).toBe(list[i]!.expectedOverall); }
});
