import { describe, it, expect } from "vitest";
import { computeSceneState } from "../../../src/core/scene";
import { loadOfficeScene } from "../../../src/data/officeScene";
import type { CharacterState, Scene } from "../../../src/core/scene/types";

/**
 * End-to-end playback verification vs the prototype (M3-T4).
 *
 * Replays the office "First Day" scenario through the core `computeSceneState`
 * at key timestamps and asserts the render state matches the prototype's
 * expected per-timestamp output: character positions, visibility, emotions,
 * active say bubbles, and the active caption. The expected values below are
 * transcribed from the prototype's timeline in `src/data/officeScene.ts`
 * (extracted from ws/scene/prototype.html) — every event's effect is traced by
 * hand so a regression in timeline evaluation or event application fails here.
 */

const scene: Scene = loadOfficeScene();

/**
 * A compact expected-state record for one character at a timestamp.
 * `say` is the expected active bubble (or `undefined` when no bubble is live).
 */
interface ExpectedCharacter {
  id: string;
  x: number;
  y: number;
  dir: string;
  emotion: string;
  visible: boolean;
  say?: { text: string; kind: string; emotion: string | undefined; until: number };
}

interface ExpectedFrame {
  t: number;
  caption: string | undefined;
  /** Characters that should be visible (with their live state). */
  characters: ExpectedCharacter[];
  /** Characters that should be hidden at this timestamp. */
  hidden: string[];
}

/** The initial (t<0.7) state of the four already-visible teammates. */
const TEAM_INITIAL: ExpectedCharacter[] = [
  { id: "maya", x: 660, y: 216, dir: "down", emotion: "neutral", visible: true },
  { id: "priya", x: 296, y: 278, dir: "left", emotion: "happy", visible: true },
  { id: "lena", x: 664, y: 436, dir: "down", emotion: "neutral", visible: true },
  { id: "dana", x: 424, y: 214, dir: "down", emotion: "happy", visible: true },
];

const OPENING_CAPTION = "Monday · 9:02 AM — Northlight Studio, floor 3";

/** The four teammates after Maya's greeting (from t=9.9 onward). */
const TEAM_AFTER_GREETING: ExpectedCharacter[] = [
  { id: "maya", x: 545, y: 455, dir: "left", emotion: "happy", visible: true },
  { id: "priya", x: 296, y: 278, dir: "left", emotion: "happy", visible: true },
  { id: "lena", x: 664, y: 436, dir: "down", emotion: "neutral", visible: true },
  { id: "dana", x: 424, y: 214, dir: "down", emotion: "happy", visible: true },
];

/**
 * The expected per-timestamp output, traced from the office scenario events.
 * Each frame pins the caption, the visible characters with their exact live
 * state, and which characters are hidden.
 */
