# Changelog

All notable changes to **Scene** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial React + Tailwind + TypeScript scaffold (Vite).
- Core/UI separation with `src/core` (business logic) and `src/ui` (thin views).
- Vitest setup enforcing 100% coverage on `src/core/**/*.ts`.
- Initial demo panel rendering project name / status / demo info.
- Core typed models for the three scene JSON shapes (STATIC_SCENE, LIVE_SCENE, SCENARIO) in `src/core/scene/types.ts`.
- Pure `parseStaticScene` / `parseLiveScene` / `parseScenario` functions in `src/core/scene/parse.ts` that validate raw JSON and throw descriptive `SceneParseError`s on malformed/missing data.
- Fixed asset set (furniture, wall decor, floor decals) with an optional external image reference per asset.
- Fixed the scaffold's malformed multi-line `package.json` description and `App.tsx` string so `npm install` and `npm run build` succeed.
- Core initial-state computation (`computeInitialState`) in `src/core/scene/state.ts` returning the ordered t=0 render state: background layers, paint-ordered foreground objects (assets, front walls, visible characters), and visible characters with their live state.
- Small pure helper functions: `assetSortKey`, `lookupAssetById`, `lookupCharacterById`, `resolveCharacter`, and coordinate math (`distance`, `manhattanDistance`, `midpoint`).
- Core asset renderer (`renderAsset` / `drawProcedural`) in `src/core/scene/draw.ts` producing deterministic draw operations (rect/ellipse/line/text/image) for every fixed asset kind, with external-image support and procedural fallback when an image is missing or unavailable.
- Added the missing optional `w` (width) field to the core `Asset` model.
- Extracted the office scene data (`STATIC_SCENE`, `LIVE_SCENE`, `SCENARIO`) from `ws/scene/prototype.html` into `src/data/officeScene.ts` as typed data with no browser APIs, plus a pure `loadOfficeScene()` loader that parses it via the core `parse*` functions into a typed `Scene` (world 1040x730, 41 assets, 5 characters, 41s / 43-event "First Day" scenario) and throws descriptive `SceneParseError`s on malformed data.
- Thin `useOfficeScene` view model in `src/ui/viewModels` that loads/parses the office scene and computes its t=0 `RenderState` via core `computeInitialState`.
- Dumb `SceneView` component in `src/ui/components` that renders a core `RenderState` as SVG: background layers (floor, corridor, back walls, windows, door, wall decor, floor decals, light patches) then foreground objects in paint order, using core draw operations as SVG primitives (rect/ellipse/line/text/image).
- Characters render with their look palette (skin/hair/shirt/pants/shoes) and current emotion glyph; external image assets render as `<image>` when available with procedural fallback otherwise (via core `renderAsset`).
- Image-availability adapter in `src/adapters/imageAvailability.ts` owning the impure browser `Image` I/O, keeping core pure.
- Minimal `ShowcasePanel` component in `src/ui/components` demonstrating `SceneView` with a short description and its props listed.
- `App` wired to load the office scene via `useOfficeScene` and render it through `ShowcasePanel`/`SceneView`, keeping the existing demo panel.
- Core timeline evaluation (`computeSceneState`) in `src/core/scene/state.ts` that replays the scenario events up to any timestamp and returns the ordered render state: background layers, paint-ordered foreground objects, and visible characters with their live state (position, emotion, visibility, and active say bubble).
- Small pure timeline helpers: `composeRenderState` (shared ordering with `computeInitialState`), `computeCharacterStates`, `applyEvent` (handles appear/move/emotion/say/exit/caption), `eventsUpTo`, and `activeCaptionAt`.
- New core types `SayBubble` and `CharacterState` (extends `Character` with an optional active say bubble), and an optional `caption` field on `RenderState`.
- Additional pure core helpers in `src/core/scene/state.ts`: asset resolution with missing-asset handling (`resolveAsset`), coordinate clamping (`clamp`), and duration helpers (`clampTimestamp`, `scenarioDuration`), all fully tested.
- Reached and locked 100% line/branch/statement/function coverage on `src/core/**/*.ts` (M2-T3), and added a coverage-gate guard test (`tests/core/coverageConfig.test.ts`) that fails if the Vitest include glob or the 100% thresholds are ever weakened.
- Thin `useSceneState` view-model hook in `src/ui/viewModels` (M2-T4) that exposes core `computeSceneState` to components for a given scene + timestamp, with no business logic re-implemented in the hook.
- Updated `useOfficeScene` to build on `useSceneState` (calling core `computeSceneState` at t=0) instead of calling `computeInitialState` directly, keeping the hook thin and delegating all logic to core.
- Core replay/time-advance helpers in `src/core/scene/replay.ts` (M3-T1): `advanceTimestamp` (frame-delta accumulation clamped to `[0, duration]`), `nextEventTimestamp` / `previousEventTimestamp` (event-boundary lookup), and `stepForward` / `stepBackward` (jump to the next/previous event boundary or fall back to a fixed step, clamped to the scenario window).
- Thin `useReplayDriver` view-model hook in `src/ui/viewModels` (M3-T1) that owns playback timing via `requestAnimationFrame`, accumulates frame deltas through core `advanceTimestamp`, recomputes state via core `computeSceneState` each frame, stops cleanly at the scenario duration (no runaway timers), and exposes `play` / `pause` / `toggle` / `seek` / `stepForward` / `stepBackward` — all delegating to pure core functions.
- Thin, dumb `PlaybackControls` component in `src/ui/components` (M3-T2) that renders play/pause, seek slider, and step forward/backward controls with a current-time / duration readout, forwarding interactions to callback props with no business logic in the component.
- Wired the office scene showcase in `App` to the `useReplayDriver` view model so `SceneView` renders the live playback state and the `PlaybackControls` component drives play/pause/seek/step.
- Reusable Atomic-design atoms in `src/ui/components/atoms` (M4-T1): thin, dumb `Button` (primary/secondary variants), `Slider` (range input forwarding numeric changes), `Badge` (label/status with default/muted tones), and `Sprite` (renders a core draw op / asset as SVG with image+fallback via core `renderAsset`), each with component tests in `tests/ui/atoms/atoms.test.tsx`.
- Refactored `PlaybackControls` to compose the `Button`, `Slider`, and `Badge` atoms, and `SceneView` to render assets through the `Sprite` atom — no business logic moved into the UI.
- End-to-end playback verification vs the prototype (M3-T4): a new `tests/core/scene/officeReplay.test.ts` replays the office "First Day" scenario through core `computeSceneState` at 16 key timestamps and asserts the render state matches the prototype's expected per-timestamp output (character positions, visibility, emotions, active say bubbles, and active captions, all traced by hand from `src/data/officeScene.ts`), plus a paint-order sanity check at every frame. A new `SceneView` full-replay-path test in `tests/ui/SceneView.test.tsx` renders the scene at every event boundary from t=0 to t=duration without errors and confirms all five characters render at the final timestamp.
- Reusable Atomic-design molecules in `src/ui/components/molecules` (M4-T2): `PlaybackControlsMolecule` (play/pause + seek + step + time/duration display composed from `Button`/`Slider`/`Badge`), `CharacterCard` (a character's look palette, emotion glyph, and active say bubble rendered via the `Sprite` atom), and `TimelineScrubber` (a seekable progress slider over the scenario duration with a time readout) — each thin and dumb, deriving display data from props, with component tests in `tests/ui/molecules/molecules.test.tsx`.
- Pure core `characterDrawOps` in `src/core/scene/draw.ts` (M4-T2) that deterministically renders a `CharacterState` (look palette, emotion glyph, active say bubble) as draw ops in character-local coordinates, fully covered by new tests in `tests/core/scene/draw.test.ts`.
- Refactored `SceneView`'s character rendering to reuse core `characterDrawOps` via the `Sprite` atom (removing the duplicated inline character drawing), and updated `App` to use `PlaybackControlsMolecule`, `TimelineScrubber`, and per-character `CharacterCard`s. `PlaybackControls` remains as a backward-compatible alias for `PlaybackControlsMolecule`.
