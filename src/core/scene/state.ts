/**
 * Core initial-state computation at t=0 (plan.md §19.1, M1-T2).
 *
 * These are pure functions that turn a parsed `Scene` into the ordered render
 * state at timestamp 0: the static background layers, the foreground objects in
 * paint order, and the visible characters with their initial live state.
 *
 * All logic is pure — no React, no DOM — and every helper is a small independent
 * function so it can be tested exhaustively.
 */

import type {
  Asset,
  Character,
  CharacterState,
  RenderState,
  RenderObject,
  Scene,
  ScenarioEvent,
} from "./types";

/**
 * Compute the paint-order (Y-sort) key for an asset, mirroring the prototype's
 * `assetSortY`. An explicit `sort` override wins; otherwise the key is derived
 * from the asset's geometry/facing so taller or nearer assets draw in front.
 */
export function assetSortKey(asset: Asset): number {
  if (typeof asset.sort === "number") return asset.sort;
  if (asset.asset === "chair") {
    const d = asset.d ?? 32;
    if (asset.dir === "down") return asset.y - d / 2;
    if (asset.dir === "up") return asset.y + d / 2;
    return asset.y;
  }
  if (asset.asset === "roundTable") return asset.y + (asset.r ?? 60) * 0.5 * 0.9;
  if (asset.asset === "plant") return asset.y + 8;
  return asset.y + (asset.d ?? 0) / 2;
}

/** Find an asset by id, or `undefined` when absent. */
export function lookupAssetById(
  assets: readonly Asset[],
  id: string,
): Asset | undefined {
  return assets.find((asset) => asset.id === id);
}

/** Find a character by id, or `undefined` when absent. */
export function lookupCharacterById(
  characters: readonly Character[],
  id: string,
): Character | undefined {
  return characters.find((character) => character.id === id);
}

/** Resolve a character by id, throwing a descriptive error when missing. */
export function resolveCharacter(
  characters: readonly Character[],
  id: string,
): Character {
  const found = lookupCharacterById(characters, id);
  if (!found) throw new Error(`Unknown character id "${id}"`);
  return found;
}

/**
 * Resolve an asset by id, throwing a descriptive error when missing.
 *
 * Mirrors `resolveCharacter` for the asset side of the scene, giving callers a
 * non-optional asset with explicit missing-asset handling.
 */
export function resolveAsset(
  assets: readonly Asset[],
  id: string,
): Asset {
  const found = lookupAssetById(assets, id);
  if (!found) throw new Error(`Unknown asset id "${id}"`);
  return found;
}

/** Euclidean distance between two points. */
export function distance(
  a: readonly [number, number],
  b: readonly [number, number],
): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.hypot(dx, dy);
}

/** Manhattan (grid) distance between two points. */
export function manhattanDistance(
  a: readonly [number, number],
  b: readonly [number, number],
): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

