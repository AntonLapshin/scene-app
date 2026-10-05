/**
 * Office scene data (M1-T4a).
 *
 * The raw STATIC_SCENE, LIVE_SCENE and SCENARIO JSON extracted verbatim from
 * the ws/scene/prototype.html web app (lines ~312 / ~402 / ~429 —
 * "Northlight Studio · Floor 3", Noah/Maya/Priya/Lena/Dana, "First Day"
 * scenario). Extracted as typed data with no browser API usage, plus a pure
 * loader that parses it into a typed `Scene` via the core `parse*` functions.
 */

import type {
  Scene,
  StaticScene,
  LiveScene,
  Scenario,
} from "../core/scene";
import {
  parseSceneBundle,
  SceneParseError,
} from "../core/scene";

/** Raw STATIC_SCENE data for the office scene. */
export const officeStaticScene: StaticScene = {
  meta: {
    name: "Northlight Studio · Floor 3",
    style: "gem-flat 2.5D",
    projection: "plan + vertical extrusion",
    world: { w: 1040, h: 730 },
  },
  floor: { x: 60, y: 110, w: 920, h: 550, plank: 56, base: "#efe3cf", tone: "#e6d8bf" },
  corridor: { x: 435, y: 680, w: 130, h: 50, color: "#1b2438" },
  walls: [
    { id: "wN", x: 40, y: 90, w: 960, h: 20, height: 70, face: "#dfe5f2", top: "#f4f7fd", layer: "back" },
    { id: "wW", x: 40, y: 90, w: 20, h: 590, height: 70, face: "#d3dae9", top: "#eef2fa", layer: "back" },
    { id: "wE", x: 980, y: 90, w: 20, h: 590, height: 70, face: "#cbd3e4", top: "#e8edf8", layer: "back" },
    { id: "wSa", x: 40, y: 660, w: 395, h: 20, height: 16, face: "#c4cde0", top: "#e6ebf6", layer: "front" },
    { id: "wSb", x: 565, y: 660, w: 435, h: 20, height: 16, face: "#c4cde0", top: "#e6ebf6", layer: "front" },
  ],
  windows: [
    { id: "win1", wall: "wN", x: 110, y: 50, w: 180, h: 46, view: "city" },
    { id: "win2", wall: "wN", x: 400, y: 50, w: 170, h: 46, view: "city" },
    { id: "win3", wall: "wN", x: 650, y: 50, w: 180, h: 46, view: "hills" },
  ],
  door: { id: "door1", x: 435, y: 660, w: 130, h: 20, frame: "#8f6b45", label: "ENTRANCE" },
  wallDecor: [
    { id: "board1", asset: "whiteboard", x: 852, y: 48, w: 132, h: 50, ink: "#4f7cff" },
    { id: "clock1", asset: "clock", x: 333, y: 64, r: 15 },
    { id: "poster1", asset: "poster", x: 588, y: 50, w: 36, h: 46, color: "#ff5d7a" },
  ],
  floorDecals: [
    { id: "rugLounge", asset: "rug", x: 205, y: 285, w: 290, h: 215, color: "#4f7cff", trim: "#9b6cf5" },
    { id: "rugEntrance", asset: "rug", x: 500, y: 616, w: 212, h: 76, color: "#2ec4a6", trim: "#ffb648" },
    { id: "zoneDesk", asset: "zone", x: 770, y: 390, w: 400, h: 330, color: "#ffb648", label: "DESK POD · A/B" },
    { id: "zoneLounge", asset: "zone", x: 205, y: 285, w: 300, h: 230, color: "#4f7cff", label: "LOUNGE" },
    { id: "zoneKitchen", asset: "zone", x: 520, y: 170, w: 260, h: 110, color: "#2ec4a6", label: "KITCHEN" },
  ],
  lightPatches: [{ x: 110, w: 180 }, { x: 400, w: 170 }, { x: 650, w: 180 }],

  assets: [
    /* lounge */
    { id: "tbl_lounge", asset: "roundTable", x: 205, y: 272, r: 74, h: 42, t: 9, color: "#f7f0e4", edge: "#c9b694" },
    { id: "ch_l1", asset: "chair", x: 205, y: 202, dir: "down", color: "#4f7cff" },
    { id: "ch_l2", asset: "chair", x: 112, y: 272, dir: "right", color: "#9b6cf5" },
    { id: "ch_l3", asset: "chair", x: 298, y: 272, dir: "left", color: "#2ec4a6" },
    { id: "ch_l4", asset: "chair", x: 205, y: 344, dir: "up", color: "#ffb648" },
    { id: "cup_l1", asset: "cup", x: 178, y: 262, z: 42, color: "#ff5d7a", sort: 305.6 },
    { id: "cup_l2", asset: "cup", x: 238, y: 286, z: 42, color: "#4f7cff", sort: 305.7 },
    { id: "notes", asset: "papers", x: 206, y: 274, z: 42, sort: 305.8 },

    /* kitchen */
    { id: "counter", asset: "counter", x: 520, y: 158, w: 242, d: 58, h: 58, color: "#eaeef7", top: "#2b3550" },
    { id: "coffee", asset: "coffeeMachine", x: 452, y: 152, z: 58, sort: 187.2 },
    { id: "kettle", asset: "kettle", x: 536, y: 150, z: 58, color: "#ff5d7a", sort: 187.3 },
    { id: "cups", asset: "cupRow", x: 602, y: 154, z: 58, sort: 187.4 },
    { id: "cooler", asset: "waterCooler", x: 372, y: 170, w: 44, d: 42, h: 48 },
    { id: "stool1", asset: "stool", x: 474, y: 240, color: "#ffb648" },

    /* west wall / storage */
    { id: "sofa", asset: "sofa", x: 112, y: 402, w: 66, d: 172, dir: "right", color: "#9b6cf5" },
    { id: "cabinet", asset: "cabinet", x: 160, y: 546, w: 190, d: 60, h: 68, color: "#5b6b8c" },
    { id: "crates", asset: "crates", x: 296, y: 524, color: "#c98a5e" },
    { id: "printer", asset: "printer", x: 330, y: 600, w: 92, d: 64, h: 46, color: "#dfe5f0" },
    { id: "plant5", asset: "plant", x: 386, y: 520, s: 0.85, pot: "#2ec4a6" },

    /* desk pod */
    { id: "deskA1", asset: "desk", x: 660, y: 280, w: 170, d: 76, h: 44, t: 10, color: "#f4ece0", edge: "#c9b694" },
    { id: "deskA2", asset: "desk", x: 860, y: 280, w: 170, d: 76, h: 44, t: 10, color: "#f4ece0", edge: "#c9b694" },
    { id: "deskB1", asset: "desk", x: 660, y: 500, w: 170, d: 76, h: 44, t: 10, color: "#f4ece0", edge: "#c9b694" },
    { id: "deskB2", asset: "desk", x: 860, y: 500, w: 170, d: 76, h: 44, t: 10, color: "#f4ece0", edge: "#c9b694" },

    { id: "chA1", asset: "chair", x: 660, y: 216, dir: "down", color: "#2ec4a6" },
    { id: "chA2", asset: "chair", x: 862, y: 216, dir: "down", color: "#4f7cff" },
    { id: "chB1", asset: "chair", x: 664, y: 436, dir: "down", color: "#9b6cf5" },
    { id: "chB2", asset: "chair", x: 860, y: 436, dir: "down", color: "#ff5d7a" },

    { id: "lapA1", asset: "laptop", x: 630, y: 258, z: 44, sort: 318.2 },
    { id: "lapA2", asset: "laptop", x: 830, y: 258, z: 44, sort: 318.3 },
    { id: "lapB1", asset: "laptop", x: 628, y: 478, z: 44, sort: 538.2 },
    { id: "lapB2", asset: "laptop", x: 830, y: 478, z: 44, sort: 538.3 },

    { id: "mugA1", asset: "cup", x: 698, y: 276, z: 44, color: "#2ec4a6", sort: 318.4 },
    { id: "mugA2", asset: "cup", x: 892, y: 278, z: 44, color: "#ffb648", sort: 318.5 },
    { id: "mugB1", asset: "cup", x: 698, y: 496, z: 44, color: "#9b6cf5", sort: 538.4 },
    { id: "bookB2", asset: "papers", x: 900, y: 494, z: 44, sort: 538.5 },
    { id: "lampA1", asset: "lamp", x: 730, y: 256, z: 44, sort: 318.6 },
    { id: "signNew", asset: "deskSign", x: 918, y: 298, z: 44, text: "NOAH", sort: 318.7 },

    /* plants */
    { id: "plant1", asset: "plant", x: 96, y: 152, s: 1.15, pot: "#ff5d7a" },
    { id: "plant2", asset: "plant", x: 956, y: 150, s: 1.0, pot: "#4f7cff" },
    { id: "plant3", asset: "plant", x: 98, y: 626, s: 0.95, pot: "#2ec4a6" },
    { id: "plant4", asset: "plant", x: 952, y: 626, s: 1.1, pot: "#ffb648" },
  ],
};

