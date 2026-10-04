# Scene — Project State

> Current state and progress. Updated by the auto-pi loop as work is done.

## Status

**M1 complete** — all M1 sub-issues (typed models + parse, initial-state
computation, asset renderer, SceneView + App wiring + showcase) implemented and
merged (#4/#5/#6/#11/#12/#13). The office scene renders at t=0 through a thin
React tree.

**M2 complete** — M2 (core pure timeline logic with 100% coverage) implemented
and merged: timeline evaluation (#15/#17), helpers (#16/#18), and the
coverage-gate guard test (#14/#19). All core logic is pure, and 100% coverage
is enforced on `src/core/**/*.ts`. M2-T4 (thin React hooks) is the only
remaining M2 item and is planned below.

**M3 planned** — replay engine (driver + playback controls + timeline display).

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
- [ ] M2-T4 Thin React hooks calling core only (planned this turn)

### M3 — Replay engine (planned this turn)
- [ ] M3-T1 Replay driver (advance time, recompute state each frame/step)
- [ ] M3-T2 Playback controls (play/pause/seek/step)
- [ ] M3-T3 Time/duration display + seekable progress control (planned next PM turn)
- [ ] M3-T4 End-to-end playback verification vs prototype (planned next PM turn)

## Next steps

- [ ] Engineer implements M2-T4 and M3-T1/T2.
- [ ] Plan M3-T3/T4 and milestone M4 on the next PM turn.
- [ ] CI passes on main.
