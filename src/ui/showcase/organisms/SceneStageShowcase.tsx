import { useMemo } from "react";
import { loadOfficeScene } from "../../../data/officeScene";
import { SceneStage } from "../../components/organisms";
import { ReplayProvider } from "../../context";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * Showcase entry for the `SceneStage` organism (M4-T5).
 *
 * Demonstrates the stage reading render state from `ReplayContext`. It is thin
 * and dumb — it only wraps the organism in a `ReplayProvider` with the office
 * scene.
 */
export function SceneStageShowcase() {
  const scene = useMemo(() => loadOfficeScene(), []);

  return (
    <ShowcaseEntry
      name="SceneStage"
      props="world · imageAvailable? · title? · description?"
      description="Composes SceneView into a titled stage, reading render state from ReplayContext."
    >
      <ReplayProvider scene={scene}>
        <SceneStage
          title="SceneStage · office scene"
          description="The office scene rendered at the current playback timestamp."
          world={scene.staticScene.meta.world}
        />
      </ReplayProvider>
    </ShowcaseEntry>
  );
}
