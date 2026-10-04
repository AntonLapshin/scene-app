import type { ReactNode } from "react";

/**
 * Button atom (M4-T1).
 *
 * A thin, dumb button with a `primary` / `secondary` visual variant. It
 * contains no business logic — it only renders its props and forwards the
 * click to the `onClick` callback.
 */
export interface ButtonProps {
  /** Visual variant: `primary` (filled) or `secondary` (outlined). */
  variant?: "primary" | "secondary";
  /** Click handler forwarded to the underlying `<button>`. */
  onClick?: () => void;
  /** Disables the button. */
  disabled?: boolean;
  /** Accessible label (rendered as `aria-label`). */
  ariaLabel?: string;
  /** Button content (label text or icon). */
  children: ReactNode;
}

/** Tailwind classes per variant. */
const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50",
  secondary:
    "rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  onClick,
  disabled,
  ariaLabel,
  children,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={VARIANTS[variant]}
    >
      {children}
    </button>
  );
}
