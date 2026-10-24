import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { namingContext, namingInput, INDEPENDENT_SUPPORT } from '../helpers/naming-v1.ts';
import { evaluateNaming } from '../../src/assessment/naming-v1.ts';
import cases from '../fixtures/naming-v1-cases.json' with { type: 'json' };
import type { NamingTaskId, NamingSubmission } from '../../src/domain/naming-contract.ts';
type API = typeof import('../../src/ui/naming-lab.ts') & typeof import('../../src/domain/task-context.ts') & typeof import('../../src/assessment/naming-v1.ts');
let source: string;
test.beforeAll(async () => { source = await buildDomainModule(); });
async function openLab(page: import('@playwright/test').Page, baseURL: string, taskId: NamingTaskId, fault = '') {
  await page.route(`${baseURL}naming-runtime.mjs`, route => route.fulfill({ contentType: 'text/javascript', body: source }));
  const initial = JSON.stringify(namingContext(taskId));
  await page.route(`${baseURL}naming-lab*`, route => route.fulfill({ contentType: 'text/html', body: `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Interne Benennungsprobe</title><div id="lab"></div><script type="module">
    import * as api from './naming-runtime.mjs';
    const initial=${initial};
    const nav=performance.getEntriesByType('navigation')[0]?.type;
    function replace(c,changes){const {contextHash,...input}=c;return api.createTaskContext({...input,...changes});}
    function changedMaterial(c){return c.taskId==='Z1.02'?{...c.material,cellProfile:c.material.cellProfile==='onion_epidermis'?'plant_leaf':'onion_epidermis'}:{...c.material,waterPotential:{...c.material.waterPotential,external:c.material.waterPotential.external-1000}};}
    let next=0;
    window.lab=api.mountNamingLab(document.getElementById('lab'),{initialContext:initial,idPrefix:crypto.randomUUID(),resumed:nav==='reload'||nav==='back_forward',
      acquireStorage:()=>{if(${JSON.stringify(fault)}==='denied')throw new DOMException('test','SecurityError');if(${JSON.stringify(fault)}==='quota')return {getItem:k=>localStorage.getItem(k),setItem:()=>{throw new DOMException('test','QuotaExceededError')},removeItem:()=>{throw Error('never delete')}};return localStorage;},
      changedContext:c=>replace(c,{seed:c.seed+'-changed',material:changedMaterial(c)}),
      newCase:c=>replace(c,{instanceId:c.instanceId+'-new-'+(++next),seed:c.seed+'-new-'+next,material:changedMaterial(c)})});
  </script></html>` }));
  await page.goto(`./naming-lab?task=${taskId}&fault=${fault}`);
  await expect(page.getByRole('heading', { name: 'Fachbegriff prüfen', exact: true })).toBeVisible();
}
for (const taskId of ['Z1.02', 'M6.02'] as const) {
  test(`${taskId}: actual DOM statuses, rich feedback, full scope, UTF16 text and self revision`, async ({ page, baseURL, isMobile }, info) => {
    const failures: string[] = [], requests: string[] = [];
    page.on('pageerror', e => failures.push(e.message)); page.on('request', r => requests.push(r.url()));
    await openLab(page, baseURL!, taskId);
    await expect(page.getByText('Fachbegriff: Ein Begriff genügt. Du musst keinen Satz schreiben.', { exact: true })).toBeVisible();
    await expect(page.getByText('Weitere Aussagen (optional) – in diesem Benennungsfeld noch nicht fachlich geprüft', { exact: true })).toBeVisible();
    const term = page.getByRole('textbox', { name: 'Fachbegriff', exact: true });
    const result = page.getByRole('region', { name: 'Rückmeldung', exact: true });
    const check = page.getByRole('button', { name: 'Begriff prüfen', exact: true });
    const rows = taskId === 'Z1.02' ? [['Zellwand', 'incorrect', 'feste äußere Hülle'], ['Membran', 'partial', 'spezifische Name'], ['Tonoplast oder Zellwand', 'clarify', 'keiner der Begriffe'], ['nicht Tonoplast', 'incorrect', 'Verneinung'], ['Tonoplat', 'correct', 'Standardschreibweise']] : [['Plasmolyse', 'incorrect', 'Zellreaktion'], ['Diffusion', 'partial', 'übergeordneter Ansatz'], ['Osmose oder Plasmolyse', 'clarify', 'keiner der Begriffe'], ['nicht Osmose', 'incorrect', 'Verneinung'], ['Osmosse', 'correct', 'Standardschreibweise']];
    for (const [text, status, detail] of rows) {
      await term.fill(text!); await check.click();
      await expect(result.locator('[data-criterion-status]')).toHaveAttribute('data-criterion-status', status!);
      await expect(result).toContainText(detail!); await expect(result).toBeFocused();
      if (status === 'incorrect' || status === 'partial') await expect(result).not.toContainText(taskId === 'Z1.02' ? 'Tonoplast' : 'Osmose');
      await expect(result).toContainText('Nächster Schritt');
    }
    const correct = taskId === 'Z1.02' ? 'Tonoplast' : 'Osmose';
    await page.getByRole('button', { name: 'Antwort selbst überarbeiten', exact: true }).click(); await expect(term).toBeFocused();
    await term.fill(correct); await check.click();
    await expect(result).toHaveAttribute('data-status', taskId === 'Z1.02' ? 'correct' : 'partial');
    await expect(result).toContainText('Ohne Hilfe beantwortet');
    if (taskId === 'M6.02') await expect(result).toContainText('M6.02.C02, M6.02.C03');
    await page.getByText('Weitere Aussagen öffnen', { exact: true }).click();
    const extra = page.getByRole('textbox', { name: 'Weitere Aussagen – ungeprüft', exact: true });
    await extra.fill('🌱 Die Zellwand schrumpft.'); await check.click();
    await expect(result).toHaveAttribute('data-status', 'clarify');
    await expect(result.locator('[data-criterion-status]')).toHaveAttribute('data-color', 'green');
    await expect(result).toContainText('not_assessed'); await expect(result).toContainText('🌱 Die Zellwand schrumpft.'); await expect(extra).toHaveValue('🌱 Die Zellwand schrumpft.');
    await page.screenshot({ path: info.outputPath(`${taskId}-scope.png`), fullPage: true });
    await result.screenshot({ path: info.outputPath(`${taskId}-scope-feedback.png`) });
    const state = await page.evaluate(() => ({ ...localStorage }));
    const saved = state['zelllabor11.progress.v1'];
    if (taskId === 'Z1.02') { expect(saved).toBeTruthy(); expect(JSON.parse(saved!).attempts.at(-1).status).toBe('clarify'); }
    else expect(saved).toBeUndefined();
    expect(saved ?? '').not.toMatch(/termText|predecessorId|Die Zellwand schrumpft|contextHash/);
    await term.fill(taskId === 'Z1.02' ? 'Zellmembran' : 'aktiver Transport'); await check.click();
    await expect(result).toHaveAttribute('data-status', 'incorrect'); await expect(result).toContainText('not_assessed');
    await extra.fill(''); await term.fill(`${correct}. Eine weitere Aussage.`); await check.click(); await expect(result).toHaveAttribute('data-status', 'clarify');
    await term.fill('<img src=x onerror="window.auditLeak=true">'); await check.click();
    await expect(result).toHaveAttribute('data-status', 'clarify'); expect(await page.evaluate(() => Object.hasOwn(window, 'auditLeak'))).toBe(false);
    await term.fill(''); await check.click(); await expect(result).toHaveAttribute('data-status', 'empty');
    await term.fill(`${correct}\u202e`); await check.click(); await expect(result).toHaveAttribute('data-status', 'technical');
    await expect(result).toContainText('kein biologischer Fehler');
    await term.fill(correct + 'x'.repeat(4097)); await check.click(); await expect(result).toHaveAttribute('data-status', 'technical');
    const dimensions = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, width: document.documentElement.clientWidth }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.width);
    expect((await check.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    if (isMobile) await expect(term).toBeVisible();
    expect(failures).toEqual([]); expect(requests.every(url => url.startsWith(baseURL!))).toBe(true);
  });
  test(`${taskId}: real keyboard/touch help chain, stale context, duplicates and solution provenance`, async ({ page, baseURL, browserName }, info) => {
    await openLab(page, baseURL!, taskId);
    const term = page.getByRole('textbox', { name: 'Fachbegriff', exact: true });
    const feedback = page.getByRole('region', { name: 'Rückmeldung' });
    const check = page.getByRole('button', { name: 'Begriff prüfen', exact: true });
    // Use the platform's all-controls navigation; still assert every actual focus target.
    const key = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
    await page.keyboard.press(key); await expect(term).toBeFocused();
    await page.keyboard.type(taskId === 'Z1.02' ? 'Membran' : 'Diffusion');
    // Closed summary then submit, reached by actual keyboard actions.
    await page.keyboard.press(key); await expect(page.locator('summary')).toBeFocused();
    await page.keyboard.press(key); await expect(check).toBeFocused(); await page.keyboard.press('Enter');
    await expect(feedback).toBeFocused();
    const initialCount = await page.getByRole('region', { name: 'Versuchsverlauf' }).locator('p').count();
    await check.dblclick(); expect(await page.getByRole('region', { name: 'Versuchsverlauf' }).locator('p').count()).toBe(initialCount);
    await page.getByRole('button', { name: 'Hinweis anzeigen', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Überarbeiten und Hilfen' })).toContainText('hint');
    await expect(page.getByRole('region', { name: 'Überarbeiten und Hilfen' })).not.toContainText(taskId === 'Z1.02' ? 'Tonoplast' : 'Osmose');
    await term.fill(taskId === 'Z1.02' ? 'Tonoplast' : 'Osmose'); await check.click(); await expect(feedback).toContainText('Mit Hinweis beantwortet');
    await page.getByRole('button', { name: 'Wortbank öffnen', exact: true }).click();
    await check.click(); await expect(feedback).toContainText('Mit Wortbank beantwortet');
    const option = page.getByRole('button', { name: `Begriff wählen: ${taskId === 'Z1.02' ? 'Vakuolenmembran' : 'Osmose'}`, exact: true });
    if (info.project.use.hasTouch) await option.tap(); else await option.click();
    await expect(term).toBeFocused(); await check.click(); await expect(feedback).toContainText('Mit Auswahl geklärt');
    await page.getByRole('button', { name: 'Lösung ausdrücklich ansehen', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Ausdrücklich aufgerufene Lösung' })).toBeVisible();
    await check.click(); await expect(feedback).toContainText('Lösung angesehen');
    await page.getByRole('button', { name: 'Materialzustand wechseln', exact: true }).click();
    await expect(feedback).toHaveAttribute('data-status', 'technical');
    await expect(page.getByRole('region', { name: 'Versuchsverlauf' })).toContainText('Veraltet – keine aktuelle Bewertung');
    await check.click(); await expect(feedback).toContainText('Lösung angesehen');
    await page.screenshot({ path: info.outputPath(`${taskId}-help-stale.png`), fullPage: true });
    await info.attach('naming-help-path.json', { body: JSON.stringify({ profile: info.project.name, taskId, selectedKey: key, touch: info.project.use.hasTouch === true, path: ['keyboard', 'duplicate', 'hint', 'wordbank', 'clarified', 'solution_viewed', 'context-change'] }), contentType: 'application/json' });
  });
}
test('reload/back keeps unknown history explicit; new material case distinct; quota/denied visible and foreign data preserved', async ({ page, baseURL }, info) => {
  for (const fault of ['quota', 'denied']) {
    await openLab(page, baseURL!, 'Z1.02', fault);
    await page.evaluate(() => localStorage.setItem('foreign-test-sentinel', 'preserve'));
    await page.getByRole('textbox', { name: 'Fachbegriff', exact: true }).fill('Tonoplast'); await page.getByRole('button', { name: 'Begriff prüfen', exact: true }).click();
    await expect(page.getByRole('status')).toContainText(`(${fault})`);
    await page.getByRole('button', { name: 'Hinweis anzeigen', exact: true }).click();
    await page.reload();
    await expect(page.getByRole('textbox', { name: 'Fachbegriff', exact: true })).toHaveValue('');
    await expect(page.getByRole('region', { name: 'Überarbeiten und Hilfen' })).toContainText('Historie nach Laden/Zurück ungesichert');
    await page.getByRole('textbox', { name: 'Fachbegriff', exact: true }).fill('Tonoplast'); await page.getByRole('button', { name: 'Begriff prüfen', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Rückmeldung' })).toHaveAttribute('data-status', 'technical');
    await page.getByRole('button', { name: 'Neuen Materialfall starten', exact: true }).click();
    await page.getByRole('button', { name: 'Begriff prüfen', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Rückmeldung' })).toHaveAttribute('data-status', 'correct');
    await page.goto('./'); await page.goBack();
    await expect(page.getByRole('region', { name: 'Überarbeiten und Hilfen' })).toContainText('Historie nach Laden/Zurück ungesichert');
    expect(await page.evaluate(() => localStorage.getItem('foreign-test-sentinel'))).toBe('preserve');
    await page.screenshot({ path: info.outputPath(`history-${fault}.png`), fullPage: true });
  }
});
test('all 260 frozen cases use the same actual browser functions and complete original evidence as Node', async ({ page, baseURL }, info) => {
  await page.route(`${baseURL}naming-runtime.mjs`, route => route.fulfill({ contentType: 'text/javascript', body: source }));
  await page.goto('./');
  const inputs = cases.map(c => namingInput(c.taskId as NamingTaskId, c.termText, c.additionalStatements));
  const serialized = await page.evaluate(async ({ url, inputsJson, support }) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const inputs = JSON.parse(inputsJson) as NamingSubmission[];
    return JSON.stringify(inputs.map(input => api.evaluateNaming(input, support)));
  }, { url: `${baseURL}naming-runtime.mjs`, inputsJson: JSON.stringify(inputs), support: INDEPENDENT_SUPPORT });
  const results = JSON.parse(serialized) as unknown[];
  expect(results).toEqual(inputs.map(input => evaluateNaming(input, INDEPENDENT_SUPPORT)));
  await info.attach('naming-runtime-parity.json', { body: JSON.stringify({ count: results.length, profile: info.project.name }), contentType: 'application/json' });
});
