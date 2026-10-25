import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { R5_CASES, R5_KNOWN, executeR5, expectedRuntimeR5, acceptedKnownR5, R5_VERSIONS, R5_OSMOSIS_CONTEXT, R5_TONOPLAST_CONTEXT } from '../helpers/p02b-r5.ts';
import type { TaskContext } from '../../src/domain/task-context.ts';
type API = typeof import('../../src/assessment/osmosis.ts') & typeof import('../../src/assessment/tonoplast.ts')
  & typeof import('../../src/assessment/osmosis-feedback.ts') & typeof import('../../src/assessment/feedback.ts')
  & typeof import('../../src/domain/task-context.ts') & typeof import('../../src/ui/feedback-presentation.ts');
let source: string;
const cases = [...R5_CASES.map(f => ({ ...f, source: 'new' })), ...R5_KNOWN.map(f => ({ ...f, source: 'known' }))];
test.beforeAll(async () => { source = await buildDomainModule(); });
test('checks all 2823 supplied, known and self-check records against Node in the actual guarded bundle', async ({ page, baseURL, browser }, info) => {
  test.setTimeout(90_000); // Full browser + Node parity for 2823 actual evaluations.
  const errors: string[] = [], external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith(baseURL!)) external.push(request.url()); });
  await page.route(`${baseURL}r5-revision.mjs`, route => route.fulfill({ contentType: 'text/javascript', body: source }));
  await page.goto('./');
  await page.evaluate(() => { localStorage.setItem('foreign-test-sentinel', 'preserve'); });
  const browserStart = performance.now();
  const results = await page.evaluate(async ({ url, versions, osmosis, tonoplast, cases }) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const oe = api.createOsmosisEvaluator(versions), te = api.createTonoplastEvaluator(versions);
    return cases.map(f => {
      const context = JSON.parse(f.field === 'osmosis' ? osmosis : tonoplast) as TaskContext;
      const result = (f.field === 'osmosis' ? oe : te).evaluate(context, { fieldId: f.field === 'osmosis' ? 'process' : 'term', text: f.text }, 'independent');
      return { result, feedback: (f.field === 'osmosis' ? api.getOsmosisFeedback : api.getTonoplastFeedback)(result.feedbackCode), bound: api.isResultForContext(result, context), display: api.STATUS_PRESENTATION[result.status] };
    });
  }, { url: `${baseURL}r5-revision.mjs`, versions: R5_VERSIONS, osmosis: JSON.stringify(R5_OSMOSIS_CONTEXT), tonoplast: JSON.stringify(R5_TONOPLAST_CONTEXT), cases });
  expect(results).toHaveLength(2823);
  const browserMs = performance.now() - browserStart;
  const nodeStart = performance.now();
  for (const [i, f] of cases.entries()) {
    const actual = results[i]!;
    const node = executeR5(f);
    expect(actual.result, f.id).toEqual(node.result);
    expect((f.source === 'new' ? expectedRuntimeR5(f) : acceptedKnownR5(f)), f.id).toContain(actual.result.status);
    expect(actual.bound).toBe(true);
    expect(actual.feedback, f.id).toBe(node.feedback);
    expect(actual.display.color).toBe(actual.result.status === 'correct' ? 'green' : actual.result.status === 'incorrect' ? 'red' : 'yellow');
    expect(actual.display.symbol).toBeTruthy(); expect(actual.display.label).toBeTruthy();
    for (const e of actual.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
  }
  await info.attach('runtime-parity-timing.json', { body: JSON.stringify({ file: info.file.split('/').at(-1), profile: info.project.name, engine: browser.version(), cases: cases.length, browserMs, nodeAndAssertionsMs: performance.now() - nodeStart }), contentType: 'application/json' });
  expect(errors).toEqual([]); expect(external).toEqual([]);
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({ 'foreign-test-sentinel': 'preserve' });
  expect(await page.evaluate(() => Object.hasOwn(window, 'auditLeak'))).toBe(false);
});
