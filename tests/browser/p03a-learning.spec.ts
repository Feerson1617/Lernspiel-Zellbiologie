import { expect, test } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';

// Own implementation-derived UI expectations, not independent acceptance.
// No private review package or internal test entry is loaded into the application.
const storageKey = 'zelllabor11.progress.v1';
const fields = ['process', 'direction', 'volume'] as const;
type Field = typeof fields[number];
const correct = { process: 'Osmose', direction: 'nach außen', volume: 'nimmt ab' };
const result = (page: Page) => page.getByRole('region', { name: 'Gesamtrückmeldung', exact: true });
const panel = (page: Page, field: Field) => page.getByRole('region', { name: `Bewertung ${field}`, exact: true });
const support = (page: Page) => page.getByRole('region', { name: 'Unterstützung und Lernstand', exact: true });
const material = (page: Page) => page.getByRole('region', { name: 'Frage und Material', exact: true });

async function press(page: Page, name: string) {
  const button = page.getByRole('button', { name, exact: true });
  if (await page.evaluate(() => navigator.maxTouchPoints > 0)) await button.tap();
  else await button.click();
}
async function open(page: Page) {
  await page.goto('./');
  await page.getByRole('link', { name: 'Erste Übung ausprobieren – Wasserhaushalt der Zelle', exact: true }).click();
  await expect(page).toHaveURL(/#\/m602$/u);
  await expect(page.getByRole('heading', { name: 'Wasserhaushalt der Zelle', exact: true })).toBeVisible();
}
async function fill(page: Page, values: Partial<Record<Field, string>> = {}) {
  for (const field of fields) await page.locator(`#learner-${field}`).fill(values[field] ?? correct[field]);
}
async function check(page: Page) { await press(page, 'Drei Antworten prüfen'); }
async function image(page: Page, info: TestInfo, name: string) {
  const path = info.outputPath(`${name}.png`);
  await page.screenshot({ path, fullPage: true });
  await info.attach(name, { path, contentType: 'image/png' });
}
async function stored(page: Page) {
  const raw = await page.evaluate(key => localStorage.getItem(key), storageKey);
  return raw === null ? null : JSON.parse(raw) as { attempts: Record<string, string>[] };
}

const problems = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page, baseURL }) => {
  const errors: string[] = []; problems.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', event => { if (event.type() === 'error') errors.push(event.text()); });
  page.on('requestfailed', request => errors.push(`failed request: ${request.url()}`));
  page.on('request', request => { if (!request.url().startsWith(baseURL!)) errors.push(`external request: ${request.url()}`); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
});
test.afterEach(async ({ page }) => { expect(problems.get(page)).toEqual([]); });

test('plays the public learning cycle with material, feedback, own revision and metadata-only progress', async ({ page }, info) => {
  await page.goto('./');
  await image(page, info, 'p03a-start');
  await page.getByRole('link', { name: 'Erste Übung ausprobieren – Wasserhaushalt der Zelle', exact: true }).click();
  await expect(material(page)).toHaveAttribute('data-case', 'water-loss-a');
  await expect(page.getByText('Interne Testfall-Steuerung', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Technische Bindung ansehen', { exact: true })).toHaveCount(0);
  for (const field of fields) await expect(page.locator(`#learner-${field}`)).toHaveValue('');
  await expect(result(page)).not.toHaveAttribute('data-status', 'correct');
  await expect(support(page)).toContainText('Bisher keine zusätzliche Hilfe genutzt');
  await expect(support(page)).not.toContainText('Ohne zusätzlich aufgerufene Hilfe beantwortet');
  const diagram = page.getByRole('img', { name: 'Zwiebel-Epidermiszelle: drei Räume und ihre Grenzen', exact: true });
  await expect(diagram).toBeVisible();
  for (const structure of ['Zellwand', 'Zellmembran', 'Cytosol', 'Vakuole', 'Tonoplast', 'Außenraum']) await expect(diagram).toContainText(structure);
  await expect(diagram.locator('[marker-end], [marker-start]')).toHaveCount(0);
  const diagramText = await diagram.locator('text').allTextContents();
  expect(diagramText.slice(0, 6)).toEqual(['Außenraum', '-700000 Pa', 'Cytosol', '-300000 Pa', 'Vakuole', '-120000 Pa']);
  await expect(material(page)).toContainText('Pa');
  await expect(material(page)).toContainText('Druck');
  await image(page, info, 'p03a-material');
  await fill(page, { direction: 'nach innen', volume: 'nimmt zu' });
  await image(page, info, 'p03a-eingabe');
  await check(page);
  await expect(result(page)).toHaveAttribute('data-status', 'incorrect');
  await expect(result(page)).toHaveAttribute('data-color', 'red');
  await expect(panel(page, 'direction')).toContainText('Nettostrom in die Zelle');
  await expect(panel(page, 'volume')).toContainText('Zunahme');
  await expect(result(page)).toBeFocused();
  for (const field of fields) {
    await expect(panel(page, field)).toContainText('Erkannter Ansatz');
    await expect(panel(page, field)).toContainText('Nächster Schritt');
    await expect(panel(page, field)).toContainText('Bezug zum Material');
    await expect(panel(page, field)).toContainText(field === 'process' ? 'Saccharose' : 'Pa');
    const explanation = panel(page, field).locator('details');
    await expect(explanation).not.toHaveAttribute('open', '');
    await expect(panel(page, field).getByText('Nächster Schritt', { exact: true })).toBeVisible();
    await expect(panel(page, field).getByText('Fachliche Einordnung und Begründung', { exact: true })).toBeHidden();
    await explanation.locator('summary').click();
    await expect(panel(page, field).getByText('Fachliche Einordnung und Begründung', { exact: true })).toBeVisible();
    if (field === 'process') await image(page, info, 'p03a-erklaerung-geoeffnet');
    await explanation.locator('summary').click();
  }
  expect(await result(page).innerText()).not.toMatch(/\bC0[123]\b|contextHash|rubricVersion/);
  await image(page, info, 'p03a-falsche-rueckmeldung');
  expect(await stored(page)).toBeNull();
  await press(page, 'Antwort selbst überarbeiten');
  await fill(page);
  await expect(result(page)).not.toHaveAttribute('data-status', 'correct');
  await expect(result(page)).toContainText('nicht mehr aktuell');
  await expect(result(page)).toHaveAttribute('data-color', 'neutral');
  await expect(result(page)).not.toContainText('Technischer Hinweis');
  await expect(result(page).locator('[data-color="green"]')).toHaveCount(0);
  await check(page);
  await expect(result(page)).toHaveAttribute('data-status', 'correct');
  await expect(result(page)).toHaveAttribute('data-color', 'green');
  await expect(result(page)).toContainText('✓');
  expect(await result(page).innerText()).not.toMatch(/\bC0[123]\b/);
  await expect(support(page)).toContainText('Nach Rückmeldung überarbeitet');
  await expect(support(page)).toContainText('Ohne zusätzlich aufgerufene Hilfe beantwortet');
  const progress = await stored(page);
  expect(progress?.attempts).toHaveLength(1);
  expect(Object.keys(progress!.attempts[0]!).sort()).toEqual(['assistance', 'attemptId', 'instanceId', 'modelVersion', 'rubricVersion', 'status', 'taskId', 'taskVersion']);
  expect(progress!.attempts[0]!['assistance']).toBe('independent');
  expect(JSON.stringify(progress)).not.toMatch(/answers|contextHash|events|Osmose|nach außen|nimmt ab/u);
  await image(page, info, 'p03a-richtige-rueckmeldung');
  await press(page, 'Weiterer Materialfall');
  await expect(material(page)).toHaveAttribute('data-case', 'water-loss-b');
  expect((await diagram.locator('text').allTextContents()).slice(0, 6)).toEqual(['Außenraum', '-900000 Pa', 'Cytosol', '-450000 Pa', 'Vakuole', '-200000 Pa']);
  for (const field of fields) await expect(page.locator(`#learner-${field}`)).toHaveValue('');
  await expect(result(page)).not.toHaveAttribute('data-status', 'correct');
  await fill(page, { direction: 'Zellinneres → Außenraum', volume: 'wird kleiner' });
  await check(page);
  await expect(result(page)).toHaveAttribute('data-status', 'correct');
  const completed = (await stored(page))!.attempts;
  expect(completed).toHaveLength(2);
  expect(completed[0]!['instanceId']).not.toBe(completed[1]!['instanceId']);
});

test('keeps field colors, factual explanations and format limits distinct for real public answers', async ({ page }) => {
  await open(page);
  const probes = [
    ['process', 'Plasmolyse', 'incorrect', 'red', '✕', 'Zellreaktion'],
    ['process', 'Diffusion', 'partial', 'yellow', '+', 'übergeordneter Ansatz'],
    ['direction', 'in beide Richtungen', 'partial', 'yellow', '+', 'Einzelbewegungen'],
    ['direction', 'kein Nettostrom', 'incorrect', 'red', '✕', 'Nettowasserbilanz'],
    ['direction', 'Vakuole → Cytosol', 'partial', 'yellow', '+', 'innere Membrangrenze'],
    ['direction', 'nach außen über den Tonoplasten', 'clarify', 'yellow', '?', 'kein Nachweis eines biologischen Fehlers'],
    ['volume', 'verändert sich', 'partial', 'yellow', '+', 'Richtung'],
    ['volume', 'Die Vakuole schrumpft.', 'clarify', 'yellow', '?', 'kein Nachweis eines biologischen Fehlers'],
    ['volume', 'Zellwand wird kleiner', 'clarify', 'yellow', '?', 'kein Nachweis eines biologischen Fehlers'],
    ['volume', '', 'empty', 'neutral', '○', 'leer'],
  ] as const;
  for (const [field, text, status, color, symbol, explanation] of probes) {
    await fill(page, { [field]: text }); await check(page);
    await expect(page.locator(`#learner-${field}`)).toHaveValue(text);
    await expect(panel(page, field)).toHaveAttribute('data-status', status);
    await expect(panel(page, field)).toHaveAttribute('data-color', color);
    await expect(panel(page, field)).toContainText(symbol);
    await expect(panel(page, field)).toContainText(explanation);
    await expect(result(page)).not.toHaveAttribute('data-status', 'correct');
  }
  expect(await stored(page)).toBeNull();
});

test('retains negation, contradictory balances, unknown spaces and spelling in the public contract', async ({ page }) => {
  await open(page);
  const probes = [
    ['direction', 'netto hinaus und kein Nettostrom', 'incorrect'],
    ['direction', 'nach außen und nach innen', 'incorrect'],
    ['direction', 'nach außen und nach außen', 'correct'],
    ['direction', 'Kammer → Außenraum', 'clarify'],
    ['volume', 'nimmt nicht ab', 'incorrect'],
    ['volume', 'nimmt nicht zu', 'partial'],
    ['volume', 'nicht nicht kleiner', 'clarify'],
    ['volume', 'nimmt ab und nimmt zu', 'incorrect'],
    ['volume', 'nimmt ab und kleiner', 'correct'],
    ['direction', 'Wahrscheinlich netto Zellinneres → Aussenraum!', 'correct'],
  ] as const;
  for (const [field, text, status] of probes) {
    await fill(page, { [field]: text }); await check(page);
    await expect(panel(page, field)).toHaveAttribute('data-status', status);
    await expect(page.locator(`#learner-${field}`)).toHaveValue(text);
    await expect(result(page)).toHaveAttribute('data-status', status === 'partial' ? 'partial' : status);
  }
  expect((await stored(page))!.attempts).toHaveLength(3);
});

test('offers direct help and selection before a second attempt and preserves provenance on case return', async ({ page }, info) => {
  await open(page);
  await press(page, 'Wortbank: Nettorichtung');
  await press(page, 'Übernehmen Nettorichtung: netto nach außen');
  await expect(page.locator('#learner-direction')).toHaveValue('netto nach außen');
  await expect(page.locator('#learner-direction')).toBeFocused();
  await page.locator('#learner-process').fill('Osmose');
  await page.locator('#learner-volume').fill('nimmt ab');
  await check(page);
  await expect(result(page)).toHaveAttribute('data-status', 'correct');
  await expect(support(page)).toContainText('Mit Auswahl geklärt');
  expect((await stored(page))!.attempts[0]!['assistance']).toBe('clarified');
  await page.getByText('Wasserpotenzial', { exact: true }).click();
  await expect(result(page)).toHaveAttribute('data-status', 'stale');
  await expect(result(page).locator('[data-color="green"]')).toHaveCount(0);
  expect((await stored(page))!.attempts).toHaveLength(1);
  await press(page, 'Lösung ansehen: Vakuolenvolumen');
  await expect(result(page)).not.toHaveAttribute('data-status', 'correct');
  await expect(support(page)).toContainText('Lösung angesehen');
  expect(await page.getByRole('region', { name: 'Überarbeiten und Hilfen', exact: true }).innerText()).not.toMatch(/\bC0[123]\b/);
  await image(page, info, 'p03a-hilfenutzung');
  await check(page);
  expect((await stored(page))!.attempts.at(-1)!['assistance']).toBe('solution_viewed');
  await press(page, 'Weiterer Materialfall');
  await expect(material(page)).toHaveAttribute('data-case', 'water-loss-b');
  for (const field of fields) await expect(page.locator(`#learner-${field}`)).toHaveValue('');
  await expect(support(page)).toContainText('Bisher keine zusätzliche Hilfe genutzt');
  await press(page, 'Weiterer Materialfall');
  await expect(material(page)).toHaveAttribute('data-case', 'water-loss-a');
  await expect(support(page)).toContainText('Lösung angesehen');
  for (const field of fields) await expect(page.locator(`#learner-${field}`)).toHaveValue('');
  await fill(page); await check(page);
  expect((await stored(page))!.attempts.at(-1)!['assistance']).toBe('solution_viewed');
});

test('keeps extra assertions visible, ungraded and out of persistence without turning them into HTML', async ({ page }) => {
  await open(page); await fill(page);
  await page.getByText('Weitere Aussagen ergänzen (optional)', { exact: true }).click();
  const extra = 'Die Zellwand schrumpft. C01 <img src=x onerror=alert(1)>';
  await page.locator('#learner-extra').fill(extra); await check(page);
  for (const field of fields) await expect(panel(page, field)).toHaveAttribute('data-status', 'correct');
  await expect(result(page)).toHaveAttribute('data-status', 'clarify');
  await expect(result(page)).toContainText(extra);
  await expect(page.locator('img[src=x]')).toHaveCount(0);
  expect(await stored(page)).toBeNull();
  await page.locator('#learner-extra').fill('');
  await expect(result(page)).not.toHaveAttribute('data-status', 'correct');
  await check(page);
  await expect(result(page)).toHaveAttribute('data-status', 'correct');
});

test('reload loses help-history certainty even before any successful stored answer', async ({ page }) => {
  await open(page);
  await press(page, 'Hinweis: Nettorichtung');
  await page.locator('#learner-direction').fill('mein ungespeicherter Entwurf');
  await page.reload();
  for (const field of fields) await expect(page.locator(`#learner-${field}`)).toHaveValue('');
  await fill(page); await check(page);
  for (const field of fields) await expect(panel(page, field)).toHaveAttribute('data-status', 'correct');
  await expect(result(page)).toHaveAttribute('data-status', 'technical');
  await expect(support(page)).toContainText('Frühere Hilfehistorie nicht gesichert');
  expect(await stored(page)).toBeNull();
  await press(page, 'Weiterer Materialfall');
  await fill(page); await check(page);
  await expect(result(page)).toHaveAttribute('data-status', 'technical');
  expect(await stored(page)).toBeNull();
});

for (const fault of ['corrupt', 'version', 'denied', 'quota'] as const) {
  test(`keeps the learner usable with ${fault} storage and preserves unrelated data`, async ({ page }) => {
    const existing = fault === 'corrupt' ? '{not-json' : fault === 'version'
      ? JSON.stringify({ schemaVersion: 1, contentVersion: 'previous-content', attempts: [] }) : null;
    await page.addInitScript(({ key, fault, existing }) => {
      const storage = window.localStorage;
      storage.setItem('unrelated-learning-app', 'must-remain');
      if (existing !== null) storage.setItem(key, existing);
      if (fault === 'denied') Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('denied', 'SecurityError'); } });
      if (fault === 'quota') {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function(k: string, value: string) {
          if (k === key) throw new DOMException('quota', 'QuotaExceededError');
          original.call(this, k, value);
        };
      }
    }, { key: storageKey, fault, existing });
    await open(page); await fill(page); await check(page);
    for (const field of fields) await expect(panel(page, field)).toHaveAttribute('data-status', 'correct');
    await expect(page.getByRole('main')).toContainText(/Speicher|Sitzung/u);
    if (fault === 'corrupt' || fault === 'version' || fault === 'denied') {
      await expect(result(page)).toHaveAttribute('data-status', 'technical');
      await expect(support(page)).toContainText('Frühere Hilfehistorie nicht gesichert');
    } else await expect(result(page)).toHaveAttribute('data-status', 'correct');
    if (fault !== 'denied') {
      expect(await page.evaluate(key => localStorage.getItem(key), storageKey)).toBe(existing);
      expect(await page.evaluate(() => localStorage.getItem('unrelated-learning-app'))).toBe('must-remain');
    } else {
      // The denied getter is the application's fault scenario; independently read
      // the same origin through a second page without replacing browser storage.
      const other = await page.context().newPage();
      await other.goto('./');
      expect(await other.evaluate(() => localStorage.getItem('unrelated-learning-app'))).toBe('must-remain');
      await other.close();
    }
  });
}

