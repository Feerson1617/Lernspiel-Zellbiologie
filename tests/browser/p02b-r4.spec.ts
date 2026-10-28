import { expect, test } from '@playwright/test';
import { parityBlocks, assertParity } from '../helpers/parity-blocks.ts';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { R4_CASES, R4_KNOWN, executeR4, expectedRuntimeR4, acceptedKnownR4, R4_VERSIONS, R4_OSMOSIS_CONTEXT, R4_TONOPLAST_CONTEXT } from '../helpers/p02b-r4.ts';
import type { TaskContext } from '../../src/domain/task-context.ts';
type API = typeof import('../../src/assessment/osmosis.ts') & typeof import('../../src/assessment/tonoplast.ts')
  & typeof import('../../src/assessment/osmosis-feedback.ts') & typeof import('../../src/assessment/feedback.ts')
  & typeof import('../../src/domain/task-context.ts') & typeof import('../../src/ui/feedback-presentation.ts');
let source: string;
const cases = [...R4_CASES.map(f => ({ ...f, source: 'new' })), ...R4_KNOWN.map(f => ({ ...f, source: 'known' }))];
test.beforeAll(async () => { source = await buildDomainModule(); });
for (const block of parityBlocks(cases, 2402)) test(`checks original positions ${block.start}–${block.start + block.cases.length - 1} of 2402 against Node`, async ({ page, baseURL, browser }, info) => {
  test.setTimeout(90_000); // Full browser + Node parity for 2402 actual evaluations.
  const errors: string[] = [], external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith(baseURL!)) external.push(request.url()); });
  await page.route(`${baseURL}r4-revision.mjs`, route => route.fulfill({ contentType: 'text/javascript', body: source }));
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
  }, { url: `${baseURL}r4-revision.mjs`, versions: R4_VERSIONS, osmosis: JSON.stringify(R4_OSMOSIS_CONTEXT), tonoplast: JSON.stringify(R4_TONOPLAST_CONTEXT), cases: block.cases });
  expect(results).toHaveLength(block.cases.length);
  const browserMs = performance.now() - browserStart;
  const nodeStart = performance.now();
  for (const [i, f] of block.cases.entries()) {
    const actual = results[i]!;
    const node = executeR4(f);
    assertParity(actual, node, (f.source === 'new' ? expectedRuntimeR4(f) : acceptedKnownR4(f)), f.text, block.positions[i]!);
  }
  await info.attach('runtime-parity-timing.json', { body: JSON.stringify({ file: info.file.split('/').at(-1), profile: info.project.name, engine: browser.version(), cases: block.cases.length, browserMs, nodeAndAssertionsMs: performance.now() - nodeStart }), contentType: 'application/json' });
  expect(errors).toEqual([]); expect(external).toEqual([]);
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({ 'foreign-test-sentinel': 'preserve' });
  expect(await page.evaluate(() => Object.hasOwn(window, 'auditLeak'))).toBe(false);
  // Only a fully completed block emits coverage; failed hooks/tests cannot
  // silently supply evidence for the missing postconditions.
  await info.attach('parity-coverage.json', { body: JSON.stringify({ source: info.file.split('/').at(-1), profile: info.project.name, total: cases.length, positions: block.positions }), contentType: 'application/json' });
});
