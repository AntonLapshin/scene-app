# Scene — Usage

This guide explains how to **author a scene JSON bundle** and how to **embed and
replay the scene player** in your own app. It is the companion to the
[README](../README.md), which covers the project overview, scripts and
architecture.

---

## 1. Authoring a scene bundle

A scene bundle is a plain JSON object with three top-level sections:

```json
{
  "staticScene": { "...": "..." },
  "liveScene": { "...": "..." },
  "scenario": { "...": "..." }
}
```

Each section is validated by the core `parse*` functions
(`src/core/scene/parse.ts`) and can be parsed as a whole with
[`parseSceneBundle`](#parse-scene-bundle) (which returns a result instead of
throwing). Malformed or missing fields produce a descriptive error.

### 1.1 `staticScene` — the geometry and fixed objects

`staticScene` describes the room: the world size, floor, corridor, walls, windows,
the door, wall decoration, floor decals, light patches, and the fixed **assets**.

The bundled office scene (`src/data/officeScene.ts`) is the canonical example. A
minimal skeleton:

```json
{
  "staticScene": {
    "meta": {
      "name": "Northlight Studio · Floor 3",
      "style": "gem-flat 2.5D",
      "projection": "plan + vertical extrusion",
      "world": { "w": 1040, "h": 730 }
    },
    "floor": { "x": 60, "y": 110, "w": 920, "h": 550, "plank": 56, "base": "#efe3cf", "tone": "#e6d8bf" },
    "corridor": { "x": 435, "y": 680, "w": 130, "h": 50, "color": "#1b2438" },
    "walls": [
      { "id": "wN", "x": 40, "y": 90, "w": 960, "h": 20, "height": 70, "face": "#dfe5f2", "top": "#f4f7fd", "layer": "back" }
    ],
    "windows": [
      { "id": "win1", "wall": "wN", "x": 110, "y": 50, "w": 180, "h": 46, "view": "city" }
    ],
    "door": { "id": "door1", "x": 435, "y": 660, "w": 130, "h": 20, "frame": "#8f6b45", "label": "ENTRANCE" },
    "wallDecor": [
      { "id": "board1", "asset": "whiteboard", "x": 852, "y": 48, "w": 132, "h": 50, "ink": "#4f7cff" },
      { "id": "clock1", "asset": "clock", "x": 333, "y": 64, "r": 15 },
      { "id": "poster1", "asset": "poster", "x": 588, "y": 50, "w": 36, "h": 46, "color": "#ff5d7a" }
    ],
    "floorDecals": [
      { "id": "rugLounge", "asset": "rug", "x": 205, "y": 285, "w": 290, "h": 215, "color": "#4f7cff", "trim": "#9b6cf5" },
      { "id": "zoneDesk", "asset": "zone", "x": 770, "y": 390, "w": 400, "h": 330, "color": "#ffb648", "label": "DESK POD · A/B" }
    ],
    "lightPatches": [ { "x": 110, "w": 180 } ],
    "assets": [
      { "id": "tbl_lounge", "asset": "roundTable", "x": 205, "y": 272, "r": 74, "h": 42, "t": 9, "color": "#f7f0e4", "edge": "#c9b694" },
      { "id": "deskA1", "asset": "desk", "x": 660, "y": 280, "w": 170, "d": 76, "h": 44, "t": 10, "color": "#f4ece0", "edge": "#c9b694" },
      { "id": "plant5", "asset": "plant", "x": 386, "y": 520, "s": 0.85, "pot": "#2ec4a6" }
    ]
  }
}
```

#### Supported asset kinds

The engine supports a **fixed set** of asset kinds (from the prototype). Each
`asset` entry selects one kind with an `asset` field, plus kind-specific optional
layout fields (see the `Asset` type in `src/core/scene/types.ts` for the full
field list).

| Category | Kinds |
|----------|-------|
| Furniture | `desk`, `roundTable`, `chair`, `stool`, `sofa`, `cabinet`, `counter`, `crates`, `printer`, `waterCooler`, `coffeeMachine`, `kettle`, `cupRow`, `cup`, `papers`, `laptop`, `lamp`, `deskSign`, `plant` |
| Wall decor | `whiteboard`, `clock`, `poster` |
| Floor decal | `rug`, `zone` |

