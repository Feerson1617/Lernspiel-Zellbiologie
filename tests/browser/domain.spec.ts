import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { buildDomainModule } from '../helpers/domain-bundle.ts';

let source: string;
test.beforeAll(async () => { source = await buildDomainModule(); });

test('uses the same SHA-256 identity and explicit SI conversions in a real browser', async ({ page, baseURL }) => {
  const moduleURL = `${baseURL}domain-under-test.mjs`;
  await page.route(moduleURL, (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: source }));
  await page.goto('./');
  const result = await page.evaluate(async (url) => {
    const api = await import(/* @vite-ignore */ url) as typeof import('../../src/domain/task-context.ts') & typeof import('../../src/domain/units.ts');
    const input = { taskId: 'Z1.01', taskVersion: 't', rubricVersion: 'r', contentVersion: 'c', modelVersion: 'm', instanceId: 'i', seed: 's', phase: 'predict', material: { z: true, a: 'ä' }, modelState: {} } as const;
    const context = api.createTaskContext(input);
    const next = api.createTaskContext({ ...input, material: { z: false, a: 'ä' } });
    return { hash: context.contextHash, volume: api.toSI('volume', 90, 'pL').value, concentration: api.toSI('concentration', 0.3, 'mol/L').value, temperature: api.toSI('temperature', 20, '°C').value, stale: api.isResultForContext(api.createContextBinding(context), next) };
  }, moduleURL);
  const json = '{"contentVersion":"c","instanceId":"i","material":{"a":"ä","z":true},"modelState":{},"modelVersion":"m","phase":"predict","rubricVersion":"r","seed":"s","taskId":"Z1.01","taskVersion":"t"}';
  const expected = `sha256-v1:${createHash('sha256').update('zelllabor11.task-context.v1\n' + json, 'utf8').digest('hex')}`;
  expect(result.hash).toBe(expected);
  expect(Math.abs((result.volume - 9e-14) / 9e-14)).toBeLessThan(1e-14);
  expect(result.concentration).toBe(300);
  expect(result.temperature).toBe(293.15);
  expect(result.stale).toBe(false);
});
