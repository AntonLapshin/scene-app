import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReplayDriver } from "../../src/ui/viewModels/useReplayDriver";
import { loadOfficeScene } from "../../src/data/officeScene";
import { computeSceneState, scenarioDuration } from "../../src/core/scene";

// Manually-controlled rAF so the frame loop only advances when we say so.
type FrameCallback = (now: number) => void;
const rafCallbacks = new Map<number, FrameCallback>();
let rafId = 0;

let nowValue = 0;

beforeEach(() => {
  rafCallbacks.clear();
  rafId = 0;
  nowValue = 0;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameCallback) => {
    rafCallbacks.set(++rafId, cb);
    return rafId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    rafCallbacks.delete(id);
  });
  vi.stubGlobal("performance", { now: () => nowValue });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Fire the next pending rAF frame at `now`, returning whether one fired. */
function fireFrame(now: number) {
  const next = rafCallbacks.entries().next().value;
  if (!next) return false;
  const [id, cb] = next as [number, FrameCallback];
  rafCallbacks.delete(id);
  nowValue = now;
  cb(now);
  return true;
}

/** The number of rAF frames currently scheduled. */
function scheduledFrames() {
  return rafCallbacks.size;
}

const scene = loadOfficeScene();
const duration = scenarioDuration(scene.scenario);

describe("useReplayDriver (M3-T1)", () => {
  it("starts at timestamp 0, paused, with the initial render state", () => {
    const { result } = renderHook(() => useReplayDriver(scene));
    expect(result.current.timestamp).toBe(0);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.renderState).toEqual(computeSceneState(scene, 0));
  });

  it("play() advances the timestamp by accumulated frame deltas", () => {
    const { result } = renderHook(() => useReplayDriver(scene));
    act(() => result.current.play());
    expect(result.current.isPlaying).toBe(true);

    // First frame establishes the baseline; second frame advances by delta.
    act(() => fireFrame(0));
    act(() => fireFrame(1000));
    expect(result.current.timestamp).toBeCloseTo(1, 5);
    expect(result.current.renderState).toEqual(computeSceneState(scene, 1));

    act(() => fireFrame(1500));
    expect(result.current.timestamp).toBeCloseTo(1.5, 5);
  });

  it("pause() stops advancing time", () => {
    const { result } = renderHook(() => useReplayDriver(scene));
    act(() => result.current.play());
    act(() => fireFrame(0));
    act(() => fireFrame(1000));
    expect(result.current.timestamp).toBeCloseTo(1, 5);

    act(() => result.current.pause());
    expect(result.current.isPlaying).toBe(false);
    act(() => fireFrame(2000));
    // No new frame is scheduled after pause; timestamp stays put.
    expect(result.current.timestamp).toBeCloseTo(1, 5);
    expect(scheduledFrames()).toBe(0);
  });

  it("toggle() flips between playing and paused", () => {
    const { result } = renderHook(() => useReplayDriver(scene));
    act(() => result.current.toggle());
    expect(result.current.isPlaying).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isPlaying).toBe(false);
  });

  it("stops cleanly at the scenario duration (no runaway timer)", () => {
    const { result } = renderHook(() => useReplayDriver(scene));
    act(() => result.current.seek(duration - 0.5));
    act(() => result.current.play());
    act(() => fireFrame(0));
    act(() => fireFrame(1000));
    expect(result.current.timestamp).toBe(duration);
    expect(result.current.isPlaying).toBe(false);
    // No further frame is scheduled past the end.
    expect(scheduledFrames()).toBe(0);
  });

  it("seek() jumps to a timestamp clamped to [0, duration]", () => {
    const { result } = renderHook(() => useReplayDriver(scene));
    act(() => result.current.seek(10));
    expect(result.current.timestamp).toBe(10);
    expect(result.current.renderState).toEqual(computeSceneState(scene, 10));

    act(() => result.current.seek(-5));
    expect(result.current.timestamp).toBe(0);

    act(() => result.current.seek(999));
    expect(result.current.timestamp).toBe(duration);
  });

  it("stepForward() jumps to the next event boundary and pauses", () => {
    const { result } = renderHook(() => useReplayDriver(scene));
    act(() => result.current.play());
    act(() => result.current.stepForward());
    // Next event after 0 is the first caption at t=0.0? No — strictly after 0.
    // The first event at t=0.0 is not > 0, so the next is the appear at 0.7.
    expect(result.current.timestamp).toBe(0.7);
    expect(result.current.isPlaying).toBe(false);
  });

  it("stepBackward() jumps to the previous event boundary and pauses", () => {
    const { result } = renderHook(() => useReplayDriver(scene));
    act(() => result.current.seek(2));
    act(() => result.current.stepBackward());
    expect(result.current.timestamp).toBe(1.4);
    expect(result.current.isPlaying).toBe(false);
  });
});
