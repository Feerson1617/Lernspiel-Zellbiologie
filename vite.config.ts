import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { assertRuntimeModule } from './tools/publish-policy.ts';
import policy from './publish.allowlist.json' with { type: 'json' };

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: '/Lernspiel-Zellbiologie/',
  publicDir: false,
  build: { outDir: 'dist', sourcemap: false },
  plugins: [{
    name: 'runtime-source-boundary',
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type === 'chunk') {
          for (const id of output.moduleIds) assertRuntimeModule(id, root, policy.repositoryFiles);
        }
      }
    },
  }],
});
