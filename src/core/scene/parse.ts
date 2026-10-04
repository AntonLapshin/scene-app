/**
 * Pure parse/validate functions that turn the prototype's raw scene JSON into
 * the typed models in `./types` (plan.md §19.1). These functions are pure — no
 * React, no DOM — and throw descriptive `SceneParseError`s on malformed or
 * missing data, so they can be exhaustively tested.
 */

import {
  ASSET_KINDS,
  DIRECTIONS,
  EMOTIONS,
  EVENT_TYPES,
  type Asset,
  type AssetKind,
  type Character,
  type CharacterLook,
  type Corridor,
  type Direction,
  type Door,
  type Emotion,
  type EventType,
  type Floor,
  type FloorDecal,
  type FloorDecalAssetKind,
  type LightPatch,
  type LiveMeta,
  type LiveScene,
  type Scenario,
  type ScenarioEvent,
  type StaticMeta,
  type StaticScene,
  type Wall,
  type WallDecor,
  type WallDecorAssetKind,
  type WallLayer,
  type Window,
  type WorldSize,
} from "./types";
import {
  SceneParseError,
  isString,
  optionalNumber,
  optionalString,
  optionalStringOrNull,
  requireArray,
  requireBoolean,
  requireNumber,
  requirePoint,
  requireRecord,
  requireString,
} from "./guards";

/** Require a value to be a valid direction. */
export function requireDirection(value: unknown, path: string): Direction {
  if (!isString(value) || !(DIRECTIONS as readonly string[]).includes(value)) {
    throw new SceneParseError(`${path} must be one of: ${DIRECTIONS.join(", ")}`);
  }
  return value as Direction;
}

/** Require a value to be a valid emotion. */
export function requireEmotion(value: unknown, path: string): Emotion {
  if (!isString(value) || !(EMOTIONS as readonly string[]).includes(value)) {
    throw new SceneParseError(`${path} must be one of: ${EMOTIONS.join(", ")}`);
  }
  return value as Emotion;
}

/** Require a value to be a valid asset kind. */
export function requireAssetKind(value: unknown, path: string): AssetKind {
  if (!isString(value) || !(ASSET_KINDS as readonly string[]).includes(value)) {
    throw new SceneParseError(`${path} must be one of the supported asset kinds`);
  }
  return value as AssetKind;
}

/** Require a value to be a valid event type. */
export function requireEventType(value: unknown, path: string): EventType {
  if (!isString(value) || !(EVENT_TYPES as readonly string[]).includes(value)) {
    throw new SceneParseError(`${path} must be one of: ${EVENT_TYPES.join(", ")}`);
  }
  return value as EventType;
}

/** Require a value to be a valid wall layer. */
export function requireWallLayer(value: unknown, path: string): WallLayer {
  if (value !== "back" && value !== "front") {
    throw new SceneParseError(`${path} must be "back" or "front"`);
  }
  return value;
}

/** Require a value to be a valid wall-decor asset kind. */
export function requireWallDecorAssetKind(
  value: unknown,
  path: string,
): WallDecorAssetKind {
  if (value !== "whiteboard" && value !== "clock" && value !== "poster") {
    throw new SceneParseError(`${path} must be a wall-decor asset kind`);
  }
  return value;
}

/** Require a value to be a valid floor-decal asset kind. */
export function requireFloorDecalAssetKind(
  value: unknown,
  path: string,
): FloorDecalAssetKind {
  if (value !== "rug" && value !== "zone") {
    throw new SceneParseError(`${path} must be a floor-decal asset kind`);
  }
  return value;
}

function parseWorldSize(raw: unknown, path: string): WorldSize {
  const r = requireRecord(raw, path);
  return {
    w: requireNumber(r.w, `${path}.w`),
    h: requireNumber(r.h, `${path}.h`),
  };
}

function parseStaticMeta(raw: unknown, path: string): StaticMeta {
  const r = requireRecord(raw, path);
  return {
    name: requireString(r.name, `${path}.name`),
    style: requireString(r.style, `${path}.style`),
    projection: requireString(r.projection, `${path}.projection`),
    world: parseWorldSize(r.world, `${path}.world`),
  };
}

function parseFloor(raw: unknown, path: string): Floor {
  const r = requireRecord(raw, path);
  return {
    x: requireNumber(r.x, `${path}.x`),
    y: requireNumber(r.y, `${path}.y`),
    w: requireNumber(r.w, `${path}.w`),
    h: requireNumber(r.h, `${path}.h`),
    plank: requireNumber(r.plank, `${path}.plank`),
    base: requireString(r.base, `${path}.base`),
    tone: requireString(r.tone, `${path}.tone`),
  };
}

function parseCorridor(raw: unknown, path: string): Corridor {
  const r = requireRecord(raw, path);
  return {
    x: requireNumber(r.x, `${path}.x`),
    y: requireNumber(r.y, `${path}.y`),
    w: requireNumber(r.w, `${path}.w`),
    h: requireNumber(r.h, `${path}.h`),
    color: requireString(r.color, `${path}.color`),
  };
}

