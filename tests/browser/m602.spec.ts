import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { m602Context, m602Input, M602_SUPPORT } from '../helpers/m602.ts';
import { evaluateM602 } from '../../src/assessment/m602.ts';
import type { M602Session } from '../../src/application/m602-session.ts';
type Page = import('@playwright/test').Page;
type API = typeof import('../../src/assessment/m602.ts') & typeof import('../../src/domain/task-context.ts');
type LabWindow = Window & { lab: { session: M602Session }; api: API };
let source: string;
test.beforeAll(async () => { source = await buildDomainModule(); });
async function openLab(page: Page, base: string, fault = '') {
  let opened = false;
  await page.route(`${base}m602-runtime.mjs`, r => r.fulfill({ contentType: 'text/javascript', body: source }));
  await page.route(`${base}m602-lab*`, r => {
    const reconstructed = opened; opened = true;
    return r.fulfill({ contentType: 'text/html', body: `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>P02c interne Probe</title><div id="lab"></div><script type="module">
    import * as api from './m602-runtime.mjs'; window.api=api;
    const initial=${JSON.stringify(m602Context())};
    function replace(c,changes){const {contextHash,...input}=c;return api.createTaskContext({...input,...changes});}
    function material(c){return {...c.material,waterPotential:{...c.material.waterPotential,external:c.material.waterPotential.external-1000}};}
    const caseB=replace(initial,{instanceId:'m602-fixed-B',seed:'m602-fixed-B',material:material(initial)});
    window.lab=api.mountM602Lab(document.getElementById('lab'),{initialContext:initial,idPrefix:crypto.randomUUID(),resumed:${reconstructed}||['reload','back_forward'].includes(performance.getEntriesByType('navigation')[0]?.type),
      acquireStorage:()=>{if(${JSON.stringify(fault)}==='denied')throw new DOMException('test','SecurityError');if(${JSON.stringify(fault)}==='quota')return {getItem:k=>localStorage.getItem(k),setItem:()=>{throw new DOMException('test','QuotaExceededError')},removeItem:()=>{throw Error('never delete')}};return localStorage;},
      changedContext:c=>replace(c,{seed:c.seed+'-changed',material:material(c)}),newCase:()=>caseB});
    </script></html>` });
  });
  await page.goto('./m602-lab');
  await expect(page.getByRole('heading', { name: 'Wasserverlust schrittweise erklären', exact: true })).toBeVisible();
}
const result = (p: Page) => p.getByRole('region', { name: 'Gesamtrückmeldung', exact: true });
const check = (p: Page) => p.getByRole('button', { name: 'Drei Antworten prüfen', exact: true });
async function fillCorrect(p: Page) {
  await p.getByRole('textbox', { name: 'a) Fachbegriff', exact: true }).fill('Osmose');
  await p.getByRole('textbox', { name: 'b) Nettorichtung', exact: true }).fill('nach außen');
  await p.getByRole('textbox', { name: 'c) Vakuolenvolumen', exact: true }).fill('nimmt ab');
}
test('real DOM field colors, detailed feedback, whole completion, unknown text, Unicode and local-only runtime', async ({ page, baseURL }, info) => {
  const errors: string[] = [], requests: string[] = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('request', r => requests.push(r.url()));
  await openLab(page, baseURL!);
  await expect(page.getByText('Weitere Aussagen (optional) – noch nicht fachlich geprüft', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'a) Fachbegriff', exact: true }).fill('Osmose'); await check(page).click();
  await expect(result(page)).toHaveAttribute('data-status', 'partial');
  expect(await page.evaluate(() => localStorage.getItem('zelllabor11.progress.v1'))).toBeNull();
  await fillCorrect(page);
  await page.locator('#m602-process').fill(''); // field probes do not book a whole-task success
  for (const [field, text, status, detail] of [
    ['direction', 'nach innen', 'incorrect', 'Gefälle'], ['direction', 'in beide Richtungen', 'partial', 'Nettobilanz'],
    ['direction', 'nicht nach außen', 'incorrect', 'Verneinung'], ['direction', 'erst hinein später hinaus', 'clarify', 'Zeitbezüge'],
    ['direction', 'Einzelne Wassermoleküle bewegen sich nach innen, netto fließt Wasser nach außen', 'correct', 'einzelne'],
    ['volume', 'größer', 'incorrect', 'Wasserbilanz'], ['volume', 'ändert sich', 'partial', 'Richtung'],
    ['volume', 'Die Zellwand schrumpft', 'incorrect', 'Zellwand und Vakuolenraum'],
    ['volume', 'Das Vakuolenvolumen nimmt ab und nimmt nicht ab', 'incorrect', 'Widerspruch'],
    ['volume', 'kleiner oder größer', 'clarify', 'Auswahl'], ['volume', 'nimmt ab und unbekannter Mechanismus', 'clarify', 'Zusatzbehauptungen'],
  ]) {
    await page.locator(`#m602-${field}`).fill(text!); await check(page).click();
    const panel = page.getByRole('region', { name: `Bewertung ${field}`, exact: true });
    await expect(panel).toHaveAttribute('data-status', status!); await expect(panel).toContainText(detail!);
    await expect(panel).toContainText('Erkannter Ansatz'); await expect(panel).toContainText('Nächster Schritt');
    await expect(result(page)).toBeFocused();
  }
  await page.screenshot({ path: info.outputPath('m602-differentiated-feedback.png'), fullPage: true });
  await result(page).screenshot({ path: info.outputPath('m602-differentiated-feedback-panel.png') });
  await fillCorrect(page); await check(page).click(); await expect(result(page)).toHaveAttribute('data-status', 'correct');
  const storage = await page.evaluate(() => localStorage.getItem('zelllabor11.progress.v1'));
  expect(JSON.parse(storage!).attempts).toHaveLength(1); expect(Object.keys(JSON.parse(storage!).attempts[0])).toHaveLength(8);
  expect(storage).not.toMatch(/answers|contextHash|Osmose|predecessorId|events/);
  await page.getByText('Weitere Aussagen öffnen', { exact: true }).click();
  const extra = page.getByRole('textbox', { name: 'Weitere Aussagen – ungeprüft', exact: true });
  await extra.fill('🌱 Die Zellwand schrumpft.'); await check(page).click();
  await expect(result(page)).toHaveAttribute('data-status', 'clarify'); await expect(result(page)).toContainText('🌱 Die Zellwand schrumpft.');
  await expect(extra).toHaveValue('🌱 Die Zellwand schrumpft.');
  await extra.fill(''); await page.locator('#m602-direction').fill('<img src=x onerror="window.leak=true">'); await check(page).click();
  await expect(result(page)).toHaveAttribute('data-status', 'clarify'); expect(await page.evaluate(() => Object.hasOwn(window, 'leak'))).toBe(false);
  await page.locator('#m602-direction').fill('nach außen\u202e'); await check(page).click(); await expect(result(page)).toHaveAttribute('data-status', 'technical');
  await expect(result(page)).toContainText('kein biologischer Fehler');
  expect(errors).toEqual([]); expect(requests.every(u => u.startsWith(baseURL!))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
test('actual keyboard and touch help chain, field provenance, copied solution, duplicates and stale material', async ({ page, baseURL, browserName }, info) => {
  await openLab(page, baseURL!);
  const key = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  for (const [id, text] of [['process', 'Osmose'], ['direction', 'in beide Richtungen'], ['volume', 'nimmt ab']]) {
    await page.keyboard.press(key); await expect(page.locator(`#m602-${id}`)).toBeFocused(); await page.keyboard.type(text!);
  }
  await page.keyboard.press(key); await expect(page.getByText('Weitere Aussagen öffnen', { exact: true })).toBeFocused();
  await page.keyboard.press(key); await expect(check(page)).toBeFocused(); await page.keyboard.press('Enter');
  await expect(result(page)).toBeFocused();
  await page.getByRole('button', { name: 'Hinweis: Nettorichtung', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Hilfen direction', exact: true })).not.toContainText('netto nach außen');
  await page.locator('#m602-direction').fill('nach außen'); await check(page).click(); await expect(result(page)).toContainText('Mit Hinweis beantwortet');
  await page.getByRole('button', { name: 'Hinweis: Vakuolenvolumen', exact: true }).click();
  await page.getByRole('button', { name: 'Wortbank: Vakuolenvolumen', exact: true }).click();
  const option = page.getByRole('button', { name: 'Übernehmen Vakuolenvolumen: nimmt ab', exact: true });
  if (info.project.use.hasTouch) await option.tap(); else await option.click();
  await expect(page.locator('#m602-volume')).toBeFocused(); await check(page).click();
  await expect(result(page)).toContainText('Mit Auswahl geklärt');
  let state = await page.evaluate(() => (window as unknown as LabWindow).lab.session.getState());
  expect(state.latest?.fieldSupport.volume.origin).toBe('wordbank_selection'); expect(state.latest?.fieldSupport.direction.assistance).toBe('hint');
  await page.getByRole('button', { name: 'Lösung ansehen: Vakuolenvolumen', exact: true }).click();
  await page.getByRole('button', { name: 'Antwort selbst überarbeiten', exact: true }).click();
  await fillCorrect(page); await check(page).click(); await expect(result(page)).toContainText('Lösung angesehen');
  state = await page.evaluate(() => (window as unknown as LabWindow).lab.session.getState());
  expect(state.latest?.support.assistance).toBe('solution_viewed');
  const count = state.outcomes.length; await check(page).dblclick();
  expect(await page.evaluate(() => (window as unknown as LabWindow).lab.session.getState().outcomes.length)).toBe(count);
  await page.getByRole('button', { name: 'Materialzustand wechseln', exact: true }).click(); await expect(result(page)).toHaveAttribute('data-status', 'technical');
  await expect(page.getByRole('region', { name: 'Versuchsverlauf', exact: true })).toContainText('Veraltet');
  await check(page).click(); await expect(result(page)).toContainText('Lösung angesehen');
  // Select again, retain that draft through a material change, then actually type.
  await page.getByRole('button', { name: 'Hinweis: Vakuolenvolumen', exact: true }).click();
  await page.getByRole('button', { name: 'Wortbank: Vakuolenvolumen', exact: true }).click();
  await page.getByRole('button', { name: 'Übernehmen Vakuolenvolumen: nimmt ab', exact: true }).click();
  await page.getByRole('button', { name: 'Materialzustand wechseln', exact: true }).click(); await check(page).click();
  expect(await page.evaluate(() => (window as unknown as LabWindow).lab.session.getState().latest?.fieldSupport.volume.origin)).toBe('wordbank_selection');
  await page.locator('#m602-volume').fill('kleiner'); await check(page).click();
  expect(await page.evaluate(() => (window as unknown as LabWindow).lab.session.getState().latest?.fieldSupport.volume.origin)).toBe('typed');
  await page.screenshot({ path: info.outputPath('m602-help-stale.png'), fullPage: true });
});
for (const navigation of ['reload', 'back']) for (const fault of ['', 'quota', 'denied']) test(`R9 unsubmitted B after ${navigation}, storage ${fault || 'normal'}: no restored independence`, async ({ page, baseURL }) => {
  await openLab(page, baseURL!, fault); await page.evaluate(() => localStorage.setItem('foreign-p02c', 'keep'));
  await page.getByRole('button', { name: 'Neuen Materialfall starten', exact: true }).click();
  await page.getByRole('button', { name: 'Hinweis: Vakuolenvolumen', exact: true }).click();
  await page.getByRole('button', { name: 'Wortbank: Vakuolenvolumen', exact: true }).click();
  await page.getByRole('button', { name: 'Lösung ansehen: Vakuolenvolumen', exact: true }).click();
  const before = await page.evaluate(() => (window as unknown as LabWindow).lab.session.getState().context);
  if (navigation === 'reload') await page.reload(); else { await page.goto('./'); await page.goBack(); }
  await expect(page.getByRole('heading', { name: 'Wasserverlust schrittweise erklären', exact: true })).toBeVisible();
  const restored = await page.evaluate(() => (window as unknown as LabWindow).lab.session.getState());
  if (restored.context.instanceId !== before.instanceId) await page.getByRole('button', { name: 'Neuen Materialfall starten', exact: true }).click();
  await fillCorrect(page); await check(page).click();
  const after = await page.evaluate(() => (window as unknown as LabWindow).lab.session.getState()); expect(after.context).toEqual(before);
  if (restored.fields.volume.events.length) expect(after.latest?.support.assistance).toBe('solution_viewed');
  else { expect(after.history).toBe('history_unverified'); await expect(result(page)).toHaveAttribute('data-status', 'technical'); }
  await expect(result(page)).not.toContainText('Ohne Hilfe beantwortet');
  const saved = await page.evaluate(() => localStorage.getItem('zelllabor11.progress.v1'));
  if (!restored.fields.volume.events.length) expect(saved).toBeNull();
  else if (saved) {
    // Retained BFCache RAM may retain a known assisted completion, never independence.
    const attempts = (JSON.parse(saved) as { attempts: { assistance: string }[] }).attempts;
    expect(attempts.every(a => a.assistance === 'solution_viewed')).toBe(true);
  }
  expect(await page.evaluate(() => localStorage.getItem('foreign-p02c'))).toBe('keep');
});
for (const fault of ['quota', 'denied']) test(`whole completed task exposes ${fault} without losing RAM or foreign content`, async ({ page, baseURL }) => {
  await openLab(page, baseURL!, fault); await page.evaluate(() => localStorage.setItem('foreign-p02c', 'keep'));
  await fillCorrect(page); await check(page).click(); await expect(result(page)).toHaveAttribute('data-status', 'correct');
  await expect(page.getByRole('status')).toContainText(`(${fault})`);
  expect(await page.evaluate(() => (window as unknown as LabWindow).lab.session.getState().outcomes.length)).toBe(1);
  expect(await page.evaluate(() => localStorage.getItem('foreign-p02c'))).toBe('keep');
});
test('browser executes every frozen new case with full Node outcome parity, not just status parity', async ({ page, baseURL }) => {
  await openLab(page, baseURL!);
  const rows = JSON.parse(readFileSync('tests/fixtures/p02c-cases.json', 'utf8')) as { field: 'direction' | 'volume'; text: string }[];
  const inputs = rows.map(r => m602Input({ [r.field]: r.text }));
  const actual = await page.evaluate(json => { const { inputs, support } = JSON.parse(json); return JSON.stringify(inputs.map((i: unknown) => (window as unknown as LabWindow).api.evaluateM602(i, support))); }, JSON.stringify({ inputs, support: M602_SUPPORT }));
  expect(JSON.parse(actual)).toEqual(inputs.map(i => evaluateM602(i, M602_SUPPORT)));
});
test('actual browser rejects foreign versions/material; changed context invalidates the old whole result', async ({ page, baseURL }) => {
  await openLab(page, baseURL!); await fillCorrect(page); await check(page).click();
  const actual = await page.evaluate(json => {
    const support = JSON.parse(json), w = window as unknown as LabWindow, c = w.lab.session.getState().context;
    const { contextHash: _hash, ...original } = c;
    const old = w.lab.session.getState().latest!;
    return JSON.stringify(['taskVersion', 'rubricVersion', 'contentVersion', 'modelVersion', 'seed', 'phase', 'material'].map(key => {
      const value = key === 'material' ? { ...c.material, waterPotential: { unit: 'Pa', vacuole: -100, cytosol: -200, external: -50 } } : key === 'phase' ? 'predict' : 'different-explicit-label';
      const context = w.api.createTaskContext({ ...original, [key]: value });
      const o = w.api.evaluateM602({ ...old.submission, context }, support);
      return { key, oldCurrent: w.api.isResultForContext(old.fullResult, context), status: o.overallStatus };
    }));
  }, JSON.stringify(M602_SUPPORT));
  const rows = JSON.parse(actual) as { key: string; oldCurrent: boolean; status: string }[];
  expect(rows.every(r => !r.oldCurrent)).toBe(true);
  for (const key of ['taskVersion', 'rubricVersion', 'contentVersion', 'material']) expect(rows.find(r => r.key === key)?.status).toBe('technical');
  // Caller-supplied model labels, seed and phase change identity, without inventing a model release.
  expect(rows.find(r => r.key === 'modelVersion')?.status).toBe('correct');
});

test('R1 mechanism/movement feedback never invents bidirectional exchange', async ({ page, baseURL }) => {
  await openLab(page, baseURL!); await fillCorrect(page);
  for (const text of ['Osmose', 'Wasser bewegt sich']) {
    await page.locator('#m602-direction').fill(text); await check(page).click();
    const panel = page.getByRole('region', { name: 'Bewertung direction', exact: true });
    await expect(panel).toHaveAttribute('data-status', 'partial');
    await expect(panel).not.toContainText('Einzelbewegungen'); await expect(panel).not.toContainText('beide Richtungen');
    await expect(panel).toContainText('Nettorichtung');
  }
  await page.locator('#m602-direction').fill('in beide Richtungen'); await check(page).click();
  await expect(page.getByRole('region', { name: 'Bewertung direction', exact: true })).toContainText('Einzelbewegungen');
});
test('R1 actual browser matches all 642 full runtime envelopes, including reported unresolved long answers', async ({ page, baseURL }) => {
  await openLab(page, baseURL!);
  const c = JSON.parse(readFileSync('tests/fixtures/p02c-r1-cases.json', 'utf8')) as { cases: { field: 'direction' | 'volume'; text: string; extra: string[] }[]; systematic: { field: 'direction' | 'volume'; text: string; extra: string[] }[] };
  const inputs = [...c.cases, ...c.systematic].map(r => m602Input({ [r.field]: r.text }, r.extra));
  const actual = await page.evaluate(json => { const { inputs, support } = JSON.parse(json); return JSON.stringify(inputs.map((i: unknown) => (window as unknown as LabWindow).api.evaluateM602(i, support))); }, JSON.stringify({ inputs, support: M602_SUPPORT }));
  expect(JSON.parse(actual)).toEqual(inputs.map(i => evaluateM602(i, M602_SUPPORT)));
});

test('R2 X01–X04 have yellow comparison feedback and cannot persist a false completion; X07 is red and X12 remains green', async ({ page, baseURL }, info) => {
  await openLab(page, baseURL!); await fillCorrect(page);
  const cases = JSON.parse(readFileSync('tests/fixtures/p02c-r2-targeted.json', 'utf8')).cases as { id: string; text: string }[];
  const panel = page.getByRole('region', { name: 'Bewertung direction', exact: true });
  for (const c of cases.filter(c => ['X01','X02','X03','X04','X07'].includes(c.id))) {
    await page.locator('#m602-direction').fill(c.text); await check(page).click();
    const unclear = c.id !== 'X07';
    await expect(panel).toHaveAttribute('data-status', unclear ? 'clarify' : 'incorrect');
    await expect(panel).toHaveAttribute('data-color', unclear ? 'yellow' : 'red');
    await expect(result(page)).toHaveAttribute('data-status', unclear ? 'clarify' : 'incorrect');
    if (unclear) {
      await expect(panel).toContainText('Du vergleichst zwei Bewegungsangaben.');
      await expect(panel).toContainText('dieselbe Membran');
      await expect(panel).toContainText('Quelle, Ziel und Membran');
      await expect(result(page)).toContainText(`Nicht geprüft (not_assessed), direction: ${c.text}`);
    } else {
      await expect(panel).toContainText('Widerspruch');
      await expect(panel).not.toContainText('Du beschreibst Einzelbewegungen');
    }
    expect(await page.evaluate(() => localStorage.getItem('zelllabor11.progress.v1'))).toBeNull();
    if (['X01','X03','X07'].includes(c.id)) await panel.screenshot({ path: info.outputPath(`r2-${c.id}-feedback.png`) });
  }
  await page.locator('#m602-direction').fill(cases.find(c => c.id === 'X12')!.text); await check(page).click();
  await expect(result(page)).toHaveAttribute('data-status', 'correct');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('zelllabor11.progress.v1')!));
  expect(saved.attempts).toHaveLength(1); expect(saved.attempts[0].assistance).toBe('independent');
  expect(Object.keys(saved.attempts[0])).toHaveLength(8);
});
test('R2 all 180 supplied, 12 targeted and 82 own inputs have full actual Node/browser outcome parity', async ({ page, baseURL }) => {
  await openLab(page, baseURL!);
  const rows = ['cases','own'].flatMap(name => JSON.parse(readFileSync(`tests/fixtures/p02c-r2-${name}.json`, 'utf8')));
  rows.push(...JSON.parse(readFileSync('tests/fixtures/p02c-r2-targeted.json', 'utf8')).cases);
  expect(rows).toHaveLength(274);
  const inputs = rows.map((r: { field: 'direction' | 'volume'; text: string; extra?: string[] }) => m602Input({ [r.field]: r.text }, r.extra ?? []));
  const actual = await page.evaluate(json => { const { inputs, support } = JSON.parse(json); return JSON.stringify(inputs.map((i: unknown) => (window as unknown as LabWindow).api.evaluateM602(i, support))); }, JSON.stringify({ inputs, support: M602_SUPPORT }));
  expect(JSON.parse(actual)).toEqual(inputs.map(i => evaluateM602(i, M602_SUPPORT)));
});

test('R3 retains each coordinated quantity in actual feedback, whole status and persisted receipts', async ({ page, baseURL }, info) => {
  await openLab(page, baseURL!); await fillCorrect(page);
  const rows = JSON.parse(readFileSync('tests/fixtures/p02c-r3-coordination-cases.json', 'utf8')).cases as { id: string; text: string; accepted: string[] }[];
  const panel = page.getByRole('region', { name: 'Bewertung volume', exact: true });
  let booked = 0;
  for (const c of rows) {
    await page.locator('#m602-volume').fill(c.text); await check(page).click();
    const state = await panel.getAttribute('data-status'); expect(c.accepted).toContain(state);
    if (['C01','C02','C05'].includes(c.id)) {
      await expect(panel).toHaveAttribute('data-color', 'red');
      await expect(panel).toContainText('Du schreibst der Zellwand eine Verkleinerung zu.');
      await expect(panel).toContainText('annähernd formstabil'); await expect(panel).toContainText('Vakuolenraum');
    }
    if (['C03','C04'].includes(c.id)) {
      await expect(panel).toHaveAttribute('data-color', 'yellow');
      await expect(panel).toContainText('Du beschreibst eine Verkleinerung des Protoplasten.');
      await expect(panel).toContainText('noch keine ausdrückliche Volumenantwort');
      await expect(panel).toContainText('dessen eigene Wasserbilanz');
    }
    if (state === 'correct') { booked++; await expect(result(page)).toHaveAttribute('data-status','correct'); }
    else { await expect(result(page)).not.toHaveAttribute('data-status','correct'); }
    const snapshot = await page.evaluate(() => {
      const w = window as unknown as LabWindow, snapshot = w.lab.session.getState().latest!;
      // getState deliberately returns a copy. Obtain the original issued handle
      // through the existing idempotent submission API; clones must stay rejected.
      let cloneRejected = false; try { w.lab.session.record(snapshot); } catch { cloneRejected = true; }
      const o = w.lab.session.submit(w.lab.session.makeSubmission(snapshot.submission.answers, snapshot.submission.additionalStatements));
      let rejected = false; try { w.lab.session.record(o); } catch { rejected = true; }
      return { rejected, cloneRejected, original: o.submission.answers.volume, evidence: o.fields.volume.result.criteria[0]!.evidence, notAssessed: o.notAssessed, persisted: localStorage.getItem('zelllabor11.progress.v1') };
    });
    expect(snapshot.cloneRejected).toBe(true);
    expect(snapshot.original).toBe(c.text);
    expect(snapshot.evidence).toEqual([{ kind: 'input_span', value: c.text, start: 0, end: c.text.length }]);
    expect(snapshot.rejected).toBe(state !== 'correct');
    if (state === 'clarify') expect(snapshot.notAssessed.some(e => e.value === c.text)).toBe(true);
    const attempts = snapshot.persisted ? JSON.parse(snapshot.persisted).attempts : [];
    expect(attempts).toHaveLength(booked);
    for (const a of attempts) { expect(Object.keys(a)).toHaveLength(8); expect(a.status).toBe('correct'); expect(a.assistance).toBe('independent'); }
    if (['C02','C03','C07','C08'].includes(c.id)) await panel.screenshot({ path: info.outputPath(`r3-${c.id}-feedback.png`) });
  }
  expect(booked).toBe(3);
});
test('R3 executes all 156 supplied and 33 frozen own cases in the actual browser with complete Node parity', async ({ page, baseURL }) => {
  await openLab(page, baseURL!);
  const rows = ['cases','own'].flatMap(name => JSON.parse(readFileSync(`tests/fixtures/p02c-r3-${name}.json`, 'utf8'))) as { field: 'direction'|'volume'; text: string; extra: string[] }[];
  expect(rows).toHaveLength(189);
  const inputs = rows.map(c => m602Input({ [c.field]: c.text }, c.extra));
  const actual = await page.evaluate(json => { const { inputs, support } = JSON.parse(json); return JSON.stringify(inputs.map((i: unknown) => (window as unknown as LabWindow).api.evaluateM602(i, support))); }, JSON.stringify({ inputs, support: M602_SUPPORT }));
  expect(JSON.parse(actual)).toEqual(inputs.map(i => evaluateM602(i, M602_SUPPORT)));
  await fillCorrect(page);
  for (const original of [
    'Die Zellwand bleibt gleich und die Vakuole schrumpft und ihr Volumen sinkt.',
    'Die Zellwand bleibt gleich und das Volumen wird größer.',
    'Die Vakuole schrumpft und die Zellwand bleibt gleich und das Volumen ändert sich.',
    'Der Protoplast schrumpft und das Volumen nimmt zu.',
  ]) {
    await page.locator('#m602-volume').fill(original); await check(page).click();
    await expect(page.getByRole('region',{ name:'Bewertung volume',exact:true })).toHaveAttribute('data-status','clarify');
    await expect(result(page)).toContainText(`Nicht geprüft (not_assessed), volume: ${original}`);
    expect(await page.evaluate(() => localStorage.getItem('zelllabor11.progress.v1'))).toBeNull();
  }
});
