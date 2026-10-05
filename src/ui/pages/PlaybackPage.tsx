import type { Scene } from "../../core/scene";
import { scenarioDuration } from "../../core/scene";
import { useReplayDriver } from "../viewModels/useReplayDriver";
import { SceneStage } from "../components/organisms/SceneStage";
import { PlaybackBar } from "../components/organisms/PlaybackBar";
import { SceneInfoPanel } from "../components/organisms/SceneInfoPanel";

export interface PlaybackPageProps {
  /** The parsed scene bundle to play back. */
  scene: Scene;
}

/**
 * PlaybackPage (M4-T3).
 *
 * The page that composes the three organisms — `SceneStage`, `PlaybackBar` and
 * `SceneInfoPanel` — and wires them to the thin `useReplayDriver` view model.
 * It contains no business logic: it delegates timing to the view model and
 * duration to core `scenarioDuration`, and passes props down to the dumb
 * organisms. All derivation stays in core/view models.
 */
export function PlaybackPage({ scene }: PlaybackPageProps) {
  const driver = useReplayDriver(scene);
  const duration = scenarioDuration(scene.scenario);

  return (
    <div className="w-full space-y-6">
      <SceneStage
        title="SceneView · Office scene playback"
        description="The office scene rendered at the current playback timestamp via the SceneView component, driven by the useReplayDriver view model."
        renderState={driver.renderState}
        world={scene.staticScene.meta.world}
      />
      <PlaybackBar driver={driver} />
      <SceneInfoPanel
        characters={driver.renderState.characters}
        title={scene.staticScene.meta.name}
        style={scene.staticScene.meta.style}
        duration={duration}
      />
    </div>
  );
}
