import type { ReactNode } from "react";
import { useTheme } from "../../context";

/**
 * Button atom (M4-T1, themed M5-T1).
 *
 * A thin, dumb button with a `primary` / `secondary` visual variant. It
 * contains no business logic — it only renders its props and forwards the
 * click to the `onClick` callback. Colors and radius come from the injected
 * theme tokens via `useTheme()`.
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

export function Button({
  variant = "primary",
  onClick,
  disabled,
  ariaLabel,
  children,
}: ButtonProps) {
  const { tokens } = useTheme();
  const isPrimary = variant === "primary";
  const variantClasses = isPrimary
    ? `${tokens.primary} ${tokens.radiusSm} px-3`
    : `${tokens.secondary} ${tokens.radiusSm} px-2.5`;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${variantClasses} py-1.5 font-medium`}
    >
      {children}
    </button>
  );
}
