import { Button } from "../atoms/Button";
import { Slider } from "../atoms/Slider";
import { Badge } from "../atoms/Badge";

export interface PlaybackControlsMoleculeProps {
  /** Whether playback is currently advancing. */
  isPlaying: boolean;
  /** The current timestamp (seconds), displayed and used for the slider. */
  timestamp: number;
  /** The scenario duration (seconds), the slider max. */
  duration: number;
  /** Toggle play/pause. */
  onToggle: () => void;
  /** Seek to an absolute timestamp (clamped by the driver via core). */
  onSeek: (timestamp: number) => void;
  /** Step to the previous event boundary (or step seconds) and pause. */
  onStepBackward: () => void;
  /** Step to the next event boundary (or step seconds) and pause. */
  onStepForward: () => void;
}

/**
 * PlaybackControlsMolecule (M4-T2).
 *
 * Composes the `Button` / `Slider` / `Badge` atoms into a play/pause + seek +
 * step control strip with a current-time/duration display. It is thin and dumb:
 * it contains no business logic — it only renders props and forwards user
 * interactions to the callback props, which are wired to the `useReplayDriver`
 * view model (which delegates to core). All decisions live in `src/core`.
 */
export function PlaybackControlsMolecule({
  isPlaying,
  timestamp,
  duration,
  onToggle,
  onSeek,
  onStepBackward,
  onStepForward,
}: PlaybackControlsMoleculeProps) {
  const clamped = Math.min(Math.max(timestamp, 0), duration);

  return (
    <div className="flex items-center gap-3 text-sm">
      <Button variant="primary" onClick={onToggle} ariaLabel={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? "Pause" : "Play"}
      </Button>

      <Button variant="secondary" onClick={onStepBackward} ariaLabel="Step backward">
        ‹
      </Button>

      <Slider
        value={clamped}
        min={0}
        max={duration}
        step={0.1}
        onChange={onSeek}
        ariaLabel="Seek"
      />

      <Button variant="secondary" onClick={onStepForward} ariaLabel="Step forward">
        ›
      </Button>

      <Badge tone="muted">
        {clamped.toFixed(1)}s / {duration.toFixed(1)}s
      </Badge>
    </div>
  );
}
