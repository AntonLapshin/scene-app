export interface PlaybackControlsProps {
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
 * Playback controls (M3-T2).
 *
 * A thin, dumb component that renders play/pause, seek slider, and step
 * forward/backward controls. It contains no business logic — it only renders
 * props and forwards user interactions to the callback props, which are wired
 * to the `useReplayDriver` view model (which delegates to core). All decisions
 * live in `src/core`.
 */
export function PlaybackControls({
  isPlaying,
  timestamp,
  duration,
  onToggle,
  onSeek,
  onStepBackward,
  onStepForward,
}: PlaybackControlsProps) {
  const clamped = Math.min(Math.max(timestamp, 0), duration);

  return (
    <div className="flex items-center gap-3 text-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button
        type="button"
        onClick={onStepBackward}
        aria-label="Step backward"
        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-700 hover:bg-slate-50"
      >
        ‹
      </button>

      <input
        type="range"
        min={0}
        max={duration}
        step={0.1}
        value={clamped}
        onChange={(e) => onSeek(Number(e.target.value))}
        aria-label="Seek"
        className="w-52 accent-indigo-600"
      />

      <button
        type="button"
        onClick={onStepForward}
        aria-label="Step forward"
        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-700 hover:bg-slate-50"
      >
        ›
      </button>

      <span className="font-mono text-xs text-slate-600" aria-live="polite">
        {clamped.toFixed(1)}s / {duration.toFixed(1)}s
      </span>
    </div>
  );
}
