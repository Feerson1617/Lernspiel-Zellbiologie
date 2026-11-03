import { expect, test } from '@playwright/test';
import assert from 'node:assert/strict';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { THIRD_CASES, executeThird, acceptedThird, THIRD_VERSIONS, THIRD_OSMOSIS_CONTEXT, THIRD_TONOPLAST_CONTEXT } from '../helpers/p02b-third.ts';
import type { TaskContext } from '../../src/domain/task-context.ts';
type API = typeof import('../../src/assessment/osmosis.ts') & typeof import('../../src/assessment/tonoplast.ts')
  & typeof import('../../src/assessment/osmosis-feedback.ts') & typeof import('../../src/assessment/feedback.ts')
  & typeof import('../../src/domain/task-context.ts') & typeof import('../../src/ui/feedback-presentation.ts');
let source: string;
test.beforeAll(async () => { source = await buildDomainModule(); });
test('checks all 212 supplied and 450 fresh/metamorphic inputs against Node in the actual guarded bundle', async ({ page, baseURL }) => {
  const errors: string[] = [], external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith(baseURL!)) external.push(request.url()); });
  await page.route(`${baseURL}third-revision.mjs`, route => route.fulfill({ contentType: 'text/javascript', body: source }));
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
  }, { url: `${baseURL}third-revision.mjs`, versions: THIRD_VERSIONS, osmosis: JSON.stringify(THIRD_OSMOSIS_CONTEXT), tonoplast: JSON.stringify(THIRD_TONOPLAST_CONTEXT), cases: THIRD_CASES });
  expect(results).toHaveLength(662);
  for (const [i, f] of THIRD_CASES.entries()) {
    const actual = results[i]!, expected = executeThird(f);
    // Pure Node comparisons need no per-assertion browser trace step. Keep the
    // full 662-case sequence in one browser, every check and original case ID.
    assert.deepStrictEqual(actual.result, expected.result, f.id);
    assert.ok(acceptedThird(f).includes(actual.result.status), f.id);
    assert.equal(actual.bound, true, f.id);
    assert.equal(actual.feedback, expected.feedback, f.id);
    assert.equal(actual.display.color, actual.result.status === 'correct' ? 'green' : actual.result.status === 'incorrect' ? 'red' : 'yellow', f.id);
    assert.ok(actual.display.symbol, f.id); assert.ok(actual.display.label, f.id);
    for (const e of actual.result.criteria[0]!.evidence) if (e.kind === 'input_span') assert.equal(f.text.slice(e.start, e.end), e.value, f.id);
  }
  expect(errors).toEqual([]); expect(external).toEqual([]);
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({ 'foreign-test-sentinel': 'preserve' });
  expect(await page.evaluate(() => Object.hasOwn(window, 'auditLeak'))).toBe(false);
});
