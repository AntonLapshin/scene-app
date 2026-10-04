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