function parseWall(raw: unknown, path: string): Wall {
  const r = requireRecord(raw, path);
  return {
    id: requireString(r.id, `${path}.id`),
    x: requireNumber(r.x, `${path}.x`),
    y: requireNumber(r.y, `${path}.y`),
    w: requireNumber(r.w, `${path}.w`),
    h: requireNumber(r.h, `${path}.h`),
    height: requireNumber(r.height, `${path}.height`),
    face: requireString(r.face, `${path}.face`),
    top: requireString(r.top, `${path}.top`),
    layer: requireWallLayer(r.layer, `${path}.layer`),
  };
}

function parseWindow(raw: unknown, path: string): Window {
  const r = requireRecord(raw, path);
  return {
    id: requireString(r.id, `${path}.id`),
    wall: requireString(r.wall, `${path}.wall`),
    x: requireNumber(r.x, `${path}.x`),
    y: requireNumber(r.y, `${path}.y`),
    w: requireNumber(r.w, `${path}.w`),
    h: requireNumber(r.h, `${path}.h`),
    view: requireString(r.view, `${path}.view`),
  };
}

function parseDoor(raw: unknown, path: string): Door {
  const r = requireRecord(raw, path);
  return {
    id: requireString(r.id, `${path}.id`),
    x: requireNumber(r.x, `${path}.x`),
    y: requireNumber(r.y, `${path}.y`),
    w: requireNumber(r.w, `${path}.w`),
    h: requireNumber(r.h, `${path}.h`),
    frame: requireString(r.frame, `${path}.frame`),
    label: requireString(r.label, `${path}.label`),
  };
}

function parseWallDecor(raw: unknown, path: string): WallDecor {
  const r = requireRecord(raw, path);
  return {
    id: requireString(r.id, `${path}.id`),
    asset: requireWallDecorAssetKind(r.asset, `${path}.asset`),
    x: requireNumber(r.x, `${path}.x`),
    y: requireNumber(r.y, `${path}.y`),
    w: optionalNumber(r, "w", path),
    h: optionalNumber(r, "h", path),
    r: optionalNumber(r, "r", path),
    ink: optionalString(r, "ink", path),
    color: optionalString(r, "color", path),
  };
}

function parseFloorDecal(raw: unknown, path: string): FloorDecal {
  const r = requireRecord(raw, path);
  return {
    id: requireString(r.id, `${path}.id`),
    asset: requireFloorDecalAssetKind(r.asset, `${path}.asset`),
    x: requireNumber(r.x, `${path}.x`),
    y: requireNumber(r.y, `${path}.y`),
    w: requireNumber(r.w, `${path}.w`),
    h: requireNumber(r.h, `${path}.h`),
    color: optionalString(r, "color", path),
    trim: optionalString(r, "trim", path),
    label: optionalString(r, "label", path),
  };
}

function parseLightPatch(raw: unknown, path: string): LightPatch {
  const r = requireRecord(raw, path);
  return {
    x: requireNumber(r.x, `${path}.x`),
    w: requireNumber(r.w, `${path}.w`),
  };
}

/** Parse a single asset, validating required fields and the asset kind. */
export function parseAsset(raw: unknown, path = "asset"): Asset {
  const r = requireRecord(raw, path);
  return {
    id: requireString(r.id, `${path}.id`),
    asset: requireAssetKind(r.asset, `${path}.asset`),
    x: requireNumber(r.x, `${path}.x`),
    y: requireNumber(r.y, `${path}.y`),
    image: optionalString(r, "image", path),
    t: optionalNumber(r, "t", path),
    d: optionalNumber(r, "d", path),
    h: optionalNumber(r, "h", path),
    r: optionalNumber(r, "r", path),
    z: optionalNumber(r, "z", path),
    s: optionalNumber(r, "s", path),
    sort: optionalNumber(r, "sort", path),
    dir: optionalDirection(r.dir, `${path}.dir`),
    color: optionalString(r, "color", path),
    edge: optionalString(r, "edge", path),
    top: optionalString(r, "top", path),
    pot: optionalString(r, "pot", path),
    ink: optionalString(r, "ink", path),
    text: optionalString(r, "text", path),
    label: optionalString(r, "label", path),
    trim: optionalString(r, "trim", path),
  };
}

/** Read an optional direction field, validating it when present. */
function optionalDirection(
  value: unknown,
  path: string,
): Direction | undefined {
  if (value === undefined) return undefined;
  return requireDirection(value, path);
}

/** Read an optional emotion field, validating it when present. */
function optionalEmotion(
  value: unknown,
  path: string,
): Emotion | undefined {
  if (value === undefined) return undefined;
  return requireEmotion(value, path);
}