Every asset may optionally set `image` to an external sprite/background
reference. When the image is available the engine draws it; when missing or
unavailable it falls back to a deterministic procedural drawing.

### 1.2 `liveScene` — the characters

`liveScene` declares the characters and their **initial** state (position,
facing, emotion, visibility, held prop, appearance palette):

```json
{
  "liveScene": {
    "meta": { "scene": "northlight_floor3", "tick": "seconds", "defaultEmotion": "neutral" },
    "characters": [
      {
        "id": "noah",
        "name": "Noah",
        "role": "New hire · Frontend",
        "color": "#4f7cff",
        "x": 500, "y": 720, "dir": "up", "emotion": "nervous", "visible": false,
        "prop": "bag",
        "look": {
          "skin": "#f2cba6", "skin2": "#e0b189", "hair": "#3d2a20", "hairStyle": "short",
          "shirt": "#7fb6ff", "shirt2": "#5b95e8", "pants": "#39435c", "shoes": "#1e2434"
        }
      }
    ]
  }
}
```

`dir` must be one of `up | down | left | right`. `emotion` must be one of the
fixed set: `neutral | happy | excited | nervous | surprised | shy | confident |
proud | sad | annoyed | thinking`.

### 1.3 `scenario` — the timeline of events

`scenario` declares the timeline. Each event has a timestamp `t` (seconds), a
`type`, an optional `who` (target character id), and type-specific fields:

```json
{
  "scenario": {
    "id": "first_day_greeting",
    "title": "First Day — Noah Joins the Team",
    "duration": 41,
    "events": [
      { "t": 0.0, "type": "caption", "text": "Monday · 9:02 AM — Northlight Studio, floor 3" },
      { "t": 0.7, "type": "appear", "who": "noah", "at": [500, 718], "dir": "up", "emotion": "nervous" },
      { "t": 1.4, "type": "move", "who": "noah", "to": [500, 672], "dir": "up" },
      { "t": 3.0, "type": "say", "who": "noah", "kind": "thought", "dur": 3.0, "emotion": "nervous", "text": "Okay… deep breath." },
      { "t": 7.2, "type": "emotion", "who": "maya", "set": "surprised" },
      { "t": 34.8, "type": "move", "who": "noah", "to": [862, 216], "dir": "down", "emotion": "excited" }
    ]
  }
}
```

#### Supported event types

| Type | Required | Effect |
|------|----------|--------|
| `caption` | `text` | Shows a scene caption. No `who` |
| `appear`  | `at` `[x, y]` | Makes a character visible and places them |
| `move`    | `to` `[x, y]` | Snap-moves a character to a destination |
| `emotion` | `set` | Sets a character's emotion |
| `say`     | `text` (+ `dur`, `kind`) | Shows a speech/thought bubble above a character |
| `exit`    | — | Makes a character invisible |

All characters move by **discrete snap** — there is no interpolation; each
`move` event instantly relocates the character at that timestamp. Playback is
**visual-only** (no audio). Timestamps are clamped to `[0, duration]`; the
`duration` field (or the last event timestamp) defines the end of playback.

### 1.4 Parsing the bundle

Use the pure core `parseSceneBundle` function to turn raw JSON into a typed
`Scene`, handling errors gracefully:

```ts
import { parseSceneBundle, type Scene } from "./core/scene";

const raw = { staticScene: {...}, liveScene: {...}, scenario: {...} };
const result = parseSceneBundle(raw);
if (result.ok) {
  const scene: Scene = result.scene;
  // ... embed the player with `scene` (see below)
} else {
  console.error(result.error); // descriptive message
}
```

`parseSceneBundle` never throws — it returns `{ ok: true, scene }` on success or
`{ ok: false, error }` on failure. (The lower-level `parseStaticScene`,
`parseLiveScene`, `parseScenario` and `parseAsset` functions throw
`SceneParseError` with a field path for direct use in tests.)

---

## 2. Embedding the player

