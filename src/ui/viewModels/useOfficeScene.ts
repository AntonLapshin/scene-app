import { useMemo } from "react";
import { loadOfficeScene } from "../../data/officeScene";
import { useSceneState } from "./useSceneState";
import type { RenderState } from "../../core/scene";

export interface UseOfficeSceneResult {
  /** The ordered render state at t=0. */
  renderState: RenderState;
  /** The scene world size for the SVG viewBox. */
  world: { w: number; h: number };
}

/**
 * Thin view model for the office scene (M1-T4b / M2-T4).
 *
 * Contains no business logic — it only loads the bundled office scene data, parses it
 * via the core `parse*` functions, and computes the t=0 render state via the thin
 * `useSceneState` hook (which calls core `computeSceneState`). All decisions live
 * in `src/core`.
 */
export function useOfficeScene(): UseOfficeSceneResult {
  const scene = useMemo(() => loadOfficeScene(), []);
  const renderState = useSceneState(scene, 0);
  return { renderState, world: scene.staticScene.meta.world };
}
