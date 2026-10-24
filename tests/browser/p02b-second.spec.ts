import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { FIELD_SCOPE_CASES, REVIEW_OSMOSIS_CONTEXT, REVIEW_TONOPLAST_CONTEXT, REVIEW_VERSIONS, SECOND_CASES, runSecondCase } from '../helpers/p02b-second.ts';
import type { TaskContext } from '../../src/domain/task-context.ts';

type API = typeof import('../../src/assessment/osmosis.ts') & typeof import('../../src/assessment/tonoplast.ts')
  & typeof import('../../src/assessment/osmosis-feedback.ts') & typeof import('../../src/assessment/feedback.ts')
  & typeof import('../../src/domain/task-context.ts') & typeof import('../../src/ui/feedback-presentation.ts');
let source: string;
test.beforeAll(async () => { source = await buildDomainModule(); });
test('runs the complete 156-case countercheck and 80 fresh cases through both real bundled APIs, matching Node and original evidence', async ({ page, baseURL }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith(baseURL!)) external.push(request.url()); });
  await page.route(`${baseURL}second-revision.mjs`, route => route.fulfill({ contentType: 'text/javascript', body: source }));
  await page.goto('./');
  const fixtures = [...SECOND_CASES, ...FIELD_SCOPE_CASES];
  const actual = await page.evaluate(async ({ url, versions, osmosis, tonoplast, inputs }) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const oe = api.createOsmosisEvaluator(versions), te = api.createTonoplastEvaluator(versions);
    return inputs.map(f => {
      const context = JSON.parse(f.field === 'osmosis' ? osmosis : tonoplast) as TaskContext;
      const result = (f.field === 'osmosis' ? oe : te).evaluate(context, { fieldId: f.field === 'osmosis' ? 'process' : 'term', text: f.text }, 'independent');
      return { result, bound: api.isResultForContext(result, context), presentation: api.STATUS_PRESENTATION[result.status],
        feedback: (f.field === 'osmosis' ? api.getOsmosisFeedback : api.getTonoplastFeedback)(result.feedbackCode) };
    });
  }, { url: `${baseURL}second-revision.mjs`, versions: REVIEW_VERSIONS, osmosis: JSON.stringify(REVIEW_OSMOSIS_CONTEXT), tonoplast: JSON.stringify(REVIEW_TONOPLAST_CONTEXT), inputs: fixtures });
  expect(actual).toHaveLength(256);
  for (const [i, f] of fixtures.entries()) {
    const value = actual[i]!;
    expect(value.result, f.id).toEqual(runSecondCase(f.field, f.text));
    expect(f.expected, f.id).toContain(value.result.status);
    expect(value.bound).toBe(true);
    expect(value.presentation.color).toBe(value.result.status === 'correct' ? 'green' : value.result.status === 'incorrect' ? 'red' : 'yellow');
    expect(value.presentation.symbol).toBeTruthy(); expect(value.presentation.label).toBeTruthy();
    expect(value.feedback.length).toBeGreaterThan(20);
    for (const e of value.result.criteria[0]!.evidence) if (e.kind === 'input_span') expect(f.text.slice(e.start, e.end)).toBe(e.value);
  }
  expect(errors).toEqual([]); expect(external).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await expect(page.getByText('Noch in Entwicklung.', { exact: true })).toBeVisible();
});
