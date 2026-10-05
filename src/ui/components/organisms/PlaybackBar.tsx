import type { ReplayDriverResult } from "../../viewModels/useReplayDriver";
import { PlaybackControlsMolecule } from "../molecules/PlaybackControlsMolecule";
import { TimelineScrubber } from "../molecules/TimelineScrubber";
import { Badge } from "../atoms/Badge";

export interface PlaybackBarProps {
  /** The thin replay-driver view model result the bar renders. */
  driver: ReplayDriverResult;
}

/**
 * PlaybackBar organism (M4-T3).
 *
 * Composes the `PlaybackControlsMolecule`, `TimelineScrubber` and a current
 * time/duration readout into a single playback section, all fed from the
 * `useReplayDriver` view model. It is thin and dumb: it contains no business
 * logic — it only renders props from the driver and forwards its callbacks. All
 * decisions live in `src/core`.
 */
export function PlaybackBar({ driver }: PlaybackBarProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Playback controls</h2>
      <p className="mt-1 text-sm text-slate-600">
        Play, pause, seek, and step through the scenario timeline.
      </p>

      <div className="mt-4">
        <PlaybackControlsMolecule
          isPlaying={driver.isPlaying}
          timestamp={driver.timestamp}
          duration={driver.duration}
          onToggle={driver.toggle}
          onSeek={driver.seek}
          onStepBackward={driver.stepBackward}
          onStepForward={driver.stepForward}
        />
      </div>

      <div className="mt-4">
        <TimelineScrubber
          value={driver.timestamp}
          duration={driver.duration}
          onChange={driver.seek}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm">
        <Badge>Time</Badge>
        <Badge tone="muted">
          {driver.timestamp.toFixed(1)}s / {driver.duration.toFixed(1)}s
        </Badge>
      </div>
    </section>
  );
}
