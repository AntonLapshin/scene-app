import type { RenderState, ImageAvailability } from "../../core/scene";
import { SceneView } from "./SceneView";

export interface ShowcasePanelProps {
  /** Component title shown in the showcase entry. */
  title: string;
  /** Short description of what the showcased component does. */
  description: string;
  /** The render state to pass to `SceneView`. */
  renderState: RenderState;
  /** The scene world size for the `SceneView` SVG viewBox. */
  world: { w: number; h: number };
  /** External-image availability predicate (delegated to `SceneView`). */
  imageAvailable?: ImageAvailability;
}

/**
 * Minimal showcase entry for `SceneView` (M1-T4c).
 *
 * A thin, dumb showcase panel that presents `SceneView` with a short description
 * and a list of its props. It renders props and composes the dumb `SceneView` —
 * no business logic lives here; all derivation stays in core/view models.
 */
export function ShowcasePanel({
  title,
  description,
  renderState,
  world,
  imageAvailable = () => false,
}: ShowcasePanelProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{description}</p>

      <dl className="mt-4 space-y-1 text-sm">
        <dt className="text-slate-500">Props</dt>
        <dd className="font-mono text-xs text-slate-500">
          renderState · world · imageAvailable
        </dd>
      </dl>

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
