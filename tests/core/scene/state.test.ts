import { describe, it, expect } from "vitest";
import {
  assetSortKey,
  lookupAssetById,
  lookupCharacterById,
  resolveCharacter,
  resolveAsset,
  distance,
  manhattanDistance,
  midpoint,
  clamp,
  clampTimestamp,
  scenarioDuration,
  computeInitialState,
} from "../../../src/core/scene/state";
import { sceneFixture } from "./fixtures";
import type { Asset, Character } from "../../../src/core/scene/types";

describe("assetSortKey", () => {
  it("uses an explicit sort override when present", () => {
    const asset: Asset = { id: "a", asset: "chair", x: 10, y: 20, sort: 5.5 };
    expect(assetSortKey(asset)).toBe(5.5);
  });

  it("derives chair keys from facing and depth", () => {
    const base = { id: "a", asset: "chair" as const, x: 0, y: 100 };
    expect(assetSortKey({ ...base, dir: "down" })).toBe(100 - 16);
    expect(assetSortKey({ ...base, dir: "down", d: 40 })).toBe(100 - 20);
    expect(assetSortKey({ ...base, dir: "up" })).toBe(100 + 16);
    expect(assetSortKey({ ...base, dir: "left" })).toBe(100);
    expect(assetSortKey({ ...base, dir: "right" })).toBe(100);
  });

  it("derives roundTable and plant keys", () => {
    expect(assetSortKey({ id: "t", asset: "roundTable", x: 0, y: 100, r: 74 })).toBeCloseTo(100 + 74 * 0.5 * 0.9);
    expect(assetSortKey({ id: "t", asset: "roundTable", x: 0, y: 100 })).toBeCloseTo(100 + 60 * 0.5 * 0.9);
    expect(assetSortKey({ id: "p", asset: "plant", x: 0, y: 100 })).toBe(108);
  });

  it("defaults to y + depth/2 for other assets", () => {
    expect(assetSortKey({ id: "d", asset: "desk", x: 0, y: 100, d: 76 })).toBe(138);
    expect(assetSortKey({ id: "c", asset: "cup", x: 0, y: 100 })).toBe(100);
  });
});

describe("lookup helpers", () => {
  const assets: Asset[] = [
    { id: "a1", asset: "desk", x: 1, y: 2 },
    { id: "a2", asset: "chair", x: 3, y: 4 },
  ];
  const chars: Character[] = [
    { id: "c1", name: "One", role: "r", color: "#000", x: 1, y: 2, dir: "up", emotion: "neutral", visible: true, prop: null, look: {} as Character["look"] },
  ];

  it("lookupAssetById finds or misses", () => {
    expect(lookupAssetById(assets, "a2")?.asset).toBe("chair");
    expect(lookupAssetById(assets, "nope")).toBeUndefined();
  });

  it("lookupCharacterById finds or misses", () => {
    expect(lookupCharacterById(chars, "c1")?.name).toBe("One");
    expect(lookupCharacterById(chars, "nope")).toBeUndefined();
  });

  it("resolveCharacter resolves or throws", () => {
    expect(resolveCharacter(chars, "c1").id).toBe("c1");
    expect(() => resolveCharacter(chars, "ghost")).toThrow(/Unknown character id "ghost"/);
  });

  it("resolveAsset resolves or throws on a missing asset", () => {
    expect(resolveAsset(assets, "a1").id).toBe("a1");
    expect(() => resolveAsset(assets, "ghost")).toThrow(/Unknown asset id "ghost"/);
  });
});

describe("coordinate math", () => {
  it("computes Euclidean distance", () => {
    expect(distance([0, 0], [3, 4])).toBe(5);
    expect(distance([1, 1], [1, 1])).toBe(0);
  });

  it("computes Manhattan distance", () => {
    expect(manhattanDistance([0, 0], [3, 4])).toBe(7);
  });

  it("computes midpoints", () => {
    expect(midpoint([0, 0], [10, 20])).toEqual([5, 10]);
  });

  it("clamps a value to an inclusive range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(20, 0, 10)).toBe(10);
    expect(clamp(5, 10, 0)).toBe(5);
  });

  it("clampTimestamp clamps to [0, duration]", () => {
    expect(clampTimestamp(-5, 41)).toBe(0);
    expect(clampTimestamp(41, 41)).toBe(41);
    expect(clampTimestamp(100, 41)).toBe(41);
    expect(clampTimestamp(3, 41)).toBe(3);
  });
});

describe("scenarioDuration", () => {
  it("returns the declared duration when present", () => {
    expect(scenarioDuration({ duration: 41, events: [] })).toBe(41);
  });

  it("falls back to the latest event timestamp when duration is absent", () => {
    expect(scenarioDuration({ events: [{ t: 3 }, { t: 9.9 }] })).toBe(9.9);
    expect(scenarioDuration({ events: [] })).toBe(0);
  });
});

describe("computeInitialState", () => {
  it("groups the static background layers", () => {
    const state = computeInitialState(sceneFixture as never);
    expect(state.background.floor).toBe(sceneFixture.staticScene.floor);
    expect(state.background.corridor).toBe(sceneFixture.staticScene.corridor);
    expect(state.background.walls).toHaveLength(2);
    expect(state.background.windows).toHaveLength(1);
    expect(state.background.door).toBe(sceneFixture.staticScene.door);
    expect(state.background.wallDecor).toHaveLength(3);
    expect(state.background.floorDecals).toHaveLength(2);
    expect(state.background.lightPatches).toHaveLength(2);
  });

  it("orders foreground objects by paint order (back to front)", () => {
    const state = computeInitialState(sceneFixture as never);
    const keys = state.objects.map((o) => o.sortKey);
    const sorted = [...keys].sort((a, b) => a - b);
    expect(keys).toEqual(sorted);

    // Every asset is present as an asset object.
    const assetCount = state.objects.filter((o) => o.kind === "asset").length;
    expect(assetCount).toBe(sceneFixture.staticScene.assets.length);

    // Front walls are present as wall objects.
    const wallCount = state.objects.filter((o) => o.kind === "wall").length;
    expect(wallCount).toBe(1);

    // Only visible characters are present.
    const charObjects = state.objects.filter((o) => o.kind === "character");
    expect(charObjects).toHaveLength(1);
    expect(charObjects[0].character?.id).toBe("maya");
  });

  it("returns visible characters with their initial live state", () => {
    const state = computeInitialState(sceneFixture as never);
    expect(state.characters).toHaveLength(1);
    expect(state.characters[0]).toMatchObject({
      id: "maya",
      x: 660,
      y: 216,
      dir: "down",
      emotion: "neutral",
      visible: true,
      prop: null,
    });
    // The hidden character (noah) is not included.
    expect(state.characters.map((c) => c.id)).not.toContain("noah");
  });

  it("handles a scene with no visible characters and no front walls", () => {
    const scene = {
      staticScene: {
        ...sceneFixture.staticScene,
        walls: sceneFixture.staticScene.walls.filter((w) => w.layer === "back"),
        assets: [],
      },
      liveScene: {
        ...sceneFixture.liveScene,
        characters: sceneFixture.liveScene.characters.map((c) => ({ ...c, visible: false })),
      },
      scenario: sceneFixture.scenario,
    };
    const state = computeInitialState(scene as never);
    expect(state.objects).toHaveLength(0);
    expect(state.characters).toHaveLength(0);
  });
});
