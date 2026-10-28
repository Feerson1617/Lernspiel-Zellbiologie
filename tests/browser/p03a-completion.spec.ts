import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page, baseURL }) => {
  const list: string[] = []; errors.set(page, list);
  page.on('pageerror', error => list.push(error.message));
  page.on('console', message => { if (message.type() === 'error') list.push(message.text()); });
  page.on('requestfailed', request => list.push(request.url()));
  page.on('request', request => { if (!request.url().startsWith(baseURL!)) list.push(`External request: ${request.url()}`); });
  page.on('response', response => { if (response.status() >= 400) list.push(`HTTP ${response.status()}`); });
});
test.afterEach(async ({ page }) => { expect(errors.get(page)).toEqual([]); });

const questions = [
  { id: 'prior-0', label: 'Räume und Grenzen', correct: 'Tonoplast', wrong: 'Zellwand' },
  { id: 'prior-1', label: 'Einzelbewegung und Nettobilanz', correct: 'Ja, gleich viele in beide Richtungen', wrong: 'Nein, alle Moleküle stehen still' },
  { id: 'prior-2', label: 'Gesamtwasserpotenziale vergleichen', correct: '−200 000 Pa', wrong: '−500 000 Pa' },
] as const;
for (const question of questions) {
  test(`prior selection invalidates all three transitions: ${question.label}`, async ({ page }) => {
    await page.goto('./');
    await page.getByRole('link', { name: 'Erste Übung ausprobieren – Wasserhaushalt der Zelle' }).click();
    await page.getByText('Kurzen Vorwissencheck öffnen', { exact: true }).click();
    const select = page.getByLabel(question.label, { exact: true });
    const message = page.locator(`#${question.id}`).locator('..').locator('.knowledge-explanation');
    const check = page.getByRole('button', { name: 'Vorwissen prüfen', exact: true });
    await select.selectOption({ label: question.correct }); await check.click();
    await expect(message).toContainText('Deine Einschätzung passt.');
    for (const [value, expected] of [[question.wrong, 'Vergleiche deine Einschätzung'], [question.correct, 'Deine Einschätzung passt.'], ['', 'Du kannst auch ohne Auswahl weiterarbeiten.']] as const) {
      await select.focus();
      await select.selectOption(value ? { label: value } : '');
      await expect(select).toBeFocused();
      await expect(message).toContainText('Auswahl geändert');
      await expect(message).not.toContainText('Deine Einschätzung passt.');
      await expect(message).not.toContainText('Vergleiche deine Einschätzung');
      await expect(page.getByRole('status').filter({ hasText: 'Auswahl geändert' })).toBeAttached();
      await check.click();
      await expect(message).toContainText(expected);
    }
    // Revealed explanations stay supported even if the choices are cleared.
    for (const [field, value] of Object.entries({ process: 'Osmose', direction: 'nach außen', volume: 'nimmt ab' })) await page.locator(`#learner-${field}`).fill(value);
    await page.getByRole('button', { name: 'Drei Antworten prüfen', exact: true }).click();
    const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('zelllabor11.progress.v1')!));
    expect(progress.attempts[0].assistance).toBe('hint');
  });
}

async function exercise(page: import('@playwright/test').Page) {
  await page.goto('./'); await page.getByRole('link', { name: 'Erste Übung ausprobieren – Wasserhaushalt der Zelle' }).click();
  await page.locator('#learner-process').waitFor();
}
async function answer(page: import('@playwright/test').Page) {
  for (const [field, value] of Object.entries({ process: 'Osmose', direction: 'nach außen', volume: 'nimmt ab' })) await page.locator(`#learner-${field}`).fill(value);
  await page.getByRole('button', { name: 'Drei Antworten prüfen', exact: true }).click();
}

