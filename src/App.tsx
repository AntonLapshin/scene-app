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
          description="ws/scene/prototype.html contains a web app prototype of the scene project that allows to define and replay scenarios with characters on a specific scene. The scene has image assets, static objects definition, characters, and the timeline. The scene can be replayed. Your goal is to extract this into a well built web app, use bun as a bundler and runner. Use TypeScript. Use React."
        />
      </div>
    </main>
  );
}
