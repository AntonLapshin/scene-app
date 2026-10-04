import type { ReactNode } from "react";

/**
 * Badge atom (M4-T1).
 *
 * A thin, dumb label/status pill. It contains no business logic — it only
 * renders its children with a `default` (pill) or `muted` (plain text) tone.
 */
export interface BadgeProps {
  /** The label / status text content. */
  children: ReactNode;
  /** Visual tone: `default` (pill) or `muted` (quiet text). */
  tone?: "default" | "muted";
}

/** Tailwind classes per tone. */
const TONES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default:
    "inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700",
  muted: "font-mono text-xs text-slate-600",
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  return (
    <span className={TONES[tone]} aria-live="polite">
      {children}
    </span>
  );
}
