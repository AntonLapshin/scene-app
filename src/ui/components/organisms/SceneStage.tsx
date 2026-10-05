import type { ImageAvailability } from "../../../core/scene";
import { SceneView } from "../SceneView";
import { useReplay, useTheme } from "../../context";

export interface SceneStageProps {
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
 * SceneStage organism (M4-T3, refactored M4-T4).
 *
 * Composes the dumb `SceneView` into a titled, card-framed stage section. It
 * reads the current `renderState` from `ReplayContext` via `useReplay()` and is
 * otherwise thin and dumb: it contains no business logic — it only renders props
 * and composes `SceneView`. All derivation stays in core/view models.
 */
export function SceneStage({
  world,
  imageAvailable = () => false,
  title = "Scene stage",
  description,
}: SceneStageProps) {
  const { renderState } = useReplay();
  const { tokens } = useTheme();
  return (
    <section className={`${tokens.radius} ${tokens.border} ${tokens.surface} p-6 shadow-sm`}>
      <h2 className={`text-xl font-semibold ${tokens.foreground}`}>{title}</h2>
      {description && (
        <p className={`mt-1 text-sm ${tokens.textMuted}`}>{description}</p>
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
