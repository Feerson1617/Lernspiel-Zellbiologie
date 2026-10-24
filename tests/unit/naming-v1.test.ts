import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import cases from '../fixtures/naming-v1-cases.json' with { type: 'json' };
import frozen from '../../qa/naming-v1-freeze.json' with { type: 'json' };
import { evaluateNaming, classifyNamingTerm } from '../../src/assessment/naming-v1.ts';
import { createNamingSession } from '../../src/application/naming-session.ts';
import { createEvaluatedAttempt, IncompleteTaskAssessmentError } from '../../src/assessment/progress.ts';
import { NAMING_CONCEPTS } from '../../src/assessment/naming-profiles.ts';
import { NAMING_CONTENT, parseNamingSubmission, createNamingSupport } from '../../src/domain/naming-contract.ts';
import type { NamingTaskId } from '../../src/domain/naming-contract.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';
import { appendAttempt, getAttemptOutcome, parseProgress } from '../../src/domain/progress.ts';
import { createProgressStore } from '../../src/persistence/progress-store.ts';
import { INDEPENDENT_SUPPORT, namingContext, namingInput } from '../helpers/naming-v1.ts';

it('keeps the entire pre-implementation contract and Soll matrix byte-for-byte frozen', () => {
  for (const [path, sha] of Object.entries(frozen.files)) expect(createHash('sha256').update(readFileSync(path)).digest('hex'), path).toBe(sha);
  expect(cases.filter(c => c.taskId === 'Z1.02')).toHaveLength(132);
  expect(cases.filter(c => c.taskId === 'M6.02')).toHaveLength(128);
});
describe('predeclared whole-field and scope cases (not independent student samples)', () => {
  for (const c of cases) it(`${c.id} ${c.taskId} ${c.group}`, () => {
    const result = evaluateNaming(namingInput(c.taskId as NamingTaskId, c.termText, c.additionalStatements), INDEPENDENT_SUPPORT);
    expect(result.termResult.status).toBe(c.expectedTerm);
    expect(result.overallStatus).toBe(c.expectedOverall);
    for (const e of result.termResult.criteria.flatMap(c => c.evidence)) if (e.kind === 'input_span') expect(c.termText.slice(e.start, e.end)).toBe(e.value);
    for (const e of result.notAssessed) expect((e.field === 'termText' ? c.termText : c.additionalStatements[e.index!])?.slice(e.start, e.end)).toBe(e.value);
    expect(Object.isFrozen(result.submission.context.material)).toBe(true);
  });
});
it('meets the new 95% target per field with ALL predeclared complete inputs in the denominator', () => {
  for (const taskId of ['Z1.02', 'M6.02'] as const) {
    const complete = cases.filter(c => c.taskId === taskId && c.expectedTerm === 'correct');
    expect(complete.length).toBeGreaterThanOrEqual(70);
    const correct = complete.filter(c => evaluateNaming(namingInput(taskId, c.termText, c.additionalStatements), INDEPENDENT_SUPPORT).termResult.status === 'correct').length;
    expect(correct / complete.length).toBeGreaterThanOrEqual(.95);
  }
});
it('exhausts every declared concept across finite articles, wrappers, confidence and punctuation configurations', () => {
  let configurations = 0;
  for (const taskId of ['Z1.02', 'M6.02'] as const) for (const concept of NAMING_CONCEPTS[taskId]) for (const name of concept.names) {
    for (const article of ['', 'der ', 'die ', 'das ', 'den ', 'dem ', 'des ', 'ein ', 'eine ', 'einen ', 'einem ', 'einer ', 'eines ']) {
      for (const [open, close] of [['', ''], ['"', '"'], ["'", "'"], ['„', '“'], ['«', '»'], ['(', ')']]) {
        for (const suffix of ['', '?', '!!', '...', ', danke!']) for (const confidence of ['', 'vielleicht, ', 'vermutlich ', 'wahrscheinlich ', 'wohl ', 'eventuell ']) {
          const text = `${confidence}${open}${article}${name.toUpperCase()}${close}${suffix}`;
          expect(classifyNamingTerm(text, taskId).status, text).toBe(concept.status); configurations++;
        }
      }
    }
  }
  expect(configurations).toBeGreaterThan(20000);
});
it('keeps original Unicode/UTF16 evidence, all input arrays and nested contexts immutable', () => {
  const extras = ['🌱 zusätzliche Erklärung'];
  const input = { ...namingInput('Z1.02', '  „Vakuolenmembran“? ', extras) };
  const result = evaluateNaming(input, INDEPENDENT_SUPPORT);
  extras[0] = 'geändert'; input.termText = 'Zellwand';
  expect(result.submission.termText).toBe('  „Vakuolenmembran“? ');
  expect(result.notAssessed[0]?.value).toBe('🌱 zusätzliche Erklärung');
  expect(result.notAssessed[0]?.end).toBe(24);
  expect(() => { (result.submission.context.material as Record<string, unknown>)['cellProfile'] = 'animal'; }).toThrow();
});
it('enforces the predeclared two wrapper levels without repeated hidden reductions', () => {
  for (const task of ['Z1.02', 'M6.02'] as const) {
    const name = task === 'Z1.02' ? 'Tonoplast' : 'Osmose';
    expect(classifyNamingTerm(`(„${name}“)`, task).status).toBe('correct');
    for (const text of [`((„${name}“))`, `(„vielleicht '${name}'“)`, `der der ${name}`, `${name}, danke. ${name}`, `Nicht nicht ${name}, sondern ${name}`]) expect(classifyNamingTerm(text, task).status, text).toBe('clarify');
  }
});
it('rejects invalid request shapes, active getters, hidden keys and new status/provenance vocabulary', () => {
  const input = namingInput('Z1.02', 'Tonoplast');
  for (const bad of [{ ...input, extra: true }, { ...input, target: { taskId: 'Z1.02', fieldId: 'process' } }, { ...input, termText: 17 }, { ...input, additionalStatements: [1] }, { ...input, additionalStatements: ['', '', '', ''] }, { ...input, revision: 0 }, { ...input, contractVersion: 'naming-input/0.2-draft' }]) expect(() => parseNamingSubmission(bad)).toThrow();
  let getterCalled = false;
  expect(() => parseNamingSubmission({ ...input, get termText() { getterCalled = true; return 'Tonoplast'; } })).toThrow();
  expect(getterCalled).toBe(false);
  expect(() => createNamingSupport({ ...INDEPENDENT_SUPPORT, assistance: 'not_assessed' as never })).toThrow();
  expect(() => createNamingSupport({ ...INDEPENDENT_SUPPORT, assistance: 'solution_viewed' })).toThrow();
  expect(() => createNamingSupport({ ...INDEPENDENT_SUPPORT, origin: 'wordbank_selection' })).toThrow();
});
it('binds every version, seed, phase, model state and exact validated material including total potential in Pa', () => {
  const input = namingInput('M6.02', 'Osmose');
  for (const key of ['taskVersion', 'rubricVersion', 'contentVersion', 'modelVersion'] as const) {
    const context = namingContext('M6.02', { [key]: 'changed-explicit-version' });
    const result = evaluateNaming({ ...input, context }, INDEPENDENT_SUPPORT);
    // modelVersion is explicitly caller-defined; all other labels are fixed to the new contract.
    expect(result.termResult.status).toBe(key === 'modelVersion' ? 'correct' : 'technical');
    expect(result.termResult.contextHash).not.toBe(input.context.contextHash);
  }
  const material = input.context.material;
  for (const key of Object.keys(material)) {
    const missing = { ...material }; delete missing[key];
    expect(evaluateNaming({ ...input, context: namingContext('M6.02', { material: missing }) }, INDEPENDENT_SUPPORT).overallStatus).toBe('technical');
  }
  for (const change of [{ waterPotential: { unit: 'MPa', vacuole: -0.1, cytosol: -0.3, external: -0.7 } }, { waterPotential: { unit: 'Pa', vacuole: -300000, cytosol: -300000, external: -700000 } }, { waterPermeability: { cellMembrane: true, tonoplast: false } }, { sucroseRetention: 'permeable' }, { extra: true }]) {
    expect(evaluateNaming({ ...input, context: namingContext('M6.02', { material: { ...material, ...change } }) }, INDEPENDENT_SUPPORT).overallStatus).toBe('technical');
  }
  expect(evaluateNaming({ ...input, context: namingContext('M6.02', { modelState: { hiddenATP: 1 } }) }, INDEPENDENT_SUPPORT).overallStatus).toBe('technical');
  expect(() => evaluateNaming({ ...input, context: { ...input.context, seed: 'forged' } }, INDEPENDENT_SUPPORT)).toThrow();
  for (const phase of ['predict', 'transfer'] as const) expect(evaluateNaming({ ...input, context: namingContext('M6.02', { phase }) }, INDEPENDENT_SUPPORT).termResult.contextHash).not.toBe(input.context.contextHash);
});
it('keeps explicit model labels mandatory and uses no default scientific version', () => {
  expect(() => namingContext('Z1.02', { modelVersion: '' })).toThrow();
  expect(() => createTaskContext({ ...namingContext('Z1.02'), modelVersion: undefined } as never)).toThrow();
});
it('checks the complete envelope for Z1.02 and never books M6.02 or a detached green criterion', () => {
  const context = namingContext('Z1.02'), s = createNamingSession(context, { idPrefix: 'scope', resumed: false, loadedAttempts: [] });
  const o = s.submit(s.makeSubmission('Tonoplast', ['Die Zellwand schrumpft.']));
  expect(o.termResult.status).toBe('correct'); expect(o.overallStatus).toBe('clarify');
  expect(s.record(o).status).toBe('clarify');
  expect(() => createEvaluatedAttempt('bypass', o.termResult, context)).toThrow('FULL_NAMING_ENVELOPE_REQUIRED');
  expect(() => s.record({ ...o, overallStatus: 'correct' })).toThrow('UNISSUED_OUTCOME');
  expect(() => s.record(o.termResult as never)).toThrow();
  const m = createNamingSession(namingContext('M6.02'), { idPrefix: 'm6', resumed: false, loadedAttempts: [] });
  const r = m.submit(m.makeSubmission('Osmose', []));
  expect(r.pendingCriteria).toEqual(['M6.02.C02', 'M6.02.C03']); expect(r.overallStatus).toBe('partial');
  expect(() => m.record(r)).toThrow(IncompleteTaskAssessmentError);
});
it('provides specific rich feedback, no unrequested solution for wrong/partial and no name in hints', () => {
  for (const task of ['Z1.02', 'M6.02'] as const) for (const concept of NAMING_CONCEPTS[task]) {
    const r = evaluateNaming(namingInput(task, concept.names[0]!), INDEPENDENT_SUPPORT);
    for (const text of Object.values(r.feedback)) expect(text.length).toBeGreaterThan(25);
    if (concept.status !== 'correct') expect(Object.values(r.feedback).join(' ')).not.toMatch(task === 'Z1.02' ? /Tonoplast|Vakuolenmembran/u : /Osmose/u);
    if (concept.status === 'incorrect') expect(r.termResult.criteria[0]?.evidence.length).toBeGreaterThan(0);
  }
});
function session() { return createNamingSession(namingContext('Z1.02'), { idPrefix: 'chain', resumed: false, loadedAttempts: [] }); }
it('owns the session configuration: caller mutation cannot mint a second booking for the same revision', () => {
  const config = { idPrefix: 'owned-prefix', resumed: false, loadedAttempts: [] };
  const s = createNamingSession(namingContext('Z1.02'), config);
  const first = s.submit(s.makeSubmission('Tonoplast', [])), record = s.record(first);
  config.idPrefix = 'changed-prefix'; config.resumed = true;
  const duplicate = s.submit(s.makeSubmission('Tonoplast', []));
  expect(duplicate).toBe(first); expect(s.record(duplicate)).toBe(record);
  expect(duplicate.submission.attemptId).toBe('owned-prefix-1');
  expect(s.getState().outcomes).toHaveLength(1);
  expect(() => createNamingSession(namingContext('Z1.02'), { ...config, unexpected: true } as never)).toThrow();
});
it('makes self revision independent, links to the original predecessor context and prevents duplicate bookings', () => {
  const s = session(); const first = s.submit(s.makeSubmission('Membran', [])); s.edit();
  const request = s.makeSubmission('Tonoplast', []), second = s.submit(request);
  expect(second.submission.predecessorId).toBe(first.submission.attemptId);
  expect(second.support.assistance).toBe('independent'); expect(first.overallStatus).toBe('partial');
  expect(s.submit(request)).toBe(second); expect(s.submit(s.makeSubmission('Tonoplast', []))).toBe(second);
  expect(s.record(second)).toBe(s.record(second));
  expect(() => s.record(first)).toThrow('UNISSUED_OUTCOME');
  s.edit(); expect(() => s.submit(request)).toThrow('STALE_SUBMISSION');
  expect(() => s.submit({ ...s.makeSubmission('Tonoplast', []), predecessorId: 'foreign' })).toThrow('PREDECESSOR');
});
it('keeps actual support sticky across all five states, material changes and copying the solution', () => {
  const s = session(); const first = s.submit(s.makeSubmission('Zellwand', []));
  for (const help of ['hint', 'wordbank', 'clarified', 'solution_viewed'] as const) {
    s.help(help); const result = s.submit(s.makeSubmission('Tonoplast', []));
    expect(result.support.assistance).toBe(help); expect(result.support.events.at(-1)?.kind).toBe(help);
    expect(result.support.origin).toBe(help === 'clarified' ? 'wordbank_selection' : 'typed');
    s.edit(); const wrong = s.submit(s.makeSubmission('Zellwand', []));
    expect(wrong.termResult.status).toBe('incorrect'); expect(wrong.support.assistance).toBe(help);
  }
  expect(first.support.assistance).toBe('independent'); expect(first.overallStatus).toBe('incorrect');
  const changed = namingContext('Z1.02', { material: { highlightedStructureId: 'tonoplast', cellProfile: 'plant_leaf' }, seed: 'new-state' });
  s.activate(changed, 'same_instance');
  const copied = s.submit(s.makeSubmission('Tonoplast', [])); expect(copied.support.assistance).toBe('solution_viewed');
  const record = s.record(copied), progress = appendAttempt(parseProgress({ schemaVersion: 1, contentVersion: NAMING_CONTENT, attempts: [] }), record);
  expect(getAttemptOutcome(progress, record.attemptId, changed).successful).toBe(false);
  expect(() => s.submit({ ...copied.submission, attemptId: 'forged' })).toThrow();
});
it('requires actually different material AND seed AND unused instance for a new independent case; return restores help', () => {
  const s = session(), initial = namingContext('Z1.02'); s.help('solution_viewed');
  for (const bad of [namingContext('Z1.02', { instanceId: 'new', seed: 'new' }), namingContext('Z1.02', { instanceId: 'new', material: { highlightedStructureId: 'tonoplast', cellProfile: 'plant_leaf' } })]) expect(() => s.activate(bad, 'new_case')).toThrow('RELABELLED_CASE');
  const fresh = namingContext('Z1.02', { instanceId: 'actual-new', seed: 'actual-new', material: { highlightedStructureId: 'tonoplast', cellProfile: 'plant_leaf' } });
  s.activate(fresh, 'new_case'); expect(s.submit(s.makeSubmission('Tonoplast', [])).support.assistance).toBe('independent');
  s.activate(initial, 'return'); expect(s.getState().assistance).toBe('solution_viewed');
  expect(() => s.activate(fresh, 'new_case')).toThrow('INSTANCE_REUSE');
});
it('rejects stale outcomes after same-instance context change and altered predecessors with old hashes', () => {
  const s = session(); const r = s.submit(s.makeSubmission('Tonoplast', []));
  s.activate(namingContext('Z1.02', { seed: 'changed-seed' }), 'same_instance');
  expect(() => s.record(r)).toThrow();
  expect(() => s.submit({ ...s.makeSubmission('Tonoplast', []), predecessorId: r.submission.attemptId })).toThrow('PREDECESSOR');
});
it('on reload/back treats absent help history as unverified without inventing events or restoring success', () => {
  const s = createNamingSession(namingContext('Z1.02'), { idPrefix: 'reload', resumed: true, loadedAttempts: [] });
  const o = s.submit(s.makeSubmission('Tonoplast', [])); expect(o.overallStatus).toBe('technical');
  expect(o.termResult.status).toBe('correct'); expect(o.support.events).toEqual([]);
  expect(() => s.record(o)).toThrow('HISTORY_UNVERIFIED');
  const old = session(), a = old.submit(old.makeSubmission('Tonoplast', [])), record = old.record(a);
  const loaded = createNamingSession(namingContext('Z1.02'), { idPrefix: 'loaded', resumed: false, loadedAttempts: [record] });
  expect(loaded.getState().history).toBe('history_unverified');
});
it('retains RAM chain on quota/denied failure and writes only eight metadata fields with no raw content', () => {
  for (const errorName of ['QuotaExceededError', 'SecurityError']) {
    const s = session(), store = createProgressStore(NAMING_CONTENT, () => ({ getItem: () => null, setItem: () => { throw new DOMException('test', errorName); }, removeItem: () => { throw Error('must not remove'); } }));
    s.help('hint'); const o = s.submit(s.makeSubmission('Tonoplast', ['PRIVATE_RAW_SENTINEL']));
    const state = store.save(appendAttempt(store.getState().progress, s.record(o)));
    expect(state.mode).toBe('session'); expect(state.issue).toBe(errorName === 'SecurityError' ? 'denied' : 'quota');
    expect(Object.keys(state.progress.attempts[0]!)).toHaveLength(8);
    expect(store.exportProgress()).not.toMatch(/PRIVATE_RAW_SENTINEL|termText|contextHash|predecessor/);
    expect(s.getState().assistance).toBe('hint'); expect(s.getState().outcomes[0]?.submission.additionalStatements).toEqual(['PRIVATE_RAW_SENTINEL']);
  }
});
