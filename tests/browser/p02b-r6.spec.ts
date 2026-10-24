import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { R6_CASES, R6_KNOWN, executeR6, expectedRuntimeR6, acceptedKnownR6, R6_VERSIONS, R6_OSMOSIS_CONTEXT, R6_TONOPLAST_CONTEXT } from '../helpers/p02b-r6.ts';
import type { TaskContext } from '../../src/domain/task-context.ts';
type API = typeof import('../../src/assessment/osmosis.ts') & typeof import('../../src/assessment/tonoplast.ts')
  & typeof import('../../src/assessment/osmosis-feedback.ts') & typeof import('../../src/assessment/feedback.ts')
  & typeof import('../../src/domain/task-context.ts') & typeof import('../../src/ui/feedback-presentation.ts');
let source: string;
const cases = [...R6_CASES.map(f => ({ ...f, source: 'new' })), ...R6_KNOWN.map(f => ({ ...f, source: 'known' }))];
test.beforeAll(async () => { source = await buildDomainModule(); });
// Bound batches, with every record retained; existing suites and timeouts stay intact.
for (let offset = 0; offset < cases.length; offset += 900) {
const batch = cases.slice(offset, offset + 900);
test(`checks R6 batch ${offset / 900 + 1} of 4 against Node in the guarded bundle`, async ({ page, baseURL, browser }, info) => {
  test.setTimeout(90_000); // Browser + Node parity for at most 900 actual evaluations; no timeout increase.
  const errors: string[] = [], external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith(baseURL!)) external.push(request.url()); });
  await page.route(`${baseURL}r6-revision.mjs`, route => route.fulfill({ contentType: 'text/javascript', body: source }));
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
  }, { url: `${baseURL}r6-revision.mjs`, versions: R6_VERSIONS, osmosis: JSON.stringify(R6_OSMOSIS_CONTEXT), tonoplast: JSON.stringify(R6_TONOPLAST_CONTEXT), cases: batch });
  expect(results).toHaveLength(batch.length);
  const browserMs = performance.now() - browserStart;
  const nodeStart = performance.now();
  for (const [i, f] of batch.entries()) {
    const actual = results[i]!;
    const node = executeR6(f);
    expect(actual.result, f.id).toEqual(node.result);
    expect((f.source === 'new' ? expectedRuntimeR6(f) : acceptedKnownR6(f)), f.id).toContain(actual.result.status);
    expect(actual.bound).toBe(true);
    expect(actual.feedback, f.id).toBe(node.feedback);
    expect(actual.display.color).toBe(actual.result.status === 'correct' ? 'green' : actual.result.status === 'incorrect' ? 'red' : 'yellow');
    expect(actual.display.symbol).toBeTruthy(); expect(actual.display.label).toBeTruthy();
    for (const e of actual.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
  }
  await info.attach('runtime-parity-timing.json', { body: JSON.stringify({ file: info.file.split('/').at(-1), profile: info.project.name, engine: browser.version(), cases: batch.length, browserMs, nodeAndAssertionsMs: performance.now() - nodeStart }), contentType: 'application/json' });
  expect(errors).toEqual([]); expect(external).toEqual([]);
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({ 'foreign-test-sentinel': 'preserve' });
  expect(await page.evaluate(() => Object.hasOwn(window, 'auditLeak'))).toBe(false);
});

}
