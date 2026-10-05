import { createContext, useContext } from "react";
import type { RenderState } from "../../core/scene";

/**
 * The replay state + driver actions injected via React Context (M4-T4).
 *
 * This is the surface organisms/consumers read from instead of receiving every
 * value as props. It is a thin projection of the `useReplayDriver` view model:
 * it contains no business logic — every value/action delegates to the driver,
 * which delegates to pure core functions. All decisions live in `src/core`.
 */
export interface ReplayContextValue {
  /** The current playback timestamp (seconds), clamped to `[0, duration]`. */
  timestamp: number;
  /** The scenario duration (seconds), from core `scenarioDuration`. */
  duration: number;
  /** Whether playback is currently advancing. */
  isPlaying: boolean;
  /** The render state at the current timestamp, from core `computeSceneState`. */
  renderState: RenderState;
  /** Jump to an absolute timestamp (clamped to the scenario duration). */
  seek: (timestamp: number) => void;
  /** Toggle between playing and paused. */
  toggle: () => void;
  /** Step to the next event (or `step` seconds) and pause. */
  stepForward: () => void;
  /** Step to the previous event (or `step` seconds) and pause. */
  stepBackward: () => void;
}

/**
 * The React context that carries the replay state. `null` when no
 * `ReplayProvider` is mounted.
 */
export const ReplayContext = createContext<ReplayContextValue | null>(null);

/**
 * Thin hook (M4-T4) that reads the injected replay state from `ReplayContext`.
 *
 * Contains no business logic — it only returns the context value. Throws when
 * used outside a `ReplayProvider` so misuse fails loudly at render time.
 */
export function useReplay(): ReplayContextValue {
  const value = useContext(ReplayContext);
  if (!value) {
    throw new Error("useReplay must be used within a ReplayProvider");
  }
  return value;
}
