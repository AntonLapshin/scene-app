import { describe, it, expect } from "vitest";
import {
  parseStaticScene,
  parseLiveScene,
  parseScenario,
  parseAsset,
  requireDirection,
  requireEmotion,
  requireAssetKind,
  requireEventType,
  requireWallLayer,
  requireWallDecorAssetKind,
  requireFloorDecalAssetKind,
} from "../../../src/core/scene/parse";
import {
  ASSET_KINDS,
  DIRECTIONS,
  EMOTIONS,
  EVENT_TYPES,
} from "../../../src/core/scene/types";
import {
  staticSceneFixture,
  liveSceneFixture,
  scenarioFixture,
} from "./fixtures";

describe("scene fixed sets", () => {
  it("exposes the full fixed asset set", () => {
    expect(ASSET_KINDS).toContain("roundTable");
    expect(ASSET_KINDS).toContain("chair");
    expect(ASSET_KINDS).toContain("cup");
    expect(ASSET_KINDS).toContain("papers");
    expect(ASSET_KINDS).toContain("counter");
    expect(ASSET_KINDS).toContain("coffeeMachine");
    expect(ASSET_KINDS).toContain("kettle");
    expect(ASSET_KINDS).toContain("cupRow");
    expect(ASSET_KINDS).toContain("waterCooler");
    expect(ASSET_KINDS).toContain("stool");
    expect(ASSET_KINDS).toContain("sofa");
    expect(ASSET_KINDS).toContain("cabinet");
    expect(ASSET_KINDS).toContain("crates");
    expect(ASSET_KINDS).toContain("printer");
    expect(ASSET_KINDS).toContain("plant");
    expect(ASSET_KINDS).toContain("desk");
    expect(ASSET_KINDS).toContain("laptop");
    expect(ASSET_KINDS).toContain("lamp");
    expect(ASSET_KINDS).toContain("deskSign");
    expect(ASSET_KINDS).toContain("whiteboard");
    expect(ASSET_KINDS).toContain("clock");
    expect(ASSET_KINDS).toContain("poster");
    expect(ASSET_KINDS).toContain("rug");
    expect(ASSET_KINDS).toContain("zone");
  });

  it("exposes directions, emotions and event types", () => {
    expect(DIRECTIONS).toEqual(["up", "down", "left", "right"]);
    expect(EMOTIONS).toContain("neutral");
    expect(EMOTIONS).toContain("surprised");
    expect(EMOTIONS).toContain("confident");
    expect(EVENT_TYPES).toEqual(["caption", "appear", "move", "emotion", "say", "exit"]);
  });
});

describe("enum validators", () => {
  it("requireDirection accepts the four directions", () => {
    for (const d of DIRECTIONS) expect(requireDirection(d, "p")).toBe(d);
    expect(() => requireDirection("north", "p")).toThrow(/p must be one of/);
    expect(() => requireDirection(5, "p")).toThrow(/p must be one of/);
  });

  it("requireEmotion accepts known emotions", () => {
    for (const e of EMOTIONS) expect(requireEmotion(e, "p")).toBe(e);
    expect(() => requireEmotion("angry", "p")).toThrow(/p must be one of/);
    expect(() => requireEmotion(1, "p")).toThrow(/p must be one of/);
  });

  it("requireAssetKind accepts the fixed set", () => {
    expect(requireAssetKind("desk", "p")).toBe("desk");
    expect(() => requireAssetKind("rocket", "p")).toThrow(/supported asset kinds/);
    expect(() => requireAssetKind(5, "p")).toThrow(/supported asset kinds/);
  });

  it("requireEventType accepts the fixed set", () => {
    for (const t of EVENT_TYPES) expect(requireEventType(t, "p")).toBe(t);
    expect(() => requireEventType("teleport", "p")).toThrow(/p must be one of/);
    expect(() => requireEventType(5, "p")).toThrow(/p must be one of/);
  });

  it("requireWallLayer accepts back/front", () => {
    expect(requireWallLayer("back", "p")).toBe("back");
    expect(requireWallLayer("front", "p")).toBe("front");
    expect(() => requireWallLayer("side", "p")).toThrow(/back.*front/);
  });

  it("requireWallDecorAssetKind accepts the three kinds", () => {
    expect(requireWallDecorAssetKind("whiteboard", "p")).toBe("whiteboard");
    expect(requireWallDecorAssetKind("clock", "p")).toBe("clock");
    expect(requireWallDecorAssetKind("poster", "p")).toBe("poster");
    expect(() => requireWallDecorAssetKind("desk", "p")).toThrow(/wall-decor/);
  });

  it("requireFloorDecalAssetKind accepts rug/zone", () => {
    expect(requireFloorDecalAssetKind("rug", "p")).toBe("rug");
    expect(requireFloorDecalAssetKind("zone", "p")).toBe("zone");
    expect(() => requireFloorDecalAssetKind("desk", "p")).toThrow(/floor-decal/);
  });
});

