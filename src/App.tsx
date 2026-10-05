import { useMemo, useState } from "react";
import { DemoPanel } from "./ui/components/DemoPanel";
import { Button } from "./ui/components/atoms/Button";
import { SceneLoadError } from "./ui/components/SceneLoadError";
import { PlaybackPage } from "./ui/pages/PlaybackPage";
import { ShowcasePage } from "./ui/pages/ShowcasePage";
import { ReplayProvider } from "./ui/context/ReplayProvider";
import { ThemeProvider } from "./ui/context/ThemeProvider";
import { parseSceneBundle } from "./core/scene";
import { officeSceneData } from "./data/officeScene";

export interface AppProps {
  /** The raw scene bundle to load. Defaults to the bundled office scene. */
  rawScene?: unknown;
}

/**
 * App root.
 *
 * Loads the scene via the core `parseSceneBundle` (which returns a result
 * instead of throwing) and wraps the tree in the thin `ReplayProvider`
 * and `ThemeProvider`. If the scene fails to parse, a clear user-facing
 * `SceneLoadError` is rendered instead of a blank crash. All derivation
 * happens in view models / context / core — no business logic lives here.
 */
export default function App({ rawScene = officeSceneData }: AppProps) {
  const result = useMemo(() => parseSceneBundle(rawScene), [rawScene]);
  const [view, setView] = useState<"playback" | "showcase">("playback");

  if (!result.ok) {
    return (
      <ThemeProvider>
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
          <SceneLoadError message={result.error} />
        </main>
      </ThemeProvider>
    );
  }

  const scene = result.scene;

  return (
    <ThemeProvider>
      <ReplayProvider scene={scene}>
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
          <div className="w-full space-y-6">
            <DemoPanel
              projectName="Scene"
              owner="AntonLapshin"
              repo="scene-app"
              description="ws/scene/prototype.html contains a web app prototype of the scene project that allows to define and replay scenarios with characters on a specific scene. The scene has image assets, static objects definition, characters, and the timeline. The scene can be replayed. Your goal is to extract this into a well built web app, use bun as a bundler and runner. Use TypeScript. Use React."
            />
            <nav aria-label="App sections" className="flex gap-2">
              <Button
                variant={view === "playback" ? "primary" : "secondary"}
                onClick={() => setView("playback")}
                ariaLabel="Show playback"
              >
                Playback
              </Button>
              <Button
                variant={view === "showcase" ? "primary" : "secondary"}
                onClick={() => setView("showcase")}
                ariaLabel="Show showcase"
              >
                Showcase
              </Button>
            </nav>
            {view === "playback" ? (
              <PlaybackPage scene={scene} />
            ) : (
              <ShowcasePage scene={scene} />
            )}
          </div>
        </main>
      </ReplayProvider>
    </ThemeProvider>
  );
}
