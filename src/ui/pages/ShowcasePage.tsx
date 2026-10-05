import { useMemo } from "react";
import type { Scene } from "../../core/scene";
import { computeInitialState } from "../../core/scene";
import { useTheme } from "../context";
import { ShowcasePanel } from "../components/ShowcasePanel";
import {
  ButtonShowcase,
  SliderShowcase,
  BadgeShowcase,
  SpriteShowcase,
} from "../showcase/atoms";
import {
  PlaybackControlsShowcase,
  CharacterCardShowcase,
  TimelineScrubberShowcase,
} from "../showcase/molecules";
import {
  SceneStageShowcase,
  PlaybackBarShowcase,
  SceneInfoPanelShowcase,
} from "../showcase/organisms";

/**
 * ShowcasePage (M4-T5).
 *
 * The page that lists a showcase entry for every atom, molecule and organism,
 * plus the retained `ShowcasePanel` (SceneView) entry. It is thin and dumb: it
 * only composes showcase entries and derives data from core to pass as props.
 * All derivation stays in core/view models.
 */
export function ShowcasePage({ scene }: { scene: Scene }) {
  const { renderState, world } = useMemo(
    () => ({
      renderState: computeInitialState(scene),
      world: scene.staticScene.meta.world,
    }),
    [scene],
  );
  const { tokens } = useTheme();

  return (
    <div className="w-full space-y-6">
      <h1 className={`text-2xl font-bold ${tokens.foreground}`}>Component showcase</h1>
      <p className={`text-sm ${tokens.textMuted}`}>
        Every atom, molecule and organism with a documented, representative
        state.
      </p>

      <section className="space-y-6">
        <h2 className={`text-lg font-semibold ${tokens.foreground}`}>Atoms</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ButtonShowcase />
          <SliderShowcase />
          <BadgeShowcase />
          <SpriteShowcase />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className={`text-lg font-semibold ${tokens.foreground}`}>Molecules</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <PlaybackControlsShowcase />
          <CharacterCardShowcase />
          <TimelineScrubberShowcase />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className={`text-lg font-semibold ${tokens.foreground}`}>Organisms</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <SceneStageShowcase />
          <PlaybackBarShowcase />
          <SceneInfoPanelShowcase />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className={`text-lg font-semibold ${tokens.foreground}`}>SceneView</h2>
        <ShowcasePanel
          title="SceneView · Office scene at t=0"
          description="The office scene rendered at timestamp 0."
          renderState={renderState}
          world={world}
        />
      </section>
    </div>
  );
}
