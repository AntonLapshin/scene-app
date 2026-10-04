/**
 * Core typed models for the three scene JSON shapes (plan.md §19.1).
 *
 * These types mirror the data produced by the ws/scene/prototype.html web app:
 * a STATIC_SCENE (geometry + fixed objects/assets), a LIVE_SCENE (characters),
 * and a SCENARIO (timeline of events). All types are pure data — no React, no
 * DOM, no browser APIs — so they can be validated and tested exhaustively.
 */

/** Cardinal direction a character or asset faces. */
export type Direction = "up" | "down" | "left" | "right";

/** The fixed set of directions from the prototype. */
export const DIRECTIONS: readonly Direction[] = ["up", "down", "left", "right"];

/** Emotions a character can express (from the prototype). */
export type Emotion =
  | "neutral"
  | "happy"
  | "excited"
  | "nervous"
  | "surprised"
  | "shy"
  | "confident"
  | "proud"
  | "sad"
  | "annoyed"
  | "thinking";

/** The fixed set of emotions from the prototype. */
export const EMOTIONS: readonly Emotion[] = [
  "neutral",
  "happy",
  "excited",
  "nervous",
  "surprised",
  "shy",
  "confident",
  "proud",
  "sad",
  "annoyed",
  "thinking",
];

/** Fixed furniture asset kinds from the prototype. */
export type FurnitureAssetKind =
  | "desk"
  | "roundTable"
  | "chair"
  | "stool"
  | "sofa"
  | "cabinet"
  | "counter"
  | "crates"
  | "printer"
  | "waterCooler"
  | "coffeeMachine"
  | "kettle"
  | "cupRow"
  | "cup"
  | "papers"
  | "laptop"
  | "lamp"
  | "deskSign"
  | "plant";

/** Fixed wall-decor asset kinds. */
export type WallDecorAssetKind = "whiteboard" | "clock" | "poster";

/** Fixed floor-decal asset kinds. */
export type FloorDecalAssetKind = "rug" | "zone";

/** Every fixed asset kind the engine can draw. */
export type AssetKind = FurnitureAssetKind | WallDecorAssetKind | FloorDecalAssetKind;

/** The full fixed asset set from the prototype. */
export const ASSET_KINDS: readonly AssetKind[] = [
  ...new Set<AssetKind>([
    "desk", "roundTable", "chair", "stool", "sofa", "cabinet", "counter",
    "crates", "printer", "waterCooler", "coffeeMachine", "kettle", "cupRow",
    "cup", "papers", "laptop", "lamp", "deskSign", "plant",
    "whiteboard", "clock", "poster", "rug", "zone",
  ]),
];

/* ── STATIC_SCENE ─────────────────────────────────────────────────── */

/** World size in abstract units. */
export interface WorldSize {
  w: number;
  h: number;
}

/** Static scene metadata. */
export interface StaticMeta {
  name: string;
  style: string;
  projection: string;
  world: WorldSize;
}

/** Floor slab. */
export interface Floor {
  x: number;
  y: number;
  w: number;
  h: number;
  plank: number;
  base: string;
  tone: string;
}

