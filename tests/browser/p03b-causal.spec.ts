import { expect, test } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';
import { appendFileSync } from 'node:fs';

// Own UI checks. All actions use the production entry, no internal testing API.
const core = [['A', 'B', 'causes'], ['A', 'C', 'causes'], ['B', 'D', 'enables_if'], ['C', 'D', 'requires_zero']] as const;
const result = (page: Page) => page.getByRole('region', { name: 'Rückmeldung zum Kausalnetz', exact: true });
const support = (page: Page) => page.getByRole('region', { name: 'Hilfehistorie und Sitzungsstand' });
const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page, baseURL }) => {
  const log: string[] = []; errors.set(page, log);
  page.on('pageerror', error => log.push(error.message));
  page.on('console', message => { if (message.type() === 'error') log.push(message.text()); });
  page.on('requestfailed', request => log.push(request.url()));
  page.on('request', request => { if (!request.url().startsWith(baseURL!)) log.push(`External request: ${request.url()}`); });
  page.on('response', response => { if (response.status() >= 400) log.push(`HTTP ${response.status()}`); });
});
test.afterEach(async ({ page }) => { expect(errors.get(page)).toEqual([]); });
async function open(page: Page) {
  await page.goto('./'); await page.getByRole('link', { name: 'Kausalnetz ausprobieren – Ursache und Wirkung', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ursache und Wirkung verknüpfen');
}
async function press(page: Page, name: string) {
  const button = page.getByRole('button', { name, exact: true });
  if (await page.evaluate(() => navigator.maxTouchPoints > 0)) await button.tap(); else await button.click();
}
async function edge(page: Page, from: string, to: string, relation: string) {
  await page.getByLabel('Startknoten', { exact: true }).selectOption(from);
  await page.getByLabel('Zielknoten', { exact: true }).selectOption(to);
  await page.getByLabel('Bedeutung des Pfeils', { exact: true }).selectOption(relation);
  await press(page, 'Verbindung hinzufügen');
}
async function complete(page: Page) { for (const [from, to, relation] of core) await edge(page, from, to, relation); await press(page, 'Kausalnetz prüfen'); }
async function screenshot(page: Page, info: TestInfo, name: string) {
  const path = info.outputPath(`${name}.png`); await page.screenshot({ path, fullPage: true }); await info.attach(name, { path, contentType: 'image/png' });
}

test('public independent preview starts neutral and the M6.02 transition has no completion gate', async ({ page }, info) => {
  await open(page); await expect(page).toHaveURL(/#\/m603$/); await expect(result(page)).toHaveAttribute('data-color', 'neutral');
  for (const id of ['causal-from', 'causal-to', 'causal-relation']) await expect(page.locator(`#${id}`)).toHaveValue('');
  await expect(page.locator('.causal-arrows path[data-from]')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Material zum Kausalnetz' })).toContainText('-120.000 Pa');
  expect(await page.locator('.learning-intro').innerText()).not.toMatch(/A → B|B → D/);
  await screenshot(page, info, 'p03b-initial');
  await page.getByRole('link', { name: 'Vorherige Übung: Wasserhaushalt', exact: true }).click();
  await expect(page.locator('#learner-process')).toHaveValue('');
  await page.getByRole('link', { name: 'Weiter zu M6.03: eigenes Kausalnetz aufbauen', exact: true }).click();
  await expect(page).toHaveURL(/#\/m603$/); await expect(result(page)).toHaveAttribute('data-status', 'empty');
});

test('mouse or touch builds, checks, revises and proceeds to unassessed writing', async ({ page }, info) => {
  await open(page); await edge(page, 'B', 'A', 'causes'); await press(page, 'Kausalnetz prüfen');
  await expect(result(page)).toHaveAttribute('data-color', 'red'); await expect(result(page)).toContainText('✕');
  await expect(page.locator('.causal-edge-list')).toContainText('kehrt die hier gefragte Erklärung um');
  await screenshot(page, info, 'p03b-error');
  await press(page, 'Verbindung 1 bearbeiten'); await page.getByLabel('Startknoten', { exact: true }).selectOption('A'); await page.getByLabel('Zielknoten', { exact: true }).selectOption('B');
  await press(page, 'Verbindung ändern'); await expect(result(page)).toHaveAttribute('data-status', 'stale');
  for (const [from, to, relation] of core.slice(1)) await edge(page, from, to, relation);
  await press(page, 'Kausalnetz prüfen'); await expect(result(page)).toHaveAttribute('data-status', 'correct'); await expect(result(page)).toHaveAttribute('data-color', 'green');
  await expect(result(page)).toContainText('✓'); await expect(support(page)).toContainText('Nach Rückmeldung selbst überarbeitet');
  await expect(support(page)).toContainText('Aktueller geprüfter Netzbeleg');
  await expect(page.locator('.causal-arrows path[data-from]')).toHaveCount(4);
  for (const [from, to, relation] of core) await expect(page.locator(`.causal-arrows path[data-from="${from}"][data-to="${to}"][data-relation="${relation}"]`)).toHaveCount(1);
  await screenshot(page, info, 'p03b-correct');
  const next = result(page).getByRole('link'); await expect(next).toHaveCount(1); await next.click(); await expect(page.locator('#kausal-erklaerung')).toBeFocused();
  await expect(page.locator('#kausal-erklaerung')).toContainText('nicht automatisch bewertet');
});

test('a single correct D condition stays partial; adding the joint condition still needs the water relations', async ({ page }) => {
  await open(page); await edge(page, 'B', 'D', 'enables_if'); await press(page, 'Kausalnetz prüfen');
  await expect(result(page)).toHaveAttribute('data-status', 'partial'); await expect(result(page)).toContainText('UND');
  await expect(page.locator('[data-criterion="M6.03.C03"]')).toHaveAttribute('data-color', 'yellow');
  await expect(page.locator('.causal-edge-list')).toContainText('Richtig');
  await edge(page, 'C', 'D', 'requires_zero'); await press(page, 'Kausalnetz prüfen');
  await expect(result(page)).toHaveAttribute('data-status', 'partial'); await expect(page.locator('[data-criterion="M6.03.C03"]')).toHaveAttribute('data-color', 'green');
  await expect(support(page)).toContainText('Kein aktueller Netzbeleg');
});

test('wrong type and contradictory assertions never hide behind the complete correct subgraph', async ({ page }) => {
  await open(page); await complete(page); await edge(page, 'B', 'D', 'causes'); await press(page, 'Kausalnetz prüfen');
  await expect(result(page)).toHaveAttribute('data-status', 'incorrect'); await expect(result(page)).toContainText('Widerspruch');
  await expect(page.locator('.causal-edge-list')).toContainText('vollständigen Turgorverlust');
  await expect(page.locator('[data-criterion="M6.03.C01"]')).toHaveAttribute('data-color', 'green');
  await expect(support(page)).toContainText('Kein aktueller Netzbeleg');
});

test('duplicates and uncertain extras are yellow until removed; valid coupling is accepted', async ({ page }) => {
  await open(page); await complete(page); await edge(page, 'A', 'B', 'causes'); await press(page, 'Kausalnetz prüfen');
  await expect(result(page)).toHaveAttribute('data-color', 'yellow'); await expect(result(page)).toContainText('doppelt');
  await press(page, 'Verbindung 5 entfernen'); await edge(page, 'A', 'B', 'coupled'); await press(page, 'Kausalnetz prüfen');
  await expect(result(page)).toHaveAttribute('data-status', 'clarify'); await expect(page.locator('.causal-edge-list')).toContainText('nicht als fachlich falsch');
  await press(page, 'Verbindung 5 entfernen'); await edge(page, 'C', 'B', 'coupled'); await press(page, 'Kausalnetz prüfen');
  await expect(result(page)).toHaveAttribute('data-status', 'correct');
});

test('strict B/C sequence is red and changing layout preserves semantic arrows and current result', async ({ page }, info) => {
  await open(page); await complete(page); const before = await page.locator('.causal-edge-text').allTextContents();
  const a = await page.locator('[data-node="A"]').boundingBox(); await press(page, 'Karten anders anordnen');
  await expect(page.locator('.causal-board')).toHaveAttribute('data-layout', 'alternate');
  await expect(result(page)).toHaveAttribute('data-status', 'correct'); expect(await page.locator('.causal-edge-text').allTextContents()).toEqual(before);
  const after = await page.locator('[data-node="A"]').boundingBox(); expect(after?.y).not.toBe(a?.y);
  await screenshot(page, info, 'p03b-equivalent-layout');
  await edge(page, 'B', 'C', 'strictly_before'); await press(page, 'Kausalnetz prüfen');
  await expect(result(page)).toHaveAttribute('data-color', 'red'); await expect(page.locator('.causal-edge-list')).toContainText('keine zwingende Folge');
});

test('wall shrinkage, automatic visible plasmolysis and an active pump are explicitly rejected', async ({ page }) => {
  await open(page); await complete(page); await page.getByText('Zusätzliche Aussagen prüfen (optional)', { exact: true }).click();
  for (const text of ['Die Zellwand schrumpft im gleichen Ausmaß wie der Protoplast.', 'Anfängliche Volumenabnahme beweist bereits sichtbare Plasmolyse.', 'Eine aktive Wasserpumpe verursacht hier den Wasserverlust.']) {
    const checkbox = page.getByRole('checkbox', { name: text, exact: true }); await checkbox.check(); await press(page, 'Kausalnetz prüfen');
    await expect(result(page)).toHaveAttribute('data-status', 'incorrect'); await expect(result(page)).toContainText(text); await checkbox.uncheck();
  }
  await press(page, 'Kausalnetz prüfen'); await expect(result(page)).toHaveAttribute('data-status', 'correct');
});

test('three specific help levels never insert an answer, and later help invalidates the current receipt', async ({ page }, info) => {
  await open(page);
  await press(page, 'Kurzer Hinweis: Bedingungen der Ablösung'); await expect(page.locator('.help-text').filter({ hasText: 'Reicht schon' })).toBeVisible();
  expect(await page.locator('.help-text').allTextContents()).not.toContain('A → B');
  await press(page, 'Verbindungshilfe: Bedingungen der Ablösung'); await expect(page.locator('.help-text').filter({ hasText: 'zwei gemeinsam' })).toBeVisible();
  await expect(page.locator('.causal-edge-text')).toHaveCount(0);
  await complete(page); await expect(result(page)).toHaveAttribute('data-status', 'correct');
  await press(page, 'Begründete Vergleichslösung ausdrücklich ansehen'); await expect(result(page)).toHaveAttribute('data-status', 'stale');
  await expect(support(page)).toContainText('Lösung angesehen'); await expect(support(page)).toContainText('Kein aktueller Netzbeleg');
  await expect(page.locator('.causal-edge-text')).toHaveCount(4);
  await press(page, 'Kausalnetz prüfen'); await expect(result(page)).toHaveAttribute('data-status', 'correct');
  await page.getByText('Herkunft der digitalen Hilfen (3)', { exact: true }).click();
  await expect(support(page)).toContainText('Stufe 1'); await expect(support(page)).toContainText('Stufe 2'); await expect(support(page)).toContainText('Stufe 3');
  await screenshot(page, info, 'p03b-help');
});

test('material changes clear the answer and text, retain disclosure and never restore an old green result', async ({ page }) => {
  await open(page); await press(page, 'Begründete Teillösung: Bedingungen der Ablösung'); await complete(page);
  await page.getByLabel('Eigene Erklärung – unbewerteter flüchtiger Arbeitsbereich', { exact: true }).fill('Ein flüchtiger eigener Entwurf.');
  await press(page, 'Materialfall wechseln'); await expect(result(page)).toHaveAttribute('data-status', 'empty');
  await expect(page.getByRole('region', { name: 'Material zum Kausalnetz' })).toContainText('-200.000 Pa');
  await expect(page.locator('#causal-explanation')).toHaveValue(''); await expect(page.locator('.causal-edge-text')).toHaveCount(0);
  await expect(support(page)).toContainText('Lösung angesehen'); await complete(page); await expect(result(page)).toHaveAttribute('data-status', 'correct');
  await press(page, 'Materialfall wechseln'); await expect(result(page)).toHaveAttribute('data-status', 'empty'); await expect(support(page)).toContainText('Lösung angesehen');
});

test('route changes preserve drafts and actual M6.02 help is attributed even across case changes', async ({ page }) => {
  await open(page); await complete(page); await page.locator('#causal-explanation').fill('Eigene Erklärung.');
  await page.getByRole('link', { name: 'Vorherige Übung: Wasserhaushalt', exact: true }).click();
  await press(page, 'Lösung ansehen: Vakuolenvolumen'); await press(page, 'Weiterer Materialfall');
  await page.getByRole('link', { name: 'Weiter zu M6.03: eigenes Kausalnetz aufbauen', exact: true }).click();
  await expect(result(page)).toHaveAttribute('data-status', 'stale'); await expect(page.locator('#causal-explanation')).toHaveValue('Eigene Erklärung.');
  await expect(support(page)).toContainText('Lösung angesehen');
  await page.getByText('Herkunft der digitalen Hilfen (1)', { exact: true }).click(); await expect(support(page)).toContainText('M6.02/volume/solution_viewed');
});

test('free explanation and self-check never create a grade or persistence; reload loses all draft data', async ({ page }) => {
  await open(page); await page.evaluate(() => { localStorage.setItem('foreign', 'keep'); sessionStorage.setItem('foreign', 'also-keep'); });
  await complete(page); const expected = await result(page).getAttribute('data-status');
  await page.locator('#causal-explanation').fill('Unbewerteter eigener Satz, kein automatischer Nachweis.');
  await page.getByText('Kriterien für Selbst- oder Partnerprüfung', { exact: true }).click();
  const checks = page.locator('#kausal-erklaerung').getByRole('checkbox'); await expect(checks).toHaveCount(4);
  for (let i = 0; i < 4; i++) await checks.nth(i).check();
  await expect(result(page)).toHaveAttribute('data-status', expected!);
  expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual({ local: { foreign: 'keep' }, session: { foreign: 'also-keep' } });
  await page.reload(); await expect(page.locator('#causal-explanation')).toHaveValue(''); await expect(result(page)).toHaveAttribute('data-status', 'empty');
  await complete(page); await expect(support(page)).toContainText('Frühere Hilfehistorie nicht gesichert'); await expect(support(page)).toContainText('Kein aktueller Netzbeleg');
});

test('responsive board and text at 200 percent retain visible focus and complete meaning without horizontal overflow', async ({ page }, info) => {
  await open(page); await complete(page);
  await page.addStyleTag({ content: 'html {font-size:200% !important}' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.getByLabel('Startknoten', { exact: true }).focus();
  expect(await page.locator('#causal-from').evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
  for (const button of await page.locator('.causal-node').all()) { const box = await button.boundingBox(); expect(box!.width).toBeGreaterThanOrEqual(44); expect(box!.height).toBeGreaterThanOrEqual(44); }
  await expect(page.locator('.causal-edge-list')).toContainText('hinreichend weitere Volumenabnahme');
  await screenshot(page, info, 'p03b-200-percent');
});

test('keyboard alone can build every required relation, check, edit, remove, open help and write', async ({ page, browserName }, info) => {
  const started = performance.now();
  // Read-only phase observations in the bounded preflight only. No values/texts
  // from the learner's editor are captured; the normal full suite is unchanged.
  async function mark(phase: string) {
    if (!process.env['WEBKIT_PREFLIGHT_PHASE']) return;
    const observed = await page.evaluate(() => ({ visibility: document.visibilityState, hasFocus: document.hasFocus(),
      focus: { tag: document.activeElement?.tagName, id: document.activeElement?.id,
        label: document.activeElement?.getAttribute('aria-label') } }));
    appendFileSync(info.outputPath('keyboard-timeline.jsonl'), JSON.stringify({ phase,
      elapsedMs: performance.now() - started, ...observed }) + '\n');
  }
  await mark('navigation-start');
  await open(page); const macWebKit = browserName === 'webkit' && process.platform === 'darwin';
  await mark('navigation-complete');
  const tab = macWebKit ? 'Alt+Tab' : 'Tab';
  const reverse = macWebKit ? 'Alt+Shift+Tab' : 'Shift+Tab';
  async function tabTo(id: string, backwards = false) {
    for (let i = 0; i < 90; i++) {
      if (await page.evaluate(target => document.activeElement?.id === target, id)) return;
      await page.keyboard.press(backwards ? reverse : tab);
    }
    throw new Error(`Keyboard did not reach ${id}`);
  }
  for (const [index, [from, to, relation]] of core.entries()) {
    // The actual visible card/radio path needs no platform-native popup.
    // Test code neither injects focus nor assigns selections or responses.
    await tabTo(`causal-node-${from}`, index > 0); await page.keyboard.press('Space');
    await expect(page.locator('#causal-from')).toHaveValue(from);
    await tabTo(`causal-node-${to}`); await page.keyboard.press('Space');
    await expect(page.locator('#causal-to')).toHaveValue(to); await expect(page.locator('#causal-relation')).toBeFocused();
    await page.keyboard.press(tab);
    await expect(page.locator('#causal-type-toggle')).toBeFocused();
    if (!(await page.locator('#causal-type-list').evaluate(el => (el as HTMLDetailsElement).open))) await page.keyboard.press('Space');
    await page.keyboard.press(tab); await expect(page.locator('#causal-kind-causes')).toBeFocused(); await page.keyboard.press('Space');
    for (let i = 0; i < ['causes', 'enables_if', 'requires_zero'].indexOf(relation); i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    await expect(page.locator(`#causal-kind-${relation}`)).toBeChecked(); await expect(page.locator('#causal-relation')).toHaveValue(relation);
    await tabTo('causal-add'); await page.keyboard.press('Space'); await expect(page.locator('#causal-from')).toBeFocused();
    await expect(page.locator('.causal-edge-text')).toHaveCount(index + 1);
    await mark(`connection-${index + 1}-complete`);
  }
  // Continue through the real document order, rather than replacing navigation with focus().
  for (let i = 0; i < 25 && !(await page.getByRole('button', { name: 'Kausalnetz prüfen', exact: true }).evaluate(el => el === document.activeElement)); i++) await page.keyboard.press(tab);
  await expect(page.getByRole('button', { name: 'Kausalnetz prüfen', exact: true })).toBeFocused();
  await page.keyboard.press('Space'); await expect(result(page)).toHaveAttribute('data-status', 'correct');
  await mark('check-complete');
  await page.keyboard.press(tab); await expect(result(page).getByRole('link')).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.locator('#kausal-erklaerung')).toBeFocused(); await page.keyboard.press(tab); await expect(page.locator('#causal-explanation')).toBeFocused(); await page.keyboard.type('Eigene biologische Erklaerung.');
  await mark('writing-complete');
  // Return from the isolated writing view with real keyboard activation.
  const returnToNet = page.getByRole('link',{name:'Zurück zum eigenen Kausalnetz',exact:true});
  for (let i = 0; i < 12 && !(await returnToNet.evaluate(el => el === document.activeElement)); i++) await page.keyboard.press(tab);
  await expect(returnToNet).toBeFocused(); await page.keyboard.press('Enter');
  await mark('return-complete');
  // Buttons also expose native keyboard activation; edit/remove are reached by tab.
  const edit = page.getByRole('button', { name: 'Verbindung 1 bearbeiten', exact: true });
  for (let i = 0; i < 60 && !(await edit.evaluate(el => el === document.activeElement)); i++) await page.keyboard.press(reverse);
  await expect(edit).toBeFocused(); await page.keyboard.press('Space'); await expect(page.locator('#causal-from')).toBeFocused();
  await mark('edit-open');
  await tabTo('causal-add'); await page.keyboard.press('Space');
  await mark('edit-complete');
  const remove = page.getByRole('button', { name: 'Verbindung 1 entfernen', exact: true });
  for (let i = 0; i < 15 && !(await remove.evaluate(el => el === document.activeElement)); i++) await page.keyboard.press(reverse);
  await expect(remove).toBeFocused(); await page.keyboard.press('Space'); await expect(page.locator('.causal-edge-text')).toHaveCount(3);
  await mark('remove-complete');
  const help = page.getByRole('button', { name: 'Kurzer Hinweis: Wasserbilanz und Volumen', exact: true });
  for (let i = 0; i < 30 && !(await help.evaluate(el => el === document.activeElement)); i++) await page.keyboard.press(tab);
  await expect(help).toBeFocused(); await page.keyboard.press('Space'); await expect(support(page)).toContainText('Digitale Unterstützung aufgerufen');
  await mark('help-complete');
  await mark('screenshot-start');
  await screenshot(page, info, 'p03b-keyboard');
  await mark('screenshot-complete');
});

test('node tapping is a complete no-drag pointer alternative', async ({ page }) => {
  await open(page);
  for (const [from, to, relation] of core) {
    for (const id of [from, to]) {
      const button = page.locator(`[data-node="${id}"]`);
      if (await page.evaluate(() => navigator.maxTouchPoints > 0)) await button.tap(); else await button.click();
    }
    await expect(page.locator('#causal-relation')).toBeFocused();
    if (!(await page.locator('#causal-type-list').evaluate(el => (el as HTMLDetailsElement).open))) await page.locator('#causal-type-toggle').click();
    const radio = page.locator(`#causal-kind-${relation}`);
    if (await page.evaluate(() => navigator.maxTouchPoints > 0)) await radio.tap(); else await radio.click();
    await expect(radio).toBeChecked(); await expect(page.locator('#causal-relation')).toHaveValue(relation);
    await press(page, 'Verbindung hinzufügen'); await expect(radio).not.toBeChecked();
  }
  await press(page, 'Kausalnetz prüfen'); await expect(result(page)).toHaveAttribute('data-status', 'correct');
});

test('all allowed extra arrows retain distinct numbers and avoid the cards across layouts and text zoom', async ({ page }, info) => {
  await open(page); await complete(page);
  for (const [from, to, type] of [['B', 'C', 'coupled'], ['C', 'B', 'coupled'], ['A', 'D', 'possible_together']]) await edge(page, from!, to!, type!);
  await press(page, 'Kausalnetz prüfen'); await expect(result(page)).toHaveAttribute('data-status', 'correct');
  expect(await page.locator('.causal-edge-list').innerText()).not.toContain('Ergänze auch');
  for (const zoom of [100, 200]) {
    await page.addStyleTag({ content: `html {font-size:${zoom}% !important}` });
    for (const layout of ['default', 'alternate']) {
      if (await page.locator('.causal-board').getAttribute('data-layout') !== layout) await press(page, 'Karten anders anordnen');
      const observed = await page.locator('.causal-board').evaluate(board => {
        const bounds = board.getBoundingClientRect(), cards = [...board.querySelectorAll('.causal-node')].map(el => el.getBoundingClientRect());
        const labels = [...board.querySelectorAll('circle')].map(el => ({ x: +el.getAttribute('cx')!, y: +el.getAttribute('cy')! }));
        const collisions: string[] = [];
        for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
          if (Math.hypot(labels[i]!.x - labels[j]!.x, labels[i]!.y - labels[j]!.y) < 25) collisions.push(`labels ${i + 1}/${j + 1}`);
        }
        for (const path of board.querySelectorAll<SVGPathElement>('path[data-from]')) {
          const length = path.getTotalLength();
          for (let step = 0; step <= 50; step++) {
            const point = path.getPointAtLength(length * step / 50), x = point.x + bounds.x, y = point.y + bounds.y;
            if (cards.some(card => x > card.left + 1 && x < card.right - 1 && y > card.top + 1 && y < card.bottom - 1)) collisions.push(`path ${path.dataset['from']}/${path.dataset['to']}`);
          }
        }
        return { count: labels.length, collisions };
      });
      expect(observed).toEqual({ count: 7, collisions: [] });
      await expect(result(page)).toHaveAttribute('data-status', 'correct');
    }
  }
  await screenshot(page, info, 'p03b-all-valid-arrows-200-percent');
});