const EXPECTED_FRAMES: ExpectedFrame[] = [
  {
    t: 0,
    caption: OPENING_CAPTION,
    characters: TEAM_INITIAL,
    hidden: ["noah"],
  },
  {
    t: 0.7,
    caption: OPENING_CAPTION,
    characters: [
      { id: "noah", x: 500, y: 718, dir: "up", emotion: "nervous", visible: true },
      ...TEAM_INITIAL,
    ],
    hidden: [],
  },
  {
    t: 3.0,
    caption: OPENING_CAPTION,
    characters: [
      {
        id: "noah", x: 492, y: 616, dir: "up", emotion: "nervous", visible: true,
        say: {
          text: "Okay… deep breath. First day, brand new team.",
          kind: "thought",
          emotion: "nervous",
          until: 6,
        },
      },
      ...TEAM_INITIAL,
    ],
    hidden: [],
  },
  {
    // Noah's say window (until 6.0) has just ended — the bubble must expire.
    t: 6.0,
    caption: OPENING_CAPTION,
    characters: [
      { id: "noah", x: 478, y: 566, dir: "up", emotion: "nervous", visible: true },
      ...TEAM_INITIAL,
    ],
    hidden: [],
  },
  {
    t: 7.2,
    caption: "Maya looks up from her desk.",
    characters: [
      { id: "noah", x: 468, y: 536, dir: "down", emotion: "nervous", visible: true },
      { id: "maya", x: 660, y: 216, dir: "down", emotion: "surprised", visible: true },
      ...TEAM_INITIAL.slice(1),
    ],
    hidden: [],
  },
  {
    t: 9.9,
    caption: "Maya looks up from her desk.",
    characters: [
      { id: "noah", x: 468, y: 536, dir: "down", emotion: "nervous", visible: true },
      {
        id: "maya", x: 545, y: 455, dir: "left", emotion: "happy", visible: true,
        say: {
          text: "Hey! You must be Noah — I'm Maya, your team lead.",
          kind: "say",
          emotion: "happy",
          until: 13.7,
        },
      },
      ...TEAM_AFTER_GREETING.slice(1),
    ],
    hidden: [],
  },
  {
    t: 11.6,
    caption: "Maya looks up from her desk.",
    characters: [
      {
        id: "noah", x: 468, y: 536, dir: "down", emotion: "shy", visible: true,
        say: {
          text: "Hi! Yes — that's me. Really nice to meet you.",
          kind: "say",
          emotion: "shy",
          until: 14.6,
        },
      },
      {
        id: "maya", x: 545, y: 455, dir: "left", emotion: "happy", visible: true,
        say: {
          text: "Hey! You must be Noah — I'm Maya, your team lead.",
          kind: "say",
          emotion: "happy",
          until: 13.7,
        },
      },
      ...TEAM_AFTER_GREETING.slice(1),
    ],
    hidden: [],
  },
  {
    // Noah's greeting bubble is still live (until 14.6) here.
    t: 13.8,
    caption: "Priya hears the introductions from the lounge.",
    characters: [
      {
        id: "noah", x: 468, y: 536, dir: "down", emotion: "shy", visible: true,
        say: {
          text: "Hi! Yes — that's me. Really nice to meet you.",
          kind: "say",
          emotion: "shy",
          until: 14.6,
        },
      },
      ...TEAM_AFTER_GREETING,
    ],
    hidden: [],
  },
  {
    t: 15.8,
    caption: "Priya hears the introductions from the lounge.",
    characters: [
      { id: "noah", x: 468, y: 536, dir: "down", emotion: "shy", visible: true },
      ...TEAM_AFTER_GREETING.slice(0, 1),
      {
        id: "priya", x: 344, y: 468, dir: "right", emotion: "excited", visible: true,
        say: {
          text: "Welcome aboard! I'm Priya — I design things and raid the snack drawer.",
          kind: "say",
          emotion: "excited",
          until: 19.8,
        },
      },
      ...TEAM_AFTER_GREETING.slice(2),
    ],
    hidden: [],
  },
  {
    t: 19.4,
    caption: "Lena peeks over from the QA row.",
    characters: [
      {
        id: "noah", x: 468, y: 536, dir: "down", emotion: "happy", visible: true,
        say: {
          text: "Snack drawer noted. I'm Noah.",
          kind: "say",
          emotion: "happy",
          until: 20.6,
        },
      },
      ...TEAM_AFTER_GREETING.slice(0, 1),
      {
        id: "priya", x: 344, y: 468, dir: "right", emotion: "excited", visible: true,
        say: {
          text: "Welcome aboard! I'm Priya — I design things and raid the snack drawer.",
          kind: "say",
          emotion: "excited",
          until: 19.8,
        },
      },
      ...TEAM_AFTER_GREETING.slice(2),
    ],
    hidden: [],
  },
  {
    t: 21.2,
    caption: "Lena peeks over from the QA row.",
    characters: [
      { id: "noah", x: 468, y: 536, dir: "down", emotion: "happy", visible: true },
      ...TEAM_AFTER_GREETING.slice(0, 1),
      { id: "priya", x: 344, y: 468, dir: "right", emotion: "excited", visible: true },
      {
        id: "lena", x: 596, y: 386, dir: "left", emotion: "shy", visible: true,
        say: {
          text: "H-hi… I'm Lena. I sit right over there if you ever need anything.",
          kind: "say",
          emotion: "shy",
          until: 25.2,
        },
      },
      ...TEAM_AFTER_GREETING.slice(3),
    ],
    hidden: [],
  },
  {
    t: 26.1,
    caption: "Lena peeks over from the QA row.",
    characters: [
      { id: "noah", x: 468, y: 536, dir: "down", emotion: "happy", visible: true },
      ...TEAM_AFTER_GREETING.slice(0, 1),
      { id: "priya", x: 344, y: 468, dir: "right", emotion: "excited", visible: true },
      { id: "lena", x: 596, y: 386, dir: "left", emotion: "shy", visible: true },
      {
        id: "dana", x: 404, y: 352, dir: "down", emotion: "happy", visible: true,
        say: {
          text: "Morning! Dana, ops. Coffee's on the counter — the machine is moody before ten.",
          kind: "say",
          emotion: "happy",
          until: 30.3,
        },
      },
    ],
    hidden: [],
  },
  {
    t: 28.8,
    caption: "Lena peeks over from the QA row.",
    characters: [
      { id: "noah", x: 468, y: 536, dir: "down", emotion: "happy", visible: true },
      {
        id: "maya", x: 545, y: 455, dir: "left", emotion: "confident", visible: true,
        say: {
          text: "Alright — let me show you to your brand new desk.",
          kind: "say",
          emotion: "confident",
          until: 32,
        },
      },
      { id: "priya", x: 344, y: 468, dir: "right", emotion: "excited", visible: true },
      { id: "lena", x: 596, y: 386, dir: "left", emotion: "shy", visible: true },
      {
        id: "dana", x: 404, y: 352, dir: "down", emotion: "happy", visible: true,
        say: {
          text: "Morning! Dana, ops. Coffee's on the counter — the machine is moody before ten.",
          kind: "say",
          emotion: "happy",
          until: 30.3,
        },
      },
    ],
    hidden: [],
  },
  {
    t: 35.3,
    caption: "Lena peeks over from the QA row.",
    characters: [
      {
        id: "noah", x: 862, y: 216, dir: "down", emotion: "excited", visible: true,
        say: {
          text: "This is perfect. Thank you — I'm really glad to be here!",
          kind: "say",
          emotion: "excited",
          until: 38.9,
        },
      },
      { id: "maya", x: 762, y: 345, dir: "right", emotion: "proud", visible: true },
      { id: "priya", x: 344, y: 468, dir: "right", emotion: "excited", visible: true },
      { id: "lena", x: 596, y: 386, dir: "left", emotion: "shy", visible: true },
      { id: "dana", x: 404, y: 352, dir: "down", emotion: "happy", visible: true },
    ],
    hidden: [],
  },
  {
    t: 39.0,
    caption: "9:14 AM — and just like that, Noah was one of them.",
    characters: [
      { id: "noah", x: 862, y: 216, dir: "down", emotion: "excited", visible: true },
      { id: "maya", x: 762, y: 345, dir: "right", emotion: "proud", visible: true },
      {
        id: "priya", x: 344, y: 468, dir: "right", emotion: "happy", visible: true,
        say: {
          text: "Anytime! Ping us if you need anything at all.",
          kind: "say",
          emotion: "happy",
          until: 40,
        },
      },
      { id: "lena", x: 596, y: 386, dir: "left", emotion: "happy", visible: true },
      { id: "dana", x: 404, y: 352, dir: "down", emotion: "happy", visible: true },
    ],
    hidden: [],
  },
  {
    // The final timestamp — every say bubble has expired; the scene holds its
    // closing composition (noah at his new desk, maya proud, team happy).
    t: 41,
    caption: "9:14 AM — and just like that, Noah was one of them.",
    characters: [
      { id: "noah", x: 862, y: 216, dir: "down", emotion: "excited", visible: true },
      { id: "maya", x: 762, y: 345, dir: "right", emotion: "proud", visible: true },
      { id: "priya", x: 344, y: 468, dir: "right", emotion: "happy", visible: true },
      { id: "lena", x: 596, y: 386, dir: "left", emotion: "happy", visible: true },
      { id: "dana", x: 404, y: 352, dir: "down", emotion: "happy", visible: true },
    ],
    hidden: [],
  },
];

