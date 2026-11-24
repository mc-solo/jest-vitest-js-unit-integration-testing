import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      // 100% on all four metrics: the verified coverage level
      // (README, 2026-11-20 run). The suite fails if coverage
      // drops below it, so a new code path without a test is
      // caught instead of silently lowering coverage.
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
