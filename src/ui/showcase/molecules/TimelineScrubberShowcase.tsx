import { TimelineScrubber } from "../../components/molecules";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * Showcase entry for the `TimelineScrubber` molecule (M4-T5).
 *
 * Demonstrates the seekable progress scrubber at a representative timestamp. It
 * is thin and dumb — it only renders the molecule with representative props.
 */
export function TimelineScrubberShowcase() {
  return (
    <ShowcaseEntry
      name="TimelineScrubber"
      props="value · duration · onChange · ariaLabel?"
      description="Composes Slider + Badge atoms into a seekable progress scrubber."
    >
      <TimelineScrubber value={20} duration={41} onChange={() => {}} />
    </ShowcaseEntry>
  );
}
