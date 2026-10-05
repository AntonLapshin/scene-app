import { useTheme } from "../../context";

/**
 * Slider atom (M4-T1, themed M5-T1).
 *
 * A thin, dumb range input used for seeking. It contains no business logic —
 * it renders the value/min/max/step props and forwards the numeric value to
 * the `onChange` callback. Clamping is left to the caller (core `clampTimestamp`
 * handles it in the driver). The accent color comes from the injected theme
 * tokens via `useTheme()`.
 */
export interface SliderProps {
  /** The current value, rendered as the input value. */
  value: number;
  /** The minimum selectable value. */
  min: number;
  /** The maximum selectable value. */
  max: number;
  /** The granularity step. */
  step?: number;
  /** Called with the numeric value on change. */
  onChange: (value: number) => void;
  /** Accessible label (rendered as `aria-label`). */
  ariaLabel?: string;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  ariaLabel,
}: SliderProps) {
  const { tokens } = useTheme();
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={ariaLabel}
      className={`w-full min-w-40 flex-1 ${tokens.accent}`}
    />
  );
}