/** Raw LIVE_SCENE data for the office scene. */
export const officeLiveScene: LiveScene = {
  meta: { scene: "northlight_floor3", tick: "seconds", defaultEmotion: "neutral" },
  characters: [
    {
      id: "noah", name: "Noah", role: "New hire · Frontend", color: "#4f7cff",
      x: 500, y: 720, dir: "up", emotion: "nervous", visible: false, prop: "bag",
      look: { skin: "#f2cba6", skin2: "#e0b189", hair: "#3d2a20", hairStyle: "short", shirt: "#7fb6ff", shirt2: "#5b95e8", pants: "#39435c", shoes: "#1e2434" },
    },
    {
      id: "maya", name: "Maya", role: "Team lead · Platform", color: "#2ec4a6",
      x: 660, y: 216, dir: "down", emotion: "neutral", visible: true, prop: null,
      look: { skin: "#c98a5e", skin2: "#b0744a", hair: "#22191a", hairStyle: "bun", shirt: "#2ec4a6", shirt2: "#1f9e85", pants: "#2b3550", shoes: "#1a2032" },
    },
    {
      id: "priya", name: "Priya", role: "Product designer", color: "#9b6cf5",
      x: 296, y: 278, dir: "left", emotion: "happy", visible: true, prop: null,
      look: { skin: "#e2a97c", skin2: "#c98f63", hair: "#2b1f22", hairStyle: "long", shirt: "#9b6cf5", shirt2: "#7d51d3", pants: "#3a3357", shoes: "#221d33" },
    },
    {
      id: "lena", name: "Lena", role: "QA engineer", color: "#ffb648",
      x: 664, y: 436, dir: "down", emotion: "neutral", visible: true, prop: null,
      look: { skin: "#ffe0cb", skin2: "#eec7ae", hair: "#b5502f", hairStyle: "ponytail", shirt: "#ffb648", shirt2: "#e2952c", pants: "#4a6fa5", shoes: "#26313f" },
    },
    {
      id: "dana", name: "Dana", role: "Ops manager", color: "#ff5d7a",
      x: 424, y: 214, dir: "down", emotion: "happy", visible: true, prop: "cup",
      look: { skin: "#8d5a3b", skin2: "#78492e", hair: "#191315", hairStyle: "curly", shirt: "#ff5d7a", shirt2: "#dd3f5e", pants: "#2c3444", shoes: "#171d29" },
    },
  ],
};

