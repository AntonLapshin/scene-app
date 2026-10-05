import type { Asset } from "../../../core/scene";
import { Sprite } from "../../components/atoms";
import { ShowcaseEntry } from "../ShowcaseEntry";

/** An asset with an external image reference (rendered as an `<image>`). */
const IMAGE_ASSET: Asset = {
  id: "desk-image",
  asset: "desk",
  x: 0,
  y: 0,
  image: "/desk.png",
};

/** The same asset without an image (rendered procedurally as a fallback). */
const PROCEDURAL_ASSET: Asset = {
  id: "desk-procedural",
  asset: "desk",
  x: 0,
  y: 0,
};

/**
 * Showcase entry for the `Sprite` atom (M4-T5).
 *
 * Demonstrates rendering an asset with an external image (when available) and
 * the procedural fallback (when unavailable). It is thin and dumb — it only
 * renders `Sprite`s with representative props.
 */
export function SpriteShowcase() {
  return (
    <ShowcaseEntry
      name="Sprite"
      props="ops? · asset? · imageAvailable?"
      description="Renders core draw ops or an asset via core renderAsset (image vs procedural fallback)."
    >
      <div className="flex flex-wrap items-start gap-4">
        <svg viewBox="0 0 100 100" width={120} height={120} role="img" aria-label="Sprite image">
          <Sprite
            asset={IMAGE_ASSET}
            imageAvailable={(src) => src === "/desk.png"}
          />
        </svg>
        <svg viewBox="0 0 100 100" width={120} height={120} role="img" aria-label="Sprite procedural">
          <Sprite asset={PROCEDURAL_ASSET} imageAvailable={() => false} />
        </svg>
      </div>
    </ShowcaseEntry>
  );
}
