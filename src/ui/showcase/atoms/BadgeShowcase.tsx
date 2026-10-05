import { Badge } from "../../components/atoms";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * Showcase entry for the `Badge` atom (M4-T5).
 *
 * Demonstrates the default (pill) and muted (quiet text) tones. It is thin and
 * dumb — it only renders `Badge`s with representative props.
 */
export function BadgeShowcase() {
  return (
    <ShowcaseEntry
      name="Badge"
      props="children · tone?: 'default' | 'muted'"
      description="A thin label/status pill with default and muted tones."
    >
      <div className="flex items-center gap-3">
        <Badge>Default</Badge>
        <Badge tone="muted">Muted</Badge>
      </div>
    </ShowcaseEntry>
  );
}
