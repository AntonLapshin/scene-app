import type { RenderState, ImageAvailability } from "../../../core/scene";
import { SceneView } from "../SceneView";

export interface SceneStageProps {
  /** The ordered render state to draw. */
  renderState: RenderState;
  /** The scene world size, used for the `SceneView` SVG viewBox. */
  world: { w: number; h: number };
  /** External-image availability predicate (delegated to core `renderAsset`). */
  imageAvailable?: ImageAvailability;
  /** Section heading shown above the stage. */
  title?: string;
  /** Short description shown under the heading. */
  description?: string;
}

/**
 * SceneStage organism (M4-T3).
 *
 * Composes the dumb `SceneView` into a titled, card-framed stage section. It is
 * thin and dumb: it contains no business logic — it only renders props and
 * composes `SceneView`. All derivation stays in core/view models.
 */
export function SceneStage({
  renderState,
  world,
  imageAvailable = () => false,
  title = "Scene stage",
  description,
}: SceneStageProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      )}
      <div className="mt-4">
        <SceneView
          renderState={renderState}
          world={world}
          imageAvailable={imageAvailable}
        />
      </div>
    </section>
  );
}
