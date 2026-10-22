import { defineConfig } from '@playwright/test';

const executablePath = process.env['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH'];

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env['CI']),
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'qa/generated/playwright.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173/Lernspiel-Zellbiologie/',
    browserName: 'chromium',
    reducedMotion: 'reduce',
    launchOptions: executablePath ? { executablePath } : {},
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'tablet-chromium', use: { viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: 'mobile-chromium', use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/Lernspiel-Zellbiologie/',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
