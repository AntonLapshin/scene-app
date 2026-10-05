import { PlaybackControlsMolecule } from "../../components/molecules";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * Showcase entry for the `PlaybackControlsMolecule` (M4-T5).
 *
 * Demonstrates the play/pause + step + seek control strip with a representative
 * timestamp. It is thin and dumb — it only renders the molecule with
 * representative props.
 */
export function PlaybackControlsShowcase() {
  return (
    <ShowcaseEntry
      name="PlaybackControlsMolecule"
      props="isPlaying · timestamp · duration · onToggle · onSeek · onStepBackward · onStepForward"
      description="Composes Button/Slider/Badge atoms into a playback control strip."
    >
      <PlaybackControlsMolecule
        isPlaying={false}
        timestamp={12.5}
        duration={41}
        onToggle={() => {}}
        onSeek={() => {}}
        onStepBackward={() => {}}
        onStepForward={() => {}}
      />
    </ShowcaseEntry>
  );
}
