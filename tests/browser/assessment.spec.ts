import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';

type API = typeof import('../../src/domain/task-context.ts') & typeof import('../../src/domain/progress.ts')
  & typeof import('../../src/assessment/tonoplast.ts') & typeof import('../../src/assessment/feedback.ts')
  & typeof import('../../src/assessment/progress.ts') & typeof import('../../src/ui/feedback-presentation.ts');
let source: string;
test.beforeAll(async () => { source = await buildDomainModule(); });
test.beforeEach(async ({ page, baseURL }) => {
  await page.route(`${baseURL}assessment-under-test.mjs`, (route) => route.fulfill({ contentType: 'text/javascript', body: source }));
  await page.goto('./');
});

test('runs the actual corrector and separate feedback/presentation descriptors without a student UI or persistence', async ({ page, baseURL }) => {
  const result = await page.evaluate(async (url) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const versions = { taskVersion: 'test-task', rubricVersion: 'test-rubric', contentVersion: 'test-content', modelVersion: 'test-no-simulation' };
    const context = api.createTaskContext({ ...versions, taskId: 'Z1.02', instanceId: 'i', seed: 's', phase: 'explain', material: { highlightedStructureId: 'tonoplast' }, modelState: {} });
    const evaluator = api.createTonoplastEvaluator(versions);
    const values = ['Ich denke, das ist der Tonoplast.', 'Die Membran heißt Zellwand.', 'Eine Hülle.', 'Tonoplast oder Zellmembran', '', 'Tonoplast' + ' '.repeat(4088)];
    const cases = values.map((text) => {
      const result = evaluator.evaluate(context, { fieldId: 'term', text }, 'hint');
      return { result, presentation: api.STATUS_PRESENTATION[result.status], feedback: api.getTonoplastFeedback(result.feedbackCode), assistance: api.ASSISTANCE_LABELS[result.assistance] };
    });
    const markup = evaluator.evaluate(context, { fieldId: 'term', text: '<script>window.__p02aExecuted=true</script>' }, 'independent');
    const text = '\tDas ist die Kernhu\u0308lle.';
    const unicode = evaluator.evaluate(context, { fieldId: 'term', text }, 'independent');
    const span = unicode.criteria[0]!.evidence[0]!;
    return { cases, markup, executed: Object.hasOwn(window, '__p02aExecuted'), span, originalSlice: span.kind === 'input_span' ? text.slice(span.start, span.end) : '', storageKeys: Object.keys(localStorage), title: document.title };
  }, `${baseURL}assessment-under-test.mjs`);
  expect(result.cases.map((item) => item.result.status)).toEqual(['correct', 'incorrect', 'partial', 'clarify', 'empty', 'technical']);
  expect(result.cases.map((item) => item.presentation.color)).toEqual(['green', 'red', 'yellow', 'yellow', 'neutral', 'yellow']);
  expect(result.cases.every((item) => item.presentation.symbol && item.presentation.label && item.feedback.length > 20 && item.assistance === 'Mit Hinweis beantwortet')).toBe(true);
  expect(result.cases[1]?.feedback).toContain('feste äußere Hülle');
  expect(result.markup.status).toBe('clarify'); expect(result.executed).toBe(false);
  expect(result.originalSlice).toBe('Das ist die Kernhu\u0308lle');
  expect(result.span.value).toBe(result.originalSlice);
  expect(result.storageKeys).toEqual([]);
  expect(result.title).toBe('Zelllabor 11 – Die Zelle erforschen');
  await expect(page.getByText('Noch in Entwicklung.', { exact: true })).toBeVisible();
});

test('blocks stale result handoff after version/material changes and keeps help distinct from factual correctness', async ({ page, baseURL }) => {
  const result = await page.evaluate(async (url) => {
    const api = await import(/* @vite-ignore */ url) as API;
    const versions = { taskVersion: 'test-task', rubricVersion: 'test-rubric', contentVersion: 'test-content', modelVersion: 'test-no-simulation' };
    const input = { ...versions, taskId: 'Z1.02', instanceId: 'i', seed: 's', phase: 'explain', material: { highlightedStructureId: 'tonoplast' }, modelState: {} } as const;
    const context = api.createTaskContext(input);
    const evaluator = api.createTonoplastEvaluator(versions);
    const response = { fieldId: 'term', text: 'Nicht die Zellwand, sondern der Tonoplast.' };
    const evaluation = evaluator.evaluate(context, response, 'independent');
    const changed = api.createTaskContext({ ...input, rubricVersion: 'changed' });
    let staleRejected = false;
    try { api.createEvaluatedAttempt('stale', evaluation, changed); } catch { staleRejected = true; }
    const invalidMaterial = api.createTaskContext({ ...input, material: { highlightedStructureId: 'cell_wall' } });
    const viewed = evaluator.evaluate(context, response, 'solution_viewed');
    const progress = api.appendAttempt(api.parseProgress({ schemaVersion: 1, contentVersion: versions.contentVersion, attempts: [] }), api.createEvaluatedAttempt('viewed', viewed, context));
    return { staleRejected, staleMatches: api.isResultForContext(evaluation, changed), version: evaluator.evaluate(changed, response, 'independent'), material: evaluator.evaluate(invalidMaterial, response, 'independent'), viewed: viewed.status, outcome: api.getAttemptOutcome(progress, 'viewed', context), stored: JSON.stringify(progress), keys: Object.keys(localStorage) };
  }, `${baseURL}assessment-under-test.mjs`);
  expect(result.staleRejected).toBe(true); expect(result.staleMatches).toBe(false);
  expect(result.version).toMatchObject({ status: 'technical', feedbackCode: 'TONOPLAST_VERSION' });
  expect(result.material).toMatchObject({ status: 'technical', feedbackCode: 'TONOPLAST_CONTEXT' });
  expect(result.viewed).toBe('correct');
  expect(result.outcome).toMatchObject({ successful: false, independent: false, assistance: 'solution_viewed' });
  expect(result.stored).not.toMatch(/Zellwand|Tonoplast|evidence|contextHash/);
  expect(result.keys).toEqual([]);
});
