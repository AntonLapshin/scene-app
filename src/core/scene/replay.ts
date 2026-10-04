/**
 * Core replay/time-advance helpers (M3-T1).
 *
 * These are pure functions that the thin `useReplayDriver` hook calls into:
 * advancing time by a frame delta, clamping to the scenario duration, and
 * stepping to the next/previous event boundary. All logic is pure — no React,
 * no DOM, no browser timer APIs — so it can be exhaustively tested.
 */

import type { Scene } from "./types";
import { clampTimestamp, scenarioDuration } from "./state";

/**
 * Advance the current timestamp by a frame delta, clamped to `[0, duration]`.
 *
 * This is the driver's frame-delta accumulation step: each frame it adds the
 * elapsed delta and clamps so playback stops exactly at the scenario duration
 * (no runaway past the end).
 */
export function advanceTimestamp(
  current: number,
  delta: number,
  duration: number,
): number {
  return clampTimestamp(current + delta, duration);
}

/**
 * The timestamp of the first event strictly after `current`, or `undefined`
 * when there is none.
 */
export function nextEventTimestamp(
  scene: Scene,
  current: number,
): number | undefined {
  let next: number | undefined;
  for (const event of scene.scenario.events) {
    if (event.t > current && (next === undefined || event.t < next)) {
      next = event.t;
    }
  }
  return next;
}

/**
 * The timestamp of the last event strictly before `current`, or `undefined`
 * when there is none.
 */
export function previousEventTimestamp(
  scene: Scene,
  current: number,
): number | undefined {
  let prev: number | undefined;
  for (const event of scene.scenario.events) {
    if (event.t < current && (prev === undefined || event.t > prev)) {
      prev = event.t;
    }
  }
  return prev;
}

/**
 * Step forward by jumping to the next event boundary, or by `step` seconds
 * when no next event exists, clamped to the scenario duration.
 */
export function stepForward(scene: Scene, current: number, step: number): number {
  const next = nextEventTimestamp(scene, current);
  if (next !== undefined) return next;
  return clampTimestamp(current + step, scenarioDuration(scene.scenario));
}

/**
 * Step backward by jumping to the previous event boundary, or by `step`
 * seconds when no previous event exists, clamped to 0.
 */
export function stepBackward(scene: Scene, current: number, step: number): number {
  const prev = previousEventTimestamp(scene, current);
  if (prev !== undefined) return prev;
  return clampTimestamp(current - step, scenarioDuration(scene.scenario));
}
