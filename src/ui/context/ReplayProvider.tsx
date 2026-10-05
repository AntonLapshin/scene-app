import type { ReactNode } from "react";
import { useReplayDriver } from "../viewModels/useReplayDriver";
import { ReplayContext } from "./replay";
import type { ReplayContextValue } from "./replay";
import type { Scene } from "../../core/scene";

export interface ReplayProviderProps {
  /** The parsed scene bundle to play back. */
  scene: Scene;
  /** The subtree that consumes the replay state via `useReplay`. */
  children: ReactNode;
}

/**
 * ReplayProvider (M4-T4).
 *
 * Injects the replay state + driver actions via `ReplayContext`. It is a thin
 * wrapper around the `useReplayDriver` view model: it contains no business
 * logic — it only projects the driver result into the context value. All
 * derivation stays in core/view models.
 */
export function ReplayProvider({ scene, children }: ReplayProviderProps) {
  const driver = useReplayDriver(scene);
  const value: ReplayContextValue = {
    timestamp: driver.timestamp,
    duration: driver.duration,
    isPlaying: driver.isPlaying,
    renderState: driver.renderState,
    seek: driver.seek,
    toggle: driver.toggle,
    stepForward: driver.stepForward,
    stepBackward: driver.stepBackward,
  };
  return <ReplayContext.Provider value={value}>{children}</ReplayContext.Provider>;
}
