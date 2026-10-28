import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { OSMOSIS_TEST_CONTEXT, OSMOSIS_TEST_VERSIONS } from '../helpers/osmosis.ts';

it('builds/imports the actual second corrector under the runtime guard without editorial data or unrelated solutions', async () => {
  const code = await buildDomainModule();
  expect(code).not.toMatch(/osmosis-cases|OSMOSIS_RECOGNITION_CASES|reference-fixtures|REL_NET_WATER_OUT|REL_VACUOLE_SMALLER|TERM_HYDROPHIL|TERM_ATP_ROLE/);
  const api = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`) as typeof import('../../src/assessment/osmosis.ts');
  const evaluator = api.createOsmosisEvaluator(OSMOSIS_TEST_VERSIONS);
  expect(evaluator.evaluate(OSMOSIS_TEST_CONTEXT, { fieldId: 'process', text: 'Osmose' }, 'independent').status).toBe('correct');
  expect(evaluator.evaluate(OSMOSIS_TEST_CONTEXT, { fieldId: 'process', text: 'Plasmolyse' }, 'independent').status).toBe('incorrect');
});
it('keeps both correctors and osmosis solutions outside the public start page', () => {
  const html = readFileSync(new URL('../../dist/index.html', import.meta.url), 'utf8');
  const js = html.match(/src="([^"]+\.js)"/u)?.[1];
  expect(js).toMatch(/^\/Lernspiel-Zellbiologie\/assets\//u);
  const code = readFileSync(new URL(`../../dist/${js!.replace('/Lernspiel-Zellbiologie/', '')}`, import.meta.url), 'utf8');
  expect(html + code).not.toMatch(/Osmose|Osmosis|OSMOSIS_|Plasmolyse|TERM_OSMOSIS|osmosis-cases|TERM_TONOPLAST|reference-fixtures/);
});
