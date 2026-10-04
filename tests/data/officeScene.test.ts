import { describe, it, expect } from "vitest";
import {
  loadOfficeScene,
  officeSceneData,
  officeStaticScene,
  officeLiveScene,
  officeScenario,
} from "../../src/data/officeScene";
import { SceneParseError } from "../../src/core/scene";

describe("office scene data (M1-T4a)", () => {
  it("exposes the raw static scene matching the prototype", () => {
    expect(officeStaticScene.meta.name).toBe("Northlight Studio · Floor 3");
    expect(officeStaticScene.meta.world).toEqual({ w: 1040, h: 730 });
    expect(officeStaticScene.walls).toHaveLength(5);
    expect(officeStaticScene.windows).toHaveLength(3);
    expect(officeStaticScene.wallDecor).toHaveLength(3);
    expect(officeStaticScene.floorDecals).toHaveLength(5);
    expect(officeStaticScene.lightPatches).toHaveLength(3);
    expect(officeStaticScene.assets).toHaveLength(41);
  });

  it("exposes the raw live scene with all five characters at initial state", () => {
    expect(officeLiveScene.meta.scene).toBe("northlight_floor3");
    expect(officeLiveScene.characters).toHaveLength(5);
    const noah = officeLiveScene.characters.find((c) => c.id === "noah")!;
    expect(noah.name).toBe("Noah");
    expect(noah.role).toContain("Frontend");
    expect(noah.visible).toBe(false);
    expect(noah.prop).toBe("bag");
    expect(noah.emotion).toBe("nervous");
    const maya = officeLiveScene.characters.find((c) => c.id === "maya")!;
    expect(maya.role).toBe("Team lead · Platform");
    expect(maya.visible).toBe(true);
    expect(maya.prop).toBeNull();
  });

  it("exposes the raw scenario with the 41s first-day timeline", () => {
    expect(officeScenario.id).toBe("first_day_greeting");
    expect(officeScenario.title).toBe("First Day — Noah Joins the Team");
    expect(officeScenario.duration).toBe(41);
    expect(officeScenario.events).toHaveLength(43);
  });

  it("bundles the three raw parts as officeSceneData", () => {
    expect(officeSceneData.staticScene).toBe(officeStaticScene);
    expect(officeSceneData.liveScene).toBe(officeLiveScene);
    expect(officeSceneData.scenario).toBe(officeScenario);
  });
});

describe("loadOfficeScene()", () => {
  it("parses the office data into a typed Scene", () => {
    const scene = loadOfficeScene();
    expect(scene.staticScene.meta.name).toBe("Northlight Studio · Floor 3");
    expect(scene.staticScene.meta.world).toEqual({ w: 1040, h: 730 });
    expect(scene.staticScene.assets).toHaveLength(41);
    expect(scene.liveScene.characters).toHaveLength(5);
    expect(scene.scenario.duration).toBe(41);
    expect(scene.scenario.events).toHaveLength(43);
  });

  it("spot-checks key fields of the parsed scene", () => {
    const scene = loadOfficeScene();
    const noah = scene.liveScene.characters.find((c) => c.id === "noah")!;
    expect(noah.role).toContain("Frontend");
    expect(noah.visible).toBe(false);
    expect(noah.prop).toBe("bag");
    expect(scene.staticScene.assets.find((a) => a.id === "tbl_lounge")).toMatchObject({
      id: "tbl_lounge", asset: "roundTable", r: 74,
    });
    expect(scene.scenario.events[0]).toMatchObject({
      t: 0, type: "caption",
      text: "Monday · 9:02 AM — Northlight Studio, floor 3",
    });
  });

  it("throws SceneParseError on malformed data", () => {
    expect(() =>
      loadOfficeScene({ ...officeSceneData, scenario: null as unknown as typeof officeScenario }),
    ).toThrow(SceneParseError);
    expect(() =>
      loadOfficeScene({ ...officeSceneData, liveScene: { ...officeLiveScene, characters: [] } }),
    ).not.toThrow();
  });

  it("exposes the SceneParseError type", () => {
    expect(SceneParseError).toBeDefined();
    expect(() => loadOfficeScene()).not.toThrow();
  });
});
