import { expect, test } from '@playwright/test';

test('loads the built start page without external requests, broken assets or browser errors', async ({ page, baseURL }) => {
  const failures: string[] = [];
  const requests: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') failures.push(message.text()); });
  page.on('requestfailed', (request) => failures.push(`Request failed: ${request.url()}`));
  page.on('response', (response) => { if (response.status() >= 400) failures.push(`HTTP ${response.status()}`); });
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Zelllabor 11');
  await expect(page.getByText('Noch in Entwicklung.', { exact: false })).toBeVisible();
  await expect(page.getByText('Noch kein für den Unterricht freigegebenes Lernspiel.')).toBeVisible();
  await page.waitForLoadState('networkidle');
  expect(requests.length).toBeGreaterThanOrEqual(3);
  for (const url of requests) expect(url.startsWith(baseURL ?? 'invalid-base')).toBe(true);
  expect(failures).toEqual([]);
  expect(await page.locator('canvas, iframe, input, textarea').count()).toBe(0);
});

test('offers working keyboard navigation and a readable responsive layout', async ({ page, browserName }, testInfo) => {
  await page.goto('./');
  // R8: macOS WebKit uses Option-Tab for links with default platform preferences.
  // Assert real keyboard focus and Enter, never replace navigation with .focus().
  const key = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await testInfo.attach('start-navigation-platform.json', { body: JSON.stringify({ host: process.platform, engine: browserName, selectedKey: key }), contentType: 'application/json' });
  await page.keyboard.press(key);
  await expect(page.getByRole('link', { name: 'Zum Inhalt', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  const link = page.getByRole('link', { name: 'Zum Entwicklungsstand' });
  await page.keyboard.press(key);
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#entwicklungsstand$/);
  await expect(page.getByRole('heading', { name: 'Der Anfang ist gelegt.' })).toBeInViewport();
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.width);
  const target = await link.boundingBox();
  expect(target?.height).toBeGreaterThanOrEqual(44);
  await page.goto('./');
  await page.screenshot({ path: testInfo.outputPath('startpage.png'), fullPage: true });
});

test('does not persist pupil data or install service workers', async ({ page }) => {
  await page.goto('./');
  const state = await page.evaluate(async () => ({
    local: localStorage.length,
    session: sessionStorage.length,
    cookies: document.cookie,
    workers: (await navigator.serviceWorker.getRegistrations()).length,
  }));
  expect(state).toEqual({ local: 0, session: 0, cookies: '', workers: 0 });
});
