import { DemoPanel } from "./ui/components/DemoPanel";
import { ShowcasePanel } from "./ui/components/ShowcasePanel";
import { useOfficeScene } from "./ui/viewModels/useOfficeScene";

/**
 * App root.
 *
 * Composes the (dumb) demo panel and a minimal showcase entry demonstrating the
 * `SceneView` rendering the office scene at t=0. All derivation happens in the
 * `useOfficeScene` view model / core — no business logic lives here.
 */
export default function App() {
  const { renderState, world } = useOfficeScene();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full space-y-6">
        <DemoPanel
          projectName="Scene"
          owner="AntonLapshin"
          repo="scene-app"
          description="ws/scene/prototype.html contains a web app prototype of the scene project that allows to define and replay scenarios with characters on a specific scene. The scene has image assets, static objects definition, characters, and the timeline. The scene can be replayed. Your goal is to extract this into a well built web app, use bun as a bundler and runner. Use TypeScript. Use React."
        />
        <ShowcasePanel
          title="SceneView · Office scene at t=0"
          description="The office scene rendered at timestamp 0 via the SceneView component, driven by the core useOfficeScene view model."
          renderState={renderState}
          world={world}
        />
      </div>
    </main>
  );
}
