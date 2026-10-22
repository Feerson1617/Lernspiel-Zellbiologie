import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { listRegularFiles } from '../../tools/publish-policy.ts';
import { TEST_CONTEXT, TEST_VERSIONS } from '../helpers/tonoplast.ts';

it('builds/imports the actual prepared corrector with the production guard and no editorial fixtures or other field solutions', async () => {
  const code = await buildDomainModule();
  expect(code).not.toMatch(/reference-fixtures|tonoplast-cases|Alle Organellen sind frei lebende Bakterien|historischen Vorgang|TERM_OSMOSIS|REL_NET_WATER_OUT|TERM_HYDROPHIL|TERM_ATP_ROLE/);
  const api = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`) as typeof import('../../src/assessment/tonoplast.ts');
  expect(api.createTonoplastEvaluator(TEST_VERSIONS).evaluate(TEST_CONTEXT, { fieldId: 'term', text: 'Tonoplast' }, 'independent').status).toBe('correct');
});

it('keeps the production start bundle free of the prepared solutions, assessment code and test corpus', () => {
  const root = new URL('../../dist/', import.meta.url);
  const files = listRegularFiles(root.pathname);
  expect(files).toHaveLength(4);
  const source = files.filter((file) => /\.(js|html)$/.test(file)).map((file) => readFileSync(new URL(file, root), 'utf8')).join('\n');
  expect(source).not.toMatch(/Tonoplast|Vakuolenmembran|TERM_TONOPLAST|TONOPLAST_CORRECT|reference-fixtures|tonoplast-cases|TERM_OSMOSIS|REL_NET_WATER_OUT/);
});
