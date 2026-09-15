import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

// Kept separate from vite.config.ts on purpose: Vitest ships its own copy of
// Vite, and mixing the two `defineConfig` types makes the build plugins fail to
// typecheck. The tests only cover the pure service and routing logic, so they
// need the path alias and nothing else.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
