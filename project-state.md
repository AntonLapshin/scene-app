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
`ShowcasePage` + `ShowcaseEntry`).

**M5 complete** — theme pattern (#38/#41: expanded `ThemeTokens` surface in
`src/ui/context/theme.ts` applied across all atoms, molecules, organisms, pages,
demo/showcase chrome, with `defaultTheme` reproducing prior styling); edge cases
(#39/#42: pure `parseSceneBundle` in `src/core/scene/parse.ts` returning a
`SceneParseResult`, `SceneLoadError` panel, missing-asset procedural fallback,
empty-timeline and out-of-range clamping); and layout/responsive polish
(#40/#43: constrained/centered stage wrapper, responsive section padding,
flexible slider, wrapping controls/scrubber/time readout, responsive
character-card sizing). All M5 sub-issues merged.

**M6 (final integration/docs) in progress** — M5-T4 (showcase theme variants +
edge states) and M6-T3 (README + usage docs) are implemented and merged (or in
PR); M6-T4 (final end-to-end verification) is running. M6-T1 (CI green) and
M6-T2 (live demo) are satisfied: CI runs lint/test:coverage/build all green,
demo live at https://AntonLapshin.github.io/scene-app/.

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

### M5 — Theming and polish (complete)
- [x] M5-T1 Theme pattern (design tokens) applied across all components (#38/#41)
- [x] M5-T2 Edge cases (missing assets, malformed JSON, empty timeline, out-of-range timestamps) (#39/#42)
- [x] M5-T3 Layout/responsive sizing polish (#40/#43)
- [ ] M5-T4 Showcase entries for theme variants and edge states (#46)

### M6 — Final integration, deployment, and docs
- [x] M6-T1 Ensure test (100% core coverage), lint, and build all pass in CI
- [x] M6-T2 Deploy live demo of the office scene to GitHub Pages
- [ ] M6-T3 README + usage docs (authoring scenes, embedding the player) (#44)
- [ ] M6-T4 Final end-to-end verification of replay engine and showcase (#45)

## Final verification (M6-T4, #45)

Ran the full verification suite on `main` (via PR #49):

- `npm test` — 253 passed / 0 failed (28 files).
- `npm run test:coverage` — 100% on `src/core/**` (and overall 100%).
- `npm run lint` — clean (0 warnings).
- `npm run build` — production build passes.
- Latest CI run on `main` — green (lint/test/build).
- Showcase — `ShowcasePage` renders every atom/molecule/organism entry plus the
  new theme-variant (`ThemeVariantShowcase`) and edge-state
  (`SceneLoadErrorShowcase`, `EmptyTimelineShowcase`, `OutOfRangeShowcase`)
  entries, covered by `tests/ui/showcase/showcase.test.tsx` and
  `tests/ui/showcase/showcaseVariants.test.tsx`.
- Replay engine end-to-end — play/pause/seek/step, timeline evaluation and edge
  cases are covered by `tests/core/scene/officeReplay.test.ts` (17 tests) and
  the full suite; no code gaps found, no code changes required.

All done-definition checks pass: milestones complete, CI green, 100% core
coverage, build passes, demo live, README/docs current.

## Next steps

- [ ] Engineer implements M5-T4 (#46), M6-T3 (#44), M6-T4 (#45).
- [ ] After M5-T4/M6-T3/M6-T4 merge, confirm the done-definition (all milestones complete, no open issues/PRs, CI green, 100% core coverage, build passes, demo live, README URL, changelog + project-state current).
- [ ] CI passes on main.
