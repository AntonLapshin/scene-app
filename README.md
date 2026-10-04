# Scene

ws/scene/prototype.html contains a web app prototype of the "scene" project that allows to define and replay scenarios with characters on a specific scene. The scene has
image assets, static objects definition, characters, and the timeline. The scene can be replayed. Your goal is to extract this into a well built web app, use bun as a bundler and
runner. Use TypeScript, Use React. Use https://github.com/AntonLapshin/showcase to build "storybook"-like showcases for all the components. Focus on quality, reusability. Follow the
Atomic design pattern, extract components https://raw.githubusercontent.com/AntonLapshin/ape-kingdom/refs/heads/main/guidelines/GUIDELINES-WEB-ATOMIC-DESIGN.md and use Context
injection pattern: https://raw.githubusercontent.com/AntonLapshin/ape-kingdom/refs/heads/main/guidelines/GUIDELINES-WEB-CONTEXT-INJECTION.md and theme pattern:
https://raw.githubusercontent.com/AntonLapshin/ape-kingdom/refs/heads/main/guidelines/GUIDELINES-WEB-THEME.md

Extract logic into small independents pure functions with 100% test coverage - core of the mehcanics and helper functions. This is the foundation layer - reusable low level pure
functions. Then higher level logic that manipulate state. The goal is to always extract logic from the UI and let the UI components be simple and focus on UI only. React hooks should
be simple too, they should rather call core logic or helper functions if the logic is required.

The goal of this project is to built a well made scene replay engine that can play a scene that is defined declaratively via json objects and assets. This scene player should be
universal and could play any 2d scene.

> Generated and maintained by [auto-pi](https://github.com/AntonLapshin/auto-pi) — an
> autonomous engineering team harness for Pi.

## Demo

Live demo: **[https://AntonLapshin.github.io/scene-app/](https://AntonLapshin.github.io/scene-app/)**

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vitest](https://vitest.dev/) for unit tests, with 100% coverage enforced on `src/core/**/*.ts`

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server
```

## Scripts

| Script              | Purpose                                    |
|---------------------|--------------------------------------------|
| `npm run dev`       | Start the Vite dev server                  |
| `npm run build`     | Type-check (`tsc`) then build for production |
| `npm run preview`   | Preview the production build locally       |
| `npm run lint`      | Run ESLint                                 |
| `npm test`          | Run unit tests (Vitest)                    |
| `npm run test:coverage` | Run tests and enforce 100% core coverage |

## Architecture

The project enforces a strict **core / UI split** (plan.md §19.1):

- `src/core/**` — pure business logic, no React, no DOM. **100% test coverage is
  required here.**
- `src/ui/**` — thin, dumb view layer (components + view models). Contains no
  business logic; it only renders what `src/core` provides.

## Project documents

- [`manifest.md`](manifest.md) — project charter / intent (purpose, goals, milestones)
- [`project-state.md`](project-state.md) — current state and progress
- [`CHANGELOG.md`](CHANGELOG.md) — versioned change log


## Shaping decisions (from /loop-seed)


- **The prototype draws every asset (desks, chairs, characters, backgrounds) procedurally on canvas — there are no image files. Should the engine keep procedural canvas assets, or must it also support external image assets (PNG sprites / background images)?** — External image assets (sprites/backgrounds) with procedural fallback

- **In the prototype, characters teleport instantly between 'move' events (state is computed per timestamp, no animation). How should character movement work in the built engine?** — Discrete snap (match current prototype)

- **Should the replay engine support audio (dialogue lines, ambient sound, SFX) driven by timeline events, or is it visual-only?** — Visual-only (no audio) *(assumed)*

- **Is this project strictly a playback/replay engine (scenes authored externally as JSON), or does it also need an authoring/editing UI to build and modify scenes in-app?** — Playback/replay only (scenes authored as JSON) *(assumed)*

- **The goal says the player should be 'universal — play any 2d scene'. Should the engine support a fixed set of asset types and event types (exactly what the prototype has), or an extensible plugin registry so new asset types and event types can be added declaratively?** — Fixed set from the prototype

- **How many sample scenes should ship with the app for the showcase and validation?** — Single office scene from the prototype *(assumed)*


