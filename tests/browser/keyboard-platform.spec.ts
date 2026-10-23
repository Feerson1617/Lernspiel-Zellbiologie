import { expect, test } from '@playwright/test';

test('records standard and platform link navigation separately and activates explicitly focused links', async ({ page, browserName, browser }, info) => {
  const observed = [];
  for (const key of ['Tab', 'Alt+Tab']) {
    await page.goto('./');
    await page.keyboard.press(key);
    observed.push({ key, active: await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.tagName === 'A' ? document.activeElement.textContent?.trim() : null })) });
  }
  const key = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await info.attach('keyboard-platform.json', { body: JSON.stringify({ engine: browserName, version: browser.version(), hostPlatform: process.platform, selectedKey: key, observed }), contentType: 'application/json' });
  await page.goto('./');
  await page.keyboard.press(key);
  await expect(page.getByRole('link', { name: 'Zum Inhalt', exact: true })).toBeFocused();
  await page.getByRole('link', { name: 'Zum Inhalt', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.getByRole('link', { name: 'Zum Entwicklungsstand' }).focus();
  await page.keyboard.press('Enter');
  expect(new URL(page.url()).hash).toBe('#entwicklungsstand');
});