describe("parseStaticScene", () => {
  it("parses the full static scene fixture", () => {
    const scene = parseStaticScene(staticSceneFixture);
    expect(scene.meta.name).toContain("Northlight");
    expect(scene.meta.world).toEqual({ w: 1040, h: 730 });
    expect(scene.floor.plank).toBe(56);
    expect(scene.corridor.color).toBe("#1b2438");
    expect(scene.walls).toHaveLength(2);
    expect(scene.walls[0].layer).toBe("back");
    expect(scene.walls[1].layer).toBe("front");
    expect(scene.windows[0].view).toBe("city");
    expect(scene.door.label).toBe("ENTRANCE");
    expect(scene.wallDecor).toHaveLength(3);
    expect(scene.floorDecals).toHaveLength(2);
    expect(scene.lightPatches).toEqual([
      { x: 110, w: 180 },
      { x: 400, w: 170 },
    ]);
    expect(scene.assets).toHaveLength(19);
  });

  it("preserves optional asset fields and the external image reference", () => {
    const raw = {
      ...staticSceneFixture,
      assets: [
        { id: "a", asset: "desk", x: 1, y: 2, image: "https://x/desk.png", t: 10, d: 76, h: 44, sort: 5 },
        { id: "b", asset: "chair", x: 3, y: 4, dir: "left", color: "#fff" },
      ],
    };
    const scene = parseStaticScene(raw);
    expect(scene.assets[0]).toMatchObject({
      id: "a", asset: "desk", x: 1, y: 2, image: "https://x/desk.png",
      t: 10, d: 76, h: 44, sort: 5,
    });
    expect(scene.assets[1]).toMatchObject({ id: "b", asset: "chair", dir: "left", color: "#fff" });
  });

  it("throws descriptive errors for malformed/missing data", () => {
    expect(() => parseStaticScene(null)).toThrow(/staticScene must be an object/);
    expect(() => parseStaticScene([])).toThrow(/staticScene must be an object/);
    expect(() => parseStaticScene({ ...staticSceneFixture, meta: {} })).toThrow(
      /staticScene.meta.name must be a string/,
    );
    expect(() => parseStaticScene({ ...staticSceneFixture, floor: null })).toThrow(
      /staticScene.floor must be an object/,
    );
    expect(() => parseStaticScene({ ...staticSceneFixture, walls: "x" })).toThrow(
      /staticScene.walls must be an array/,
    );
    expect(() =>
      parseStaticScene({ ...staticSceneFixture, walls: [{ id: "w" }] }),
    ).toThrow(/staticScene.walls\[0\]\.x must be a number/);
    expect(() =>
      parseStaticScene({ ...staticSceneFixture, walls: [{ ...staticSceneFixture.walls[0], layer: "side" }] }),
    ).toThrow(/staticScene.walls\[0\]\.layer must be "back" or "front"/);
    expect(() =>
      parseStaticScene({ ...staticSceneFixture, windows: [{}] }),
    ).toThrow(/staticScene.windows\[0\]\.id must be a string/);
    expect(() => parseStaticScene({ ...staticSceneFixture, door: null })).toThrow(
      /staticScene.door must be an object/,
    );
    expect(() =>
      parseStaticScene({ ...staticSceneFixture, wallDecor: [{ id: "x", asset: "desk", x: 1, y: 2 }] }),
    ).toThrow(/staticScene.wallDecor\[0\]\.asset must be a wall-decor asset kind/);
    expect(() =>
      parseStaticScene({ ...staticSceneFixture, floorDecals: [{ id: "x", asset: "desk" }] }),
    ).toThrow(/staticScene.floorDecals\[0\]\.asset must be a floor-decal asset kind/);
    expect(() =>
      parseStaticScene({ ...staticSceneFixture, lightPatches: [{}] }),
    ).toThrow(/staticScene.lightPatches\[0\]\.x must be a number/);
    expect(() =>
      parseStaticScene({ ...staticSceneFixture, assets: [{ id: "a", asset: "rocket", x: 1, y: 2 }] }),
    ).toThrow(/staticScene.assets\[0\]\.asset must be one of the supported asset kinds/);
    expect(() =>
      parseStaticScene({ ...staticSceneFixture, assets: [{ asset: "desk", x: 1, y: 2 }] }),
    ).toThrow(/staticScene.assets\[0\]\.id must be a string/);
  });

  it("parseAsset validates a single asset", () => {
    expect(parseAsset({ id: "a", asset: "plant", x: 1, y: 2, s: 1.1, pot: "#f00" })).toMatchObject({
      id: "a", asset: "plant", x: 1, y: 2, s: 1.1, pot: "#f00",
    });
    expect(parseAsset({ id: "d1", asset: "desk", x: 1, y: 2, w: 200 })).toMatchObject({
      id: "d1", asset: "desk", x: 1, y: 2, w: 200,
    });
    expect(() => parseAsset(null)).toThrow(/asset must be an object/);
    expect(() => parseAsset({ id: "a", asset: "desk", x: 1 })).toThrow(/asset\.y must be a number/);
    expect(() => parseAsset({ id: "a", asset: "desk", x: 1, y: 2, dir: "north" })).toThrow(
      /asset\.dir must be one of/,
    );
  });
});

