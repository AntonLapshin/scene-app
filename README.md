# Scene

**Scene** is a universal 2D **scene replay engine**. It plays scenes defined
declaratively via JSON bundles (a `staticScene` of geometry and fixed assets, a
`liveScene` of characters, and a `scenario` timeline of events) and renders them
per timestamp. It was extracted from the `ws/scene/prototype.html` web app
prototype and ships the single office scene from that prototype as a live demo.

The engine computes state per timestamp (discrete snap movement, visual-only)
and renders it as SVG. All business logic lives in pure, independently testable
functions in `src/core` with 100% coverage; the UI is a thin layer that renders
what core computes.

> Generated and maintained by [auto-pi](https://github.com/AntonLapshin/auto-pi) — an
> autonomous engineering team harness for Pi.

## Demo

Live demo: **[https://AntonLapshin.github.io/scene-app/](https://AntonLapshin.github.io/scene-app/)**

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vitest](https://vitest.dev/) for unit tests, with 100% coverage enforced on `src/core/**/*.ts`

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server
```

## Scripts

| Script              | Purpose                                    |
|---------------------|--------------------------------------------|
| `npm run dev`       | Start the Vite dev server                  |
| `npm run build`     | Type-check (`tsc`) then build for production |
| `npm run preview`   | Preview the production build locally       |
| `npm run lint`      | Run ESLint                                 |
| `npm test`          | Run unit tests (Vitest)                    |
| `npm run test:coverage` | Run tests and enforce 100% core coverage |

## Architecture

The project enforces a strict **core / UI split** (plan.md §19.1):

- `src/core/**` — pure business logic, no React, no DOM. **100% test coverage is
  required here.** Models, parsing, state computation, replay and asset
  rendering all live here as small independent pure functions.
- `src/ui/**` — thin, dumb view layer (components + view models). Contains no
  business logic; it only renders what `src/core` provides. Follows Atomic
  design (`atoms`, `molecules`, `organisms`, pages), Context injection
  (`ReplayProvider`/`useReplay`, `ThemeProvider`/`useTheme`), and a theme
  pattern (design tokens in `src/ui/context/theme.ts`). Every component is
  showcased via the showcase library (`ShowcasePage`).
- `src/adapters/**` — impure I/O (e.g. the external-image availability check).

## Scene JSON format

A scene bundle is a plain JSON object with three sections. See
[`docs/usage.md`](docs/usage.md) for the full authoring guide and a complete
example.

```json
{
  "staticScene": { "meta": { "world": { "w": 1040, "h": 730 }, "...": "..." }, "assets": [ "...asset entries..." ] },
  "liveScene":  { "characters": [ "...character entries..." ] },
  "scenario":   { "duration": 41, "events": [ "...timeline events..." ] }
}
```

- **`staticScene`** — the room geometry and fixed objects: world size, floor,
  corridor, walls, windows, door, wall decor, floor decals, light patches, and
  the **assets**. Supported asset kinds are a fixed set from the prototype:
  furniture (`desk`, `roundTable`, `chair`, `stool`, `sofa`, `cabinet`,
  `counter`, `crates`, `printer`, `waterCooler`, `coffeeMachine`, `kettle`,
  `cupRow`, `cup`, `papers`, `laptop`, `lamp`, `deskSign`, `plant`), wall decor
  (`whiteboard`, `clock`, `poster`) and floor decals (`rug`, `zone`). Each asset
  may reference an optional external `image`; when missing, the engine falls
  back to procedural drawing.
- **`liveScene`** — the characters and their initial state (position, facing
  direction `up|down|left|right`, emotion, visibility, held prop, appearance
  palette).
- **`scenario`** — the timeline of events. Supported event types are `caption`,
  `appear`, `move`, `emotion`, `say` and `exit`. Characters move by **discrete
  snap** (no interpolation), and playback is **visual-only** (no audio).

The bundled office scene data lives in `src/data/officeScene.ts` and is the
canonical, verified example of the format.

## Embedding the player

There are three ways to embed the player in your own app. Full examples are in
[`docs/usage.md`](docs/usage.md).

1. **Quick path** — pass a raw bundle to `App`:
   ```tsx
   <App rawScene={mySceneJson} />
   ```
   `App` parses it with core `parseSceneBundle`, wraps the tree in
   `ThemeProvider` + `ReplayProvider`, and renders the `PlaybackPage` (or a
   `SceneLoadError` panel on invalid input).

2. **Composed path** — parse the scene yourself and compose `ReplayProvider` +
   `PlaybackPage`:
   ```tsx
   import { loadOfficeScene } from "./data/officeScene"; // validates the office bundle
   import { ReplayProvider } from "./ui/context/ReplayProvider";
   import { PlaybackPage } from "./ui/pages/PlaybackPage";

   <ReplayProvider scene={scene}>
     <PlaybackPage scene={scene} />
   </ReplayProvider>
   ```
   `loadOfficeScene()` parses the bundled office scene; `parseSceneBundle(raw)`
   parses any bundle and returns a result instead of throwing.

3. **Manual path** — compute a `RenderState` from core and render the dumb
   `SceneView` component:
   ```tsx
   import { computeSceneState } from "./core/scene";
   import { SceneView } from "./ui/components/SceneView";

   const renderState = computeSceneState(scene, timestamp);
   <SceneView renderState={renderState} world={scene.staticScene.meta.world} />
   ```
   For full controls, use the `useReplayDriver` view model (wrapped by
   `ReplayProvider`).

## Project documents

- [`manifest.md`](manifest.md) — project charter / intent (purpose, goals, milestones)
- [`project-state.md`](project-state.md) — current state and progress
- [`docs/usage.md`](docs/usage.md) — authoring scenes and embedding the player
- [`CHANGELOG.md`](CHANGELOG.md) — versioned change log