There are three ways to embed the player, from highest to lowest level. All of
them are thin and delegate to core.

### 2.1 The quick path — `App` with a raw bundle

Pass a raw scene bundle to `App` (defaults to the bundled office scene):

```tsx
import App from "./App";

<App rawScene={mySceneJson} />
```

`App` parses the bundle with `parseSceneBundle`, wraps the tree in
`ThemeProvider` + `ReplayProvider`, and renders `PlaybackPage` (or a
`SceneLoadError` panel when parsing fails). This is the simplest embedding if
you just want the full player.

### 2.2 The composed path — `ReplayProvider` + `PlaybackPage`

For more control, parse the scene yourself and compose the providers with the
`PlaybackPage`:

```tsx
import { ReplayProvider } from "./ui/context/ReplayProvider";
import { PlaybackPage } from "./ui/pages/PlaybackPage";
import { loadOfficeScene } from "./data/officeScene";
import { parseSceneBundle, type Scene } from "./core/scene";

const scene: Scene = loadOfficeScene(); // validates the bundled office scene
// ...or from raw JSON:
// const result = parseSceneBundle(raw); if (!result.ok) throw new Error(result.error);

export function MyPlayer({ scene }: { scene: Scene }) {
  return (
    <ReplayProvider scene={scene}>
      <PlaybackPage scene={scene} />
    </ReplayProvider>
  );
}
```

The `ReplayProvider` injects replay state (timestamp, duration, render state,
and the play/pause/seek/step actions) via `ReplayContext`, which the organisms
read through `useReplay()`. `PlaybackPage` composes the three organisms —
`SceneStage`, `PlaybackBar`, `SceneInfoPanel`.

### 2.3 The manual path — `SceneView` with a computed `renderState`

If you want to drive the replay yourself, compute a `RenderState` from core and
render it with the dumb `SceneView` component:

```tsx
import { useMemo } from "react";
import { computeSceneState, type Scene } from "./core/scene";
import { SceneView } from "./ui/components/SceneView";

export function MySceneView({ scene, timestamp }: { scene: Scene; timestamp: number }) {
  const renderState = useMemo(() => computeSceneState(scene, timestamp), [scene, timestamp]);
  return (
    <SceneView
      renderState={renderState}
      world={scene.staticScene.meta.world}
    />
  );
}
```

`SceneView` only renders what it is given — no business logic. To get the full
set of controls, use the `useReplayDriver` view-model hook (which the
`ReplayProvider` wraps) and pass its `renderState`/actions down explicitly.

### 2.4 Embedding checklist

- Parse with `parseSceneBundle` (result, never throws) or `loadOfficeScene()`.
- Wrap the tree in `ReplayProvider` to get `useReplay()` in organisms.
- Optionally wrap in `ThemeProvider` to inject a custom design-token surface.
- For a minimal render, use `SceneView` with a `renderState` from core
  `computeSceneState`.

---

## 3. Architecture notes

- **`src/core`** — pure, independently testable functions (models, parse,
  initial/state computation, replay, asset rendering). No React, no DOM, 100%
  coverage required.
- **`src/ui/viewModels`** — thin hooks that call core and expose state to
  components (e.g. `useReplayDriver`, `useSceneState`).
- **`src/ui/components`** — dumb components that render props / callbacks.
  Follows Atomic design (`atoms`, `molecules`, `organisms`) plus pages.
- **`src/ui/context`** — `ReplayProvider`/`useReplay` and
  `ThemeProvider`/`useTheme` (Context injection) instead of prop drilling.
- **`src/ui/showcase`** — every component has a showcase entry, rendered on
  `ShowcasePage`. Theme variants and edge states are showcased too.
- **`src/adapters`** — impure I/O (e.g. the `imageAvailability` predicate).

Every UI component is showcased via the showcase library, and design tokens
drive styling through the theme pattern — see `src/ui/context/theme.ts` for the
`ThemeTokens` surface and `src/ui/showcase/variants/darkTheme.ts` for an
alternate theme.

For the full project intent, milestones and architecture decisions, see
[`manifest.md`](../manifest.md) and [`project-state.md`](../project-state.md).
