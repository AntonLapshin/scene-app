import { describe, it, expect } from "vitest";
import {
  parseStaticScene,
  parseLiveScene,
  parseScenario,
  SceneParseError,
  ASSET_KINDS,
  DIRECTIONS,
  EMOTIONS,
  EVENT_TYPES,
} from "../../../src/core/scene";

/**
 * Barrel re-export test: importing the scene module surface should expose the
 * typed models, the fixed sets, and the pure parse functions (M1-T1).
 */
describe("scene module barrel", () => {
  it("re-exports parse functions and the error type", () => {
    expect(typeof parseStaticScene).toBe("function");
    expect(typeof parseLiveScene).toBe("function");
    expect(typeof parseScenario).toBe("function");
    expect(new SceneParseError("x")).toBeInstanceOf(Error);
  });

  it("re-exports the fixed sets", () => {
    expect(ASSET_KINDS).toContain("desk");
    expect(DIRECTIONS).toContain("up");
    expect(EMOTIONS).toContain("neutral");
    expect(EVENT_TYPES).toContain("move");
  });
});
