/**
 * SceneLoadError (M5-T2).
 *
 * A thin, dumb error-state panel rendered when a scene bundle fails to parse
 * (malformed/missing JSON). It contains no business logic — it only renders a
 * clear user-facing message and the descriptive parse error from core, so a
 * bad scene produces a visible error instead of a blank crash.
 */
import { useTheme } from "../context";

/**
 * SceneLoadError (M5-T2, themed M5-T4).
 *
 * A thin, dumb error-state panel rendered when a scene bundle fails to parse
 * (malformed/missing JSON). It contains no business logic — it only renders a
 * clear user-facing message and the descriptive parse error from core, so a
 * bad scene produces a visible error instead of a blank crash. Colors and
 * radius come from the injected theme tokens via `useTheme()`.
 */
export interface SceneLoadErrorProps {
  /** A human-readable description of the scene load failure. */
  message: string;
}

export function SceneLoadError({ message }: SceneLoadErrorProps) {
  const { tokens } = useTheme();
  return (
    <section
      data-scene-load-error
      className={`mx-auto max-w-md ${tokens.radius} ${tokens.border} ${tokens.surface} p-6 shadow-sm`}
    >
      <h2 className={`text-xl font-semibold ${tokens.foreground}`}>Scene failed to load</h2>
      <p className={`mt-1 text-sm ${tokens.textMuted}`}>
        The scene data could not be parsed. It may be missing, malformed, or
        incomplete.
      </p>
      <pre
        data-error-message
        className={`mt-3 overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-3 font-mono text-xs ${tokens.monoText}`}
      >
        {message}
      </pre>
    </section>
  );
}
