# Scene — Project State

> Current state and progress. Updated by the auto-pi loop as work is done.

## Status

**Scaffolded** — the React + Tailwind + TypeScript skeleton is in place. Milestone M1
planning is underway.

## What's here

- Vite + React + TypeScript + Tailwind project scaffold.
- Core/UI split with `src/core` (business logic) and `src/ui` (thin views).
- Vitest with 100% coverage enforced on `src/core/**/*.ts`.
- CI and GitHub Pages deploy workflows (from seed).
- Manifest with sub-issue backlogs for milestones M1–M6.

## Planned work

### M1 — Vertical slice (in progress)
- [ ] M1-T1 Core typed models + parse/validate scene JSON (#1)
- [ ] M1-T2 Core initial-state computation at t=0 (#2)
- [ ] M1-T3 Procedural asset rendering + external image support with fallback (#3)
- [ ] M1-T4 SceneView component + App wiring + minimal showcase entry (planned next)

## Next steps

- [ ] Implement M1-T1 through M1-T3 (in flight).
- [ ] Plan M1-T4 and milestone M2 on the next PM turn.
- [ ] Set up CI and GitHub Pages deployment.

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
