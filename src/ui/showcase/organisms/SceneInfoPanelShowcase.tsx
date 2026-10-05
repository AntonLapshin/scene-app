import { useMemo } from "react";
import { loadOfficeScene } from "../../../data/officeScene";
import { SceneInfoPanel } from "../../components/organisms";
import { ReplayProvider } from "../../context";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * Showcase entry for the `SceneInfoPanel` organism (M4-T5).
 *
 * Demonstrates the metadata + character cards reading from `ReplayContext`. It
 * is thin and dumb — it only wraps the organism in a `ReplayProvider` with the
 * office scene.
 */
export function SceneInfoPanelShowcase() {
  const scene = useMemo(() => loadOfficeScene(), []);

  return (
    <ShowcaseEntry
      name="SceneInfoPanel"
      props="title · style — (reads characters + duration from ReplayContext)"
      description="Composes CharacterCards and metadata badges from ReplayContext."
    >
      <ReplayProvider scene={scene}>
        <SceneInfoPanel
          title={scene.staticScene.meta.name}
          style={scene.staticScene.meta.style}
        />
      </ReplayProvider>
    </ShowcaseEntry>
  );
}
