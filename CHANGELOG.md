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
