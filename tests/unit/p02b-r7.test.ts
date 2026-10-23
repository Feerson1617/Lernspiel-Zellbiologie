import { spawnSync } from 'node:child_process';
import { canonicalReviewData } from '../helpers/p02b-r7.ts';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { afterAll, expect, it } from 'vitest';
import { R7_CASES, R7_KNOWN, executeR7, expectedRuntimeR7, acceptedKnownR7, R7_OSMOSIS_CONTEXT, R7_TONOPLAST_CONTEXT, R7_UNRESOLVED } from '../helpers/p02b-r7.ts';
import { R7_MAIN, R7_SYSTEMATIC, R7_TARGETED, R7_INPUT_HASHES, R7_RESULT_HASHES, R7_REAFFIRMATION_IDS, R7_ADJUDICATIONS } from '../fixtures/p02b-r7-cases.ts';
import { R6_MAIN, R6_SYSTEMATIC, R6_TARGETED, R6_KNOWN } from '../fixtures/p02b-r6-cases.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { createEvaluatedAttempt, IncompleteTaskAssessmentError } from '../../src/assessment/progress.ts';

const cases = R7_CASES.map(f => ({ ...f, expectedRuntime: expectedRuntimeR7(f), ...executeR7(f) }));
const knownCases = R7_KNOWN.map(f => ({ ...f, expectedRuntime: acceptedKnownR7(f), ...executeR7(f) }));
afterAll(() => writeFileSync('qa/generated/p02b-r7-results.json', JSON.stringify({ cases, knownCases }, null, 2) + '\n'));
for (const f of [...cases, ...knownCases]) it(`${f.id}: ${R7_UNRESOLVED.includes(f.id) ? 'records unresolved original Soll; no acceptance' : 'regression'} — ${f.text}`, () => {
  expect(f.expectedRuntime, f.id).toContain(f.result.status);
  expect(isResultForContext(f.result, f.field === 'osmosis' ? R7_OSMOSIS_CONTEXT : R7_TONOPLAST_CONTEXT)).toBe(true);
  expect(f.result.criteria).toHaveLength(1);
  expect(f.result.criteria[0]!.id).toBe(f.field === 'osmosis' ? 'M6.02.C01' : 'Z1.02.C01');
  expect(f.feedback.length).toBeGreaterThan(20);
  if (f.result.status === 'correct') expect(f.result.unassessedRelevantText).toBe(false);
  for (const e of f.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
  if (f.field === 'osmosis') expect(() => createEvaluatedAttempt(`r4-${f.id}`, f.result, R7_OSMOSIS_CONTEXT)).toThrow(IncompleteTaskAssessmentError);
});

const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(canonicalReviewData(value))).digest('hex');
it('preserves all supplied IDs, texts, metadata, raw Soll and the 13 declared overlaps', () => {
  const lists = [R7_MAIN, R7_SYSTEMATIC, R7_TARGETED, R7_KNOWN];
  expect(lists.map(list => list.length)).toEqual([183, 290, 24, 2520]);
  expect(lists.map(hash)).toEqual(Object.values(R7_INPUT_HASHES));
  expect(R7_KNOWN).toEqual([R6_KNOWN, R6_MAIN, R6_SYSTEMATIC, R6_TARGETED].flatMap((list, i) => list.map(f => ({ ...f, id: `previous${i}-${f.id}`, group: `previous${i}-${f.group}` }))));
  const normalize = (s: string) => s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const main = new Set(R7_MAIN.map(f => normalize(f.text)));
  expect(main.size).toBe(183);
  expect(new Set(R7_SYSTEMATIC.map(f => normalize(f.text))).size).toBe(290);
  expect(R7_SYSTEMATIC.filter(f => main.has(normalize(f.text)))).toHaveLength(13);
  expect(R7_SYSTEMATIC.filter(f => !main.has(normalize(f.text)))).toHaveLength(277);
  expect(new Set(lists.flat().map(f => f.id)).size).toBe(3017);
  expect(R7_UNRESOLVED).toHaveLength(113); // 63 main + 50 systematic, no revised Soll.
});

it('reproduces all complete supplied results, context hashes, evidence and feedback', () => {
  const lists = [cases.slice(0, 183), cases.slice(183, 473), cases.slice(473), knownCases];
  expect(lists.map(list => hash(list.map(({ result, feedback }) => ({ result, feedback }))))).toEqual(Object.values(R7_RESULT_HASHES));
});

it('retains the original 12 reaffirmation repairs and all 24 new courtesy diagnoses', () => {
  const selected = knownCases.filter(f => (R7_REAFFIRMATION_IDS as readonly string[]).includes(f.id));
  expect(selected).toHaveLength(12);
  for (const f of selected) expect(f.result.status, f.id).toBe('correct');
  expect(R7_TARGETED).toHaveLength(24);
  for (const f of cases.slice(473)) expect(f.expected, f.id).toContain(f.result.status);
});

it('retains three biologically warranted red adjudications beside their raw clarify Soll', () => {
  for (const original of R7_ADJUDICATIONS) {
    const f = knownCases.find(f => f.id === original.id)!;
    expect(f.text).toBe(original.text);
    expect(f.expected).toEqual(original.originalExpected);
    expect(f.expected).toEqual(['clarify']);
    expect(f.result.status).toBe('incorrect');
    expect(f.result.criteria[0]!.evidence.length).toBeGreaterThan(0);
  }
});

it('keeps the inactive main-check proposal consistent with the separately reviewable workflow patch', () => {
  const rules = JSON.parse(readFileSync('review/main-ruleset-proposal.json', 'utf8')) as { rules: { type: string; parameters?: { required_status_checks: { context: string; integration_id: number }[] } }[] };
  const checks = rules.rules.find(r => r.type === 'required_status_checks')!.parameters!.required_status_checks;
  expect(checks.map(c => c.context).sort()).toEqual(['build', 'webkit']);
  expect(checks.every(c => c.integration_id === 15368)).toBe(true);
  const patch = readFileSync('review/pages-gates-proposal.patch', 'utf8');
  expect(patch).toContain('-    if: github.event_name == \'pull_request\'');
  expect(patch).toContain('+    needs: [build, webkit]');
  const validation = spawnSync('git', ['apply', '--check', 'review/pages-gates-proposal.patch'], { encoding: 'utf8' });
  expect(validation.status, validation.stderr).toBe(0); // Read-only, does not apply it.
});
