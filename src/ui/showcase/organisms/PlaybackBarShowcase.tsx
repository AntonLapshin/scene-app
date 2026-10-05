import { useMemo } from "react";
import { loadOfficeScene } from "../../../data/officeScene";
import { PlaybackBar } from "../../components/organisms";
import { ReplayProvider } from "../../context";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * Showcase entry for the `PlaybackBar` organism (M4-T5).
 *
 * Demonstrates the playback section reading driver actions from
 * `ReplayContext`. It is thin and dumb — it only wraps the organism in a
 * `ReplayProvider` with the office scene.
 */
export function PlaybackBarShowcase() {
  const scene = useMemo(() => loadOfficeScene(), []);

  return (
    <ShowcaseEntry
      name="PlaybackBar"
      props="— (reads replay state + driver actions from ReplayContext)"
      description="Composes the controls molecule, timeline scrubber and time readout from ReplayContext."
    >
      <ReplayProvider scene={scene}>
        <PlaybackBar />
      </ReplayProvider>
    </ShowcaseEntry>
  );
}
