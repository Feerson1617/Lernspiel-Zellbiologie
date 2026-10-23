import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { FOURTH_CASES, FOURTH_RETRACTION_CASES, executeFourth, acceptedFourth, FOURTH_VERSIONS, FOURTH_OSMOSIS_CONTEXT, FOURTH_TONOPLAST_CONTEXT } from '../helpers/p02b-fourth.ts';
import type { TaskContext } from '../../src/domain/task-context.ts';
type API = typeof import('../../src/assessment/osmosis.ts') & typeof import('../../src/assessment/tonoplast.ts')
  & typeof import('../../src/assessment/osmosis-feedback.ts') & typeof import('../../src/assessment/feedback.ts')
  & typeof import('../../src/domain/task-context.ts') & typeof import('../../src/ui/feedback-presentation.ts');
let source: string;
const cases = [...FOURTH_CASES, ...FOURTH_RETRACTION_CASES];
test.beforeAll(async () => { source = await buildDomainModule(); });
test('checks all 956 corpus inputs and 12 retraction diagnostics against Node in the actual guarded bundle', async ({ page, baseURL }) => {
  const errors: string[] = [], external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith(baseURL!)) external.push(request.url()); });
  await page.route(`${baseURL}fourth-revision.mjs`, route => route.fulfill({ contentType: 'text/javascript', body: source }));
  await page.goto('./');
  await page.evaluate(() => { localStorage.setItem('foreign-test-sentinel', 'preserve'); });
  const results = await page.evaluate(async ({ url, versions, osmosis, tonoplast, cases }) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const oe = api.createOsmosisEvaluator(versions), te = api.createTonoplastEvaluator(versions);
    return cases.map(f => {
      const context = JSON.parse(f.field === 'osmosis' ? osmosis : tonoplast) as TaskContext;
      const result = (f.field === 'osmosis' ? oe : te).evaluate(context, { fieldId: f.field === 'osmosis' ? 'process' : 'term', text: f.text }, 'independent');
      return { result, feedback: (f.field === 'osmosis' ? api.getOsmosisFeedback : api.getTonoplastFeedback)(result.feedbackCode), bound: api.isResultForContext(result, context), display: api.STATUS_PRESENTATION[result.status] };
    });
  }, { url: `${baseURL}fourth-revision.mjs`, versions: FOURTH_VERSIONS, osmosis: JSON.stringify(FOURTH_OSMOSIS_CONTEXT), tonoplast: JSON.stringify(FOURTH_TONOPLAST_CONTEXT), cases });
  expect(results).toHaveLength(968);
  for (const [i, f] of cases.entries()) {
    const actual = results[i]!;
    expect(actual.result, f.id).toEqual(executeFourth(f).result);
    expect(acceptedFourth(f), f.id).toContain(actual.result.status);
    expect(actual.bound).toBe(true);
    expect(actual.feedback, f.id).toBe(executeFourth(f).feedback);
    expect(actual.display.color).toBe(actual.result.status === 'correct' ? 'green' : actual.result.status === 'incorrect' ? 'red' : 'yellow');
    expect(actual.display.symbol).toBeTruthy(); expect(actual.display.label).toBeTruthy();
    for (const e of actual.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
  }
  expect(errors).toEqual([]); expect(external).toEqual([]);
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({ 'foreign-test-sentinel': 'preserve' });
  expect(await page.evaluate(() => Object.hasOwn(window, 'auditLeak'))).toBe(false);
});
