import { mkdirSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

mkdirSync(new URL('./qa/generated/', import.meta.url), { recursive: true });

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'review/**/*.test.ts'],
    reporters: ['default', 'json'],
    maxWorkers: 2,
  },
});