test('supports real keyboard navigation, Enter submission, touch and enlarged text without hidden controls', async ({ page, browserName }, info) => {
  await page.goto('./');
  const key = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  const entry = page.getByRole('link', { name: 'Erste Übung ausprobieren – Wasserhaushalt der Zelle', exact: true });
  // Walk the real tab order; do not replace this evidence with DOM focus().
  for (let i = 0; i < 12 && !await entry.evaluate(el => el === document.activeElement); i++) await page.keyboard.press(key);
  await expect(entry).toBeFocused();
  expect(await entry.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/m602$/u);
  const first = page.locator('#learner-process');
  for (let i = 0; i < 35 && !await first.evaluate(el => el === document.activeElement); i++) await page.keyboard.press(key);
  await expect(first).toBeFocused();
  expect(await first.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  await page.keyboard.type(correct.process);
  // Input fields may have per-field tools in between. Keep real sequential focus.
  for (const field of ['direction', 'volume'] as const) {
    const input = page.locator(`#learner-${field}`);
    for (let i = 0; i < 20 && !await input.evaluate(el => el === document.activeElement); i++) await page.keyboard.press(key);
    await expect(input).toBeFocused(); await page.keyboard.type(correct[field]);
  }
  await page.keyboard.press('Enter');
  await expect(result(page)).toHaveAttribute('data-status', 'correct');
  await expect(result(page)).toBeFocused();
  const announcement = page.getByRole('status').filter({ hasText: 'Rückmeldung:' });
  await expect(announcement).toHaveAttribute('aria-live', 'polite');
  await expect(announcement).toContainText('Drei Feldrückmeldungen verfügbar');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.width);
  const next = page.getByRole('button', { name: 'Weiterer Materialfall', exact: true });
  const size = await next.boundingBox(); expect(size?.height).toBeGreaterThanOrEqual(44);
  await press(page, 'Weiterer Materialfall');
  await expect(material(page)).toHaveAttribute('data-case', 'water-loss-b');
  await image(page, info, 'p03a-vergrossert-mobil');
  await info.attach('p03a-input-platform.json', { body: JSON.stringify({ host: process.platform, engine: browserName, key, touch: await page.evaluate(() => navigator.maxTouchPoints), textScale: '200%' }), contentType: 'application/json' });
});