/** The midpoint of two points. */
export function midpoint(
  a: readonly [number, number],
  b: readonly [number, number],
): [number, number] {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

/**
 * Clamp a value to the inclusive range `[min, max]`.
 *
 * When `min > max` the bounds are swapped so the result is always well-defined.
 */
export function clamp(value: number, min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.min(Math.max(value, lo), hi);
}

/**
 * Clamp a timestamp to the scenario's playback window `[0, duration]`.
 *
 * Negative timestamps (before the first event) clamp to 0; timestamps past the
 * final event clamp to the scenario duration.
 */
export function clampTimestamp(timestamp: number, duration: number): number {
  return clamp(timestamp, 0, duration);
}

/**
 * The effective duration of a scenario in seconds.
 *
 * Returns the declared `duration` when present, otherwise the timestamp of the
 * latest event (or 0 for an empty timeline).
 */
export function scenarioDuration(scenario: {
  duration?: number;
  events: readonly { t: number }[];
}): number {
  if (typeof scenario.duration === "number") return scenario.duration;
  let latest = 0;
  for (const event of scenario.events) {
    if (event.t > latest) latest = event.t;
  }
  return latest;
}

/**
 * Compose the ordered render state from a set of character states.
 *
 * Groups the static background layers, paints the assets in paint order, adds
 * front walls above the assets, and paints only visible characters above
 * everything ordered by their y. Shared by `computeInitialState` and the
 * timeline evaluation so both produce identical ordering.
 */
export function composeRenderState(
  scene: Scene,
  characterStates: readonly CharacterState[],
): RenderState {
  const { staticScene } = scene;
  const background: RenderState["background"] = {
    floor: staticScene.floor,
    corridor: staticScene.corridor,
    walls: staticScene.walls,
    windows: staticScene.windows,
    door: staticScene.door,
    wallDecor: staticScene.wallDecor,
    floorDecals: staticScene.floorDecals,
    lightPatches: staticScene.lightPatches,
  };

  const objects: RenderObject[] = [];

  // Assets are painted in paint order.
  for (const asset of staticScene.assets) {
    objects.push({ kind: "asset", sortKey: assetSortKey(asset), asset });
  }

  // Front walls are painted above assets, ordered by their bottom edge.
  for (const wall of staticScene.walls) {
    if (wall.layer === "front") {
      objects.push({ kind: "wall", sortKey: wall.y + wall.h, wall });
    }
  }

  // Visible characters are painted above everything, ordered by their y.
  const visibleCharacters = characterStates.filter((c) => c.visible);
  for (const character of visibleCharacters) {
    objects.push({ kind: "character", sortKey: character.y, character });
  }

  objects.sort((a, b) => a.sortKey - b.sortKey);

  return { background, objects, characters: visibleCharacters };
}

/**
 * Compute the render state at timestamp 0 from a parsed Scene.
 *
 * Characters use their initial live-scene state and only the visible ones are
 * included in the ordered foreground. Backgrounds are grouped for drawing.
 */
export function computeInitialState(scene: Scene): RenderState {
  return composeRenderState(scene, scene.liveScene.characters);
}

/**
 * Compute the render state at an arbitrary timestamp by replaying the timeline
 * events up to that point. Pure — no browser APIs. See `timeline.ts`.
 */
export function computeSceneState(scene: Scene, timestamp: number): RenderState {
  const characters = computeCharacterStates(scene, timestamp);
  const state = composeRenderState(scene, characters);
  state.caption = activeCaptionAt(scene, timestamp);
  return state;
}

/**
 * Replay the timeline events up to `timestamp` and return each character's
 * live state (position, emotion, visibility, active say bubble).
 */
export function computeCharacterStates(
  scene: Scene,
  timestamp: number,
): CharacterState[] {
  const byId = new Map<string, CharacterState>();
  for (const character of scene.liveScene.characters) {
    byId.set(character.id, character);
  }

  for (const event of eventsUpTo(scene.scenario, timestamp)) {
    if (event.who === undefined) continue;
    const current = byId.get(event.who);
    if (!current) continue;
    byId.set(event.who, applyEvent(current, event));
  }

  // Expire say bubbles whose window has ended.
  const result: CharacterState[] = [];
  for (const character of byId.values()) {
    if (character.say && timestamp >= character.say.until) {
      result.push({ ...character, say: undefined });
    } else {
      result.push(character);
    }
  }
  return result;
}

/**
 * Apply a single timeline event to a character's live state, returning a new
 * state. `caption` events are no-ops for characters (they carry no `who`).
 */
export function applyEvent(
  character: CharacterState,
  event: ScenarioEvent,
): CharacterState {
  switch (event.type) {
    case "appear":
      return {
        ...character,
        visible: true,
        x: event.at?.[0] ?? character.x,
        y: event.at?.[1] ?? character.y,
        dir: event.dir ?? character.dir,
        emotion: event.emotion ?? character.emotion,
      };
    case "move":
      return {
        ...character,
        x: event.to?.[0] ?? character.x,
        y: event.to?.[1] ?? character.y,
        dir: event.dir ?? character.dir,
        emotion: event.emotion ?? character.emotion,
      };
    case "emotion":
      return { ...character, emotion: event.set ?? character.emotion };
    case "say":
      return {
        ...character,
        emotion: event.emotion ?? character.emotion,
        say: {
          text: event.text ?? "",
          kind: event.kind ?? "say",
          emotion: event.emotion,
          until: event.t + (event.dur ?? 0),
        },
      };
    case "exit":
      return { ...character, visible: false };
    case "caption":
      return character;
  }
}

/**
 * The timeline events with `t <= timestamp`, sorted by time (stable so equal
 * timestamps keep source order).
 */
export function eventsUpTo(
  scenario: { events: readonly ScenarioEvent[] },
  timestamp: number,
): ScenarioEvent[] {
  return scenario.events
    .filter((event) => event.t <= timestamp)
    .sort((a, b) => a.t - b.t);
}

/**
 * The active scene caption text at `timestamp`: the text of the latest
 * `caption` event that has fired, or `undefined` when none has yet.
 */
export function activeCaptionAt(
  scene: Scene,
  timestamp: number,
): string | undefined {
  let caption: string | undefined;
  for (const event of eventsUpTo(scene.scenario, timestamp)) {
    if (event.type === "caption") caption = event.text;
  }
  return caption;
}
