import { useMemo } from "react";
import { DemoPanel } from "./ui/components/DemoPanel";
import { PlaybackPage } from "./ui/pages/PlaybackPage";
import { loadOfficeScene } from "./data/officeScene";

/**
 * App root.
 *
 * Renders the demo panel and the `PlaybackPage`, which composes the organisms
 * (`SceneStage`, `PlaybackBar`, `SceneInfoPanel`) wired to the thin
 * `useReplayDriver` view model. All derivation happens in view models / core — no
 * business logic lives here.
 */
export default function App() {
  const scene = useMemo(() => loadOfficeScene(), []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full space-y-6">
        <DemoPanel
          projectName="Scene"
          owner="AntonLapshin"
          repo="scene-app"
          description="ws/scene/prototype.html contains a web app prototype of the scene project that allows to define and replay scenarios with characters on a specific scene. The scene has image assets, static objects definition, characters, and the timeline. The scene can be replayed. Your goal is to extract this into a well built web app, use bun as a bundler and runner. Use TypeScript. Use React."
        />
        <PlaybackPage scene={scene} />
      </div>
    </main>
  );
}