/** Raw SCENARIO data for the office scene. */
export const officeScenario: Scenario = {
  id: "first_day_greeting",
  title: "First Day — Noah Joins the Team",
  duration: 41,
  events: [
    { t: 0.0, type: "caption", text: "Monday · 9:02 AM — Northlight Studio, floor 3" },
    { t: 0.7, type: "appear", who: "noah", at: [500, 718], dir: "up", emotion: "nervous" },
    { t: 1.4, type: "move", who: "noah", to: [500, 672], dir: "up" },
    { t: 2.2, type: "move", who: "noah", to: [492, 616], dir: "up" },
    { t: 3.0, type: "say", who: "noah", kind: "thought", dur: 3.0, emotion: "nervous", text: "Okay… deep breath. First day, brand new team." },
    { t: 5.4, type: "move", who: "noah", to: [478, 566], dir: "up" },
    { t: 6.2, type: "move", who: "noah", to: [468, 536], dir: "down", emotion: "nervous" },
    { t: 6.8, type: "caption", text: "Maya looks up from her desk." },
    { t: 7.2, type: "emotion", who: "maya", set: "surprised" },
    { t: 8.0, type: "move", who: "maya", to: [566, 236], dir: "left" },
    { t: 8.8, type: "move", who: "maya", to: [552, 352], dir: "down" },
    { t: 9.5, type: "move", who: "maya", to: [545, 455], dir: "left", emotion: "happy" },
    { t: 9.9, type: "say", who: "maya", dur: 3.8, emotion: "happy", text: "Hey! You must be Noah — I'm Maya, your team lead." },
    { t: 11.6, type: "say", who: "noah", dur: 3.0, emotion: "shy", text: "Hi! Yes — that's me. Really nice to meet you." },
    { t: 13.8, type: "caption", text: "Priya hears the introductions from the lounge." },
    { t: 14.2, type: "emotion", who: "priya", set: "surprised" },
    { t: 14.7, type: "move", who: "priya", to: [330, 368], dir: "down" },
    { t: 15.4, type: "move", who: "priya", to: [344, 468], dir: "right", emotion: "excited" },
    { t: 15.8, type: "say", who: "priya", dur: 4.0, emotion: "excited", text: "Welcome aboard! I'm Priya — I design things and raid the snack drawer." },
    { t: 18.0, type: "say", who: "noah", dur: 2.6, emotion: "happy", text: "Snack drawer noted. I'm Noah." },
    { t: 19.4, type: "caption", text: "Lena peeks over from the QA row." },
    { t: 19.8, type: "emotion", who: "lena", set: "surprised" },
    { t: 20.3, type: "move", who: "lena", to: [612, 404], dir: "left", emotion: "shy" },
    { t: 20.9, type: "move", who: "lena", to: [596, 386], dir: "left" },
    { t: 21.2, type: "say", who: "lena", dur: 4.0, emotion: "shy", text: "H-hi… I'm Lena. I sit right over there if you ever need anything." },
    { t: 23.4, type: "say", who: "noah", dur: 2.6, emotion: "happy", text: "Thanks Lena — that's really kind." },
    { t: 25.0, type: "move", who: "dana", to: [418, 286], dir: "down" },
    { t: 25.7, type: "move", who: "dana", to: [404, 352], dir: "down", emotion: "happy" },
    { t: 26.1, type: "say", who: "dana", dur: 4.2, emotion: "happy", text: "Morning! Dana, ops. Coffee's on the counter — the machine is moody before ten." },
    { t: 28.8, type: "say", who: "maya", dur: 3.2, emotion: "confident", text: "Alright — let me show you to your brand new desk." },
    { t: 30.6, type: "move", who: "maya", to: [660, 330], dir: "right" },
    { t: 31.2, type: "move", who: "maya", to: [762, 345], dir: "right", emotion: "proud" },
    { t: 31.6, type: "move", who: "noah", to: [600, 480], dir: "right" },
    { t: 32.4, type: "move", who: "noah", to: [760, 410], dir: "up" },
    { t: 33.2, type: "move", who: "noah", to: [900, 332], dir: "up" },
    { t: 34.0, type: "move", who: "noah", to: [952, 250], dir: "up" },
    { t: 34.8, type: "move", who: "noah", to: [862, 216], dir: "down", emotion: "excited" },
    { t: 35.3, type: "say", who: "noah", dur: 3.6, emotion: "excited", text: "This is perfect. Thank you — I'm really glad to be here!" },
    { t: 37.0, type: "say", who: "priya", dur: 3.0, emotion: "happy", text: "Anytime! Ping us if you need anything at all." },
    { t: 37.4, type: "emotion", who: "maya", set: "proud" },
    { t: 37.8, type: "emotion", who: "lena", set: "happy" },
    { t: 38.2, type: "emotion", who: "dana", set: "happy" },
    { t: 39.0, type: "caption", text: "9:14 AM — and just like that, Noah was one of them." },
  ],
};

/** The bundled office scene as raw data for the loader. */
export const officeSceneData: Scene = {
  staticScene: officeStaticScene,
  liveScene: officeLiveScene,
  scenario: officeScenario,
};

/**
 * Load the office scene: parse the bundled office data into a typed `Scene`
 * using the core `parseSceneBundle` (which validates each part). `raw` defaults
 * to the bundled office scene data. Purely validates the data — throws a
 * descriptive error if any part is malformed or missing.
 */
export function loadOfficeScene(raw: Scene = officeSceneData): Scene {
  const result = parseSceneBundle(raw);
  if (!result.ok) throw new SceneParseError(result.error);
  return result.scene;
}