describe("parseLiveScene", () => {
  it("parses the full live scene fixture", () => {
    const live = parseLiveScene(liveSceneFixture);
    expect(live.meta).toEqual({
      scene: "northlight_floor3",
      tick: "seconds",
      defaultEmotion: "neutral",
    });
    expect(live.characters).toHaveLength(2);
    const noah = live.characters[0];
    expect(noah.id).toBe("noah");
    expect(noah.prop).toBe("bag");
    expect(noah.visible).toBe(false);
    expect(noah.dir).toBe("up");
    expect(noah.emotion).toBe("nervous");
    expect(noah.look.hairStyle).toBe("short");
    expect(live.characters[1].prop).toBeNull();
  });

  it("throws descriptive errors for malformed/missing data", () => {
    expect(() => parseLiveScene(null)).toThrow(/liveScene must be an object/);
    expect(() => parseLiveScene({ ...liveSceneFixture, meta: null })).toThrow(
      /liveScene.meta must be an object/,
    );
    expect(() => parseLiveScene({ ...liveSceneFixture, characters: "x" })).toThrow(
      /liveScene.characters must be an array/,
    );
    expect(() =>
      parseLiveScene({ ...liveSceneFixture, characters: [{ ...liveSceneFixture.characters[0], dir: "north" }] }),
    ).toThrow(/liveScene.characters\[0\]\.dir must be one of/);
    expect(() =>
      parseLiveScene({ ...liveSceneFixture, characters: [{ ...liveSceneFixture.characters[0], emotion: "angry" }] }),
    ).toThrow(/liveScene.characters\[0\]\.emotion must be one of/);
    expect(() =>
      parseLiveScene({ ...liveSceneFixture, characters: [{ ...liveSceneFixture.characters[0], look: {} }] }),
    ).toThrow(/liveScene.characters\[0\]\.look\.skin must be a string/);
    expect(() =>
      parseLiveScene({ ...liveSceneFixture, characters: [{ ...liveSceneFixture.characters[0], visible: "yes" }] }),
    ).toThrow(/liveScene.characters\[0\]\.visible must be a boolean/);
    expect(() =>
      parseLiveScene({ ...liveSceneFixture, characters: [{ ...liveSceneFixture.characters[0], prop: 5 }] }),
    ).toThrow(/liveScene.characters\[0\]\.prop must be a string/);
  });
});

