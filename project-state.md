# Scene — Project State

> Current state and progress. Updated by the auto-pi loop as work is done.

## Status

**M1 in progress** — core M1 sub-issues (T1 typed models + parse, T2 initial-state
computation, T3 asset renderer) are implemented and merged (#4/#5/#6). M1-T4
(SceneView + App wiring + showcase) is planned and in flight.

## What's here

- Vite + React + TypeScript + Tailwind project scaffold.
- Core/UI split with `src/core` (business logic) and `src/ui` (thin views).
- Vitest with 100% coverage enforced on `src/core/**/*.ts`.
- CI and GitHub Pages deploy workflows (from seed).
- Manifest with sub-issue backlogs for milestones M1–M6.

## Planned work

### M1 — Vertical slice (in progress)
- [x] M1-T1 Core typed models + parse/validate scene JSON (#1)
- [x] M1-T2 Core initial-state computation at t=0 (#2)
- [x] M1-T3 Procedural asset rendering + external image support with fallback (#3)
- [ ] M1-T4 SceneView component + App wiring + minimal showcase entry
  - [ ] M1-T4a Office scene data + typed parse (#7)
  - [ ] M1-T4b SceneView component + view model rendering t=0 (#8)
  - [ ] M1-T4c App wiring + minimal showcase entry (#9)

## Next steps

- [ ] Engineer implements M1-T4a/b/c (#7/#8/#9).
- [ ] Plan milestone M2 (timeline evaluation) on the next PM turn.
- [ ] CI passes on main; Pages deployment is blocked until Pages is enabled (#10).

## Changelog (CHANGELOG.md)

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
