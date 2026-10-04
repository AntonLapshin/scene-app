import { useMemo } from "react";
import { computeSceneState } from "../../core/scene";
import type { Scene, RenderState } from "../../core/scene";

/**
 * Thin view model hook that exposes core `computeSceneState` to components
 * (M2-T4).
 *
 * Contains no business logic — it only calls the pure core `computeSceneState`
 * function for the given scene + timestamp and memoizes the result. All
 * decisions live in `src/core`.
 */
export function useSceneState(scene: Scene, timestamp: number): RenderState {
  return useMemo(() => computeSceneState(scene, timestamp), [scene, timestamp]);
}
