import { describe, it, expect } from "vitest";
import {
  computeSceneState,
  computeCharacterStates,
  applyEvent,
  eventsUpTo,
  activeCaptionAt,
} from "../../../src/core/scene/state";
import { sceneFixture } from "./fixtures";

const scene = sceneFixture as never as import("../../../src/core/scene/types").Scene;

describe("eventsUpTo", () => {
  it("returns only events at or before the timestamp, sorted by time", () => {
    const events = eventsUpTo(scene.scenario, 3.0);
    expect(events.map((e) => e.t)).toEqual([0.0, 0.7, 1.4, 3.0]);
  });

  it("returns no events for a timestamp before the first event", () => {
    expect(eventsUpTo(scene.scenario, -1)).toEqual([]);
  });

  it("returns all events for a timestamp after the last event", () => {
    const events = eventsUpTo(scene.scenario, 100);
    expect(events).toHaveLength(scene.scenario.events.length);
  });

  it("sorts events that are out of source order by time", () => {
    const scenario = {
      events: [
        { t: 5, type: "move" as const, who: "a", to: [1, 1] as [number, number] },
        { t: 2, type: "move" as const, who: "a", to: [2, 2] as [number, number] },
      ],
    };
    expect(eventsUpTo(scenario, 10).map((e) => e.t)).toEqual([2, 5]);
  });
});

describe("applyEvent", () => {
  const base = {
    id: "noah", name: "Noah", role: "r", color: "#000",
    x: 500, y: 720, dir: "up" as const, emotion: "nervous" as const,
    visible: false, prop: null,
    look: {} as never,
  };

  it("appear makes the character visible and moves it to `at`", () => {
    const out = applyEvent(base, {
      t: 0.7, type: "appear", who: "noah", at: [500, 718], dir: "up", emotion: "nervous",
    });
    expect(out.visible).toBe(true);
    expect(out.x).toBe(500);
    expect(out.y).toBe(718);
    expect(out.dir).toBe("up");
    expect(out.emotion).toBe("nervous");
  });

  it("move updates position, direction and emotion when present", () => {
    const out = applyEvent(base, {
      t: 1.4, type: "move", who: "noah", to: [492, 616], dir: "down", emotion: "happy",
    });
    expect(out.x).toBe(492);
    expect(out.y).toBe(616);
    expect(out.dir).toBe("down");
    expect(out.emotion).toBe("happy");
  });

  it("move keeps existing direction/emotion when not provided", () => {
    const out = applyEvent(base, { t: 1.4, type: "move", who: "noah", to: [10, 20] });
    expect(out.dir).toBe("up");
    expect(out.emotion).toBe("nervous");
  });

  it("appear keeps position when `at` is missing", () => {
    const out = applyEvent(base, { t: 0.7, type: "appear", who: "noah" });
    expect(out.visible).toBe(true);
    expect(out.x).toBe(500);
    expect(out.y).toBe(720);
  });

  it("move keeps position when `to` is missing", () => {
    const out = applyEvent(base, { t: 1.4, type: "move", who: "noah" });
    expect(out.x).toBe(500);
    expect(out.y).toBe(720);
  });

  it("emotion sets the character's emotion", () => {
    const out = applyEvent(base, { t: 7.2, type: "emotion", who: "maya", set: "surprised" });
    expect(out.emotion).toBe("surprised");
  });

  it("emotion keeps the current emotion when `set` is missing", () => {
    const out = applyEvent(base, { t: 7.2, type: "emotion", who: "maya" });
    expect(out.emotion).toBe("nervous");
  });

  it("say sets an active bubble and its emotion", () => {
    const out = applyEvent(base, {
      t: 3.0, type: "say", who: "noah", kind: "thought", dur: 3.0, emotion: "nervous", text: "Deep breath.",
    });
    expect(out.emotion).toBe("nervous");
    expect(out.say).toEqual({
      text: "Deep breath.",
      kind: "thought",
      emotion: "nervous",
      until: 6.0,
    });
  });

  it("say defaults kind to \"say\" and duration to 0", () => {
    const out = applyEvent(base, { t: 1, type: "say", who: "noah", text: "Hi" });
    expect(out.say).toEqual({ text: "Hi", kind: "say", emotion: undefined, until: 1 });
  });

  it("say defaults text to empty when absent", () => {
    const out = applyEvent(base, { t: 1, type: "say", who: "noah" });
    expect(out.say).toEqual({ text: "", kind: "say", emotion: undefined, until: 1 });
  });

  it("exit makes the character invisible", () => {
    const out = applyEvent({ ...base, visible: true }, { t: 40, type: "exit", who: "noah" });
    expect(out.visible).toBe(false);
  });

  it("caption is a no-op for a character", () => {
    const out = applyEvent(base, { t: 0, type: "caption", text: "Hello" });
    expect(out).toEqual(base);
  });
});

