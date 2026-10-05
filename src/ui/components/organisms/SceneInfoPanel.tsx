import { useReplay } from "../../context";
import { CharacterCard } from "../molecules/CharacterCard";
import { Badge } from "../atoms/Badge";

export interface SceneInfoPanelProps {
  /** Scene name shown as a metadata badge. */
  title: string;
  /** Scene visual style shown as a metadata badge. */
  style: string;
}

/**
 * SceneInfoPanel organism (M4-T3, refactored M4-T4).
 *
 * Composes `CharacterCard`s for the visible characters plus a row of scene
 * metadata `Badge`s (name, style, duration, character count). It reads the
 * visible characters and duration from `ReplayContext` via `useReplay()` and is
 * otherwise thin and dumb: it contains no business logic — it only renders
 * context values and composes the molecule/atom. All derivation stays in
 * core/view models.
 */
export function SceneInfoPanel({ title, style }: SceneInfoPanelProps) {
  const { renderState, duration } = useReplay();
  const characters = renderState.characters;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Scene info</h2>
      <p className="mt-1 text-sm text-slate-600">
        Current state of each visible character and scene metadata.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{title}</Badge>
        <Badge>{style}</Badge>
        <Badge>{duration.toFixed(1)}s</Badge>
        <Badge>{characters.length} characters</Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {characters.map((c) => (
          <CharacterCard key={c.id} character={c} />
        ))}
      </div>
    </section>
  );
}
