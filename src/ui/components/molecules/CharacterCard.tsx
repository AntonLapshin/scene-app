import type { CharacterState } from "../../../core/scene";
import { characterDrawOps } from "../../../core/scene";
import { Sprite } from "../atoms/Sprite";

export interface CharacterCardProps {
  /** The character's live state (look palette, emotion, optional say bubble). */
  character: CharacterState;
}

/** The look-palette color chips shown on the card. */
const PALETTE_LABELS: { key: keyof CharacterState["look"]; label: string }[] = [
  { key: "skin", label: "Skin" },
  { key: "hair", label: "Hair" },
  { key: "shirt", label: "Shirt" },
  { key: "pants", label: "Pants" },
  { key: "shoes", label: "Shoes" },
];

/**
 * CharacterCard molecule (M4-T2).
 *
 * Shows a character's current state — look palette, emotion glyph, and any
 * active say bubble — rendered via the `Sprite` atom from core
 * `characterDrawOps`. It is thin and dumb: it contains no business logic, it
 * only renders props and composes the `Sprite` atom. All drawing decisions
 * live in `src/core`.
 */
export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <article
      data-character-card={character.id}
      className="flex w-56 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <header className="flex items-center gap-3">
        <svg
          viewBox="-40 -70 80 80"
          width={56}
          height={56}
          role="img"
          aria-label={`${character.name} sprite`}
          className="shrink-0 rounded-lg bg-slate-50"
        >
          <g transform="translate(0,0)">
            <Sprite ops={characterDrawOps(character)} />
          </g>
        </svg>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{character.name}</h3>
          <p className="text-xs text-slate-500">{character.role}</p>
          <p className="mt-0.5 text-xs text-slate-600">
            Emotion: <span className="font-medium">{character.emotion}</span>
          </p>
        </div>
      </header>

      {character.say && (
        <p
          data-say-bubble
          className="rounded-lg border border-slate-200 bg-amber-50 px-2 py-1 text-xs text-slate-700"
        >
          “{character.say.text}”
        </p>
      )}

      <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-slate-600">
        {PALETTE_LABELS.map(({ key, label }) => (
          <li key={key} className="flex items-center justify-between">
            <span>{label}</span>
            <span
              data-palette={key}
              title={character.look[key]}
              className="inline-block h-3 w-3 rounded-full border border-slate-300"
              style={{ backgroundColor: character.look[key] }}
            />
          </li>
        ))}
      </ul>
    </article>
  );
}
