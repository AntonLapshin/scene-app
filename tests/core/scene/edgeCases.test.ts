import { describe, it, expect } from "vitest";
import { parseSceneBundle } from "../../../src/core/scene/parse";
import { renderAsset, drawProcedural } from "../../../src/core/scene/draw";
import {
  computeSceneState,
  computeInitialState,
  scenarioDuration,
  clampTimestamp,
} from "../../../src/core/scene/state";
import { advanceTimestamp, stepForward, stepBackward } from "../../../src/core/scene/replay";
import { ASSET_KINDS } from "../../../src/core/scene/types";
import type { Asset, Scene } from "../../../src/core/scene/types";
import { sceneFixture } from "./fixtures";

const scene = sceneFixture as unknown as Scene;

/** A minimal asset with an unavailable external image reference. */
function missingImageAsset(kind: Asset["asset"]): Asset {
  return { id: `a-${kind}`, asset: kind, x: 10, y: 20, image: `/sprites/${kind}.png` };
}

describe("M5-T2: malformed scene JSON → parse result", () => {
  it("parses a valid scene bundle into a typed Scene", () => {
    const result = parseSceneBundle(sceneFixture);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.scene.staticScene.meta.name).toContain("Northlight");
      expect(result.scene.liveScene.characters.length).toBeGreaterThan(0);
      expect(result.scene.scenario.duration).toBe(41);
    }
  });

  it("returns a descriptive error (not a throw) for a non-object bundle", () => {
    const result = parseSceneBundle(null);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/scene must be an object/);
  });

  it("returns a descriptive error for a malformed static scene", () => {
    const bad = { ...sceneFixture, staticScene: { ...sceneFixture.staticScene, floor: null } };
    const result = parseSceneBundle(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/staticScene\.floor must be an object/);
  });

  it("returns a descriptive error for a malformed live scene", () => {
    const bad = { ...sceneFixture, liveScene: { ...sceneFixture.liveScene, characters: "x" } };
    const result = parseSceneBundle(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/liveScene\.characters must be an array/);
  });

  it("returns a descriptive error for a malformed scenario", () => {
    const bad = { ...sceneFixture, scenario: { ...sceneFixture.scenario, events: "x" } };
    const result = parseSceneBundle(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/scenario\.events must be an array/);
  });

  it("returns a descriptive error when a required field is missing", () => {
    const bad = { staticScene: sceneFixture.staticScene, liveScene: sceneFixture.liveScene };
    const result = parseSceneBundle(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/scenario must be an object/);
  });

  it("falls back to a generic message when the thrown value is not an Error", () => {
    // A property getter that throws a non-Error forces the fallback branch.
    const raw: Record<string, unknown> = {
      staticScene: sceneFixture.staticScene,
      liveScene: sceneFixture.liveScene,
      scenario: sceneFixture.scenario,
    };
    Object.defineProperty(raw, "staticScene", {
      get() {
        throw "boom"; // not an Error
      },
    });
    const result = parseSceneBundle(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("Unknown scene parse error");
  });
});

describe("M5-T2: missing/unavailable assets fall back to procedural", () => {
  it("falls back to procedural drawing for every asset kind when the image is unavailable", () => {
    for (const kind of ASSET_KINDS) {
      const ops = renderAsset(missingImageAsset(kind), () => false);
      expect(ops.length, kind).toBeGreaterThan(0);
      expect(ops.every((o) => o.type !== "image"), kind).toBe(true);
      // The fallback matches the pure procedural drawing for that kind.
      expect(ops).toEqual(drawProcedural(missingImageAsset(kind)));
    }
  });

  it("never emits an image op for an unavailable asset", () => {
    for (const kind of ASSET_KINDS) {
      const ops = renderAsset(missingImageAsset(kind));
      expect(ops.some((o) => o.type === "image"), kind).toBe(false);
    }
  });
});

describe("M5-T2: empty timeline renders initial state and plays/seeks safely", () => {
  const emptyScene: Scene = {
    ...scene,
    scenario: { id: "empty", title: "Empty", duration: 0, events: [] },
  };

  it("renders the initial state at any timestamp without errors", () => {
    const initial = computeInitialState(emptyScene);
    expect(computeSceneState(emptyScene, 0)).toEqual(initial);
    expect(computeSceneState(emptyScene, 10)).toEqual(initial);
    expect(computeSceneState(emptyScene, -5)).toEqual(initial);
  });

  it("reports a zero duration for an empty timeline", () => {
    expect(scenarioDuration(emptyScene.scenario)).toBe(0);
  });

  it("steps forward/backward safely on an empty timeline", () => {
    // Duration is 0, so stepping clamps to the empty playback window.
    expect(stepForward(emptyScene, 0, 1)).toBe(0);
    expect(stepBackward(emptyScene, 0, 1)).toBe(0);
    expect(advanceTimestamp(0, 2, 0)).toBe(0);
  });
});

describe("M5-T2: out-of-range timestamps are clamped safely", () => {
  const duration = scenarioDuration(scene.scenario);

  it("clamps seek/advance beyond the duration and below 0", () => {
    expect(clampTimestamp(-10, duration)).toBe(0);
    expect(clampTimestamp(duration + 100, duration)).toBe(duration);
    expect(advanceTimestamp(duration - 0.1, 10, duration)).toBe(duration);
  });

  it("never produces invalid render state at out-of-range timestamps", () => {
    const atStart = computeSceneState(scene, -5);
    const atEnd = computeSceneState(scene, 1e9);
    // Negative timestamps behave like the initial state (no events have fired).
    expect(atStart).toEqual(computeInitialState(scene));
    // Huge timestamps behave like the end (all events have fired).
    expect(atEnd).toEqual(computeSceneState(scene, duration));
    // Both are well-formed render states.
    expect(atStart.objects).toBeInstanceOf(Array);
    expect(atEnd.characters).toBeInstanceOf(Array);
  });

  it("steps never exceed the clamped playback window", () => {
    expect(stepForward(scene, duration, 1)).toBeLessThanOrEqual(duration);
    expect(stepBackward(scene, 0, 1)).toBe(0);
  });
});