describe("computeCharacterStates", () => {
  it("replays events up to the timestamp, preserving initial state before events", () => {
    const states = computeCharacterStates(scene, 0.5);
    const noah = states.find((c) => c.id === "noah")!;
    // No events have fired yet — noah stays hidden at his initial position.
    expect(noah.visible).toBe(false);
    expect(noah.x).toBe(500);
    expect(noah.y).toBe(720);
  });

  it("applies appear + moves + says in order", () => {
    const states = computeCharacterStates(scene, 4.0);
    const noah = states.find((c) => c.id === "noah")!;
    expect(noah.visible).toBe(true);
    expect(noah.x).toBe(500);
    expect(noah.y).toBe(672);
    expect(noah.say).toBeDefined();
    expect(noah.say!.text).toBe("Deep breath.");
  });

  it("expires a say bubble once its window ends", () => {
    const during = computeCharacterStates(scene, 5.9).find((c) => c.id === "noah")!;
    expect(during.say).toBeDefined();
    const after = computeCharacterStates(scene, 6.0).find((c) => c.id === "noah")!;
    expect(after.say).toBeUndefined();
  });

  it("applies an emotion event to a character", () => {
    const states = computeCharacterStates(scene, 7.5);
    const maya = states.find((c) => c.id === "maya")!;
    expect(maya.emotion).toBe("surprised");
  });

  it("applies an exit event to hide a character", () => {
    const states = computeCharacterStates(scene, 41);
    const noah = states.find((c) => c.id === "noah")!;
    expect(noah.visible).toBe(false);
  });

  it("ignores events whose who is unknown or absent", () => {
    const scenario = {
      ...scene.scenario,
      events: [
        ...scene.scenario.events,
        { t: 1, type: "move" as const, who: "ghost", to: [1, 1] as [number, number] },
        { t: 2, type: "caption" as const, text: "x" },
      ],
    };
    const states = computeCharacterStates(
      { ...scene, scenario },
      10,
    );
    // No character named "ghost" exists; caption has no who — neither throws.
    expect(states.map((c) => c.id)).toContain("maya");
  });
});

describe("activeCaptionAt", () => {
  it("returns the latest caption text at the timestamp", () => {
    expect(activeCaptionAt(scene, 0.5)).toBe("Monday · 9:02 AM");
  });

  it("returns undefined before any caption has fired", () => {
    expect(activeCaptionAt(scene, -1)).toBeUndefined();
  });

  it("returns the most recent caption after several fire", () => {
    // Fixture has only one caption (t=0); append a later one.
    const scenario = {
      ...scene.scenario,
      events: [
        ...scene.scenario.events,
        { t: 10, type: "caption" as const, text: "Later caption" },
      ],
    };
    expect(activeCaptionAt({ ...scene, scenario }, 11)).toBe("Later caption");
  });
});

describe("computeSceneState", () => {
  it("returns the ordered render state with caption and live characters", () => {
    const state = computeSceneState(scene, 4.0);
    expect(state.caption).toBe("Monday · 9:02 AM");
    // Background is grouped.
    expect(state.background.floor).toBe(scene.staticScene.floor);
    // Objects are paint-ordered.
    const keys = state.objects.map((o) => o.sortKey);
    expect(keys).toEqual([...keys].sort((a, b) => a - b));
    // Noah is now visible (appeared) and included.
    const visibleIds = state.characters.map((c) => c.id);
    expect(visibleIds).toContain("noah");
    expect(visibleIds).toContain("maya");
    // Noah has an active say bubble.
    const noah = state.characters.find((c) => c.id === "noah")!;
    expect(noah.say?.text).toBe("Deep breath.");
  });

  it("before the first event matches the initial state (no caption)", () => {
    const state = computeSceneState(scene, -1);
    expect(state.caption).toBeUndefined();
    expect(state.characters.map((c) => c.id)).toEqual(["maya"]);
  });

  it("after the last event keeps the final state", () => {
    const state = computeSceneState(scene, 100);
    // Noah exited, so only the initially-visible characters remain.
    expect(state.characters.map((c) => c.id)).not.toContain("noah");
    expect(state.characters.map((c) => c.id)).toContain("maya");
  });
});
