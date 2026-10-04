/**
 * Core asset renderer (plan.md §19.1, M1-T3).
 *
 * A pure renderer that turns each asset of the fixed prototype set into a list
 * of draw operations (primitives). Assets that reference an external image are
 * drawn from that image when it is available; when the image is missing or
 * unavailable the renderer falls back to a deterministic procedural drawing.
 *
 * Everything here is pure and side-effect free. The image-availability check is
 * injected as a predicate so no I/O (fetch, DOM, browser APIs) leaks into core.
 * The same asset + params always produces the same output.
 */

import type { Asset, AssetKind, CharacterState } from "./types";

/* ── Draw operation model ─────────────────────────────────────────── */

/** The primitive draw-operation types the renderer can emit. */
export type DrawOpType = "rect" | "ellipse" | "line" | "text" | "image";

/** A filled/stroked rectangle. */
export interface DrawRect {
  type: "rect";
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rx?: number;
}

/** A filled/stroked ellipse. */
export interface DrawEllipse {
  type: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

/** A stroked line segment. */
export interface DrawLine {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth?: number;
}

/** A text label. */
export interface DrawText {
  type: "text";
  x: number;
  y: number;
  text: string;
  fill?: string;
  fontSize?: number;
}

/** An external image reference. */
export interface DrawImage {
  type: "image";
  x: number;
  y: number;
  w: number;
  h: number;
  src: string;
}

/** Any draw operation the renderer produces. */
export type DrawOp = DrawRect | DrawEllipse | DrawLine | DrawText | DrawImage;

/** Predicate reporting whether an external image source is available. */
export type ImageAvailability = (src: string) => boolean;

/* ── Small constructors ───────────────────────────────────────────── */

function rect(op: Omit<DrawRect, "type">): DrawRect {
  return { type: "rect", ...op };
}

function ellipse(op: Omit<DrawEllipse, "type">): DrawEllipse {
  return { type: "ellipse", ...op };
}

function line(op: Omit<DrawLine, "type">): DrawLine {
  return { type: "line", ...op };
}

function text(op: Omit<DrawText, "type">): DrawText {
  return { type: "text", fill: "#222", fontSize: 12, ...op };
}

function image(op: Omit<DrawImage, "type">): DrawImage {
  return { type: "image", ...op };
}

/* ── Default geometry per asset kind ──────────────────────────────── */

/** Default footprint width per asset kind (used when no explicit w/h). */
export function defaultAssetSize(kind: AssetKind): { w: number; h: number } {
  switch (kind) {
    case "desk": return { w: 170, h: 76 };
    case "roundTable": return { w: 148, h: 82 };
    case "chair": return { w: 40, h: 32 };
    case "stool": return { w: 34, h: 26 };
    case "sofa": return { w: 66, h: 172 };
    case "cabinet": return { w: 190, h: 60 };
    case "counter": return { w: 242, h: 58 };
    case "crates": return { w: 60, h: 48 };
    case "printer": return { w: 92, h: 64 };
    case "waterCooler": return { w: 44, h: 42 };
    case "coffeeMachine": return { w: 64, h: 48 };
    case "kettle": return { w: 44, h: 30 };
    case "cupRow": return { w: 72, h: 22 };
    case "cup": return { w: 18, h: 20 };
    case "papers": return { w: 40, h: 8 };
    case "laptop": return { w: 52, h: 36 };
    case "lamp": return { w: 24, h: 40 };
    case "deskSign": return { w: 48, h: 20 };
    case "plant": return { w: 40, h: 56 };
    case "whiteboard": return { w: 132, h: 50 };
    case "clock": return { w: 30, h: 30 };
    case "poster": return { w: 36, h: 46 };
    case "rug": return { w: 290, h: 215 };
    case "zone": return { w: 400, h: 330 };
  }
}

/* ── Procedural drawing per asset kind ────────────────────────────── */

/** Draw a desk: slab top, side, and two legs. */
function drawDesk(a: Asset): DrawOp[] {
  const w = a.w ?? 170;
  const d = a.d ?? 76;
  const t = a.t ?? 10;
  const color = a.color ?? "#f4ece0";
  const edge = a.edge ?? "#c9b694";
  return [
    rect({ x: a.x, y: a.y, w, h: d, fill: edge }),
    rect({ x: a.x, y: a.y, w, h: t, fill: color }),
    rect({ x: a.x, y: a.y + d - 12, w: 8, h: 12, fill: edge }),
    rect({ x: a.x + w - 8, y: a.y + d - 12, w: 8, h: 12, fill: edge }),
  ];
}

/** Draw a round table: an elliptical top over a thicker elliptical base. */
function drawRoundTable(a: Asset): DrawOp[] {
  const r = a.r ?? 74;
  const t = a.t ?? 9;
  const color = a.color ?? "#f7f0e4";
  const edge = a.edge ?? "#c9b694";
  return [
    ellipse({ cx: a.x, cy: a.y, rx: r, ry: r * 0.55, fill: edge }),
    ellipse({ cx: a.x, cy: a.y - t, rx: r, ry: r * 0.55, fill: color }),
  ];
}

/** Draw a chair: a seat plus a back depending on facing. */
function drawChair(a: Asset): DrawOp[] {
  const w = a.w ?? 40;
  const d = a.d ?? 32;
  const color = a.color ?? "#4f7cff";
  const dir = a.dir ?? "down";
  const seat = rect({ x: a.x, y: a.y, w, h: d, fill: color });
  if (dir === "down") return [rect({ x: a.x, y: a.y - 6, w, h: 6, fill: color }), seat];
  if (dir === "up") return [rect({ x: a.x, y: a.y + d, w, h: 6, fill: color }), seat];
  return [rect({ x: a.x - 6, y: a.y, w: 6, h: d, fill: color }), seat];
}

/** Draw a stool: a seat pad over a short block. */
function drawStool(a: Asset): DrawOp[] {
  const w = a.w ?? 34;
  const d = a.d ?? 26;
  const color = a.color ?? "#ffb648";
  return [
    rect({ x: a.x, y: a.y, w, h: d, fill: color }),
    ellipse({ cx: a.x + w / 2, cy: a.y, rx: w / 2, ry: 6, fill: color }),
  ];
}

/** Draw a sofa: a base plus a backrest on the facing side. */
function drawSofa(a: Asset): DrawOp[] {
  const w = a.w ?? 66;
  const d = a.d ?? 172;
  const color = a.color ?? "#9b6cf5";
  const dir = a.dir ?? "right";
  const base = rect({ x: a.x, y: a.y, w, h: d, fill: color });
  if (dir === "right") return [rect({ x: a.x - 8, y: a.y, w: 8, h: d, fill: color }), base];
  return [rect({ x: a.x + w, y: a.y, w: 8, h: d, fill: color }), base];
}

/** Draw a cabinet or counter: a box with a top strip. */
function drawBox(a: Asset, fallbackW: number, fallbackD: number, fallbackColor: string): DrawOp[] {
  const w = a.w ?? fallbackW;
  const d = a.d ?? fallbackD;
  const h = a.h ?? 68;
  const color = a.color ?? fallbackColor;
  const top = a.top ?? color;
  return [
    rect({ x: a.x, y: a.y, w, h: d, fill: color }),
    rect({ x: a.x, y: a.y, w, h: Math.min(h * 0.2, 12), fill: top }),
  ];
}

/** Draw a stack of crates. */
function drawCrates(a: Asset): DrawOp[] {
  const w = a.w ?? 60;
  const color = a.color ?? "#c98a5e";
  return [
    rect({ x: a.x, y: a.y, w, h: 24, fill: color }),
    rect({ x: a.x + 6, y: a.y - 18, w: w - 12, h: 18, fill: color }),
  ];
}

/** Draw a printer: a box plus a paper slot. */
function drawPrinter(a: Asset): DrawOp[] {
  const w = a.w ?? 92;
  const d = a.d ?? 64;
  const color = a.color ?? "#dfe5f0";
  return [
    rect({ x: a.x, y: a.y, w, h: d, fill: color }),
    rect({ x: a.x + 8, y: a.y + 6, w: w - 16, h: 10, fill: "#fff", stroke: color }),
  ];
}

/** Draw a water cooler: a body with a bottle on top. */
function drawWaterCooler(a: Asset): DrawOp[] {
  const w = a.w ?? 44;
  const d = a.d ?? 42;
  return [
    rect({ x: a.x, y: a.y, w, h: d, fill: "#dfe5f0" }),
    rect({ x: a.x + w / 2 - 10, y: a.y - 18, w: 20, h: 18, fill: "#bfe8ff", rx: 6 }),
  ];
}

/** Draw a coffee machine: a box with a spout. */
function drawCoffeeMachine(a: Asset): DrawOp[] {
  const w = a.w ?? 64;
  const color = a.color ?? "#4a5568";
  return [
    rect({ x: a.x, y: a.y, w, h: 48, fill: color, rx: 4 }),
    rect({ x: a.x + 6, y: a.y + 26, w: 14, h: 8, fill: "#fff" }),
  ];
}

/** Draw a kettle: a body with a handle. */
function drawKettle(a: Asset): DrawOp[] {
  const w = a.w ?? 44;
  const color = a.color ?? "#ff5d7a";
  return [
    ellipse({ cx: a.x + w / 2, cy: a.y + 20, rx: w / 2, ry: 20, fill: color }),
    line({ x1: a.x + 4, y1: a.y + 8, x2: a.x + 4, y2: a.y + 20, stroke: color, strokeWidth: 3 }),
  ];
}

/** Draw a row of cups. */
function drawCupRow(a: Asset): DrawOp[] {
  const count = 5;
  const color = a.color ?? "#ff5d7a";
  const ops: DrawOp[] = [];
  for (let i = 0; i < count; i += 1) {
    ops.push(rect({ x: a.x + i * 14, y: a.y, w: 12, h: 20, fill: color, rx: 3 }));
  }
  return ops;
}

/** Draw a single cup. */
function drawCup(a: Asset): DrawOp[] {
  const color = a.color ?? "#ff5d7a";
  return [
    rect({ x: a.x, y: a.y, w: 18, h: 20, fill: color, rx: 4 }),
    ellipse({ cx: a.x + 9, cy: a.y, rx: 9, ry: 4, fill: color }),
  ];
}

/** Draw a small stack of papers. */
function drawPapers(a: Asset): DrawOp[] {
  const w = a.w ?? 40;
  const color = a.color ?? "#fff";
  return [
    rect({ x: a.x, y: a.y, w, h: 6, fill: color, stroke: "#ccc" }),
    rect({ x: a.x + 3, y: a.y - 5, w: w - 6, h: 6, fill: color, stroke: "#ccc" }),
  ];
}

/** Draw a laptop: a base and a raised screen. */
function drawLaptop(a: Asset): DrawOp[] {
  const w = a.w ?? 52;
  return [
    rect({ x: a.x, y: a.y + 12, w, h: 10, fill: "#222" }),
    rect({ x: a.x + 4, y: a.y, w: w - 8, h: 14, fill: "#7fb6ff" }),
  ];
}

/** Draw a lamp: a pole and a shade. */
function drawLamp(a: Asset): DrawOp[] {
  const color = a.color ?? "#222";
  return [
    line({ x1: a.x + 12, y1: a.y + 40, x2: a.x + 12, y2: a.y + 12, stroke: color, strokeWidth: 3 }),
    ellipse({ cx: a.x + 12, cy: a.y + 8, rx: 12, ry: 8, fill: color }),
  ];
}

/** Draw a desk sign: a base plus the label text. */
function drawDeskSign(a: Asset): DrawOp[] {
  const w = a.w ?? 48;
  const color = a.color ?? "#2b3550";
  return [
    rect({ x: a.x, y: a.y, w, h: 16, fill: color, rx: 3 }),
    text({ x: a.x + w / 2, y: a.y + 12, text: a.text ?? "", fill: "#fff", fontSize: 11 }),
  ];
}

/** Draw a plant: a pot and a few leaves. */
function drawPlant(a: Asset): DrawOp[] {
  const s = a.s ?? 1;
  const pot = a.pot ?? "#2ec4a6";
  const w = 40 * s;
  return [
    rect({ x: a.x, y: a.y + 30 * s, w, h: 26 * s, fill: pot }),
    ellipse({ cx: a.x + w / 2, cy: a.y + 30 * s, rx: w / 2, ry: 6 * s, fill: pot }),
    ellipse({ cx: a.x + w / 2, cy: a.y + 12 * s, rx: 18 * s, ry: 20 * s, fill: "#3fae6b" }),
  ];
}

/** Draw a whiteboard: a board plus an ink stroke. */
function drawWhiteboard(a: Asset): DrawOp[] {
  const w = a.w ?? 132;
  const h = a.h ?? 50;
  const ink = a.ink ?? "#4f7cff";
  return [
    rect({ x: a.x, y: a.y, w, h, fill: "#fff", stroke: "#c4cde0" }),
    line({ x1: a.x + 10, y1: a.y + 14, x2: a.x + 40, y2: a.y + 30, stroke: ink, strokeWidth: 3 }),
  ];
}

/** Draw a clock: a face and two hands. */
function drawClock(a: Asset): DrawOp[] {
  const r = a.r ?? 15;
  const cx = a.x;
  const cy = a.y;
  return [
    ellipse({ cx, cy, rx: r, ry: r, fill: "#fff", stroke: "#2b3550" }),
    line({ x1: cx, y1: cy, x2: cx, y2: cy - r * 0.6, stroke: "#2b3550", strokeWidth: 2 }),
    line({ x1: cx, y1: cy, x2: cx + r * 0.45, y2: cy, stroke: "#2b3550", strokeWidth: 2 }),
  ];
}

/** Draw a poster: a colored rectangle. */
function drawPoster(a: Asset): DrawOp[] {
  const w = a.w ?? 36;
  const h = a.h ?? 46;
  const color = a.color ?? "#ff5d7a";
  return [rect({ x: a.x, y: a.y, w, h, fill: color })];
}

/** Draw a rug: a rounded rectangle. */
function drawRug(a: Asset): DrawOp[] {
  const w = a.w ?? 290;
  const h = a.h ?? 215;
  const color = a.color ?? "#4f7cff";
  const trim = a.trim ?? "#9b6cf5";
  return [
    rect({ x: a.x, y: a.y, w, h, fill: color, rx: 16 }),
    rect({ x: a.x + 6, y: a.y + 6, w: w - 12, h: h - 12, fill: "none", stroke: trim, strokeWidth: 2, rx: 12 }),
  ];
}

/** Draw a zone: a labeled outline. */
function drawZone(a: Asset): DrawOp[] {
  const w = a.w ?? 400;
  const h = a.h ?? 330;
  const color = a.color ?? "#ffb648";
  return [
    rect({ x: a.x, y: a.y, w, h, fill: "none", stroke: color, strokeWidth: 2 }),
    text({ x: a.x + 6, y: a.y + 14, text: a.label ?? "", fill: color, fontSize: 12 }),
  ];
}

/** Produce the deterministic procedural draw ops for an asset. */
export function drawProcedural(asset: Asset): DrawOp[] {
  switch (asset.asset) {
    case "desk": return drawDesk(asset);
    case "roundTable": return drawRoundTable(asset);
    case "chair": return drawChair(asset);
    case "stool": return drawStool(asset);
    case "sofa": return drawSofa(asset);
    case "cabinet": return drawBox(asset, 190, 60, "#5b6b8c");
    case "counter": return drawBox(asset, 242, 58, "#eaeef7");
    case "crates": return drawCrates(asset);
    case "printer": return drawPrinter(asset);
    case "waterCooler": return drawWaterCooler(asset);
    case "coffeeMachine": return drawCoffeeMachine(asset);
    case "kettle": return drawKettle(asset);
    case "cupRow": return drawCupRow(asset);
    case "cup": return drawCup(asset);
    case "papers": return drawPapers(asset);
    case "laptop": return drawLaptop(asset);
    case "lamp": return drawLamp(asset);
    case "deskSign": return drawDeskSign(asset);
    case "plant": return drawPlant(asset);
    case "whiteboard": return drawWhiteboard(asset);
    case "clock": return drawClock(asset);
    case "poster": return drawPoster(asset);
    case "rug": return drawRug(asset);
    case "zone": return drawZone(asset);
  }
}

/**
 * Render an asset to draw operations.
 *
 * When the asset references an external image and that image is available, a
 * single image draw-op is returned. Otherwise the deterministic procedural
 * drawing is returned. `imageAvailable` defaults to "unavailable" so the
 * fallback path is exercised unless a caller explicitly reports otherwise.
 */
export function renderAsset(
  asset: Asset,
  imageAvailable: ImageAvailability = () => false,
): DrawOp[] {
  if (asset.image && imageAvailable(asset.image)) {
    const size = defaultAssetSize(asset.asset);
    const w = asset.w ?? size.w;
    const h = asset.h ?? size.h;
    return [image({ x: asset.x, y: asset.y, w, h, src: asset.image })];
  }
  return drawProcedural(asset);
}

/* ── Character rendering ──────────────────────────────────────────── */

/** Emotion → glyph mapping, used for the small glyph above a head. */
export const EMOTION_GLYPH: Record<string, string> = {
  neutral: "·",
  happy: "☺",
  excited: "★",
  nervous: "~",
  surprised: "!",
  shy: "☁",
  confident: "▲",
  proud: "♛",
  sad: "☹",
  annoyed: "#",
  thinking: "?",
};

/** Default body geometry for a character (local coords, feet at origin). */
const BODY = 26;
const HEAD_R = 11;

/**
 * Produce the deterministic draw ops for a character (M4-T2).
 *
 * Pure and side-effect free: the same character state always produces the same
 * ops, in character-local coordinates (origin at the feet center) so callers
 * can translate the result into place. Draws the look palette (pants, shoes,
 * shirt, skin, hair), the emotion glyph, and any active say bubble.
 */
export function characterDrawOps(character: CharacterState): DrawOp[] {
  const { look, emotion, say } = character;
  const headCy = -BODY - HEAD_R;
  const ops: DrawOp[] = [
    // legs / shoes
    rect({ x: -8, y: -BODY + 8, w: 7, h: 10, fill: look.pants }),
    rect({ x: 1, y: -BODY + 8, w: 7, h: 10, fill: look.pants }),
    rect({ x: -9, y: -BODY + 16, w: 9, h: 4, fill: look.shoes, rx: 1 }),
    rect({ x: 0, y: -BODY + 16, w: 9, h: 4, fill: look.shoes, rx: 1 }),
    // torso / shirt
    rect({ x: -11, y: -BODY, w: 22, h: 14, fill: look.shirt, rx: 3 }),
    rect({ x: -11, y: -BODY, w: 22, h: 6, fill: look.shirt2, rx: 3 }),
    // head (ellipse with rx === ry draws a circle)
    ellipse({ cx: 0, cy: headCy, rx: HEAD_R, ry: HEAD_R, fill: look.skin }),
    // hair dome
    ellipse({
      cx: 0,
      cy: headCy - HEAD_R * 0.35,
      rx: HEAD_R,
      ry: HEAD_R * 0.85,
      fill: look.hair,
    }),
    // emotion glyph
    text({
      x: 0,
      y: headCy - HEAD_R - 6,
      text: EMOTION_GLYPH[emotion] ?? EMOTION_GLYPH.neutral,
      fill: "#2b3550",
      fontSize: 12,
    }),
  ];

  // Active say/thought bubble above the head.
  if (say) {
    const bubbleW = 60 + say.text.length * 3;
    const bubbleH = 20;
    const bx = -bubbleW / 2;
    const by = headCy - HEAD_R - 26;
    ops.push(
      rect({
        x: bx,
        y: by,
        w: bubbleW,
        h: bubbleH,
        fill: "#fff",
        stroke: "#c4cde0",
        rx: 8,
      }),
      text({
        x: 0,
        y: by + bubbleH / 2,
        text: say.text,
        fill: "#2b3550",
        fontSize: 11,
      }),
    );
  }

  return ops;
}