function findCharacter(
  state: ReturnType<typeof computeSceneState>,
  id: string,
): CharacterState {
  const found = state.characters.find((c) => c.id === id);
  if (!found) throw new Error(`Character "${id}" not visible in render state`);
  return found;
}

describe("office playback vs prototype (M3-T4)", () => {
  it.each(EXPECTED_FRAMES.map((f) => [f.t, f] as const))(
    "matches the prototype render state at t=%s",
    (_t, frame) => {
      const state = computeSceneState(scene, frame.t);

      // Active caption matches the prototype's latest caption event.
      expect(state.caption).toBe(frame.caption);

      // Exactly the expected characters are visible.
      const visibleIds = state.characters.map((c) => c.id).sort();
      const expectedVisible = frame.characters.map((c) => c.id).sort();
      expect(visibleIds).toEqual(expectedVisible);

      // Every expected character carries the exact live state.
      for (const expected of frame.characters) {
        const actual = findCharacter(state, expected.id);
        expect(actual.x).toBe(expected.x);
        expect(actual.y).toBe(expected.y);
        expect(actual.dir).toBe(expected.dir);
        expect(actual.emotion).toBe(expected.emotion);
        expect(actual.visible).toBe(true);
        if (expected.say) {
          expect(actual.say).toEqual(expected.say);
        } else {
          expect(actual.say).toBeUndefined();
        }
      }

      // Hidden characters are absent from the render state.
      for (const hidden of frame.hidden) {
        expect(visibleIds).not.toContain(hidden);
      }
    },
  );

  it("produces a valid paint-ordered render state at every key timestamp", () => {
    for (const frame of EXPECTED_FRAMES) {
      const state = computeSceneState(scene, frame.t);
      const keys = state.objects.map((o) => o.sortKey);
      expect(keys).toEqual([...keys].sort((a, b) => a - b));
      expect(state.background.floor).toBe(scene.staticScene.floor);
    }
  });
});
