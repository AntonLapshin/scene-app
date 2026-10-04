import { describe, it, expect } from "vitest";
import {
  drawProcedural,
  renderAsset,
  defaultAssetSize,
  characterDrawOps,
  EMOTION_GLYPH,
} from "../../../src/core/scene/draw";
import type { Asset, AssetKind, CharacterState } from "../../../src/core/scene/types";

/** Every fixed asset kind the renderer must be able to draw. */
const ALL_KINDS: AssetKind[] = [
  "desk", "roundTable", "chair", "stool", "sofa", "cabinet", "counter",
  "crates", "printer", "waterCooler", "coffeeMachine", "kettle", "cupRow",
  "cup", "papers", "laptop", "lamp", "deskSign", "plant",
  "whiteboard", "clock", "poster", "rug", "zone",
];

function asset(kind: AssetKind, overrides: Partial<Asset> = {}): Asset {
  return { id: "a1", asset: kind, x: 100, y: 200, ...overrides };
}

describe("defaultAssetSize", () => {
  it("returns a finite positive size for every asset kind", () => {
    for (const kind of ALL_KINDS) {
      const size = defaultAssetSize(kind);
      expect(size.w).toBeGreaterThan(0);
      expect(size.h).toBeGreaterThan(0);
      expect(Number.isFinite(size.w)).toBe(true);
      expect(Number.isFinite(size.h)).toBe(true);
    }
  });
});

describe("drawProcedural", () => {
  it("produces at least one draw op for every asset kind", () => {
    for (const kind of ALL_KINDS) {
      const ops = drawProcedural(asset(kind));
      expect(ops.length, kind).toBeGreaterThan(0);
      for (const op of ops) {
        expect(op.type).toMatch(/^(rect|ellipse|line|text|image)$/);
      }
    }
  });

  it("is deterministic: same asset produces identical output", () => {
    const a = asset("desk", { w: 170, d: 76, t: 10, color: "#f4ece0", edge: "#c9b694" });
    expect(drawProcedural(a)).toEqual(drawProcedural(a));
    const b = asset("roundTable", { r: 74, t: 9 });
    expect(drawProcedural(b)).toEqual(drawProcedural(b));
  });

  it("draws a desk as a slab plus legs", () => {
    const ops = drawProcedural(asset("desk", { w: 170, d: 76, t: 10 }));
    expect(ops).toHaveLength(4);
    expect(ops[0]).toMatchObject({ type: "rect", x: 100, y: 200, w: 170, h: 76 });
    expect(ops[1]).toMatchObject({ type: "rect", h: 10 });
  });

  it("draws a round table with an elliptical top", () => {
    const ops = drawProcedural(asset("roundTable", { r: 74, t: 9 }));
    expect(ops.every((o) => o.type === "ellipse")).toBe(true);
    expect(ops[1]).toMatchObject({ type: "ellipse", rx: 74, cy: 200 - 9 });
  });

  it("orients chair and sofa backs by facing", () => {
    expect(drawProcedural(asset("chair", { dir: "down" }))[0]).toMatchObject({ y: 200 - 6 });
    expect(drawProcedural(asset("chair", { dir: "up" }))[0]).toMatchObject({ y: 200 + 32 });
    expect(drawProcedural(asset("chair", { dir: "left" }))[0]).toMatchObject({ x: 100 - 6 });
    expect(drawProcedural(asset("sofa", { dir: "right" }))[0]).toMatchObject({ x: 100 - 8 });
    expect(drawProcedural(asset("sofa", { dir: "left" }))[0]).toMatchObject({ x: 100 + 66 });
  });

  it("emits a cup row with one op per cup", () => {
    const ops = drawProcedural(asset("cupRow"));
    expect(ops).toHaveLength(5);
    expect(ops.every((o) => o.type === "rect")).toBe(true);
  });

  it("emits text ops for desk sign and zone labels", () => {
    const sign = drawProcedural(asset("deskSign", { text: "NOAH" }));
    expect(sign.some((o) => o.type === "text" && o.text === "NOAH")).toBe(true);

    const zone = drawProcedural(asset("zone", { label: "DESK POD" }));
    expect(zone.some((o) => o.type === "text" && o.text === "DESK POD")).toBe(true);
    expect(zone.some((o) => o.type === "rect" && o.fill === "none")).toBe(true);
  });

  it("draws a clock as a face plus two hands", () => {
    const ops = drawProcedural(asset("clock", { r: 15 }));
    expect(ops.filter((o) => o.type === "ellipse")).toHaveLength(1);
    expect(ops.filter((o) => o.type === "line")).toHaveLength(2);
  });

  it("scales a plant by its scale factor", () => {
    const ops = drawProcedural(asset("plant", { s: 0.5 }));
    const pot = ops.find((o) => o.type === "rect") as { x: number; w: number } | undefined;
    expect(pot).toBeDefined();
    expect(pot!.w).toBeCloseTo(40 * 0.5);
  });
});

