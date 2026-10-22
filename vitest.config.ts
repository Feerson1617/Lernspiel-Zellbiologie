import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'review/**/*.test.ts'],
    reporters: ['default', 'json'],
    maxWorkers: 2,
  },
});
