import type { RenderState, ImageAvailability } from "../../core/scene";
import { SceneView } from "./SceneView";
import { useTheme } from "../context";

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
  const { tokens } = useTheme();
  return (
    <section className={`${tokens.radius} ${tokens.border} ${tokens.surface} p-6 shadow-sm`}>
      <h2 className={`text-xl font-semibold ${tokens.foreground}`}>{title}</h2>
      <p className={`mt-1 text-sm ${tokens.textMuted}`}>{description}</p>

      <dl className="mt-4 space-y-1 text-sm">
        <dt className={tokens.textSubtle}>Props</dt>
        <dd className={`font-mono text-xs ${tokens.textSubtle}`}>
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
