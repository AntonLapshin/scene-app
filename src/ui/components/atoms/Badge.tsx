import type { ReactNode } from "react";
import { useTheme } from "../../context";

/**
 * Badge atom (M4-T1, themed M5-T1).
 *
 * A thin, dumb label/status pill. It contains no business logic — it only
 * renders its children with a `default` (pill) or `muted` (plain text) tone.
 * Colors and radius come from the injected theme tokens via `useTheme()`.
 */
export interface BadgeProps {
  /** The label / status text content. */
  children: ReactNode;
  /** Visual tone: `default` (pill) or `muted` (quiet text). */
  tone?: "default" | "muted";
}

export function Badge({ children, tone = "default" }: BadgeProps) {
  const { tokens } = useTheme();
  const className =
    tone === "muted"
      ? `font-mono text-xs ${tokens.textMuted}`
      : `inline-flex items-center ${tokens.radiusPill} ${tokens.surfaceMuted} px-2 py-0.5 text-xs font-medium ${tokens.textMuted}`;
  return (
    <span className={className} aria-live="polite">
      {children}
    </span>
  );
}
