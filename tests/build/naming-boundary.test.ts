import { build } from 'vite';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
const root = fileURLToPath(new URL('../..', import.meta.url));
it.each(['tests/fixtures/naming-v1-cases.json?raw', 'tests/fixtures/naming-v1-scenarios.json', 'tests/fixtures/p02b-r8-cases.json', 'contracts/naming-v1.schema.json', 'review/naming-input-1.0.0.md?raw', 'qa/naming-v1-freeze.json', 'tests/fixtures/p02b-r9-cases.json?raw', 'qa/p02b-r9-plan.json', 'tests/fixtures/p02c-cases.json?raw', 'contracts/m602.schema.json', 'review/m602-relations-1.0.0.md?raw', 'qa/p02c-freeze.json'])('rejects a real runtime import of %s', async file => {
  const entry = 'naming-negative-entry';
  await expect(build({ configFile: join(root, 'vite.config.ts'), logLevel: 'silent',
    plugins: [{ name: 'negative-naming-entry', resolveId(id) { if (id === entry || id === join(root, entry)) return `\0${entry}`; },
      load(id) { if (id === `\0${entry}`) return `export { default } from ${JSON.stringify(join(root, file))};`; } }],
    build: { write: false, lib: { entry, formats: ['es'] } },
  })).rejects.toThrow('Runtime import outside src');
});
it.each(['naming-lab', 'm602-lab'])('rejects publishing test-internal UI %s, while the guarded test harness remains usable', async file => {
  await expect(build({ configFile: join(root, 'vite.config.ts'), logLevel: 'silent',
    build: { write: false, lib: { entry: join(root, `src/ui/${file}.ts`), formats: ['es'] } },
  })).rejects.toThrow('Internal naming lab must not enter production output');
});
