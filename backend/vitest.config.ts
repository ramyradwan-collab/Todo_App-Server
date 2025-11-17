import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    reporters: [
      'verbose',
      './tests/reporters/vitestQAReporter.ts',
    ],
  },
});