/** Parse a full STATIC_SCENE. */
export function parseStaticScene(raw: unknown): StaticScene {
  const root = requireRecord(raw, "staticScene");
  return {
    meta: parseStaticMeta(root.meta, "staticScene.meta"),
    floor: parseFloor(root.floor, "staticScene.floor"),
    corridor: parseCorridor(root.corridor, "staticScene.corridor"),
    walls: requireArray(root.walls, "staticScene.walls").map((w, i) =>
      parseWall(w, `staticScene.walls[${i}]`),
    ),
    windows: requireArray(root.windows, "staticScene.windows").map((w, i) =>
      parseWindow(w, `staticScene.windows[${i}]`),
    ),
    door: parseDoor(root.door, "staticScene.door"),
    wallDecor: requireArray(root.wallDecor, "staticScene.wallDecor").map((d, i) =>
      parseWallDecor(d, `staticScene.wallDecor[${i}]`),
    ),
    floorDecals: requireArray(root.floorDecals, "staticScene.floorDecals").map(
      (d, i) => parseFloorDecal(d, `staticScene.floorDecals[${i}]`),
    ),
    lightPatches: requireArray(root.lightPatches, "staticScene.lightPatches").map(
      (p, i) => parseLightPatch(p, `staticScene.lightPatches[${i}]`),
    ),
    assets: requireArray(root.assets, "staticScene.assets").map((a, i) =>
      parseAsset(a, `staticScene.assets[${i}]`),
    ),
  };
}

function parseCharacterLook(raw: unknown, path: string): CharacterLook {
  const r = requireRecord(raw, path);
  const keys = [
    "skin", "skin2", "hair", "hairStyle", "shirt", "shirt2", "pants", "shoes",
  ] as const;
  const out = {} as CharacterLook;
  for (const key of keys) {
    out[key] = requireString(r[key], `${path}.${key}`);
  }
  return out;
}

function parseCharacter(raw: unknown, path: string): Character {
  const r = requireRecord(raw, path);
  return {
    id: requireString(r.id, `${path}.id`),
    name: requireString(r.name, `${path}.name`),
    role: requireString(r.role, `${path}.role`),
    color: requireString(r.color, `${path}.color`),
    x: requireNumber(r.x, `${path}.x`),
    y: requireNumber(r.y, `${path}.y`),
    dir: requireDirection(r.dir, `${path}.dir`),
    emotion: requireEmotion(r.emotion, `${path}.emotion`),
    visible: requireBoolean(r.visible, `${path}.visible`),
    prop: optionalStringOrNull(r, "prop", path) ?? null,
    look: parseCharacterLook(r.look, `${path}.look`),
  };
}

function parseLiveMeta(raw: unknown, path: string): LiveMeta {
  const r = requireRecord(raw, path);
  return {
    scene: requireString(r.scene, `${path}.scene`),
    tick: requireString(r.tick, `${path}.tick`),
    defaultEmotion: requireString(r.defaultEmotion, `${path}.defaultEmotion`),
  };
}

/** Parse a full LIVE_SCENE. */
export function parseLiveScene(raw: unknown): LiveScene {
  const root = requireRecord(raw, "liveScene");
  return {
    meta: parseLiveMeta(root.meta, "liveScene.meta"),
    characters: requireArray(root.characters, "liveScene.characters").map(
      (c, i) => parseCharacter(c, `liveScene.characters[${i}]`),
    ),
  };
}

function parseEvent(raw: unknown, path: string): ScenarioEvent {
  const r = requireRecord(raw, path);
  const type = requireEventType(r.type, `${path}.type`);
  const base: ScenarioEvent = {
    t: requireNumber(r.t, `${path}.t`),
    type,
    who: optionalString(r, "who", path),
    dir: optionalDirection(r.dir, `${path}.dir`),
    emotion: optionalEmotion(r.emotion, `${path}.emotion`),
  };

  switch (type) {
    case "caption":
      return { ...base, text: requireString(r.text, `${path}.text`) };
    case "appear":
      return { ...base, at: requirePoint(r.at, `${path}.at`) };
    case "move":
      return { ...base, to: requirePoint(r.to, `${path}.to`) };
    case "emotion":
      return { ...base, set: requireEmotion(r.set, `${path}.set`) };
    case "say":
      return {
        ...base,
        text: requireString(r.text, `${path}.text`),
        kind: optionalString(r, "kind", path),
        dur: optionalNumber(r, "dur", path),
      };
    case "exit":
      return base;
  }
}

/** Parse a full SCENARIO. */
export function parseScenario(raw: unknown): Scenario {
  const root = requireRecord(raw, "scenario");
  return {
    id: requireString(root.id, "scenario.id"),
    title: requireString(root.title, "scenario.title"),
    duration: requireNumber(root.duration, "scenario.duration"),
    events: requireArray(root.events, "scenario.events").map((e, i) =>
      parseEvent(e, `scenario.events[${i}]`),
    ),
  };
}
