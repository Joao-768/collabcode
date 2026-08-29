import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        globals: false,
        // Tests share one database, so they must not run concurrently.
        fileParallelism: false,
        setupFiles: ['./src/__tests__/setup.ts'],
        include: ['src/__tests__/**/*.test.ts'],
        testTimeout: 20000,
        hookTimeout: 30000,
    },
})