describe("renderAsset", () => {
  it("returns a single image op when the image is available", () => {
    const a = asset("desk", { image: "/sprites/desk.png", w: 170, h: 76 });
    const ops = renderAsset(a, (src) => src === "/sprites/desk.png");
    expect(ops).toHaveLength(1);
    expect(ops[0]).toEqual({
      type: "image",
      x: 100,
      y: 200,
      w: 170,
      h: 76,
      src: "/sprites/desk.png",
    });
  });

  it("falls back to procedural drawing when no image is referenced", () => {
    const ops = renderAsset(asset("desk"));
    expect(ops[0].type).not.toBe("image");
    expect(ops.length).toBeGreaterThan(1);
  });

  it("falls back to procedural drawing when the image is unavailable", () => {
    const a = asset("desk", { image: "/sprites/missing.png" });
    const ops = renderAsset(a, () => false);
    expect(ops.every((o) => o.type !== "image")).toBe(true);
    expect(ops.length).toBeGreaterThan(1);
  });

  it("defaults image availability to unavailable", () => {
    const a = asset("desk", { image: "/sprites/whatever.png" });
    expect(renderAsset(a).every((o) => o.type !== "image")).toBe(true);
  });

  it("uses default asset size for the image op when w/h are absent", () => {
    const a = asset("rug", { image: "/sprites/rug.png" });
    const ops = renderAsset(a, () => true);
    expect(ops[0]).toMatchObject({ type: "image", w: 290, h: 215, src: "/sprites/rug.png" });
  });
});

describe("characterDrawOps (M4-T2)", () => {
  const base: CharacterState = {
    id: "maya",
    name: "Maya",
    role: "New hire",
    color: "#4f7cff",
    x: 300,
    y: 400,
    dir: "down",
    emotion: "happy",
    visible: true,
    prop: null,
    look: {
      skin: "#f2c79b",
      skin2: "#e8b58a",
      hair: "#5b3a1e",
      hairStyle: "bob",
      shirt: "#4f7cff",
      shirt2: "#7fb6ff",
      pants: "#2b3550",
      shoes: "#222",
    },
  };

  it("renders the look palette, emotion glyph and no say bubble", () => {
    const ops = characterDrawOps(base);
    expect(ops.some((o) => o.type === "rect" && o.fill === base.look.pants)).toBe(true);
    expect(ops.some((o) => o.type === "rect" && o.fill === base.look.shirt)).toBe(true);
    expect(ops.some((o) => o.type === "ellipse" && o.fill === base.look.skin)).toBe(true);
    expect(ops.some((o) => o.type === "ellipse" && o.fill === base.look.hair)).toBe(true);
    const glyph = ops.find((o) => o.type === "text" && o.text === EMOTION_GLYPH.happy);
    expect(glyph).toBeTruthy();
    // no say bubble
    expect(ops.some((o) => o.type === "rect" && o.fill === "#fff")).toBe(false);
  });

  it("adds a say bubble when the character has an active say state", () => {
    const withSay: CharacterState = {
      ...base,
      say: { text: "Hello!", kind: "say", emotion: "happy", until: 42 },
    };
    const ops = characterDrawOps(withSay);
    const bubble = ops.find((o) => o.type === "rect" && o.fill === "#fff");
    expect(bubble).toBeTruthy();
    const bubbleText = ops.find((o) => o.type === "text" && o.text === "Hello!");
    expect(bubbleText).toBeTruthy();
  });

  it("falls back to the neutral glyph for unknown emotions", () => {
    const unknown = { ...base, emotion: "weird" as CharacterState["emotion"] };
    const ops = characterDrawOps(unknown);
    expect(
      ops.some((o) => o.type === "text" && o.text === EMOTION_GLYPH.neutral),
    ).toBe(true);
  });
});
