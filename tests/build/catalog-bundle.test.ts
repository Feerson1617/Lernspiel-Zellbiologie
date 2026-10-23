import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';
import { expect, it } from 'vitest';
import type { TaskRegistry } from '../../src/domain/catalog.ts';
import { TASK_IDS } from '../../src/domain/identities.ts';

const root = fileURLToPath(new URL('../..', import.meta.url));
const configFile = join(root, 'vite.config.ts');

it('bundles the prepared public catalog without editorial keys, fixtures or development imports', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'zelllabor11-public-catalog-'));
  try {
    await build({ configFile, logLevel: 'silent', build: {
      outDir: directory,
      lib: { entry: join(root, 'src/content/task-catalog.ts'), formats: ['es'], fileName: () => 'catalog.mjs' },
    } });
    const file = join(directory, 'catalog.mjs');
    const source = readFileSync(file, 'utf8');
    expect(source).not.toMatch(/reference-fixtures|model-vectors|wrong_reasons|response_spec|rubric_granularity|assessment_implementation_status/);
    const module = await import(/* @vite-ignore */ pathToFileURL(file).href) as { taskRegistry: TaskRegistry };
    expect(module.taskRegistry.catalog.tasks).toHaveLength(79);
    for (const id of TASK_IDS) {
      const task = module.taskRegistry.getTask(id);
      expect(task.id).toBe(id);
      expect(Object.keys(task).sort()).toEqual(['id', 'missionId', 'publicationStatus', 'title', 'type']);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

it.each(['spec/tasks.json', 'spec/reference-fixtures.json?raw', 'spec/text-rubrics.json?raw',
  'tests/fixtures/p02b-countercheck-cases.ts?raw', 'tests/fixtures/p02b-second-language.ts?raw',
  'review/main-ruleset-proposal.json?raw', 'qa/P02b-Nachbesserung.md?raw',
  'tests/fixtures/p02b-20261023-cases.ts?raw', 'tests/fixtures/p02b-20261023-fresh.ts?raw',
  'tests/fixtures/p02b-20261023-r2-cases.ts?raw', 'tests/fixtures/p02b-20261023-r2-fresh.ts?raw',
  'tests/fixtures/p02b-20261023-r2-additions.ts?raw',
])('rejects a real Vite runtime import from %s before writing output', async (file) => {
  const entry = 'p01a-negative-runtime-entry';
  await expect(build({
    configFile,
    logLevel: 'silent',
    plugins: [{
      name: 'synthetic-runtime-import-negative-test',
      resolveId(id) { if (id === entry || id === join(root, entry)) return `\0${entry}`; },
      load(id) { if (id === `\0${entry}`) return `export { default } from ${JSON.stringify(join(root, file))};`; },
    }],
    build: { write: false, lib: { entry, formats: ['es'] } },
  })).rejects.toThrow('Runtime import outside src');
});
