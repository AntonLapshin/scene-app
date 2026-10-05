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

**M3 complete** — replay driver (#21/#24) with pure core time/step helpers
(`advanceTimestamp`, `nextEventTimestamp`, `previousEventTimestamp`,
`stepForward`, `stepBackward`) in `src/core/scene/replay.ts` plus the thin
`useReplayDriver` view model; playback controls (#22/#25) with
play/pause/seek/step and time/duration display + seekable progress slider; and
end-to-end playback verification vs the prototype (#26/#29) via
`tests/core/scene/officeReplay.test.ts`.

**M4 complete** — atoms (#28/#30: `Button`, `Slider`, `Badge`, `Sprite`) and
molecules (#27/#31: `PlaybackControlsMolecule`, `CharacterCard`,
`TimelineScrubber`) extracted into `src/ui/components/{atoms,molecules}` with
barrels; organisms + pages (#32/#35: `SceneStage`, `PlaybackBar`,
`SceneInfoPanel`, `PlaybackPage`); context injection (#33/#36: `ReplayProvider`
+ `ThemeProvider` in `src/ui/context` with `useReplay`/`useTheme` hooks) instead
of prop drilling; and showcase entries for every component (#34/#37 via
`ShowcasePage` + `ShowcaseEntry`). M5 (theming/polish) and M6 (final
integration/docs) remain.

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

### M3 — Replay engine (complete)
- [x] M3-T1 Replay driver (#21/#24)
- [x] M3-T2 Playback controls (#22/#25)
- [x] M3-T3 Time/duration display + seekable progress control (#22/#25)
- [x] M3-T4 End-to-end playback verification vs prototype (#26/#29)

### M4 — Atomic UI components + showcase (complete)
- [x] M4-T1 Extract reusable atoms (buttons, sliders, badges, sprites) (#28/#30)
- [x] M4-T2 Extract reusable molecules (playback controls, character card, timeline scrubber) (#27/#31)
- [x] M4-T3 Compose organisms (SceneStage, PlaybackBar, SceneInfoPanel) and pages (#32/#35)
- [x] M4-T4 Context injection (replay state, theme) instead of prop drilling (#33/#36)
- [x] M4-T5 Showcase entries for every component (#34/#37)

### M5 — Theming and polish (in progress)
- [ ] M5-T1 Theme pattern (design tokens) applied across all components (#38)
- [ ] M5-T2 Edge cases (missing assets, malformed JSON, empty timeline, out-of-range timestamps) (#39)
- [ ] M5-T3 Layout/responsive sizing polish (#40)
- [ ] M5-T4 Showcase entries for theme variants and edge states (planned next turn)

### M6 — Final integration, deployment, and docs
- [ ] M6-T1 Ensure test (100% core coverage), lint, and build all pass in CI
- [x] M6-T2 Deploy live demo of the office scene to GitHub Pages
- [ ] M6-T3 README + usage docs (authoring scenes, embedding the player)
- [ ] M6-T4 Final end-to-end verification of replay engine and showcase

## Next steps

- [ ] Engineer implements M5-T1 (#38), M5-T2 (#39), M5-T3 (#40).
- [ ] Plan M5-T4 and M6 sub-issues on later PM turns.
- [ ] CI passes on main.
