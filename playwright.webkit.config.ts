import { defineConfig } from '@playwright/test';
import original from './playwright.config.ts';

/** R8 approved equivalent navigation repair: macOS WebKit Option-Tab + Enter.
 * Raw standard/Option-Tab observations remain separate platform evidence. */
const suite = process.env['WEBKIT_SUITE'] ?? 'all';
const additional = ['**/p02b-third.spec.ts', '**/keyboard-platform.spec.ts', '**/p02b-fourth.spec.ts', '**/p02b-r3.spec.ts', '**/p02b-r4.spec.ts', '**/p02b-r5.spec.ts', '**/p02b-r6.spec.ts', '**/p02b-r7.spec.ts', '**/naming-v1.spec.ts', '**/p02b-r8.spec.ts'];
const projects = original.projects;
if (!projects?.length) throw new Error('The standard browser profiles must be present.');
export default defineConfig({
  ...original,
  ...(suite === 'baseline' ? { testIgnore: additional } : suite === 'additional' ? { testMatch: additional } : {}),
  reporter: [['list'], ['json', { outputFile: `qa/generated/webkit-${suite}.json` }]],
  metadata: { hostPlatform: process.platform, keyboardProfile: process.platform === 'darwin' ? 'macos-webkit-option-tab' : 'standard-tab', suite },
  use: { ...original.use, browserName: 'webkit', launchOptions: {} },
  projects: projects.map(project => {
    if (!project.name) throw new Error('Every browser profile needs its original name.');
    return { ...project, name: project.name.replace('chromium', 'webkit'), use: { ...project.use, browserName: 'webkit', launchOptions: {} } };
  }),
});
