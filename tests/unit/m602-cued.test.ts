import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { classifyM602CuedRelation } from '../../src/assessment/m602-cued-relations.ts';
import { evaluateM602Cued as evaluateM602 } from '../../src/assessment/m602-cued.ts';
import { createM602CuedSession as createM602Session } from '../../src/application/m602-session.ts';
import { parseM602CuedSubmission as parseM602Submission } from '../../src/domain/m602-cued-contract.ts';
import { M602_FIELDS } from '../../src/domain/m602-contract.ts';
import type { RelationField } from '../../src/assessment/m602-relations.ts';
import { createEvaluatedAttempt } from '../../src/assessment/progress.ts';
import { isResultForContext } from '../../src/domain/task-context.ts';
import { appendAttempt, parseProgress, getAttemptOutcome } from '../../src/domain/progress.ts';
import { m602CuedInput as m602Input, m602CuedContext as m602Context, M602_SUPPORT } from '../helpers/m602-cued.ts';
import { m602Input as legacyInput } from '../helpers/m602.ts';
import { evaluateM602 as evaluateLegacy } from '../../src/assessment/m602.ts';
import { createNamingSupport } from '../../src/domain/naming-contract.ts';
import { createProgressStore } from '../../src/persistence/progress-store.ts';
const rows = ['cases','supplement'].flatMap(name => JSON.parse(readFileSync(`tests/fixtures/m602-cued-${name}.json`,'utf8'))) as { id: string; field: RelationField; text: string; expected: string; group: string }[];
it('keeps the complete own matrix fixed before first current execution, without independent acceptance', () => {
 for(const name of ['freeze','supplement-freeze']){const f=JSON.parse(readFileSync(`qa/m602-cued-${name}.json`,'utf8')) as {files:Record<string,string>};
 for(const [p,sha] of Object.entries(f.files)) expect(createHash('sha256').update(readFileSync(p)).digest('hex')).toBe(sha);}
 expect(rows).toHaveLength(160);
});
for(const r of rows) it(`${r.id} ${r.field} ${r.group}: ${r.text}`,()=>{
 const o=evaluateM602(m602Input({[r.field]:r.text}),M602_SUPPORT);
 expect(classifyM602CuedRelation(r.text,r.field).status).toBe(r.expected);
 expect(o.fields[r.field].result.status).toBe(r.expected);
 for(const e of o.fields[r.field].result.criteria[0]!.evidence) if(e.kind==='input_span') expect(r.text.slice(e.start,e.end)).toBe(e.value);
 if(r.expected==='clarify') {expect(o.notAssessed.some(x=>x.value===r.text)).toBe(true);expect(o.fields[r.field].feedback.difference).toMatch(/kein|nicht/u);}
 const s=createM602Session(o.submission.context,{idPrefix:r.id,resumed:false,loadedAttempts:[]});const live=s.submit(s.makeSubmission(o.submission.answers,[]));
 if(r.expected==='correct') {expect(live.overallStatus).toBe('correct');expect(Object.keys(s.record(live))).toHaveLength(8);}
 else expect(()=>s.record(live)).toThrow();
});
it('keeps every valid short entry including yellow entries in its per-field denominator',()=>{
 for(const field of ['direction','volume']as const){const valid=rows.filter(r=>r.field===field&&r.group==='valid');expect(valid).toHaveLength(24);expect(valid.filter(r=>classifyM602CuedRelation(r.text,field).status==='correct').length/valid.length).toBeGreaterThanOrEqual(.95);}
});
it('rejects legacy envelopes, contexts, issued handles and old metadata as current performance',()=>{
 const old=legacyInput(),s=session(),o=evaluateLegacy(old,M602_SUPPORT);
 expect(()=>parseM602Submission(old)).toThrow('M602_CUED_CONTRACT');expect(()=>s.submit(old)).toThrow();
 expect(evaluateM602({...m602Input(),context:old.context},M602_SUPPORT).overallStatus).toBe('technical');
 expect(()=>s.record(o as never)).toThrow();expect(()=>createM602Session(old.context,{idPrefix:'legacy',resumed:false,loadedAttempts:[]})).toThrow();
 const raw=JSON.stringify({schemaVersion:1,contentVersion:old.context.contentVersion,attempts:[{attemptId:'old',taskId:'M6.02',instanceId:old.context.instanceId,taskVersion:old.context.taskVersion,rubricVersion:old.context.rubricVersion,modelVersion:old.context.modelVersion,status:'correct',assistance:'independent'}]});
 let storage=raw;const store=createProgressStore(m602Context().contentVersion,()=>({getItem:()=>storage,setItem:(_k,v)=>{storage=v},removeItem:()=>{throw Error('must preserve')}}));
 expect(store.getState().issue).toBe('content_version');const loaded=store.getState().history!.attempts;
 const current=createM602Session(m602Context(),{idPrefix:'restored',resumed:false,loadedAttempts:loaded});const now=current.submit(current.makeSubmission(m602Input().answers,[]));
 expect(now.overallStatus).toBe('technical');expect(()=>current.record(now)).toThrow('HISTORY_UNVERIFIED');expect(storage).toBe(raw);
 expect(getAttemptOutcome(parseProgress(JSON.parse(raw)), 'old',m602Context()).successful).toBe(false);
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
  s.activate(m602Context({ seed: 'state-changed' }), 'same_instance');
  const changed = s.submit(s.makeSubmission(m602Input().answers, []));
  expect(changed.support.assistance).toBe('solution_viewed'); expect(changed.fieldSupport.volume.origin).toBe('wordbank_selection');
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

it('checks all 1296 current status/additional-text/history combinations against a separate truth table',()=>{
 const states=['correct','incorrect','partial','clarify','empty','technical'];
 const values={process:['Osmose','Plasmolyse','Diffusion','Osmose oder Diffusion','','x\u202e'],direction:['nach außen','nach innen','in beide Richtungen','sie geht hinaus','','x\u202e'],volume:['nimmt ab','größer','ändert sich','es wird kleiner','','x\u202e']};
 let count=0;
 for(let a=0;a<6;a++)for(let b=0;b<6;b++)for(let c=0;c<6;c++)for(const extra of [[],['Zusatz'],['Die Wand schrumpft.']])for(const history of ['verified','history_unverified']as const){
  const fs=[states[a],states[b],states[c]],support=createNamingSupport({assistance:'independent',history,origin:'typed',events:[]});
  const o=evaluateM602(m602Input({process:values.process[a]!,direction:values.direction[b]!,volume:values.volume[c]!},extra),{process:support,direction:support,volume:support});
  const expected=history==='history_unverified'||fs.includes('technical')?'technical':fs.includes('incorrect')?'incorrect':fs.includes('clarify')||extra.length?'clarify':fs.every(s=>s==='empty')?'empty':fs.every(s=>s==='correct')?'correct':'partial';
  expect(M602_FIELDS.map(f=>o.fields[f].result.status)).toEqual(fs);expect(o.overallStatus).toBe(expected);count++;
 }
 expect(count).toBe(1296);
});
it('retains field-specific assistance and history across all 250 current pure support combinations',()=>{
 const kinds=['independent','hint','wordbank','clarified','solution_viewed']as const;let count=0;
 for(const a of kinds)for(const b of kinds)for(const c of kinds)for(const history of ['verified','history_unverified']as const){
  const support=Object.fromEntries(M602_FIELDS.map((f,i)=>{const kind=[a,b,c][i]!;return[f,createNamingSupport({assistance:kind,history,origin:kind==='clarified'?'wordbank_selection':'typed',events:kind==='independent'?[]:[{id:f,kind,contextHash:m602Context().contextHash}]})]}))as typeof M602_SUPPORT;
  const o=evaluateM602(m602Input(),support);expect(o.support.assistance).toBe(kinds[Math.max(...[a,b,c].map(x=>kinds.indexOf(x)))]);expect(o.overallStatus).toBe(history==='verified'?'correct':'technical');count++;
 }
 expect(count).toBe(250);
});

it('conservatively isolates the historical multi-object reference regardless of constituent order',()=>{
 for(const marker of ['hier','jetzt','insgesamt','im angezeigten Zustand'])for(const pronoun of ['es','ihr Volumen']){
  const volume=`Die Vakuole schrumpft und die Zellwand bleibt gleich und ${marker} wird ${pronoun} kleiner.`;
  const old=evaluateLegacy(legacyInput({volume}),M602_SUPPORT);expect(old.fields.volume.result.status).toBe('clarify');expect(old.overallStatus).toBe('clarify');
  const current=evaluateM602(m602Input({volume}),M602_SUPPORT);expect(current.fields.volume.result.status).toBe('clarify');expect(current.overallStatus).toBe('clarify');
 }
});

for(const field of ['direction','volume']as const)for(let i=0;i<10;i++)it(`current ${field} context gate ${i}`,()=>{
 const base=m602Context(),m=base.material;
 const variants=[
  {},
  {material:{...m,waterPotential:{unit:'Pa',vacuole:-220000.5,cytosol:-550000.5,external:-1100000.5}}},
  {material:{...m,waterPotential:{unit:'MPa',vacuole:-.2,cytosol:-.5,external:-1.1}}},
  {material:{...m,waterPotential:{unit:'Pa',vacuole:-100,cytosol:-100,external:-300}}},
  {material:{...m,waterPermeability:{cellMembrane:false,tonoplast:true}}},
  {material:{...m,waterPermeability:{cellMembrane:true,tonoplast:false}}},
  {material:{...m,observationPhase:'late_equilibrium'}},
  {modelState:{unmodelled:1}},
  {taskVersion:'old'},
  {rubricVersion:'old'},
 ];
 const context=m602Context(variants[i]!);const o=evaluateM602({...m602Input(),context},M602_SUPPORT);
 expect(o.fields[field].result.status).toBe(i<2?'correct':'technical');
 expect(o.fields[field].result.contextHash).toBe(context.contextHash);
});

it('distinguishes a valid prediction workflow phase from an unsupported biological observation phase',()=>{
 const prediction=m602Context({phase:'predict'}),o=evaluateM602({...m602Input(),context:prediction},M602_SUPPORT);
 expect(o.overallStatus).toBe('correct');expect(isResultForContext(o.fullResult,m602Context())).toBe(false);
});

// Own code-guided crossprobe fixed before execution. No external review corpus
// is imported; these names have no biological meaning and are not a blacklist.
const ownKeyCases: { field: RelationField; text: string; status: string; reason: string }[] = [];
for (const name of ['constructor', '__proto__', 'toString', 'hasOwnProperty', 'valueOf', 'isPrototypeOf']) {
  for (const field of ['direction', 'volume'] as const) for (const prefix of ['', 'netto ', 'nicht ']) {
    ownKeyCases.push({ field, text: prefix + name, status: 'clarify', reason: 'scope' });
  }
}
for (const [field, good] of [['direction', 'nach außen'], ['volume', 'nimmt ab']] as const) {
  for (const text of [`constructor und ${good}`, `${good} und __proto__`, 'constructor unbekannt', 'unbekannt constructor']) {
    ownKeyCases.push({ field, text, status: 'clarify', reason: 'scope' });
  }
}
for (const text of ['constructor → Außenraum', 'Zellinneres → constructor', '__proto__ → Außenraum', 'Zellinneres → __proto__']) {
  ownKeyCases.push({ field: 'direction', text, status: 'clarify', reason: 'scope' });
}
for (const [field, text, status, reason] of [
  ['direction', 'nach außen', 'correct', 'out'], ['direction', 'nach innen', 'incorrect', 'in'],
  ['volume', 'nimmt ab', 'correct', 'down'], ['volume', 'nimmt zu', 'incorrect', 'up'],
] as const) ownKeyCases.push({ field, text, status, reason });
for (const c of ownKeyCases) it(`own-key ${c.field}: ${c.text} → ${c.status}/${c.reason}`, () => {
  const input = m602Input({ [c.field]: c.text }), o = evaluateM602(input, M602_SUPPORT);
  expect(classifyM602CuedRelation(c.text, c.field)).toEqual({ status: c.status, reason: c.reason });
  expect(o.fields[c.field].result.status).toBe(c.status);
  expect(o.fields[c.field].result.criteria[0]!.reasonCode).toBe(c.reason);
  expect(o.overallStatus).toBe(c.status);
  expect(o.fields[c.field].result.criteria[0]!.evidence).toEqual([{ kind: 'input_span', value: c.text, start: 0, end: c.text.length }]);
  expect(o.notAssessed).toEqual(c.status === 'clarify'
    ? [{ field: c.field, index: null, status: 'not_assessed', value: c.text, start: 0, end: c.text.length }] : []);
  const s = session(), current = s.submit(s.makeSubmission(input.answers, []));
  if (c.status === 'correct') expect(Object.keys(s.record(current))).toHaveLength(8);
  else expect(() => s.record(current)).toThrow('INCOMPLETE_M602');
});
it('own-key repair preserves explicit malformed contract and technical context rejection', () => {
  const input = m602Input({ volume: 'constructor' });
  expect(() => evaluateM602({ ...input, answers: { ...input.answers, volume: null } }, M602_SUPPORT)).toThrow();
  expect(() => evaluateM602({ ...input, context: { ...input.context, contextHash: 'forged' } }, M602_SUPPORT)).toThrow();
  const invalid = evaluateM602({ ...input, context: m602Context({ modelState: { unsupported: true } }) }, M602_SUPPORT);
  expect(invalid.overallStatus).toBe('technical');
  expect(invalid.fields.volume.result.criteria[0]!.reasonCode).toBe('technical');
  for (const field of ['direction', 'volume'] as const) {
    const text = '🌱 constructor';
    const o = evaluateM602(m602Input({ [field]: text }), M602_SUPPORT);
    expect(o.fields[field].result.status).toBe('clarify');
    expect(o.notAssessed).toContainEqual({ field, index: null, status: 'not_assessed', value: text, start: 0, end: 14 });
  }
});
