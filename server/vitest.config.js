import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules/', 'dist/'],
    testTimeout: 10000, // 10 seconds for API tests
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'dist/',
        'src/config/init-db.js',
        'src/config/seed.js',
      ],
    },
  },
});
