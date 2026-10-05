import { SceneLoadError } from "../../components/SceneLoadError";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * SceneLoadError showcase entry (M5-T4).
 *
 * Demonstrates the error-state panel rendered when a scene bundle fails to
 * parse (malformed/missing JSON). It is thin and dumb — it only renders the
 * `SceneLoadError` component with a representative descriptive message from
 * core. No new business logic.
 */
export function SceneLoadErrorShowcase() {
  return (
    <ShowcaseEntry
      name="SceneLoadError"
      props="message"
      description="Rendered when a scene bundle fails to parse — malformed or missing JSON produces a clear error instead of a blank crash."
    >
      <SceneLoadError message="staticScene.floor must be an object (path: staticScene.floor)" />
    </ShowcaseEntry>
  );
}
