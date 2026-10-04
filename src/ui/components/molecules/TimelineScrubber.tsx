import { Slider } from "../atoms/Slider";
import { Badge } from "../atoms/Badge";

export interface TimelineScrubberProps {
  /** The current timestamp (seconds), the slider value. */
  value: number;
  /** The scenario duration (seconds), the slider max. */
  duration: number;
  /** Seek to an absolute timestamp (clamped by the driver via core). */
  onChange: (value: number) => void;
  /** Accessible label (rendered as `aria-label`). */
  ariaLabel?: string;
}

/**
 * TimelineScrubber molecule (M4-T2).
 *
 * Composes the `Slider` + `Badge` atoms into a seekable progress scrubber over
 * the scenario duration, with a current-time/duration readout. It is thin and
 * dumb: it contains no business logic — it only renders props and forwards the
 * numeric value to `onChange`, which is wired to the driver (delegating to
 * core `clampTimestamp`). All decisions live in `src/core`.
 */
export function TimelineScrubber({
  value,
  duration,
  onChange,
  ariaLabel = "Timeline",
}: TimelineScrubberProps) {
  const clamped = Math.min(Math.max(value, 0), duration);

  return (
    <div className="flex items-center gap-3 text-sm">
      <Slider
        value={clamped}
        min={0}
        max={duration}
        step={0.1}
        onChange={onChange}
        ariaLabel={ariaLabel}
      />
      <Badge tone="muted">
        {clamped.toFixed(1)}s / {duration.toFixed(1)}s
      </Badge>
    </div>
  );
}
