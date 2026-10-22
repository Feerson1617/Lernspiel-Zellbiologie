import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { OSMOSIS_TEST_CONTEXT as CONTEXT, OSMOSIS_TEST_VERSIONS as VERSIONS } from '../helpers/osmosis.ts';
import { OSMOSIS_ADVERSARIAL_CASES, OSMOSIS_CASES, OSMOSIS_RECOGNITION_CASES } from '../fixtures/osmosis-cases.ts';
import { TEST_CONTEXT as TONOPLAST_CONTEXT, TEST_VERSIONS as TONOPLAST_VERSIONS } from '../helpers/tonoplast.ts';
import type { TaskContext } from '../../src/domain/task-context.ts';
type API = typeof import('../../src/assessment/osmosis.ts') & typeof import('../../src/assessment/osmosis-feedback.ts')
  & typeof import('../../src/assessment/tonoplast.ts') & typeof import('../../src/assessment/progress.ts')
  & typeof import('../../src/domain/task-context.ts') & typeof import('../../src/domain/progress.ts')
  & typeof import('../../src/ui/feedback-presentation.ts');
let source: string;
test.beforeAll(async () => { source = await buildDomainModule(); });
test.beforeEach(async ({ page, baseURL }) => {
  await page.route(`${baseURL}osmosis-under-test.mjs`, (route) => route.fulfill({ contentType: 'text/javascript', body: source }));
  await page.goto('./');
});
test('runs all fixed osmosis cases with bound criteria, original evidence, feedback and presentation in the actual bundled browser code', async ({ page, baseURL }) => {
  // Undefined has no serializable browser argument; its rejection is exercised by unit tests.
  const fixtures = [
    ...OSMOSIS_CASES.filter(({ input }) => input !== undefined), ...OSMOSIS_ADVERSARIAL_CASES,
    ...OSMOSIS_RECOGNITION_CASES.map((fixture) => ({ ...fixture, expected: 'correct' as const })),
  ];
  const results = await page.evaluate(async ({ url, contextJson, versions, inputsJson }) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const context = JSON.parse(contextJson) as TaskContext;
    const inputs = JSON.parse(inputsJson) as unknown[];
    const evaluator = api.createOsmosisEvaluator(versions);
    return inputs.map((text) => {
      const result = evaluator.evaluate(context, { fieldId: 'process', text }, 'wordbank');
      return { result, feedback: api.getOsmosisFeedback(result.feedbackCode), presentation: api.STATUS_PRESENTATION[result.status], bound: api.isResultForContext(result, context) };
    });
  }, { url: `${baseURL}osmosis-under-test.mjs`, contextJson: JSON.stringify(CONTEXT), versions: VERSIONS, inputsJson: JSON.stringify(fixtures.map(({ input }) => input)) });
  for (const [index, fixture] of fixtures.entries()) {
    const { result, feedback, presentation, bound } = results[index]!;
    expect(result.status, fixture.id).toBe(fixture.expected); expect(result.criteria).toHaveLength(1);
    expect(result.criteria[0]?.id).toBe('M6.02.C01'); expect(result.criteria[0]?.status).toBe(fixture.expected);
    expect(bound).toBe(true); expect(result.assistance).toBe('wordbank');
    expect(feedback.length).toBeGreaterThan(20); expect(presentation.symbol).toBeTruthy(); expect(presentation.label).toBeTruthy();
    expect(presentation.color).toBe(fixture.expected === 'correct' ? 'green' : fixture.expected === 'incorrect' ? 'red' : fixture.expected === 'empty' ? 'neutral' : 'yellow');
    for (const span of result.criteria[0]!.evidence) if (span.kind === 'input_span') expect((fixture.input as string).slice(span.start, span.end)).toBe(span.value);
  }
  expect(results.find(({ result }) => result.feedbackCode === 'OSMOSIS_WRONG_PLASMOLYSIS')?.feedback).toContain('Zellreaktion');
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await expect(page.getByText('Noch in Entwicklung.', { exact: true })).toBeVisible();
});
test('retains version/context/help guards and prevents cross-field confusion without writing raw text or executing markup', async ({ page, baseURL }) => {
  const result = await page.evaluate(async ({ url, contextJson, versions, tonoplastJson, tonoplastVersions }) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const context = JSON.parse(contextJson) as TaskContext;
    const tonoplastContext = JSON.parse(tonoplastJson) as TaskContext;
    const evaluator = api.createOsmosisEvaluator(versions);
    const old = evaluator.evaluate(context, { fieldId: 'process', text: 'Osmose' }, 'independent');
    const { contextHash: _hash, ...input } = context;
    const changed = api.createTaskContext({ ...input, contentVersion: 'changed' });
    let rejected = false;
    try { api.createEvaluatedAttempt('stale', old, changed); } catch { rejected = true; }
    const incomplete = api.createTaskContext({ ...input, material: { concentration_mol_per_L: 0.5 } });
    const viewed = evaluator.evaluate(context, { fieldId: 'process', text: 'Der Vorgang heißt Osmose.' }, 'solution_viewed');
    let fieldRejected = false;
    try { api.createEvaluatedAttempt('viewed', viewed, context); } catch (error) { fieldRejected = error instanceof api.IncompleteTaskAssessmentError; }
    const progress = api.parseProgress({ schemaVersion: 1, contentVersion: versions.contentVersion, attempts: [] });
    const tonoplast = api.createTonoplastEvaluator(tonoplastVersions);
    const markup = evaluator.evaluate(context, { fieldId: 'process', text: '<script>window.__osmosis=true</script>' }, 'independent');
    return { rejected, bound: api.isResultForContext(old, changed), version: evaluator.evaluate(changed, { fieldId: 'process', text: 'Osmose' }, 'independent').status,
      material: evaluator.evaluate(incomplete, { fieldId: 'process', text: 'Osmose' }, 'independent').status,
      foreignTask: evaluator.evaluate(tonoplastContext, { fieldId: 'process', text: 'Osmose' }, 'independent').status,
      unimplementedFields: ['direction', 'volume'].map((fieldId) => evaluator.evaluate(context, { fieldId, text: 'Osmose' }, 'independent').status),
      tonoplastStillWorks: tonoplast.evaluate(tonoplastContext, { fieldId: 'term', text: 'Tonoplast' }, 'independent').status,
      wrongTerm: tonoplast.evaluate(tonoplastContext, { fieldId: 'term', text: 'Osmose' }, 'independent').status,
      fieldRejected, fieldStatus: viewed.status, assistance: viewed.assistance, attempts: progress.attempts.length, stored: JSON.stringify(progress), markup: markup.status,
      executed: Object.hasOwn(window, '__osmosis'), keys: Object.keys(localStorage) };
  }, { url: `${baseURL}osmosis-under-test.mjs`, contextJson: JSON.stringify(CONTEXT), versions: VERSIONS, tonoplastJson: JSON.stringify(TONOPLAST_CONTEXT), tonoplastVersions: TONOPLAST_VERSIONS });
  expect(result.rejected).toBe(true); expect(result.bound).toBe(false);
  expect([result.version, result.material, result.foreignTask, ...result.unimplementedFields]).toEqual(['technical', 'technical', 'technical', 'technical', 'technical']);
  expect(result.tonoplastStillWorks).toBe('correct'); expect(result.wrongTerm).toBe('clarify');
  expect(result.fieldStatus).toBe('correct'); expect(result.assistance).toBe('solution_viewed');
  expect(result.fieldRejected).toBe(true); expect(result.attempts).toBe(0);
  expect(result.stored).not.toMatch(/Osmose|evidence|contextHash|rawText/);
  expect(result.markup).toBe('clarify'); expect(result.executed).toBe(false); expect(result.keys).toEqual([]);
});
