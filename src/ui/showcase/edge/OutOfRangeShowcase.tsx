import { useMemo } from "react";
import { computeSceneState, scenarioDuration } from "../../../core/scene";
import { loadOfficeScene } from "../../../data/officeScene";
import { ShowcasePanel } from "../../components/ShowcasePanel";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * Out-of-range-timestamp showcase entry (M5-T4).
 *
 * Demonstrates the end-of-timeline state produced when a timestamp beyond the
 * scenario duration is requested. Core `computeSceneState` clamps timestamps to
 * `[0, duration]`, so a huge timestamp yields the fully-replayed end state. It
 * reuses core for the pure derivation and renders it via the dumb
 * `ShowcasePanel`. No new business logic.
 */
export function OutOfRangeShowcase() {
  const scene = useMemo(() => loadOfficeScene(), []);
  const duration = useMemo(() => scenarioDuration(scene.scenario), [scene]);
  const renderState = useMemo(() => computeSceneState(scene, 1e9), [scene]);

  return (
    <ShowcaseEntry
      name="Out-of-range timestamp"
      props="computeSceneState(scene, 1e9) → clamped to duration"
      description="Timestamps beyond the scenario duration clamp to the end — all events fired, no invalid render state."
    >
      <ShowcasePanel
        title={`End of timeline · t ≥ ${duration}s`}
        description="A seek far past the scenario duration clamps to the end of the timeline: every event has fired and Noah has reached his desk."
        renderState={renderState}
        world={scene.staticScene.meta.world}
      />
    </ShowcaseEntry>
  );
}
