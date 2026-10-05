import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  advanceTimestamp,
  clampTimestamp,
  computeSceneState,
  scenarioDuration,
  stepBackward,
  stepForward,
} from "../../core/scene";
import type { RenderState, Scene } from "../../core/scene";

export interface ReplayDriverResult {
  /** The current playback timestamp (seconds), clamped to `[0, duration]`. */
  timestamp: number;
  /** The scenario duration (seconds), from core `scenarioDuration`. */
  duration: number;
  /** The render state at the current timestamp, from core `computeSceneState`. */
  renderState: RenderState;
  /** Whether playback is currently advancing. */
  isPlaying: boolean;
  /** Start advancing time. */
  play: () => void;
  /** Pause advancing time. */
  pause: () => void;
  /** Toggle between playing and paused. */
  toggle: () => void;
  /** Jump to an absolute timestamp (clamped to the scenario duration). */
  seek: (timestamp: number) => void;
  /** Step to the next event (or `step` seconds) and pause. */
  stepForward: () => void;
  /** Step to the previous event (or `step` seconds) and pause. */
  stepBackward: () => void;
}

export interface ReplayDriverOptions {
  /** Fixed step (seconds) used by `stepForward`/`stepBackward`. */
  step?: number;
}

/**
 * Thin replay driver view-model hook (M3-T1).
 *
 * Owns playback timing (frame-delta accumulation via `requestAnimationFrame`)
 * and exposes the current timestamp + render state. It contains no business
 * logic — every time/step computation delegates to pure core functions
 * (`advanceTimestamp`, `clampTimestamp`, `stepForward`, `stepBackward`,
 * `scenarioDuration`, `computeSceneState`). All decisions live in `src/core`.
 */
export function useReplayDriver(
  scene: Scene,
  options: ReplayDriverOptions = {},
): ReplayDriverResult {
  const { step = 1 } = options;
  const [timestamp, setTimestamp] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mirror of `timestamp` for use inside the rAF loop without re-subscribing.
  const timestampRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const duration = useMemo(() => scenarioDuration(scene.scenario), [scene]);
  const renderState = useMemo(
    () => computeSceneState(scene, timestamp),
    [scene, timestamp],
  );

  // Reset playback when the scene changes.
  useEffect(() => {
    timestampRef.current = 0;
    setTimestamp(0);
    setIsPlaying(false);
  }, [scene]);

  // Frame loop: accumulate elapsed frame deltas and advance the timestamp.
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    lastTimeRef.current = performance.now();
    const tick = (now: number) => {
      const last = lastTimeRef.current ?? now;
      const delta = (now - last) / 1000;
      lastTimeRef.current = now;
      const next = advanceTimestamp(timestampRef.current, delta, duration);
      timestampRef.current = next;
      setTimestamp(next);
      // Stop cleanly at the scenario duration — no runaway timer.
      if (next >= duration) {
        setIsPlaying(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [isPlaying, duration]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((p) => !p), []);

  const seek = useCallback(
    (target: number) => {
      const next = clampTimestamp(target, duration);
      timestampRef.current = next;
      setTimestamp(next);
    },
    [duration],
  );

  const stepFwd = useCallback(() => {
    const next = stepForward(scene, timestampRef.current, step);
    timestampRef.current = next;
    setTimestamp(next);
    setIsPlaying(false);
  }, [scene, step]);

  const stepBwd = useCallback(() => {
    const next = stepBackward(scene, timestampRef.current, step);
    timestampRef.current = next;
    setTimestamp(next);
    setIsPlaying(false);
  }, [scene, step]);

  return {
    timestamp,
    duration,
    renderState,
    isPlaying,
    play,
    pause,
    toggle,
    seek,
    stepForward: stepFwd,
    stepBackward: stepBwd,
  };
}
