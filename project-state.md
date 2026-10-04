# Scene — Project State

> Current state and progress. Updated by the auto-pi loop as work is done.

## Status

**M1 complete** — all M1 sub-issues (typed models + parse, initial-state
computation, asset renderer, SceneView + App wiring + showcase) implemented and
merged (#4/#5/#6/#11/#12/#13). The office scene renders at t=0 through a thin
React tree.

**M2 complete** — M2 (core pure timeline logic with 100% coverage) implemented
and merged: timeline evaluation (#15/#17), helpers (#16/#18), the coverage-gate
guard test (#14/#19), and the thin `useSceneState` hook (#20/#23). All core
logic is pure, and 100% coverage is enforced on `src/core/**/*.ts`.

**M3 complete (core replay engine)** — replay driver (#21/#24) with pure core
time/step helpers (`advanceTimestamp`, `nextEventTimestamp`,
`previousEventTimestamp`, `stepForward`, `stepBackward`) in
`src/core/scene/replay.ts` plus the thin `useReplayDriver` view model; playback
controls (#22/#25) with play/pause/seek/step and time/duration display +
seekable progress slider. M3-T4 (end-to-end verification vs prototype) remains
and is planned below.

**M4 planned** — refactor UI into Atomic-design components + showcase.

## What's here

- Vite + React + TypeScript + Tailwind project scaffold.
- Core/UI split with `src/core` (business logic) and `src/ui` (thin views).
- Vitest with 100% coverage enforced on `src/core/**/*.ts`.
- CI and GitHub Pages deploy workflows (from seed).
- Manifest with sub-issue backlogs for milestones M1–M6.
- Typed scene models, parse/validate functions, initial-state computation,
  asset renderer with image fallback, office scene data, and a SceneView +
  App wiring + minimal showcase entry.
- Core timeline evaluation (`computeSceneState`, `computeCharacterStates`,
  `applyEvent`, `eventsUpTo`, `activeCaptionAt`) in `src/core/scene/state.ts`
  that replays scenario events up to any timestamp and returns the ordered
  render state (background, paint-ordered objects, visible characters with
  position/emotion/visibility/active say bubble).
- Small pure timeline helpers: `composeRenderState` (shared ordering),
  `computeCharacterStates`, `applyEvent` (appear/move/emotion/say/exit/caption),
  `eventsUpTo`, `activeCaptionAt`.
- Core helpers: `resolveAsset`, `clamp`, `clampTimestamp`, `scenarioDuration`,
  plus existing asset lookup / coordinate math.
- Coverage-gate guard test enforcing 100% coverage on `src/core/**/*.ts`.

## Planned work

### M1 — Vertical slice (complete)
- [x] M1-T1 Core typed models + parse/validate scene JSON (#1)
- [x] M1-T2 Core initial-state computation at t=0 (#2)
- [x] M1-T3 Procedural asset rendering + external image support with fallback (#3)
- [x] M1-T4 SceneView component + App wiring + minimal showcase entry (#7/#8/#9)

### M2 — Core pure logic (complete)
- [x] M2-T1 Core timeline evaluation (#15/#17)
- [x] M2-T2 Core helpers (asset lookup, coordinate math, id resolution, validation, duration) (#16/#18)
- [x] M2-T3 Achieve 100% coverage on src/core/**/*.ts (#14/#19)
- [x] M2-T4 Thin React hooks calling core only (#20/#23)

### M3 — Replay engine (core done, verification remaining)
- [x] M3-T1 Replay driver (#21/#24)
- [x] M3-T2 Playback controls (#22/#25)
- [x] M3-T3 Time/duration display + seekable progress control (#22/#25)
- [ ] M3-T4 End-to-end playback verification vs prototype (planned this turn)

### M4 — Atomic UI components + showcase (planned this turn)
- [ ] M4-T1 Extract reusable atoms (buttons, sliders, badges, sprites)
- [ ] M4-T2 Extract reusable molecules (playback controls, character card, timeline scrubber)
- [ ] M4-T3 Compose organisms (SceneStage, PlaybackBar, SceneInfoPanel) and pages
- [ ] M4-T4 Context injection (replay state, theme) instead of prop drilling
- [ ] M4-T5 Showcase entries for every component

## Next steps

- [ ] Engineer implements M3-T4 and M4-T1/T2.
- [ ] Plan M4-T3/T4/T5 and milestone M5 on the next PM turn.
- [ ] CI passes on main.
