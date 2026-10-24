import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { classifyM602Relation } from '../../src/assessment/m602-relations.ts';
import type { RelationField } from '../../src/assessment/m602-relations.ts';
import { evaluateM602 } from '../../src/assessment/m602.ts';
import { createM602Session } from '../../src/application/m602-session.ts';
import { parseM602Submission, M602_FIELDS } from '../../src/domain/m602-contract.ts';
import { createEvaluatedAttempt } from '../../src/assessment/progress.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { appendAttempt, parseProgress, getAttemptOutcome } from '../../src/domain/progress.ts';
import { M602_SUPPORT, m602Context, m602Input } from '../helpers/m602.ts';
const rows = JSON.parse(readFileSync('tests/fixtures/p02c-cases.json', 'utf8')) as { id: string; field: RelationField; text: string; expected: string; group: string }[];
it('preserves the pre-implementation contract and predeclared own Soll values; no independent acceptance', () => {
  const freeze = JSON.parse(readFileSync('qa/p02c-freeze.json', 'utf8')) as { files: Record<string, string> };
  for (const [path, hash] of Object.entries(freeze.files)) expect(createHash('sha256').update(readFileSync(path)).digest('hex')).toBe(hash);
  expect(rows.filter(r => r.field === 'direction')).toHaveLength(106); expect(rows.filter(r => r.field === 'volume')).toHaveLength(98);
});
it('treats quantified excesses as net balances and retains their simultaneous contradiction', () => {
  expect(classifyM602Relation('Es treten mehr Wassermoleküle aus als ein und mehr Wassermoleküle ein als aus', 'direction').status).toBe('incorrect');
  expect(classifyM602Relation('Mehr Wassermoleküle aus als ein; netto nach innen', 'direction').status).toBe('incorrect');
});
for (const row of rows) it(`${row.id} ${row.field} ${row.group}`, () => {
  const d = classifyM602Relation(row.text, row.field); expect(d.status, row.text).toBe(row.expected);
  const o = evaluateM602(m602Input({ [row.field]: row.text }), M602_SUPPORT);
  expect(o.fields[row.field].result.status).toBe(row.expected);
  for (const evidence of o.fields[row.field].result.criteria[0]!.evidence) if (evidence.kind === 'input_span') expect(row.text.slice(evidence.start, evidence.end)).toBe(evidence.value);
});
it('keeps all predeclared complete relations in the denominator per field, zero critical colors', () => {
  for (const field of ['direction', 'volume'] as const) {
    const complete = rows.filter(r => r.field === field && r.expected === 'correct');
    expect(complete.length).toBeGreaterThanOrEqual(60);
    expect(complete.filter(r => classifyM602Relation(r.text, field).status === 'correct').length / complete.length).toBeGreaterThanOrEqual(.95);
  }
});
it('integrates exactly three same-context criteria; incomplete, contradictory or unassessed answers cannot complete M6', () => {
  const o = evaluateM602(m602Input(), M602_SUPPORT);
  expect(o.overallStatus).toBe('correct'); expect(o.pendingCriteria).toEqual([]);
  expect(o.fullResult.criteria.map(c => c.id)).toEqual(['M6.02.C01', 'M6.02.C02', 'M6.02.C03']);
  for (const f of M602_FIELDS) expect(isResultForContext(o.fields[f].result, o.submission.context)).toBe(true);
  for (const answers of [{ direction: '', volume: '' }, { process: '', direction: '', volume: '' }, { direction: 'nach innen' }, { volume: 'größer' }, { direction: 'raus und ich denke an Bakterien' }]) {
    const bad = evaluateM602(m602Input(answers), M602_SUPPORT); expect(bad.overallStatus).not.toBe('correct');
  }
  expect(evaluateM602(m602Input({}, ['Die Zellwand schrumpft.']), M602_SUPPORT).overallStatus).toBe('clarify');
  expect(evaluateM602(m602Input({ volume: 'größer' }, ['Osmose ist korrekt.']), M602_SUPPORT).overallStatus).toBe('incorrect');
});
it('uses explicit separate versions and exact water-potential material including pressure, both membranes and retention', () => {
  const input = m602Input();
  for (const key of ['taskVersion', 'rubricVersion', 'contentVersion'] as const) expect(evaluateM602({ ...input, context: m602Context({ [key]: 'changed' }) }, M602_SUPPORT).overallStatus).toBe('technical');
  const c = m602Context({ modelVersion: 'explicit-another-model-label' });
  expect(isResultForContext(evaluateM602(input, M602_SUPPORT).fullResult, c)).toBe(false);
  expect(() => m602Context({ modelVersion: '' })).toThrow();
  for (const material of [{ ...input.context.material, waterPotential: { unit: 'MPa', vacuole: -.1, cytosol: -.3, external: -.7 } }, { ...input.context.material, waterPermeability: { cellMembrane: true, tonoplast: false } }, { ...input.context.material, sucroseRetention: 'permeable' }, { ...input.context.material, waterPotential: { unit: 'Pa', vacuole: -1, cytosol: -1, external: -3 } }]) expect(evaluateM602({ ...input, context: m602Context({ material }) }, M602_SUPPORT).overallStatus).toBe('technical');
  expect(evaluateM602({ ...input, context: m602Context({ modelState: { hiddenValue: 1 } }) }, M602_SUPPORT).overallStatus).toBe('technical');
  expect(() => evaluateM602({ ...input, context: { ...input.context, seed: 'forged' } }, M602_SUPPORT)).toThrow();
});
it('rejects malformed shapes and never coerces fields or turns extra text into an answer', () => {
  const input = m602Input();
  for (const value of [{ ...input, extra: true }, { ...input, answers: { process: 'Osmose', direction: 'raus' } }, { ...input, answers: { ...input.answers, volume: 3 } }, { ...input, additionalStatements: ['', '', '', ''] }]) expect(() => parseM602Submission(value)).toThrow();
  let getterCalled = false;
  expect(() => parseM602Submission({ ...input, get answers() { getterCalled = true; return input.answers; } })).toThrow(); expect(getterCalled).toBe(false);
  const extras = ['🌱 unbekannter Zusatz'], answers = { ...input.answers };
  const result = evaluateM602({ ...input, answers, additionalStatements: extras }, M602_SUPPORT); answers.volume = 'größer'; extras[0] = 'changed';
  expect(result.submission.answers.volume).toBe('nimmt ab'); expect(result.notAssessed[0]?.value).toBe('🌱 unbekannter Zusatz'); expect(Object.isFrozen(result.fields)).toBe(true);
});
function session(resumed = false) { return createM602Session(m602Context(), { idPrefix: 'm602-ledger', resumed, loadedAttempts: [] }); }
it('records only complete privately issued envelopes; wrong predecessors/clones/duplicates/stale contexts are rejected', () => {
  const s = session(); const a = s.submit(s.makeSubmission({ process: 'Osmose', direction: '', volume: '' }, [])); expect(() => s.record(a)).toThrow('INCOMPLETE_M602');
  s.edit(); const request = s.makeSubmission(m602Input().answers, []), o = s.submit(request);
  expect(o.submission.predecessorId).toBe(a.submission.attemptId); expect(s.submit(request)).toBe(o); expect(s.record(o)).toBe(s.record(o));
  expect(Object.keys(s.record(o))).toHaveLength(8); expect(() => s.record({ ...o })).toThrow('UNISSUED_M602');
  expect(() => createEvaluatedAttempt('bypass', o.fullResult, o.submission.context)).toThrow();
  s.edit(); expect(() => s.submit({ ...s.makeSubmission(m602Input().answers, []), predecessorId: 'foreign' })).toThrow('PREDECESSOR');
  s.activate(m602Context({ seed: 'another' }), 'same_instance'); expect(() => s.record(o)).toThrow(); expect(() => s.submit(request)).toThrow('STALE_M602');
});
it('keeps actual field-specific help and whole-instance assistance, including copied solutions and self revision', () => {
  const s = session(); s.help('direction', 'hint');
  let o = s.submit(s.makeSubmission(m602Input().answers, [])); expect(o.fields.process.result.assistance).toBe('independent'); expect(o.fields.direction.result.assistance).toBe('hint'); expect(o.support.assistance).toBe('hint');
  s.help('volume', 'wordbank'); s.help('volume', 'clarified'); o = s.submit(s.makeSubmission(m602Input().answers, [])); expect(o.fieldSupport.volume.origin).toBe('wordbank_selection');
  s.help('direction', 'solution_viewed'); s.edit('direction'); o = s.submit(s.makeSubmission(m602Input().answers, [])); expect(o.support.assistance).toBe('solution_viewed');
  const receipt = s.record(o), progress = appendAttempt(parseProgress({ schemaVersion: 1, contentVersion: o.submission.context.contentVersion, attempts: [] }), receipt);
  expect(getAttemptOutcome(progress, receipt.attemptId, o.submission.context).independent).toBe(false); expect(getAttemptOutcome(progress, receipt.attemptId, o.submission.context).successful).toBe(false);
  s.activate(m602Context({ seed: 'state-changed' }), 'same_instance'); expect(s.submit(s.makeSubmission(m602Input().answers, [])).support.assistance).toBe('solution_viewed');
});
it('inherits the repaired R9 boundary: a repeated B after unsaved help and reload never restores trust', () => {
  const a = m602Context(), b = m602Context({ instanceId: 'B', seed: 'B', material: { ...a.material, waterPotential: { unit: 'Pa', vacuole: -100000, cytosol: -300000, external: -701000 } } });
  const old = session(); old.activate(b, 'new_case'); old.help('volume', 'solution_viewed');
  const restored = session(true); restored.activate(b, 'new_case'); const o = restored.submit(restored.makeSubmission(m602Input().answers, []));
  expect(o.submission.context).toEqual(old.getState().context); expect(o.fullResult.criteria.every(c => c.status === 'correct')).toBe(true); expect(o.overallStatus).toBe('technical'); expect(() => restored.record(o)).toThrow('HISTORY_UNVERIFIED');
});
it('provides concrete feedback paths and keeps actual hints distinct from solutions', () => {
  for (const [field, values] of [['direction', ['nach innen', 'in beide Richtungen', 'Saccharose geht nach außen']], ['volume', ['größer', 'ändert sich', 'Die Zellwand schrumpft']]] as const) for (const text of values) {
    const f = evaluateM602(m602Input({ [field]: text }), M602_SUPPORT).fields[field].feedback;
    expect(Object.values(f).every(s => s.length > 25)).toBe(true);
    expect(f.next).not.toMatch(/Leider falsch|Versuche es noch einmal/u);
  }
});
