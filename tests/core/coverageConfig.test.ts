import { describe, it, expect } from "vitest";
import configRaw from "../../vite.config.ts?raw";

/**
 * Coverage-gate guard (M2-T3 / issue #14).
 *
 * The project enforces 100% coverage on the pure business logic under
 * src/core (plan.md §19.1). This test asserts that enforcement is actually
 * wired into the Vitest config and cannot silently regress: if the include
 * glob or the 100% thresholds are ever weakened, this test fails.
 */
describe("coverage gate", () => {
  it("targets src/core/**/*.ts with no exclusions", () => {
    expect(configRaw).toContain('include: ["src/core/**/*.ts"]');
    expect(configRaw).toContain("exclude: []");
  });

  it("enforces 100% on all coverage metrics", () => {
    expect(configRaw).toContain("lines: 100");
    expect(configRaw).toContain("functions: 100");
    expect(configRaw).toContain("statements: 100");
    expect(configRaw).toContain("branches: 100");
  });
});
