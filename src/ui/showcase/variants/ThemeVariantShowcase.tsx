import { useMemo } from "react";
import { loadOfficeScene } from "../../../data/officeScene";
import { Button, Badge, Slider } from "../../components/atoms";
import { SceneStage } from "../../components/organisms";
import { ThemeProvider, ReplayProvider } from "../../context";
import { ShowcaseEntry } from "../ShowcaseEntry";
import { darkTheme } from "./darkTheme";

/**
 * Theme-variant showcase entry (M5-T4).
 *
 * Renders key atoms (Button, Badge, Slider) and an organism (SceneStage) under a
 * non-default `darkTheme` via `ThemeProvider`, demonstrating that components
 * re-skin purely from the injected tokens. It is thin and dumb — it only wraps
 * existing components in a `ThemeProvider` and reuses core/office data; no new
 * business logic.
 */
export function ThemeVariantShowcase() {
  const scene = useMemo(() => loadOfficeScene(), []);

  return (
    <ShowcaseEntry
      name="Theme variant · dark"
      props="ThemeProvider theme={darkTheme} — components read tokens via useTheme()"
      description="Key atoms and the SceneStage organism re-rendered under an alternate dark theme, with no component changes."
    >
      <ThemeProvider theme={darkTheme}>
        <div className={`space-y-6 p-4 ${darkTheme.tokens.background}`}>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button disabled>Disabled</Button>
            <Badge>Status · online</Badge>
            <Badge tone="muted">muted</Badge>
          </div>
          <Slider value={50} min={0} max={100} onChange={() => {}} ariaLabel="Theme slider" />
          <ReplayProvider scene={scene}>
            <SceneStage
              title="SceneStage · dark theme"
              description="The office scene stage under the dark theme."
              world={scene.staticScene.meta.world}
            />
          </ReplayProvider>
        </div>
      </ThemeProvider>
    </ShowcaseEntry>
  );
}
