# Scene — Manifest

> Project charter / intent. This file is a living document maintained by the
> auto-pi PM persona as the project evolves. The milestones below are the
> backbone of the project: the PM plans issues against them.

## Purpose

Build a well-made, universal 2D scene replay engine that plays scenes defined declaratively via JSON objects and assets, extracted from the ws/scene/prototype.html web app prototype. The engine computes state per timestamp (discrete snap movement, visual-only) and renders it. All business logic lives in pure, independently testable functions in src/core with 100% coverage; higher-level state logic and simple React hooks call into it. UI is thin, follows Atomic design, Context injection, and theme patterns, and every component is showcased via the 'showcase' library. The engine supports a fixed set of asset/event types from the prototype with external image assets plus procedural fallback, and ships the single office scene from the prototype.

## Goals

- Deliver a universal 2D scene replay engine that plays declaratively-defined JSON scenes (assets, static objects, characters, timeline) with a live demo of the office scene
- Keep all business logic in src/core as small independent pure functions with 100% test coverage; higher-level state logic and React hooks call into it, keeping UI thin and UI-only
- Follow Atomic design, Context injection, and theme patterns; showcase every component via the showcase library
- Support external image assets (sprites/backgrounds) with procedural fallback, discrete snap movement, visual-only playback, and the fixed asset/event set from the prototype

## Non-goals

- Authoring/editing UI — scenes are authored externally as JSON and only replayed in-app
- Audio support (dialogue, ambient sound, SFX) — playback is visual-only
- Procedural-only rendering — external image assets must be supported (procedural is only a fallback)
- Extensible plugin registry — a fixed set of asset/event types from the prototype
- Animated/interpolated movement — characters snap discretely per timestamp
- More than the single office scene shipped for validation

## Success criteria

- [ ] npm install && npm test && npm run build pass in CI
- [ ] A live demo is deployed to GitHub Pages
- [ ] src/core/** holds 100% test coverage
- [ ] The office scene replays end-to-end with play/pause/seek/step controls and matches the prototype's per-timestamp output
- [ ] Every UI component has a showcase entry in the showcase library

## Milestones

### M1 — Vertical slice: scaffold + static scene render

**Goal:** Stand up the project and render the office scene's static content (backgrounds, objects, characters at t=0) from parsed JSON, with procedural fallback for missing assets.

**Scope:**
  - Parse the office scene JSON into typed Scene/Asset/Object/Character models in src/core with validation
  - Render the scene at timestamp 0: backgrounds, static objects, and characters positioned per their initial state
  - Draw each asset with external image support and a procedural fallback when the image is missing
  - Wire the scene through a thin React component tree (App -> SceneView) with a minimal showcase entry

### M2 — Core pure logic: timeline evaluation with 100% coverage

**Goal:** Extract all scene mechanics into small independent pure functions in src/core — timeline evaluation, state computation per timestamp, and helpers — fully tested.

**Scope:**
  - Implement pure functions that compute the full scene state for any given timestamp from the timeline (move events, presence, visibility, order)
  - Extract helpers (asset lookup, coordinate math, id resolution, validation) as small independent pure functions
  - Achieve and enforce 100% test coverage on src/core/**/*.ts
  - Keep React hooks thin, calling core logic only

### M3 — Replay engine: playback controls and state driver

**Goal:** Turn the core into a working replay engine with playback controls (play/pause/seek/step) and a timeline-driven state driver.

**Scope:**
  - Implement a replay driver that advances time and recomputes state from core functions on each frame/step
  - Add playback controls: play, pause, seek to timestamp, and step forward/backward
  - Display the current time and total duration with a seekable progress control
  - Drive the scene render from the replay state and verify end-to-end playback matches the prototype

### M4 — Atomic UI components + showcase

**Goal:** Refactor the UI into Atomic-design components (atoms/molecules/organisms), each showcased in the showcase library, using Context injection.

**Scope:**
  - Extract reusable atoms (buttons, sliders, badges, sprites) and molecules (playback controls, character card, timeline scrubber)
  - Compose organisms (SceneStage, PlaybackBar, SceneInfoPanel) and pages from these components
  - Inject dependencies (replay state, theme) via Context injection pattern rather than prop drilling
  - Add showcase entries for every component, documenting props and states

### M5 — Theming and polish

**Goal:** Apply the theme pattern and polish the visual presentation, edge cases, and error handling.

**Scope:**
  - Implement the theme pattern (design tokens) and apply it across all components
  - Handle edge cases: missing assets, malformed JSON, empty timeline, out-of-range timestamps
  - Polish layout, responsive sizing, and visual consistency of the scene stage and controls
  - Add showcase entries for theme variants and edge states

### M6 — Final integration, deployment, and docs

**Goal:** Ship the completed engine: integrate all parts, ensure CI passes, deploy a live demo to GitHub Pages, and document usage.

**Scope:**
  - Ensure npm test (100% core coverage), lint, and build all pass in CI
  - Deploy a live demo of the office scene to GitHub Pages
  - Write README and usage docs for authoring scenes and embedding the player
  - Final end-to-end verification of the replay engine and showcase