test('home navigation retains the current draft and requested help without exporting responses', async ({ page }) => {
  await open(page);
  for (const [name, target] of [['1 Vorwissen', '#vorwissen'], ['2 Material', '#lernmaterial'], ['3 Antworten', '#lernantworten'], ['4 Weiterdenken', '#weiterdenken']] as const) {
    await page.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(/#\/m602$/u);
    await expect(page.locator(target)).toBeFocused();
  }
  const skip = page.getByRole('link', { name: 'Zur Aufgabe', exact: true });
  await skip.focus(); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/m602$/u);
  await expect(page.locator('#lernantworten')).toBeFocused();
  await press(page, 'Hinweis: Fachbegriff');
  await page.locator('#learner-process').fill('Osmose');
  await page.getByRole('link', { name: 'Zur Startseite', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Zelllabor 11');
  await page.getByRole('link', { name: 'Erste Übung ausprobieren – Wasserhaushalt der Zelle', exact: true }).click();
  await expect(page.locator('#learner-process')).toHaveValue('Osmose');
  await fill(page); await check(page);
  await expect(result(page)).toHaveAttribute('data-status', 'correct');
  expect((await stored(page))!.attempts.at(-1)!['assistance']).toBe('hint');
});

test('prior knowledge stays optional and the notebook example is explicit solution support', async ({ page }) => {
  await open(page);
  await expect(page.getByRole('heading', { name: 'Vorwissen aktivieren', exact: true })).toBeVisible();
  await page.getByText('Kurzen Vorwissencheck öffnen', { exact: true }).click();
  await page.getByLabel('Räume und Grenzen', { exact: true }).selectOption({ label: 'Zellwand' });
  await page.getByLabel('Einzelbewegung und Nettobilanz', { exact: true }).selectOption({ label: 'Nein, alle Moleküle stehen still' });
  await page.getByLabel('Gesamtwasserpotenziale vergleichen', { exact: true }).selectOption({ label: '−500 000 Pa' });
  await press(page, 'Vorwissen prüfen');
  // Wrong prior checks never lock the assessed task or create a graded result.
  await expect(page.locator('#vorwissen')).toContainText('Vergleiche deine Einschätzung');
  await expect(page.getByRole('button', { name: 'Drei Antworten prüfen', exact: true })).toBeEnabled();
  await expect(result(page)).not.toHaveAttribute('data-status', 'correct');
  await expect(page.getByRole('heading', { name: 'Erklären im Heft', exact: true })).toBeVisible();
  await press(page, 'Beispiellösung im Heftvergleich ansehen');
  await expect(support(page)).toContainText('Lösung angesehen');
  for (const name of ['Fachbegriff', 'Nettorichtung', 'Vakuolenvolumen']) await expect(support(page)).toContainText(`${name}: Lösung angesehen`);
  await fill(page); await check(page);
  await expect(result(page)).toHaveAttribute('data-status', 'correct');
  expect((await stored(page))!.attempts.at(-1)!['assistance']).toBe('solution_viewed');
  await expect(page.getByRole('main')).toContainText('nicht durch die drei Kurzfelder automatisch bewertet');
});
