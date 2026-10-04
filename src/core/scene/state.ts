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
  RenderState,
  RenderObject,
  Scene,
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
 * Compute the render state at timestamp 0 from a parsed Scene.
 *
 * Characters use their initial live-scene state and only the visible ones are
 * included in the ordered foreground. Backgrounds are grouped for drawing.
 */
export function computeInitialState(scene: Scene): RenderState {
  const { staticScene, liveScene } = scene;
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
  const visibleCharacters = liveScene.characters.filter((c) => c.visible);
  for (const character of visibleCharacters) {
    objects.push({ kind: "character", sortKey: character.y, character });
  }

  objects.sort((a, b) => a.sortKey - b.sortKey);

  return { background, objects, characters: visibleCharacters };
}
