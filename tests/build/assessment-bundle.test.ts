import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { buildDomainModule } from '../helpers/domain-bundle.ts';
import { listRegularFiles } from '../../tools/publish-policy.ts';
import { TEST_CONTEXT, TEST_VERSIONS } from '../helpers/tonoplast.ts';

it('builds/imports the actual prepared corrector with the production guard and no editorial fixtures or other field solutions', async () => {
  const code = await buildDomainModule();
  expect(code).not.toMatch(/reference-fixtures|tonoplast-cases|Alle Organellen sind frei lebende Bakterien|historischen Vorgang|REL_NET_WATER_OUT|TERM_HYDROPHIL|TERM_ATP_ROLE/);
  const api = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`) as typeof import('../../src/assessment/tonoplast.ts');
  expect(api.createTonoplastEvaluator(TEST_VERSIONS).evaluate(TEST_CONTEXT, { fieldId: 'term', text: 'Tonoplast' }, 'independent').status).toBe('correct');
});

it('keeps solutions out of the initial entry while allowing only the new public learning chunks', () => {
  const root = new URL('../../dist/', import.meta.url);
  const files = listRegularFiles(root.pathname);
  const html = readFileSync(new URL('index.html', root), 'utf8');
  const entry = html.match(/src="[^\"]*\/(index-[^\"]+\.js)"/)?.[1];
  expect(entry).toBeDefined();
  const initial = readFileSync(new URL(`assets/${entry}`, root), 'utf8');
  expect(initial).not.toMatch(/Tonoplast|Vakuolenmembran|TERM_TONOPLAST|TONOPLAST_CORRECT|reference-fixtures|tonoplast-cases|TERM_OSMOSIS|REL_NET_WATER_OUT/);
  const source = files.filter(file => /\.(js|html)$/.test(file)).map(file => readFileSync(new URL(file, root), 'utf8')).join('\n');
  expect(source).toContain('Erklären im Heft');
  expect(source).toContain('Wasserhaushalt der Zelle');
  expect(source).not.toMatch(/TERM_TONOPLAST|TONOPLAST_CORRECT|reference-fixtures|tonoplast-cases|TERM_OSMOSIS|REL_NET_WATER_OUT|INTERNE P02c|Interne Testfall-Steuerung/);
  expect(files.filter(file => file.endsWith('.js')).every(file => /^assets\/(?:index|m602-entry)-[\w-]+\.js$/.test(file))).toBe(true);
});
