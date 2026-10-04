import { useMemo } from "react";
import { DemoPanel } from "./ui/components/DemoPanel";
import {
  CharacterCard,
  PlaybackControlsMolecule,
  TimelineScrubber,
} from "./ui/components/molecules";
import { ShowcasePanel } from "./ui/components/ShowcasePanel";
import { useReplayDriver } from "./ui/viewModels/useReplayDriver";
import { loadOfficeScene } from "./data/officeScene";
import { scenarioDuration } from "./core/scene";

/**
 * App root.
 *
 * Composes the (dumb) demo panel, the `SceneView` showcase, the playback
 * control molecule, a timeline scrubber, and character cards — all wired to the
 * thin `useReplayDriver` view model. All derivation happens in view models /
 * core — no business logic lives here.
 */
export default function App() {
  const scene = useMemo(() => loadOfficeScene(), []);
  const driver = useReplayDriver(scene);
  const duration = scenarioDuration(scene.scenario);

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
          title="SceneView · Office scene playback"
          description="The office scene rendered at the current playback timestamp via the SceneView component, driven by the useReplayDriver view model."
          renderState={driver.renderState}
          world={scene.staticScene.meta.world}
        />
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Playback controls</h2>
          <p className="mt-1 text-sm text-slate-600">
            Play, pause, seek, and step through the scenario timeline.
          </p>
          <div className="mt-4">
            <PlaybackControlsMolecule
              isPlaying={driver.isPlaying}
              timestamp={driver.timestamp}
              duration={duration}
              onToggle={driver.toggle}
              onSeek={driver.seek}
              onStepBackward={driver.stepBackward}
              onStepForward={driver.stepForward}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Timeline</h2>
          <p className="mt-1 text-sm text-slate-600">
            Scrub the scenario progress.
          </p>
          <div className="mt-4">
            <TimelineScrubber
              value={driver.timestamp}
              duration={duration}
              onChange={driver.seek}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Characters</h2>
          <p className="mt-1 text-sm text-slate-600">
            Current state of each visible character.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            {driver.renderState.characters
              .filter((c) => c.visible)
              .map((c) => (
                <CharacterCard key={c.id} character={c} />
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