describe("parseScenario", () => {
  it("parses the full scenario fixture with all event types", () => {
    const scenario = parseScenario(scenarioFixture);
    expect(scenario.id).toBe("first_day_greeting");
    expect(scenario.title).toContain("First Day");
    expect(scenario.duration).toBe(41);
    expect(scenario.events).toHaveLength(7);

    const byType = Object.fromEntries(scenario.events.map((e) => [e.type, e]));
    const say = scenario.events.find((e) => e.type === "say" && e.kind === "thought")!;
    expect(byType.caption.text).toBe("Monday · 9:02 AM");
    expect(byType.appear.at).toEqual([500, 718]);
    expect(byType.appear.dir).toBe("up");
    expect(byType.move.to).toEqual([500, 672]);
    expect(say.kind).toBe("thought");
    expect(say.dur).toBe(3.0);
    expect(say.text).toBe("Deep breath.");
    expect(byType.emotion.set).toBe("surprised");
    expect(byType.exit.who).toBe("noah");
  });

  it("throws descriptive errors for malformed/missing data", () => {
    expect(() => parseScenario(null)).toThrow(/scenario must be an object/);
    expect(() => parseScenario({ ...scenarioFixture, id: 5 })).toThrow(
      /scenario.id must be a string/,
    );
    expect(() => parseScenario({ ...scenarioFixture, title: 5 })).toThrow(
      /scenario.title must be a string/,
    );
    expect(() => parseScenario({ ...scenarioFixture, duration: "x" })).toThrow(
      /scenario.duration must be a number/,
    );
    expect(() => parseScenario({ ...scenarioFixture, events: "x" })).toThrow(
      /scenario.events must be an array/,
    );
    expect(() => parseScenario({ ...scenarioFixture, events: [{ type: "caption" }] })).toThrow(
      /scenario.events\[0\]\.t must be a number/,
    );
    expect(() =>
      parseScenario({ ...scenarioFixture, events: [{ t: 0, type: "teleport" }] }),
    ).toThrow(/scenario.events\[0\]\.type must be one of/);
  });

  it("validates per-event-type required fields", () => {
    const base = { t: 0 };
    expect(() => parseScenario({ ...scenarioFixture, events: [{ ...base, type: "caption" }] })).toThrow(
      /scenario.events\[0\]\.text must be a string/,
    );
    expect(() => parseScenario({ ...scenarioFixture, events: [{ ...base, type: "appear", at: "x" }] })).toThrow(
      /scenario.events\[0\]\.at must be a \[x, y\] pair/,
    );
    expect(() => parseScenario({ ...scenarioFixture, events: [{ ...base, type: "move", to: [1] }] })).toThrow(
      /scenario.events\[0\]\.to must be a \[x, y\] pair/,
    );
    expect(() => parseScenario({ ...scenarioFixture, events: [{ ...base, type: "emotion", set: "angry" }] })).toThrow(
      /scenario.events\[0\]\.set must be one of/,
    );
    expect(() => parseScenario({ ...scenarioFixture, events: [{ ...base, type: "say" }] })).toThrow(
      /scenario.events\[0\]\.text must be a string/,
    );
    expect(() => parseScenario({ ...scenarioFixture, events: [{ ...base, type: "move", to: [1, 2], dir: "north" }] })).toThrow(
      /scenario.events\[0\]\.dir must be one of/,
    );
    expect(() => parseScenario({ ...scenarioFixture, events: [{ ...base, type: "say", text: "x", dur: "long" }] })).toThrow(
      /scenario.events\[0\]\.dur must be a number/,
    );
  });
});
