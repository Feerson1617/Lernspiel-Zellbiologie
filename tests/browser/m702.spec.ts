import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function open(page: Page) { await page.goto('./#/m702'); await expect(page.getByRole('heading', { level: 1 })).toHaveText('Was zeigt die schnellere Stoffaufnahme?'); }
async function review(page: Page) { await page.getByRole('button', { name: 'Erstfassung festhalten und Kriterien vergleichen' }).click(); await page.getByText('Einzelne Aussagen zum Material prüfen (freiwillig)', { exact: true }).click(); }
async function check(page: Page) { await page.getByRole('button', { name: 'Nur diese Aussagen prüfen', exact: true }).click(); }
async function choice(page: Page, id: string, value = true) { await page.locator(`#m702-choice-${id}`).setChecked(value); }

test('M702 entry retains both paths, two material cards and three tasks without disclosing a solution', async ({ page }, info) => {
  await page.goto('./'); await expect(page.getByRole('heading', { name: 'A · Wasserhaushalt erklären' })).toBeVisible(); await expect(page.getByRole('heading', { name: 'B · Daten darstellen und deuten' })).toBeVisible();
  await page.getByRole('link', { name: 'Stoffaufnahme untersuchen – Protein und Energie' }).click();
  await expect(page.locator('[data-material-card]')).toHaveCount(2); await expect(page.locator('[data-work-order]')).toHaveCount(3);
  await expect(page.getByRole('table')).toContainText('3 nmol/(min·cm²)'); await expect(page.locator('[data-material-card="conditions"]')).toContainText('außen 4 mmol/L und innen 1 mmol/L');
  await expect(page.locator('#m702-review')).toBeHidden(); await expect(page.getByRole('checkbox')).toHaveCount(0); await expect(page.locator('#m702-help')).toBeEmpty();
  await expect(page.getByText('Eine mögliche Vergleichserklärung:', { exact: false })).toHaveCount(0);
  await page.locator('main').screenshot({ path: info.outputPath('initial-material-and-own-work.png') });
});
test('M702 own cycle freezes both actual drafts and keeps revision separate across navigation', async ({ page }, info) => {
  await open(page); await page.locator('#m702-argument').fill('Synthetischer Erstentwurf: mit P drei statt eins.'); await page.locator('#m702-investigation').fill('Synthetischer erster Untersuchungsvorschlag.');
  await review(page); await page.getByText('Festgehaltene Erstfassung anzeigen', { exact: true }).click();
  await page.getByRole('button', { name: 'Eigene Fassung überarbeiten' }).click(); await expect(page.locator('#m702-argument')).toBeFocused();
  await page.locator('#m702-argument').fill('Synthetische überarbeitete Begründung.'); await page.locator('#m702-investigation').fill('Synthetisch präzisierter Vorschlag.');
  await expect(page.locator('#m702-original-argument')).toHaveText('Synthetischer Erstentwurf: mit P drei statt eins.');
  await expect(page.locator('#m702-original-investigation')).toHaveText('Synthetischer erster Untersuchungsvorschlag.');
  await page.getByRole('link', { name: 'Zelllabor 11 · Zur Startseite' }).click(); await page.getByRole('link', { name: 'Relative Massenänderung berechnen' }).click();
  await page.getByRole('link', { name: 'Zelllabor 11 · Zur Startseite' }).click(); await page.getByRole('link', { name: 'Stoffaufnahme untersuchen – Protein und Energie' }).click();
  await expect(page.locator('#m702-argument')).toHaveValue('Synthetische überarbeitete Begründung.');
  await expect(page.locator('#m702-investigation')).toHaveValue('Synthetisch präzisierter Vorschlag.');
  await expect(page.locator('#m702-original-argument')).toHaveText('Synthetischer Erstentwurf: mit P drei statt eins.');
  await page.locator('#m702-review').screenshot({ path: info.outputPath('first-and-revised-drafts.png') });
});
test('M702 early comparison without writing never becomes a fictitious independent first answer', async ({ page }) => {
  await open(page); await page.getByRole('button', { name: 'Vergleichserklärung ansehen', exact: true }).click();
  await expect(page.locator('#m702-writing-state')).toContainText('noch kein eigener Text'); await expect(page.locator('#m702-support')).toContainText('Vergleichserklärung angesehen');
  await page.locator('#m702-argument').fill('Synthetischer Text nach dem Vergleich.');
  await page.getByText('Festgehaltene Erstfassung anzeigen', { exact: true }).click(); await expect(page.locator('#m702-original-argument')).toHaveText('Noch kein eigener Text vorhanden.');
  await expect(page.locator('input:checked')).toHaveCount(0); await page.getByRole('button', { name: 'Neue Bearbeitung beginnen' }).click();
  await expect(page.locator('#m702-argument')).toHaveValue(''); await expect(page.locator('#m702-review')).toBeHidden(); await expect(page.locator('#m702-support')).toContainText('Vergleichserklärung angesehen');
});
test('M702 early comparison captures a written first draft before help and never overwrites it', async ({ page }) => {
  await open(page); await page.locator('#m702-argument').fill('Synthetischer Satz vor der Hilfe.'); await page.getByRole('button', { name: 'Vergleichserklärung ansehen', exact: true }).click();
  await page.locator('#m702-argument').fill('Synthetischer Satz nach der Hilfe.'); await page.getByRole('button', { name: 'Erstfassung festhalten und Kriterien vergleichen' }).click();
  await page.getByText('Festgehaltene Erstfassung anzeigen', { exact: true }).click(); await expect(page.locator('#m702-original-argument')).toHaveText('Synthetischer Satz vor der Hilfe.');
});
test('M702 a correct bounded limit is green while the incomplete selection remains partial and writing ungraded', async ({ page }) => {
  await open(page); await page.locator('#m702-argument').fill('Synthetischer absichtlich falscher Freitext: ATP ist hier sicher bewiesen.'); await review(page);
  await check(page); await expect(page.locator('#m702-outcome')).toHaveAttribute('data-status', 'empty');
  await choice(page, 'energy_open'); await check(page); await expect(page.locator('#m702-outcome')).toHaveAttribute('data-status', 'partial');
  await expect(page.locator('#m702-feedback-energy_open')).toHaveAttribute('data-color', 'green'); await expect(page.locator('#m702-feedback-energy_open')).toContainText('konkreten Materialbefund');
  await choice(page, 'rate'); await expect(page.locator('#m702-feedback-energy_open')).toHaveAttribute('data-color', 'green'); await check(page);
  await expect(page.locator('#m702-outcome')).toHaveAttribute('data-status', 'correct'); await expect(page.locator('#m702-outcome')).toContainText('weiterhin nicht fachlich geprüft');
  await expect(page.locator('#m702-argument')).toHaveValue(/absichtlich falscher Freitext/);
});
for (const [id, reason, action] of [
  ['atp_pump', 'eine ATP-Nutzung wurde nicht untersucht', 'zusätzliche Messung'],
  ['active_proven', 'keinen gekoppelten Energieeinsatz', 'Angabe zum Antrieb'],
  ['passive_proven', 'eine Kopplung wurde nicht untersucht', 'Schlussfolgerung so um'],
] as const) test(`M702 ${id} feedback identifies the error and one next action without giving the model answer`, async ({ page }, info) => {
  await open(page); await review(page); await choice(page, 'rate'); await choice(page, id); await check(page);
  const feedback = page.locator(`#m702-feedback-${id}`); await expect(feedback).toHaveAttribute('data-color', 'red'); await expect(feedback).toContainText(reason); await expect(feedback).toContainText(action);
  await expect(page.locator('#m702-feedback-rate')).toHaveAttribute('data-color', 'green'); await expect(page.locator('#m702-help')).toBeEmpty();
  await expect(feedback).not.toContainText('ATP-Verfügbarkeit'); await expect(feedback).not.toContainText('3 statt 1');
  await feedback.screenshot({ path: info.outputPath(`${id}-initial-feedback.png`) });
  await feedback.getByRole('button', { name: 'Denkimpuls dazu anfordern' }).click(); await expect(page.locator('#m702-help')).toContainText('Welche Größe');
  await page.getByRole('button', { name: 'Argumentation strukturieren', exact: true }).click(); await expect(page.locator('#m702-help')).toContainText('Materialbefund → begründete Schlussfolgerung');
  await expect(page.locator('#m702-argument')).toHaveValue(''); await expect(page.locator('input:checked')).toHaveCount(2);
  await choice(page, id, false); await choice(page, 'energy_open'); await check(page); await expect(page.locator('#m702-outcome')).toHaveAttribute('data-status', 'correct');
});
test('M702 unmatched selection clarifies and a definite added contradiction stays red with correct parts preserved', async ({ page }) => {
  await open(page); await review(page); await choice(page, 'rate'); await choice(page, 'energy_open'); await choice(page, 'other'); await check(page);
  await expect(page.locator('#m702-outcome')).toHaveAttribute('data-status', 'clarify'); await expect(page.locator('#m702-feedback-other')).toContainText('kein fachliches Falsch');
  await choice(page, 'atp_pump'); await check(page); await expect(page.locator('#m702-outcome')).toHaveAttribute('data-status', 'incorrect');
  await expect(page.locator('#m702-feedback-energy_open')).toHaveAttribute('data-color', 'green'); await choice(page, 'atp_pump', false); await choice(page, 'other', false); await check(page);
  await expect(page.locator('#m702-outcome')).toHaveAttribute('data-status', 'correct');
});
test('M702 keyboard alone supports own writing, comparison, choice, feedback and revision', async ({ page, browserName }, info) => {
  await open(page); const key = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await info.attach('keyboard-platform.json', { body: JSON.stringify({ platform: process.platform, engine: browserName, key }), contentType: 'application/json' });
  await page.keyboard.press(key); await expect(page.locator('#m702-argument')).toBeFocused(); await page.keyboard.insertText('Synthetischer eigener Tastaturentwurf.');
  await page.keyboard.press(key); await expect(page.locator('#m702-investigation')).toBeFocused(); await page.keyboard.insertText('Synthetischer eigener Vergleichsvorschlag.');
  await page.keyboard.press(key); await page.keyboard.press('Enter'); await expect(page.getByRole('heading', { name: 'Kriterien für Selbst-, Partner- oder Lehrkraftprüfung' })).toBeFocused();
  await page.keyboard.press(key); await page.keyboard.press(key); await page.keyboard.press(key); await page.keyboard.press('Enter');
  await page.keyboard.press(key); await expect(page.locator('#m702-choice-rate')).toBeFocused(); await page.keyboard.press('Space');
  await page.keyboard.press(key); await page.keyboard.press(key); await expect(page.locator('#m702-choice-energy_open')).toBeFocused(); await page.keyboard.press('Space');
  for (let i = 0; i < 4; i++) await page.keyboard.press(key); await expect(page.getByRole('button', { name: 'Nur diese Aussagen prüfen' })).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.locator('#m702-outcome')).toBeFocused(); await expect(page.locator('#m702-outcome')).toHaveAttribute('data-status', 'correct');
});
test('M702 native pointer or touch alternative opens helpers and preserves individual corrections', async ({ page }, info) => {
  await open(page); const touch = Boolean(info.project.use.hasTouch);
  const activate = async (selector: string) => { const target = page.locator(selector); if (touch) await target.tap(); else await target.click(); };
  await info.attach('pointer-mode.json', { body: JSON.stringify({ touchEmulation: touch }), contentType: 'application/json' });
  await page.locator('#m702-argument').fill('Synthetischer eigener Touchentwurf.'); await review(page);
  await activate('#m702-choice-rate'); await activate('#m702-choice-active_proven'); await check(page); await expect(page.locator('#m702-outcome')).toHaveAttribute('data-status', 'incorrect');
  await activate('#m702-choice-active_proven'); await activate('#m702-choice-energy_open'); await check(page); await expect(page.locator('#m702-outcome')).toHaveAttribute('data-status', 'correct');
});
test('M702 text stays private, reload discards it and uncertain assistance never turns correct choices red', async ({ page, baseURL }) => {
  await open(page); const requests: string[] = []; page.on('request', request => requests.push(request.url()));
  await page.evaluate(() => { localStorage.setItem('foreign', 'keep'); sessionStorage.setItem('foreign', 'keep'); });
  const text = '<img src=x onerror="window.bad=true">SYNTHETIC-PRIVATE-M702'; await page.locator('#m702-argument').fill(text); await page.locator('#m702-investigation').fill(text); await review(page);
  await page.getByText('Festgehaltene Erstfassung anzeigen', { exact: true }).click(); await expect(page.locator('#m702-original-argument')).toHaveText(text); await expect(page.locator('main img')).toHaveCount(0);
  expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage }, cookies: document.cookie }))).toEqual({ local: { foreign: 'keep' }, session: { foreign: 'keep' }, cookies: '' });
  await page.reload(); await expect(page.locator('#m702-argument')).toHaveValue(''); await expect(page.locator('#m702-support')).toContainText('Frühere Hilfenutzung nach Neuladen nicht gesichert');
  await review(page); await choice(page, 'rate'); await choice(page, 'energy_open'); await check(page); await expect(page.locator('#m702-outcome')).toHaveAttribute('data-status', 'correct');
  expect(requests.every(url => url.startsWith(baseURL ?? 'invalid-base'))).toBe(true);
});
for (const width of [1440, 820, 390, 320]) for (const font of [100, 200]) test(`M702 readable ${width}px ${font}% text with actionable feedback`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 1000 }); await open(page); await page.evaluate(value => { document.documentElement.style.fontSize = `${value}%`; }, font);
  async function bounds() {
    const result = await page.evaluate(() => {
      const width = document.documentElement.clientWidth; const errors: string[] = [];
      const walk = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT);
      while (walk.nextNode()) {
        if (!walk.currentNode.textContent?.trim()) continue;
        const range = document.createRange(); range.selectNodeContents(walk.currentNode);
        for (const rect of range.getClientRects()) if (rect.width && (rect.left < -1 || rect.right > width + 1)) errors.push(walk.currentNode.textContent.slice(0, 80));
      }
      return { width, scroll: document.documentElement.scrollWidth, errors };
    });
    expect(result.scroll).toBeLessThanOrEqual(result.width); expect(result.errors).toEqual([]);
  }
  await bounds(); await page.screenshot({ path: info.outputPath('initial.png'), fullPage: true });
  await page.locator('#m702-argument').fill('Synthetischer eigener Entwurf.'); await review(page); await choice(page, 'rate'); await choice(page, 'atp_pump'); await check(page); await bounds();
  await expect(page.locator('#m702-feedback-rate')).toHaveAttribute('data-color', 'green'); await page.locator('#m702-feedback-atp_pump').screenshot({ path: info.outputPath('feedback.png') });
  const box = await page.getByRole('button', { name: 'Nur diese Aussagen prüfen' }).boundingBox(); expect(box?.height).toBeGreaterThanOrEqual(44);
});
