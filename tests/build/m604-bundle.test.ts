import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { assertPublicBundleText, listRegularFiles } from '../../tools/publish-policy.ts';

it('ships only the M6.04 runtime inside the authorized learner chunk, never its frozen expected answers', () => {
  const root = new URL('../../dist/',import.meta.url), files = listRegularFiles(root.pathname);
  const initial = files.find(path => /^assets\/index-.*\.js$/.test(path))!, learning = files.find(path => /^assets\/m602-entry-.*\.js$/.test(path))!;
  const source = (path: string) => readFileSync(new URL(path,root),'utf8');
  expect(source(initial)).not.toContain('m604-controlled-investigation/'); expect(source(learning)).toContain('m604-controlled-investigation/1.1.0');
  expect(source(learning)).not.toContain('m604-controlled-investigation/1.0.0');
  for (const path of files.filter(p => /\.(js|css|html)$/.test(p))) expect(source(path)).not.toMatch(/m604-preimplementation-cases|all-empty|alternative-valid-investigation|own-biological-tests|m604-session-tests/);
  expect(() => assertPublicBundleText(learning,'m604-controlled-investigation/1.1.0')).not.toThrow();
  for (const path of ['index.html',initial,'assets/other-abcd1234.js']) expect(() => assertPublicBundleText(path,'m604-controlled-investigation/1.1.0')).toThrow();
});
it('retains synthetic failure traces only through explicit test-output paths, without changing retry or worker policy', () => {
  const workflow = readFileSync('.github/workflows/pages.yml','utf8');
  for (const engine of ['Chromium','WebKit']) {
    const block = workflow.slice(workflow.indexOf(`- name: Retain synthetic ${engine} failure traces`)).split('\n      - name:')[0]!;
    expect(block).toContain('if: failure()'); expect(block).toContain('retention-days: 7');
    expect(block).toContain('test-results/**/trace.zip'); expect(block).toContain('test-results/**/error-context.md');
    expect(block).not.toMatch(/path: \.|\.env|attachments\/|workspace\/|include-hidden-files/);
  }
  expect(readFileSync('playwright.config.ts','utf8')).toContain('workers: 2');
  expect(readFileSync('playwright.config.ts','utf8')).toContain('retries: 0');
});