test('complete success has one next step and retains optional detailed field feedback', async ({ page }) => {
  await exercise(page); await answer(page);
  const feedback = page.getByRole('region', { name: 'Gesamtrückmeldung', exact: true });
  await expect(feedback).toHaveAttribute('data-status', 'correct');
  await expect(feedback.getByRole('heading', { level: 2 })).toHaveCount(1);
  await expect(feedback).toContainText('Fachbegriff, Nettorichtung und Vakuolenvolumen');
  expect(await feedback.innerText()).not.toMatch(/Prüfe die|Nächster Schritt/);
  const next = feedback.getByRole('link'); await expect(next).toHaveCount(1);
  for (const field of ['Fachbegriff', 'Nettorichtung', 'Vakuolenvolumen']) {
    const summary = feedback.getByText(`Fachliche Erklärung: ${field}`, { exact: true });
    await summary.click(); await expect(summary.locator('..').getByText('Bezug zum Material', { exact: true })).toBeVisible(); await summary.click();
  }
  await next.click(); await expect(page.locator('#weiterdenken')).toBeFocused();
  await expect(page).toHaveURL(/#\/m602$/);
});

for (const kind of ['hint', 'notebook'] as const) {
  test(`help after correct: ${kind} preserves the old receipt and explains the new revision`, async ({ page }) => {
    await exercise(page); await answer(page);
    const before = await page.evaluate(() => localStorage.getItem('zelllabor11.progress.v1'));
    await page.getByRole('button', { name: kind === 'hint' ? 'Hinweis: Nettorichtung' : 'Beispiellösung im Heftvergleich ansehen', exact: true }).click();
    const feedback = page.getByRole('region', { name: 'Gesamtrückmeldung', exact: true });
    await expect(feedback).toHaveAttribute('data-status', 'stale');
    await expect(feedback).toHaveAttribute('data-color', 'neutral');
    await expect(feedback).toContainText('bei der damaligen Abgabe fachlich richtig');
    await expect(feedback).toContainText('nicht rückwirkend biologisch falsch');
    await expect(feedback).toContainText('erneute Abgabe');
    expect(await page.evaluate(() => localStorage.getItem('zelllabor11.progress.v1'))).toBe(before);
    await page.getByRole('button', { name: 'Drei Antworten prüfen', exact: true }).click();
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem('zelllabor11.progress.v1')!));
    expect(after.attempts).toHaveLength(2);
    expect(after.attempts[0]).toEqual(JSON.parse(before!).attempts[0]);
    expect(after.attempts[1].assistance).toBe(kind === 'hint' ? 'hint' : 'solution_viewed');
    await expect(feedback).toHaveAttribute('data-status', 'correct');
  });
}

test('notebook self-reflection is voluntary and never grades, stores or certifies a written explanation', async ({ page }) => {
  await exercise(page);
  await page.getByText('Nach dem Schreiben: Selbst- oder Partnerprüfung öffnen', { exact: true }).click();
  const reflection = page.locator('.notebook-reflection');
  await expect(reflection).toContainText('keine automatische Fachbewertung');
  await expect(reflection).toContainText('Zahlen und Pa');
  await expect(reflection).toContainText('Zellmembran');
  await expect(reflection).toContainText('Tonoplast');
  await expect(reflection).toContainText('Wasserbilanz');
  await expect(reflection).toContainText('keine zwangsläufig sichtbare Ablösung');
  const checkboxes = reflection.getByRole('checkbox'); await expect(checkboxes).toHaveCount(4);
  for (let i = 0; i < 4; i++) { await checkboxes.nth(i).focus(); await page.keyboard.press('Space'); await expect(checkboxes.nth(i)).toBeChecked(); }
  await expect(page.getByRole('region', { name: 'Gesamtrückmeldung', exact: true })).toHaveAttribute('data-status', 'empty');
  expect(await page.evaluate(() => localStorage.getItem('zelllabor11.progress.v1'))).toBeNull();
  await answer(page);
  const before = await page.evaluate(() => localStorage.getItem('zelllabor11.progress.v1'));
  await checkboxes.nth(0).uncheck();
  expect(await page.evaluate(() => localStorage.getItem('zelllabor11.progress.v1'))).toBe(before);
});

test('responsive material has readable HTML boundaries, grouped SI values and short focus-preserving jumps', async ({ page }, info) => {
  await exercise(page);
  const material = page.getByRole('region', { name: 'Frage und Material', exact: true });
  const legend = material.locator('.cell-legend');
  await expect(legend).toContainText('Zellwand'); await expect(legend).toContainText('Zellmembran'); await expect(legend).toContainText('Tonoplast');
  expect(await legend.evaluate(el => Number.parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
  const table = material.getByRole('table');
  await expect(table).toContainText('-120.000 Pa'); await expect(table).toContainText('-300.000 Pa'); await expect(table).toContainText('-700.000 Pa');
  if (page.viewportSize()!.width <= 1000) {
    expect(await page.locator('.learning-workspace').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(1);
  }
  await page.getByRole('link', { name: 'Vom Material zu deinen Antworten', exact: true }).click();
  await expect(page.locator('#lernantworten')).toBeFocused();
  await page.getByRole('link', { name: 'Material noch einmal ansehen', exact: true }).click();
  await expect(material).toBeFocused(); await expect(page).toHaveURL(/#\/m602$/);
  await page.addStyleTag({ content: 'html {font-size:200% !important}' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('r10-200-percent.png'), fullPage: true });
});
