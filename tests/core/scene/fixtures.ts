/**
 * Shared fixtures for scene parse tests, mirroring the data shapes from the
 * ws/scene/prototype.html web app (STATIC_SCENE, LIVE_SCENE, SCENARIO).
 */

export const staticSceneFixture = {
  meta: {
    name: "Northlight Studio · Floor 3",
    style: "gem-flat 2.5D",
    projection: "plan + vertical extrusion",
    world: { w: 1040, h: 730 },
  },
  floor: { x: 60, y: 110, w: 920, h: 550, plank: 56, base: "#efe3cf", tone: "#e6d8bf" },
  corridor: { x: 435, y: 680, w: 130, h: 50, color: "#1b2438" },
  walls: [
    {
      id: "wN", x: 40, y: 90, w: 960, h: 20, height: 70,
      face: "#dfe5f2", top: "#f4f7fd", layer: "back",
    },
    {
      id: "wSa", x: 40, y: 660, w: 395, h: 20, height: 16,
      face: "#c4cde0", top: "#e6ebf6", layer: "front",
    },
  ],
  windows: [
    { id: "win1", wall: "wN", x: 110, y: 50, w: 180, h: 46, view: "city" },
  ],
  door: { id: "door1", x: 435, y: 660, w: 130, h: 20, frame: "#8f6b45", label: "ENTRANCE" },
  wallDecor: [
    { id: "board1", asset: "whiteboard", x: 852, y: 48, w: 132, h: 50, ink: "#4f7cff" },
    { id: "clock1", asset: "clock", x: 333, y: 64, r: 15 },
    { id: "poster1", asset: "poster", x: 588, y: 50, w: 36, h: 46, color: "#ff5d7a" },
  ],
  floorDecals: [
    { id: "rugLounge", asset: "rug", x: 205, y: 285, w: 290, h: 215, color: "#4f7cff", trim: "#9b6cf5" },
    { id: "zoneDesk", asset: "zone", x: 770, y: 390, w: 400, h: 330, color: "#ffb648", label: "DESK POD · A/B" },
  ],
  lightPatches: [{ x: 110, w: 180 }, { x: 400, w: 170 }],
  assets: [
    { id: "tbl_lounge", asset: "roundTable", x: 205, y: 272, r: 74, h: 42, t: 9, color: "#f7f0e4", edge: "#c9b694" },
    { id: "ch_l1", asset: "chair", x: 205, y: 202, dir: "down", color: "#4f7cff" },
    { id: "cup_l1", asset: "cup", x: 178, y: 262, z: 42, color: "#ff5d7a", sort: 305.6 },
    { id: "counter", asset: "counter", x: 520, y: 158, w: 242, d: 58, h: 58, color: "#eaeef7", top: "#2b3550" },
    { id: "coffee", asset: "coffeeMachine", x: 452, y: 152, z: 58, sort: 187.2 },
    { id: "kettle", asset: "kettle", x: 536, y: 150, z: 58, color: "#ff5d7a", sort: 187.3 },
    { id: "cups", asset: "cupRow", x: 602, y: 154, z: 58, sort: 187.4 },
    { id: "cooler", asset: "waterCooler", x: 372, y: 170, w: 44, d: 42, h: 48 },
    { id: "stool1", asset: "stool", x: 474, y: 240, color: "#ffb648" },
    { id: "sofa", asset: "sofa", x: 112, y: 402, w: 66, d: 172, dir: "right", color: "#9b6cf5" },
    { id: "cabinet", asset: "cabinet", x: 160, y: 546, w: 190, d: 60, h: 68, color: "#5b6b8c" },
    { id: "crates", asset: "crates", x: 296, y: 524, color: "#c98a5e" },
    { id: "printer", asset: "printer", x: 330, y: 600, w: 92, d: 64, h: 46, color: "#dfe5f0" },
    { id: "plant5", asset: "plant", x: 386, y: 520, s: 0.85, pot: "#2ec4a6" },
    { id: "deskA1", asset: "desk", x: 660, y: 280, w: 170, d: 76, h: 44, t: 10, color: "#f4ece0", edge: "#c9b694" },
    { id: "lapA1", asset: "laptop", x: 630, y: 258, z: 44, sort: 318.2 },
    { id: "mugA1", asset: "cup", x: 698, y: 276, z: 44, color: "#2ec4a6", sort: 318.4 },
    { id: "lampA1", asset: "lamp", x: 730, y: 256, z: 44, sort: 318.6 },
    { id: "signNew", asset: "deskSign", x: 918, y: 298, z: 44, text: "NOAH", sort: 318.7 },
  ],
};

export const liveSceneFixture = {
  meta: { scene: "northlight_floor3", tick: "seconds", defaultEmotion: "neutral" },
  characters: [
    {
      id: "noah", name: "Noah", role: "New hire · Frontend", color: "#4f7cff",
      x: 500, y: 720, dir: "up", emotion: "nervous", visible: false, prop: "bag",
      look: {
        skin: "#f2cba6", skin2: "#e0b189", hair: "#3d2a20", hairStyle: "short",
        shirt: "#7fb6ff", shirt2: "#5b95e8", pants: "#39435c", shoes: "#1e2434",
      },
    },
    {
      id: "maya", name: "Maya", role: "Team lead · Platform", color: "#2ec4a6",
      x: 660, y: 216, dir: "down", emotion: "neutral", visible: true, prop: null,
      look: {
        skin: "#c98a5e", skin2: "#b0744a", hair: "#22191a", hairStyle: "bun",
        shirt: "#2ec4a6", shirt2: "#1f9e85", pants: "#2b3550", shoes: "#1a2032",
      },
    },
  ],
};

export const scenarioFixture = {
  id: "first_day_greeting",
  title: "First Day — Noah Joins the Team",
  duration: 41,
  events: [
    { t: 0.0, type: "caption", text: "Monday · 9:02 AM" },
    { t: 0.7, type: "appear", who: "noah", at: [500, 718], dir: "up", emotion: "nervous" },
    { t: 1.4, type: "move", who: "noah", to: [500, 672], dir: "up" },
    { t: 3.0, type: "say", who: "noah", kind: "thought", dur: 3.0, emotion: "nervous", text: "Deep breath." },
    { t: 7.2, type: "emotion", who: "maya", set: "surprised" },
    { t: 9.9, type: "say", who: "maya", dur: 3.8, emotion: "happy", text: "Hey!" },
    { t: 40.0, type: "exit", who: "noah" },
  ],
};
