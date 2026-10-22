import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

/** In-memory library build with the production runtime-import guard enabled. */
export async function buildDomainModule(): Promise<string> {
  const root = fileURLToPath(new URL('../..', import.meta.url));
  const entry = 'p01b-domain-browser-test';
  const result = await build({
    configFile: join(root, 'vite.config.ts'),
    logLevel: 'silent',
    plugins: [{
      name: 'domain-browser-test-entry',
      resolveId(id) { if (id === entry || id === join(root, entry)) return `\0${entry}`; },
      load(id) {
        if (id === `\0${entry}`) return [
          `export * from ${JSON.stringify(join(root, 'src/domain/task-context.ts'))};`,
          `export * from ${JSON.stringify(join(root, 'src/domain/units.ts'))};`,
          `export * from ${JSON.stringify(join(root, 'src/domain/progress.ts'))};`,
          `export * from ${JSON.stringify(join(root, 'src/persistence/progress-store.ts'))};`,
          `export * from ${JSON.stringify(join(root, 'src/assessment/tonoplast.ts'))};`,
          `export * from ${JSON.stringify(join(root, 'src/assessment/feedback.ts'))};`,
          `export * from ${JSON.stringify(join(root, 'src/assessment/progress.ts'))};`,
          `export * from ${JSON.stringify(join(root, 'src/ui/feedback-presentation.ts'))};`,
        ].join('\n');
      },
    }],
    build: { write: false, lib: { entry, formats: ['es'] } },
  });
  const results = Array.isArray(result) ? result : [result];
  const output = results[0];
  if (results.length !== 1 || !output || !('output' in output)) throw new Error('Expected one domain library build.');
  const chunks = output.output.filter((item) => item.type === 'chunk');
  if (chunks.length !== 1 || !chunks[0]) throw new Error('Expected a self-contained domain module.');
  return chunks[0].code;
}
