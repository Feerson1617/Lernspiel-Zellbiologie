import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { R8_CORPUS, executeR8, R8_VERSIONS } from '../helpers/p02b-r8.ts';
import { REVIEW_MATERIAL } from '../helpers/p02b-second.ts';
type API = typeof import('../../src/assessment/osmosis.ts') & typeof import('../../src/assessment/tonoplast.ts') & typeof import('../../src/assessment/osmosis-feedback.ts') & typeof import('../../src/assessment/feedback.ts') & typeof import('../../src/domain/task-context.ts');
let source: string;
test.beforeAll(async () => { source = await buildDomainModule(); });
const cases = Object.values(R8_CORPUS.groups).flat();
for (let offset = 0; offset < cases.length; offset += 900) {
  const batch = cases.slice(offset, offset + 900);
  test(`R8 immutable legacy browser/Node parity batch ${offset / 900 + 1}`, async ({ page, baseURL }, info) => {
    test.setTimeout(90000);
    await page.route(`${baseURL}r8-runtime.mjs`, r => r.fulfill({ contentType: 'text/javascript', body: source })); await page.goto('./');
    const results = await page.evaluate(async ({ url, cases, versions, material }) => {
      const api = await import(/* @vite-ignore */ url) as API;
      const base = { ...versions, instanceId: 'independent-review9-PR6', seed: 'fixed-independent-review', phase: 'explain' as const, modelState: {} };
      const oe = api.createOsmosisEvaluator(versions), te = api.createTonoplastEvaluator(versions);
      const oc = api.createTaskContext({ ...base, taskId: 'M6.02', material }), tc = api.createTaskContext({ ...base, taskId: 'Z1.02', material: { highlightedStructureId: 'tonoplast' } });
      return cases.map(c => { const result = (c.field === 'osmosis' ? oe : te).evaluate(c.field === 'osmosis' ? oc : tc, { fieldId: c.field === 'osmosis' ? 'process' : 'term', text: c.text }, 'independent');
        return { result, feedback: (c.field === 'osmosis' ? api.getOsmosisFeedback : api.getTonoplastFeedback)(result.feedbackCode) }; });
    }, { url: `${baseURL}r8-runtime.mjs`, cases: batch, versions: R8_VERSIONS, material: REVIEW_MATERIAL });
    expect(results).toEqual(batch.map(executeR8));
    await info.attach('r8-legacy-parity.json', { body: JSON.stringify({ count: results.length, profile: info.project.name, biologicalAcceptance: 'historical red; this checks byte-equivalent runtime parity only' }), contentType: 'application/json' });
  });
}
