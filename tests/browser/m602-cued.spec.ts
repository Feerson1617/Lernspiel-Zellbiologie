import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { m602CuedContext, m602CuedInput, M602_SUPPORT } from '../helpers/m602-cued.ts';
import { evaluateM602Cued } from '../../src/assessment/m602-cued.ts';
import type { M602CuedSession } from '../../src/application/m602-session.ts';
type Page = import('@playwright/test').Page;
type API = typeof import('../../src/assessment/m602-cued.ts');
type LabWindow = Window & { api: API; lab: { session: M602CuedSession } };
let source: string;
test.beforeAll(async () => { source = await buildDomainModule(true); });
async function open(page: Page, base: string, fault = '') {
  let opened = false;
  await page.route(`${base}cued-runtime.mjs`, r => r.fulfill({ contentType: 'text/javascript', body: source }));
  await page.route(`${base}cued-lab`, r => {
    const resumed = opened; opened = true;
    return r.fulfill({ contentType: 'text/html', body: `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Interne Relationsprobe</title><div id="lab"></div><script type="module">
    import * as api from './cued-runtime.mjs'; window.api=api;
    const initial=${JSON.stringify(m602CuedContext())};
    function change(c,fields){const {contextHash,...rest}=c;return api.createTaskContext({...rest,...fields});}
    function material(c){return {...c.material,waterPotential:{...c.material.waterPotential,external:c.material.waterPotential.external-1000}};}
    ${fault}
    window.lab=api.mountM602CuedLab(document.getElementById('lab'),{initialContext:initial,idPrefix:'cued-dom',resumed:${resumed},acquireStorage:()=>window.localStorage,
    changedContext:c=>change(c,{material:material(c)}),newCase:c=>change(c,{instanceId:c.instanceId+'-new',seed:c.seed+'-new',material:material(c)})});
    </script></html>` });
  });
  await page.goto(`${base}cued-lab`); await expect(page.locator('#m602-process')).toBeVisible();
}
const result = (p: Page) => p.getByRole('region', { name: 'Gesamtrückmeldung', exact: true });
async function fill(p: Page) {
  for (const [f,v] of Object.entries(m602CuedInput().answers)) await p.locator(`#m602-${f}`).fill(v);
}
async function check(p: Page) {
  const button = p.getByRole('button', { name: 'Drei Antworten prüfen', exact: true });
  if (await p.evaluate(() => navigator.maxTouchPoints > 0)) await button.tap(); else await button.click();
}
test('announces given conditions and empty independent slots, then checks actual keyboard/touch, feedback and exact metadata', async ({ page, baseURL }, info) => {
  const errors: string[] = [], foreign: string[] = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('request', r => { if (!r.url().startsWith(baseURL!)) foreign.push(r.url()); });
  await open(page, baseURL!);
  await expect(page.getByRole('textbox',{name:'Wasser bewegt sich NETTO über die ZELLMEMBRAN: deine Richtung',exact:true})).toHaveValue('');
  await expect(page.getByRole('textbox',{name:'Das VAKUOLENVOLUMEN: deine Veränderung',exact:true})).toHaveValue('');
  await expect(page.locator('select,input[type=radio]')).toHaveCount(0);
  for (const [f,v] of Object.entries(m602CuedInput().answers)) { await page.locator(`#m602-${f}`).focus(); await page.keyboard.type(v); }
  await check(page); await expect(result(page)).toHaveAttribute('data-status','correct'); await expect(result(page)).toBeFocused();
  await expect(result(page)).toContainText('Erkannter Ansatz'); await expect(result(page)).toContainText('Gesamtpotenziale'); await expect(result(page)).toContainText('Nächster Schritt');
  const raw = await page.evaluate(() => localStorage.getItem('zelllabor11.progress.v1'));
  const saved = JSON.parse(raw!); expect(saved.attempts).toHaveLength(1); expect(Object.keys(saved.attempts[0])).toHaveLength(8); expect(saved.attempts[0].taskVersion).toBe('M6.02@cued-relations-1');
  expect(raw).not.toMatch(/answers|contextHash|events|Osmose|nach außen/); expect(errors).toEqual([]); expect(foreign).toEqual([]);
  expect(await page.evaluate(() => 'evaluateM602' in (window as unknown as LabWindow).api)).toBe(false);
  expect(source).not.toContain('ich dachte'); // old sentence grammar is absent from the current-only bundle
  await result(page).screenshot({ path: info.outputPath('cued-current-feedback.png') });
});
test('keeps full browser/Node parity for the entire frozen current matrix, with no private R4 corpus import', async ({ page, baseURL }) => {
  await open(page, baseURL!);
  const rows = ['cases','supplement'].flatMap(name => JSON.parse(readFileSync(`tests/fixtures/m602-cued-${name}.json`,'utf8'))) as {field:'direction'|'volume';text:string}[];
  const inputs=rows.map(r=>m602CuedInput({[r.field]:r.text}));
  const actual=await page.evaluate(json=>{const {inputs,support}=JSON.parse(json);return inputs.map((x:unknown)=>(window as unknown as LabWindow).api.evaluateM602Cued(x,support));},JSON.stringify({inputs,support:M602_SUPPORT}));
  expect(actual).toEqual(inputs.map(x=>evaluateM602Cued(x,M602_SUPPORT)));
});
test('distinguishes wrong, partial and outside-format sentences in the actual DOM without imaginary feedback or success', async ({ page, baseURL }, info) => {
  await open(page, baseURL!); await fill(page);
  for(const [f,v,status]of [['direction','rein','incorrect'],['direction','kein Nettotransport','incorrect'],['direction','in beide Richtungen','partial'],['volume','nimmt zu','incorrect'],['volume','verändert sich','partial'],['volume','Die Vakuole schrumpft.','clarify'],['volume','Die Vakuole nimmt zu.','clarify'],['volume','sie wird kleiner','clarify'],['direction','nach außen über den Tonoplasten','clarify']]as const){
    await fill(page);await page.locator(`#m602-${f}`).fill(v);await check(page);
    const panel=page.getByRole('region',{name:`Bewertung ${f}`,exact:true});await expect(panel).toHaveAttribute('data-status',status);await expect(result(page)).not.toHaveAttribute('data-status','correct');
    if(status==='clarify'){await expect(panel).toContainText('kein Nachweis eines biologischen Fehlers');await expect(result(page)).toContainText(`Nicht geprüft (not_assessed), ${f}: ${v}`);await expect(panel).not.toContainText('Du schreibst der Zellwand');}
    expect(await page.evaluate(()=>localStorage.getItem('zelllabor11.progress.v1'))).toBeNull();
  }
  await result(page).screenshot({path:info.outputPath('cued-scope-feedback.png')});
  await fill(page);await page.getByText('Weitere Aussagen öffnen',{exact:true}).click();await page.locator('#m602-extra').fill('Osmose ist passiv.');await check(page);
  for(const f of ['process','direction','volume'])await expect(page.getByRole('region',{name:`Bewertung ${f}`,exact:true})).toHaveAttribute('data-status','correct');
  await expect(result(page)).toHaveAttribute('data-status','clarify');await expect(result(page)).toContainText('Osmose ist passiv.');expect(await page.evaluate(()=>localStorage.getItem('zelllabor11.progress.v1'))).toBeNull();
});
test('retains help, selection provenance, self revision, material binding and reload distrust in the current route', async ({ page, baseURL }) => {
  await open(page, baseURL!);await fill(page);
  await page.getByRole('button',{name:'Hinweis: Nettorichtung',exact:true}).click();await page.getByRole('button',{name:'Wortbank: Nettorichtung',exact:true}).click();
  await page.getByRole('button',{name:'Übernehmen Nettorichtung: netto nach außen',exact:true}).click();
  await expect(page.locator('#m602-direction')).toBeFocused();await check(page);await expect(result(page)).toHaveAttribute('data-status','correct');
  let s=await page.evaluate(()=>(window as unknown as LabWindow).lab.session.getState());expect(s.latest!.fieldSupport.direction.origin).toBe('wordbank_selection');expect(s.latest!.support.assistance).toBe('clarified');
  await page.getByRole('button',{name:'Materialzustand wechseln',exact:true}).click();await check(page);
  s=await page.evaluate(()=>(window as unknown as LabWindow).lab.session.getState());expect(s.latest!.fieldSupport.direction.origin).toBe('wordbank_selection');expect(s.latest!.support.assistance).toBe('clarified');
  await page.getByRole('button',{name:'Antwort selbst überarbeiten',exact:true}).click();await page.locator('#m602-direction').fill('hinaus');await check(page);
  s=await page.evaluate(()=>(window as unknown as LabWindow).lab.session.getState());expect(s.latest!.fieldSupport.direction.origin).toBe('typed');expect(s.latest!.support.assistance).toBe('clarified');
  // A material switch intentionally closes the visible help chain; reopen it
  // through the real controls instead of trying to click a hidden solution.
  await page.getByRole('button',{name:'Hinweis: Nettorichtung',exact:true}).click();
  await page.getByRole('button',{name:'Wortbank: Nettorichtung',exact:true}).click();
  await page.getByRole('button',{name:'Lösung ansehen: Nettorichtung',exact:true}).click();await check(page);
  s=await page.evaluate(()=>(window as unknown as LabWindow).lab.session.getState());expect(s.latest!.support.assistance).toBe('solution_viewed');
  await page.reload();await fill(page);await page.getByRole('button',{name:'Neuen Materialfall starten',exact:true}).click();await fill(page);await check(page);
  await expect(result(page)).toHaveAttribute('data-status','technical');await expect(result(page)).toContainText('Historie ungesichert');
  s=await page.evaluate(()=>(window as unknown as LabWindow).lab.session.getState());expect(s.history).toBe('history_unverified');
});
test('does not migrate an old content envelope or erase foreign browser data', async ({ page, baseURL }) => {
  const old=JSON.stringify({schemaVersion:1,contentVersion:'zelllabor11.m602-content/1.0.0',attempts:[{attemptId:'old',taskId:'M6.02',instanceId:'old',taskVersion:'M6.02@relations-input-1',rubricVersion:'M6.02.C01-C03@concept-1-scope-1',modelVersion:'review-no-simulation',status:'correct',assistance:'independent'}]});
  await page.addInitScript(value=>{localStorage.setItem('zelllabor11.progress.v1',value);localStorage.setItem('foreign-test-data','preserve');},old);
  await open(page,baseURL!);await fill(page);await check(page);await expect(result(page)).toHaveAttribute('data-status','technical');
  expect(await page.evaluate(()=>localStorage.getItem('zelllabor11.progress.v1'))).toBe(old);expect(await page.evaluate(()=>localStorage.getItem('foreign-test-data'))).toBe('preserve');
});

