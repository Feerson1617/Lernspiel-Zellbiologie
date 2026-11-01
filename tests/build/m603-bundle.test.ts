import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { assertPublicBundleText, listRegularFiles } from '../../tools/publish-policy.ts';
it('keeps the new causal contract inside the reviewed learner chunk and excludes own test answers', () => {
  const root = new URL('../../dist/', import.meta.url), files = listRegularFiles(root.pathname);
  const initial = files.find(path => /^assets\/index-.*\.js$/.test(path))!;
  const learning = files.find(path => /^assets\/m602-entry-.*\.js$/.test(path))!;
  const source = (path: string) => readFileSync(new URL(path, root), 'utf8');
  expect(source(initial)).not.toContain('m603-causal-map/'); expect(source(learning)).toContain('m603-causal-map/1.0.1');
  for (const path of files.filter(path => /\.(js|css|html)$/.test(path))) {
    expect(source(path)).not.toMatch(/m603-cases|weak-core-type|session-tests|own-m603-tests|pre-implementation cases/);
  }
  expect(() => assertPublicBundleText(learning, 'm603-causal-map/1.0.1')).not.toThrow();
  for (const path of ['index.html', initial, 'assets/m602-entry-abcd1234.css', 'assets/other-abcd1234.js']) {
    expect(() => assertPublicBundleText(path, 'm603-causal-map/1.0.1')).toThrow();
  }
});
