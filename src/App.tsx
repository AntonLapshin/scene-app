import { DemoPanel } from "./ui/components/DemoPanel";

/**
 * App root.
 *
 * Just composes the (dumb) demo panel, passing the project identity down from
 * the scaffold context. No business logic here — that lives in `src/core`.
 */
export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full">
        <DemoPanel
          projectName="Scene"
          owner="AntonLapshin"
          repo="scene-app"
          description="ws/scene/prototype.html contains a web app prototype of the "scene" project that allows to define and replay scenarios with characters on a specific scene. The scene has
image assets, static objects definition, characters, and the timeline. The scene can be replayed. Your goal is to extract this into a well built web app, use bun as a bundler and
runner. Use TypeScript, Use React. Use https://github.com/AntonLapshin/showcase to build "storybook"-like showcases for all the components. Focus on quality, reusability. Follow the
Atomic design pattern, extract components https://raw.githubusercontent.com/AntonLapshin/ape-kingdom/refs/heads/main/guidelines/GUIDELINES-WEB-ATOMIC-DESIGN.md and use Context
injection pattern: https://raw.githubusercontent.com/AntonLapshin/ape-kingdom/refs/heads/main/guidelines/GUIDELINES-WEB-CONTEXT-INJECTION.md and theme pattern:
https://raw.githubusercontent.com/AntonLapshin/ape-kingdom/refs/heads/main/guidelines/GUIDELINES-WEB-THEME.md

Extract logic into small independents pure functions with 100% test coverage - core of the mehcanics and helper functions. This is the foundation layer - reusable low level pure
functions. Then higher level logic that manipulate state. The goal is to always extract logic from the UI and let the UI components be simple and focus on UI only. React hooks should
be simple too, they should rather call core logic or helper functions if the logic is required.

The goal of this project is to built a well made scene replay engine that can play a scene that is defined declaratively via json objects and assets. This scene player should be
universal and could play any 2d scene."
        />
      </div>
    </main>
  );
}
