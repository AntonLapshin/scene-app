import { useMemo, useState } from "react";
import { DemoPanel } from "./ui/components/DemoPanel";
import { Button } from "./ui/components/atoms/Button";
import { PlaybackPage } from "./ui/pages/PlaybackPage";
import { ShowcasePage } from "./ui/pages/ShowcasePage";
import { ReplayProvider } from "./ui/context/ReplayProvider";
import { ThemeProvider } from "./ui/context/ThemeProvider";
import { loadOfficeScene } from "./data/officeScene";

/**
 * App root.
 *
 * Wraps the tree in the thin `ReplayProvider` (injecting replay state via
 * `ReplayContext`) and `ThemeProvider` (injecting the design-token surface via
 * `ThemeContext`), then renders the demo panel and a thin nav toggling between
 * the `PlaybackPage` and the `ShowcasePage` (which lists every component). All
 * derivation happens in view models / context / core — no business logic lives
 * here.
 */
export default function App() {
  const scene = useMemo(() => loadOfficeScene(), []);
  const [view, setView] = useState<"playback" | "showcase">("playback");

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