for(const fault of ['denied','quota']as const)test(`current reload/new-ID history remains unverified with storage ${fault}`,async({page,baseURL})=>{
  const script=fault==='denied'
    ? "Object.defineProperty(window,'localStorage',{get(){throw new DOMException('denied','SecurityError')}});"
    : "const originalStorage=window.localStorage;Object.defineProperty(window,'localStorage',{get(){return {getItem:k=>originalStorage.getItem(k),setItem(){throw new DOMException('quota','QuotaExceededError')},removeItem:k=>originalStorage.removeItem(k)}}});";
  await open(page,baseURL!,script);await fill(page);
  await page.getByRole('button',{name:'Hinweis: Vakuolenvolumen',exact:true}).click();
  await page.locator('#m602-volume').fill('');
  await page.reload();await page.getByRole('button',{name:'Neuen Materialfall starten',exact:true}).click();await fill(page);await check(page);
  await expect(result(page)).toHaveAttribute('data-status','technical');await expect(result(page)).toContainText('Historie ungesichert');
  const s=await page.evaluate(()=>(window as unknown as LabWindow).lab.session.getState());expect(s.history).toBe('history_unverified');
  for(const f of ['process','direction','volume'])await expect(page.getByRole('region',{name:`Bewertung ${f}`,exact:true})).toHaveAttribute('data-status','correct');
});
