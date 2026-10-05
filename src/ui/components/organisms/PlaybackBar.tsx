import { useReplay, useTheme } from "../../context";
import { PlaybackControlsMolecule } from "../molecules/PlaybackControlsMolecule";
import { TimelineScrubber } from "../molecules/TimelineScrubber";
import { Badge } from "../atoms/Badge";

/**
 * PlaybackBar organism (M4-T3, refactored M4-T4, themed M5-T1).
 *
 * Composes the `PlaybackControlsMolecule`, `TimelineScrubber` and a current
 * time/duration readout into a single playback section. It reads the replay
 * state + driver actions from `ReplayContext` via `useReplay()` and the theme
 * tokens via `useTheme()`. It is otherwise thin and dumb: it contains no
 * business logic — it only renders context values and forwards the callbacks.
 * All decisions live in `src/core`.
 */
export function PlaybackBar() {
  const { isPlaying, timestamp, duration, toggle, seek, stepForward, stepBackward } =
    useReplay();
  const { tokens } = useTheme();

  return (
    <section className={`${tokens.radius} ${tokens.border} ${tokens.surface} p-6 shadow-sm`}>
      <h2 className={`text-xl font-semibold ${tokens.foreground}`}>Playback controls</h2>
      <p className={`mt-1 text-sm ${tokens.textMuted}`}>
        Play, pause, seek, and step through the scenario timeline.
      </p>

      <div className="mt-4">
        <PlaybackControlsMolecule
          isPlaying={isPlaying}
          timestamp={timestamp}
          duration={duration}
          onToggle={toggle}
          onSeek={seek}
          onStepBackward={stepBackward}
          onStepForward={stepForward}
        />
      </div>

      <div className="mt-4">
        <TimelineScrubber value={timestamp} duration={duration} onChange={seek} />
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm">
        <Badge>Time</Badge>
        <Badge tone="muted">
          {timestamp.toFixed(1)}s / {duration.toFixed(1)}s
        </Badge>
      </div>
    </section>
  );
}