/** Entrance corridor. */
export interface Corridor {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

/** Which wall layer a wall belongs to. */
export type WallLayer = "back" | "front";

/** A wall segment. */
export interface Wall {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  height: number;
  face: string;
  top: string;
  layer: WallLayer;
}

/** A window on a wall. */
export interface Window {
  id: string;
  wall: string;
  x: number;
  y: number;
  w: number;
  h: number;
  view: string;
}

/** The room's entrance door. */
export interface Door {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  frame: string;
  label: string;
}

/** A piece of wall decoration (whiteboard/clock/poster). */
export interface WallDecor {
  id: string;
  asset: WallDecorAssetKind;
  x: number;
  y: number;
  w?: number;
  h?: number;
  r?: number;
  ink?: string;
  color?: string;
}

/** A floor decal (rug/zone). */
export interface FloorDecal {
  id: string;
  asset: FloorDecalAssetKind;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  trim?: string;
  label?: string;
}

/** A light patch cast from a window. */
export interface LightPatch {
  x: number;
  w: number;
}

/**
 * A fixed asset placed in the scene.
 *
 * `asset` selects one of the fixed kinds from the prototype. `image` is an
 * optional external image reference (sprite/background); when absent the
 * engine falls back to procedural drawing. The remaining fields are
 * asset-specific layout/visual props, all optional, matching the prototype.
 */
export interface Asset {
  id: string;
  asset: AssetKind;
  x: number;
  y: number;
  /** Optional external image reference (sprite/background). */
  image?: string;
  /** Width (counter/sofa/cabinet/printer/waterCooler/desk/etc.). */
  w?: number;
  /** Slab thickness (desk/roundTable). */
  t?: number;
  /** Depth (desk/counter/cabinet/waterCooler/sofa/printer). */
  d?: number;
  /** Height (desk/counter/cabinet/waterCooler/printer). */
  h?: number;
  /** Radius (roundTable/clock). */
  r?: number;
  /** Vertical offset above floor (cup/laptop/etc.). */
  z?: number;
  /** Scale (plant). */
  s?: number;
  /** Manual paint-order (Y-sort) override. */
  sort?: number;
  /** Facing direction (chair/sofa). */
  dir?: Direction;
  /** Primary fill color. */
  color?: string;
  /** Edge/trim color. */
  edge?: string;
  /** Top surface color. */
  top?: string;
  /** Plant pot color. */
  pot?: string;
  /** Whiteboard ink color. */
  ink?: string;
  /** Desk-sign text. */
  text?: string;
  /** Zone label. */
  label?: string;
  /** Rug trim color. */
  trim?: string;
}

/** A parsed STATIC_SCENE. */
export interface StaticScene {
  meta: StaticMeta;
  floor: Floor;
  corridor: Corridor;
  walls: Wall[];
  windows: Window[];
  door: Door;
  wallDecor: WallDecor[];
  floorDecals: FloorDecal[];
  lightPatches: LightPatch[];
  assets: Asset[];
}

/* ── LIVE_SCENE ───────────────────────────────────────────────────── */

/** Character appearance palette. */
export interface CharacterLook {
  skin: string;
  skin2: string;
  hair: string;
  hairStyle: string;
  shirt: string;
  shirt2: string;
  pants: string;
  shoes: string;
}

/** A character in the live scene. */
export interface Character {
  id: string;
  name: string;
  role: string;
  color: string;
  x: number;
  y: number;
  dir: Direction;
  emotion: Emotion;
  visible: boolean;
  /** Held prop id (or null). */
  prop: string | null;
  look: CharacterLook;
}

/** Live scene metadata. */
export interface LiveMeta {
  scene: string;
  tick: string;
  defaultEmotion: string;
}

/** A parsed LIVE_SCENE. */
export interface LiveScene {
  meta: LiveMeta;
  characters: Character[];
}

/* ── SCENARIO ─────────────────────────────────────────────────────── */

/** The fixed set of event types from the prototype. */
export type EventType =
  | "caption"
  | "appear"
  | "move"
  | "emotion"
  | "say"
  | "exit";

/** The fixed set of event types from the prototype. */
export const EVENT_TYPES: readonly EventType[] = [
  "caption",
  "appear",
  "move",
  "emotion",
  "say",
  "exit",
];

/** A timeline event. */
export interface ScenarioEvent {
  /** Timestamp (seconds). */
  t: number;
  type: EventType;
  /** Target character id. */
  who?: string;
  /** appear destination. */
  at?: [number, number];
  /** move destination. */
  to?: [number, number];
  /** Facing direction. */
  dir?: Direction;
  /** Emotion set by the event. */
  emotion?: Emotion;
  /** Say bubble kind ("say" | "thought"). */
  kind?: string;
  /** Say bubble duration (seconds). */
  dur?: number;
  /** Caption/say text. */
  text?: string;
  /** emotion event: the emotion to set. */
  set?: Emotion;
}

/** A parsed SCENARIO. */
export interface Scenario {
  id: string;
  title: string;
  duration: number;
  events: ScenarioEvent[];
}

/* ── BUNDLED SCENE + INITIAL STATE ────────────────────────────────── */

/** A fully parsed scene bundle (M1-T2 input). */
export interface Scene {
  staticScene: StaticScene;
  liveScene: LiveScene;
  scenario: Scenario;
}

/** The static background layers drawn before foreground objects. */
export interface Background {
  floor: Floor;
  corridor: Corridor;
  walls: Wall[];
  windows: Window[];
  door: Door;
  wallDecor: WallDecor[];
  floorDecals: FloorDecal[];
  lightPatches: LightPatch[];
}

/** What a foreground render object represents. */
export type RenderObjectKind = "asset" | "wall" | "character";

/**
 * A single foreground item in paint order. Exactly one of `asset`, `wall` or
 * `character` is set, matching `kind`.
 */
export interface RenderObject {
  kind: RenderObjectKind;
  /** Paint-order key: lower values are drawn first (behind). */
  sortKey: number;
  asset?: Asset;
  wall?: Wall;
  character?: Character;
}

/** The render state at a given timestamp. */
export interface RenderState {
  /** Static background layers (drawn first, in order). */
  background: Background;
  /** Foreground objects ordered by paint order (back to front). */
  objects: RenderObject[];
  /** Characters visible at this timestamp, with their live state. */
  characters: Character[];
}
