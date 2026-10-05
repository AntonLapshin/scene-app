import { useMemo } from "react";
import { computeInitialState } from "../../../core/scene";
import type { Scene } from "../../../core/scene";
import { loadOfficeScene } from "../../../data/officeScene";
import { ShowcasePanel } from "../../components/ShowcasePanel";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * Empty-timeline showcase entry (M5-T4).
 *
 * Demonstrates a scene whose scenario has no events (an empty timeline). It
 * reuses core `computeInitialState` to derive the render state — a pure
 * derivation — and renders it via the dumb `ShowcasePanel`. No new business
 * logic.
 */
export function EmptyTimelineShowcase() {
  const scene = useMemo(() => loadOfficeScene(), []);
  const emptyScene = useMemo<Scene>(
    () => ({
      ...scene,
      scenario: { id: "empty", title: "Empty timeline", duration: 0, events: [] },
    }),
    [scene],
  );
  const renderState = useMemo(
    () => computeInitialState(emptyScene),
    [emptyScene],
  );

  return (
    <ShowcaseEntry
      name="Empty timeline"
      props="scene.scenario.events = [] · duration 0"
      description="A scene with no timeline events renders its initial state and plays/seeks safely (clamped to 0)."
    >
      <ShowcasePanel
        title="Empty timeline · initial state"
        description="No events have fired, so only the initial live characters are visible; stepping and seeking stay clamped to 0."
        renderState={renderState}
        world={emptyScene.staticScene.meta.world}
      />
    </ShowcaseEntry>
  );
}
