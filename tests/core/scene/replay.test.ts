import { describe, it, expect } from "vitest";
import {
  advanceTimestamp,
  nextEventTimestamp,
  previousEventTimestamp,
  stepForward,
  stepBackward,
} from "../../../src/core/scene/replay";
import { sceneFixture } from "./fixtures";
import type { Scene } from "../../../src/core/scene/types";

const scene = sceneFixture as unknown as Scene;

// A scenario with no events, so stepping falls back to the fixed step.
const emptyEventsScene = {
  ...scene,
  scenario: { ...scene.scenario, events: [] },
} as Scene;

describe("advanceTimestamp", () => {
  it("advances by the frame delta", () => {
    expect(advanceTimestamp(2, 0.5, 41)).toBe(2.5);
  });

  it("clamps at the duration (no runaway past the end)", () => {
    expect(advanceTimestamp(40.8, 0.5, 41)).toBe(41);
  });

  it("clamps negative results to 0", () => {
    expect(advanceTimestamp(0, -1, 41)).toBe(0);
  });
});

describe("nextEventTimestamp", () => {
  it("returns the first event strictly after the current timestamp", () => {
    expect(nextEventTimestamp(scene, 0.5)).toBe(0.7);
  });

  it("returns undefined when no event is after the current timestamp", () => {
    expect(nextEventTimestamp(scene, 41)).toBeUndefined();
  });

  it("skips an event exactly at the current timestamp", () => {
    expect(nextEventTimestamp(scene, 0.7)).toBe(1.4);
  });
});

describe("previousEventTimestamp", () => {
  it("returns the last event strictly before the current timestamp", () => {
    expect(previousEventTimestamp(scene, 2)).toBe(1.4);
  });

  it("returns undefined when no event is before the current timestamp", () => {
    expect(previousEventTimestamp(scene, 0)).toBeUndefined();
  });

  it("skips an event exactly at the current timestamp", () => {
    expect(previousEventTimestamp(scene, 0.7)).toBe(0.0);
    expect(previousEventTimestamp(scene, 0.0)).toBeUndefined();
  });
});

describe("stepForward", () => {
  it("jumps to the next event boundary when one exists", () => {
    expect(stepForward(scene, 0.5, 1)).toBe(0.7);
  });

  it("advances by the fixed step when no next event exists", () => {
    expect(stepForward(emptyEventsScene, 20, 1)).toBe(21);
    expect(stepForward(emptyEventsScene, 41, 1)).toBe(41);
  });

  it("clamps to the scenario duration", () => {
    expect(stepForward(emptyEventsScene, 40.6, 1)).toBe(41);
  });
});

describe("stepBackward", () => {
  it("jumps to the previous event boundary when one exists", () => {
    expect(stepBackward(scene, 2, 1)).toBe(1.4);
  });

  it("moves back by the fixed step when no previous event exists", () => {
    expect(stepBackward(emptyEventsScene, 0, 1)).toBe(0);
    expect(stepBackward(emptyEventsScene, 20, 1)).toBe(19);
  });

  it("clamps to 0", () => {
    expect(stepBackward(emptyEventsScene, 0.5, 1)).toBe(0);
  });
});
