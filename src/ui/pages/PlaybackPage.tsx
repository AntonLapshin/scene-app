import type { Scene } from "../../core/scene";
import { SceneStage } from "../components/organisms/SceneStage";
import { PlaybackBar } from "../components/organisms/PlaybackBar";
import { SceneInfoPanel } from "../components/organisms/SceneInfoPanel";

export interface PlaybackPageProps {
  /** The parsed scene bundle to play back. */
  scene: Scene;
}

/**
 * PlaybackPage (M4-T3, refactored M4-T4).
 *
 * The page that composes the three organisms — `SceneStage`, `PlaybackBar` and
 * `SceneInfoPanel`. Replay state (timestamp, duration, render state, driver
 * actions) now flows through `ReplayContext` (injected by `ReplayProvider` in
 * `App`), so the organisms read it via `useReplay()` instead of receiving it as
 * props. The page only passes the static scene metadata (world, name, style)
 * down as props. It contains no business logic — all derivation stays in
 * core/view models.
 */
export function PlaybackPage({ scene }: PlaybackPageProps) {
  return (
    <div className="w-full space-y-6">
      <SceneStage
        title="SceneView · Office scene playback"
        description="The office scene rendered at the current playback timestamp via the SceneView component, driven by the replay driver injected through ReplayContext."
        world={scene.staticScene.meta.world}
      />
      <PlaybackBar />
      <SceneInfoPanel
        title={scene.staticScene.meta.name}
        style={scene.staticScene.meta.style}
      />
    </div>
  );
}
