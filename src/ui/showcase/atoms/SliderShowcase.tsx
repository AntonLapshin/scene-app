import { Slider } from "../../components/atoms";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * Showcase entry for the `Slider` atom (M4-T5).
 *
 * Demonstrates the slider at its min, mid and max values over a 0–41s range.
 * It is thin and dumb — it only renders `Slider`s with representative props.
 */
export function SliderShowcase() {
  return (
    <ShowcaseEntry
      name="Slider"
      props="value · min · max · step? · onChange · ariaLabel?"
      description="A thin range input used for seeking, shown at min, mid and max."
    >
      <div className="space-y-2">
        <Slider value={0} min={0} max={41} onChange={() => {}} ariaLabel="Slider min" />
        <Slider value={20} min={0} max={41} onChange={() => {}} ariaLabel="Slider mid" />
        <Slider value={41} min={0} max={41} onChange={() => {}} ariaLabel="Slider max" />
      </div>
    </ShowcaseEntry>
  );
}
