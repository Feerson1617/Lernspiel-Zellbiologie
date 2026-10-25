import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { namingContext } from '../helpers/naming-v1.ts';
import type { NamingSession } from '../../src/application/naming-session.ts';
type Page = import('@playwright/test').Page;
type APIWindow = Window & { lab: { session: NamingSession; store: ReturnType<typeof import('../../src/persistence/progress-store.ts').createProgressStore> } };
let openLab: (page: Page, base: string, task: 'Z1.02' | 'M6.02', fault?: string) => Promise<void>;
test.beforeAll(async () => {
  const code = await buildDomainModule(), fixture = readFileSync('tests/browser/naming-v1.spec.ts', 'utf8');
  const original = fixture.slice(fixture.indexOf('async function openLab('), fixture.indexOf('\nfor (const taskId of'));
  openLab = new Function('source', 'namingContext', 'expect', `return (${stripTypeScriptTypes(original)})`)(code, namingContext, expect) as typeof openLab;
});
for (const task of ['Z1.02', 'M6.02'] as const) for (const help of ['hint', 'wordbank', 'clarified', 'solution_viewed'] as const) for (const storage of ['empty', 'stored-A', 'quota', 'denied'] as const) for (const navigation of ['reload', 'back'] as const) {
  test(`${task} ${help}, ${storage}, ${navigation}: unsubmitted B keeps provenance boundary`, async ({ page, baseURL }, info) => {
    await openLab(page, baseURL!, task, storage === 'quota' || storage === 'denied' ? storage : '');
    const term = page.getByRole('textbox', { name: 'Fachbegriff', exact: true });
    const check = page.getByRole('button', { name: 'Begriff prüfen', exact: true });
    const feedback = page.getByRole('region', { name: 'Rückmeldung', exact: true });
    const helpPanel = page.getByRole('region', { name: 'Überarbeiten und Hilfen' });
    await page.evaluate(() => localStorage.setItem('foreign-r9', 'keep'));
    if (storage === 'stored-A') {
      await term.fill(task === 'Z1.02' ? 'Tonoplast' : 'Osmose'); await check.click();
      if (task === 'M6.02') await page.evaluate(() => {
        const c = (window as unknown as APIWindow).lab.session.getState().context;
        localStorage.setItem('zelllabor11.progress.v1', JSON.stringify({ schemaVersion: 1, contentVersion: c.contentVersion,
          attempts: [{ attemptId: 'historical-A', taskId: c.taskId, instanceId: c.instanceId, taskVersion: c.taskVersion,
            rubricVersion: c.rubricVersion, modelVersion: c.modelVersion, status: 'partial', assistance: 'independent' }] }));
      });
    }
    await page.getByRole('button', { name: 'Neuen Materialfall starten', exact: true }).click();
    await page.getByRole('button', { name: 'Hinweis anzeigen', exact: true }).click();
    if (help !== 'hint') await page.getByRole('button', { name: 'Wortbank öffnen', exact: true }).click();
    if (help === 'clarified') await page.getByRole('button', { name: `Begriff wählen: ${task === 'Z1.02' ? 'Tonoplast' : 'Osmose'}`, exact: true }).click();
    if (help === 'solution_viewed') await page.getByRole('button', { name: 'Lösung ausdrücklich ansehen', exact: true }).click();
    const before = await page.evaluate(() => ({ state: (window as unknown as APIWindow).lab.session.getState(), storage: localStorage.getItem('zelllabor11.progress.v1') }));
    expect(before.state.assistance).toBe(help);
    expect(before.state.outcomes.filter(o => o.submission.context.instanceId === before.state.context.instanceId)).toHaveLength(0);
    if (storage !== 'stored-A') expect(before.storage).toBeNull();
    if (navigation === 'reload') await page.reload();
    else { await page.goto('./'); await page.goBack(); }
    await expect(page.getByRole('heading', { name: 'Fachbegriff prüfen', exact: true })).toBeVisible();
    const resumed = await page.evaluate(() => (window as unknown as APIWindow).lab.session.getState());
    // A real retained BFCache RAM ledger must preserve help; a reconstructed
    // document must preserve uncertainty. Neither may assert independence.
    if (resumed.events.length) expect(resumed.assistance).toBe(help);
    else expect(resumed.history).toBe('history_unverified');
    if (resumed.context.instanceId !== before.state.context.instanceId) await page.getByRole('button', { name: 'Neuen Materialfall starten', exact: true }).click();
    await term.fill(task === 'Z1.02' ? 'Tonoplast' : 'Osmose'); await check.click();
    const after = await page.evaluate(() => ({ state: (window as unknown as APIWindow).lab.session.getState(), storage: localStorage.getItem('zelllabor11.progress.v1') }));
    expect(after.state.context).toEqual(before.state.context);
    expect(after.state.latest?.termResult.status).toBe('correct');
    await expect(feedback).not.toContainText('Ohne Hilfe beantwortet'); await expect(helpPanel).not.toContainText('Ohne Hilfe beantwortet');
    if (!resumed.events.length) {
      expect(after.state.history).toBe('history_unverified'); await expect(feedback).toHaveAttribute('data-status', 'technical');
      await expect(feedback).toContainText(/frühere Hilfen/i);
      expect(after.storage).toBe(before.storage);
    } else expect(after.state.assistance).toBe(help);
    if (task === 'M6.02') expect(after.state.latest?.pendingCriteria).toEqual(['M6.02.C02', 'M6.02.C03']);
    if (after.storage) {
      const saved = JSON.parse(after.storage) as { attempts: { instanceId: string; assistance: string; status: string }[] };
      expect(saved.attempts.some(a => a.instanceId === before.state.context.instanceId && a.assistance === 'independent' && a.status === 'correct')).toBe(false);
      expect(after.storage).not.toMatch(/termText|contextHash|events|predecessor/);
    }
    expect(await page.evaluate(() => localStorage.getItem('foreign-r9'))).toBe('keep');
    await info.attach('r9-provenance.json', { body: JSON.stringify({ task, help, storage, navigation, before, after }), contentType: 'application/json' });
    if (storage === 'empty' && help === 'solution_viewed') await feedback.screenshot({ path: info.outputPath(`${task}-${navigation}-uncertain.png`) });
  });
}
for (const task of ['Z1.02', 'M6.02'] as const) test(`${task}: trusted fresh A to B is a positive provenance counterexample`, async ({ page, baseURL }) => {
  await openLab(page, baseURL!, task);
  await page.getByRole('button', { name: 'Neuen Materialfall starten', exact: true }).click();
  await page.getByRole('textbox', { name: 'Fachbegriff', exact: true }).fill(task === 'Z1.02' ? 'Tonoplast' : 'Osmose');
  await page.getByRole('button', { name: 'Begriff prüfen', exact: true }).click();
  const state = await page.evaluate(() => (window as unknown as APIWindow).lab.session.getState());
  expect(state.history).toBe('verified'); expect(state.latest?.support.assistance).toBe('independent');
  await expect(page.getByRole('region', { name: 'Rückmeldung', exact: true })).toHaveAttribute('data-status', task === 'Z1.02' ? 'correct' : 'partial');
});
