import { useMemo } from "react";
import { loadOfficeScene } from "../../data/officeScene";
import { computeInitialState } from "../../core/scene";
import type { RenderState } from "../../core/scene";

export interface UseOfficeSceneResult {
  /** The ordered render state at t=0. */
  renderState: RenderState;
  /** The scene world size for the SVG viewBox. */
  world: { w: number; h: number };
}

/**
 * Thin view model for the office scene (M1-T4b).
 *
 * Contains no business logic — it only loads the bundled office scene data,
 * parses it via the core `parse*` functions, and computes the t=0 render state
 * via the core `computeInitialState`. All decisions live in `src/core`.
 */
export function useOfficeScene(): UseOfficeSceneResult {
  return useMemo(() => {
    const scene = loadOfficeScene();
    const renderState = computeInitialState(scene);
    return { renderState, world: scene.staticScene.meta.world };
  }, []);
}
