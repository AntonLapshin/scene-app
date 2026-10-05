import { Button } from "../../components/atoms";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * Showcase entry for the `Button` atom (M4-T5).
 *
 * Demonstrates the primary, secondary and disabled states. It is thin and dumb —
 * it only renders `Button`s with representative props.
 */
export function ButtonShowcase() {
  return (
    <ShowcaseEntry
      name="Button"
      props="variant?: 'primary' | 'secondary' · onClick? · disabled? · ariaLabel? · children"
      description="A thin button atom with primary/secondary variants and a disabled state."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button disabled>Disabled</Button>
      </div>
    </ShowcaseEntry>
  );
}
