import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import {
  ThemeProvider,
  defaultTheme,
  ReplayProvider,
} from "../../../src/ui/context";
import type { Theme, ThemeTokens } from "../../../src/ui/context";
import { Button, Slider, Badge } from "../../../src/ui/components/atoms";
import { CharacterCard } from "../../../src/ui/components/molecules";
import {
  SceneStage,
  PlaybackBar,
  SceneInfoPanel,
} from "../../../src/ui/components/organisms";
import { DemoPanel } from "../../../src/ui/components/DemoPanel";
import { ShowcasePanel } from "../../../src/ui/components/ShowcasePanel";
import { ShowcaseEntry } from "../../../src/ui/showcase";
import { ShowcasePage } from "../../../src/ui/pages/ShowcasePage";
import { AppContent } from "../../../src/App";
import { loadOfficeScene } from "../../../src/data/officeScene";
import { computeInitialState, scenarioDuration } from "../../../src/core/scene";

/** A custom theme with distinctive token classes used to prove theming. */
const customTheme: Theme = {
  name: "custom",
  tokens: {
    primary: "bg-custom-primary text-custom-onPrimary hover:bg-custom-primaryHover disabled:opacity-50",
    secondary: "border border-custom-control text-custom-controlText hover:bg-custom-controlHover disabled:opacity-50",
    accent: "accent-custom-accent",
    link: "text-custom-link underline hover:text-custom-linkHover",
    background: "bg-custom-background",
    surface: "bg-custom-surface",
    surfaceMuted: "bg-custom-surfaceMuted",
    statusPill: "bg-custom-status bg-custom-statusText",
    sayBubble: "bg-custom-say",
    border: "border-custom-border",
    controlBorder: "border-custom-controlBorder",
    foreground: "text-custom-foreground",
    textMuted: "text-custom-muted",
    textSubtle: "text-custom-subtle",
    monoText: "font-mono text-custom-mono",
    radius: "rounded-custom-radius",
    radiusSm: "rounded-custom-sm",
    radiusPill: "rounded-custom-pill",
  },
};

function themed(ui: ReactNode): ReactNode {
  return <ThemeProvider theme={customTheme}>{ui}</ThemeProvider>;
}

function themedWithReplay(ui: ReactNode): ReactNode {
  const scene = loadOfficeScene();
  return (
    <ThemeProvider theme={customTheme}>
      <ReplayProvider scene={scene}>{ui}</ReplayProvider>
    </ThemeProvider>
  );
}


describe("M5-T1 theme-driven styling", () => {
  it("drives Button styling from theme tokens", () => {
    const { container } = render(themed(<div><Button>Primary</Button><Button variant="secondary">Secondary</Button></div>));
    const primary = container.querySelector("button")!;
    expect(primary.className).toContain("bg-custom-primary");
    // secondary button
    const buttons = container.querySelectorAll("button");
    expect(buttons[1].className).toContain("border-custom-control");
  });

  it("drives Slider accent from theme tokens", () => {
    const { getByLabelText } = render(
      themed(<Slider value={0} min={0} max={10} onChange={() => {}} ariaLabel="Seek" />),
    );
    expect((getByLabelText("Seek") as HTMLInputElement).className).toContain(
      "accent-custom-accent",
    );
  });

  it("drives Badge pill and muted tones from theme tokens", () => {
    const { container } = render(
      themed(<div><Badge>Pill</Badge><Badge tone="muted">Muted</Badge></div>),
    );
    const spans = container.querySelectorAll("span");
    expect(spans[0].className).toContain("bg-custom-surfaceMuted");
    expect(spans[0].className).toContain("rounded-custom-pill");
    expect(spans[1].className).toContain("text-custom-muted");
  });

  it("drives CharacterCard colors/radius from theme tokens", () => {
    const scene = loadOfficeScene();
    const character = computeInitialState(scene).characters[0];
    const { container } = render(themed(<CharacterCard character={character} />));
    const card = container.querySelector("[data-character-card]")!;
    expect(card.className).toContain("bg-custom-surface");
    expect(card.className).toContain("border-custom-border");
    expect(card.className).toContain("rounded-custom-radius");
    expect(container.querySelector("[data-palette]")!.className).toContain("rounded-custom-pill");
  });

  it("drives organism card styling from theme tokens", () => {
    const scene = loadOfficeScene();
    const renderState = computeInitialState(scene);
    const duration = scenarioDuration(scene.scenario);
    const { container } = render(
      themedWithReplay(
        <div>
          <SceneStage world={scene.staticScene.meta.world} />
          <PlaybackBar />
          <SceneInfoPanel title="t" style="s" />
        </div>,
      ),
    );
    const sections = container.querySelectorAll("section");
    for (const section of sections) {
      expect(section.className).toContain("bg-custom-surface");
      expect(section.className).toContain("rounded-custom-radius");
    }
    // ReplayContext still drives the organisms.
    expect(container.querySelector("[data-character='maya']")).not.toBeNull();
    expect(container.querySelector("[data-character-card='maya']")).not.toBeNull();
    expect(renderState.characters.length).toBeGreaterThan(0);
    expect(duration).toBeGreaterThan(0);
  });

  it("drives DemoPanel styling (status pill, link, surface) from theme tokens", () => {
    const { container } = render(
      themed(
        <DemoPanel
          projectName="Scene"
          owner="a"
          repo="b"
          status="shipped"
          description="desc"
        />,
      ),
    );
    const section = container.querySelector("section")!;
    expect(section.className).toContain("bg-custom-surface");
    expect(container.querySelector("a")!.className).toContain("text-custom-link");
    expect(container.querySelector("span")!.className).toContain("bg-custom-status");
  });

  it("drives ShowcasePanel and ShowcaseEntry card styling from theme tokens", () => {
    const scene = loadOfficeScene();
    const renderState = computeInitialState(scene);
    const world = scene.staticScene.meta.world;
    const { container } = render(
      themed(
        <div>
          <ShowcasePanel title="T" description="d" renderState={renderState} world={world} />
          <ShowcaseEntry name="B" props="p">x</ShowcaseEntry>
        </div>,
      ),
    );
    const sections = container.querySelectorAll("section");
    for (const section of sections) {
      expect(section.className).toContain("bg-custom-surface");
      expect(section.className).toContain("rounded-custom-radius");
    }
  });

  it("drives ShowcasePage headings from theme tokens", () => {
    const scene = loadOfficeScene();
    const { container } = render(themed(<ShowcasePage scene={scene} />));
    const h1 = container.querySelector("h1")!;
    expect(h1.className).toContain("text-custom-foreground");
    const h2s = container.querySelectorAll("h2");
    for (const h2 of h2s) {
      expect(h2.className).toContain("text-custom-foreground");
    }
  });

  it("drives the app background from theme tokens", () => {
    const { container } = render(themed(<AppContent />));
    const main = container.querySelector("main")!;
    expect(main.className).toContain("bg-custom-background");
  });

  it("defaults to defaultTheme tokens when no ThemeProvider is mounted", () => {
    const { container } = render(<Button>Go</Button>);
    const btn = container.querySelector("button")!;
    expect(btn.className).toContain("bg-indigo-600");
    expect(defaultTheme.name).toBe("default");
    expect(defaultTheme.tokens.primary).toContain("bg-indigo-600");
  });

  it("exposes every styling token on the default theme surface", () => {
    const tokens: ThemeTokens = defaultTheme.tokens;
    const keys: (keyof ThemeTokens)[] = [
      "primary", "secondary", "accent", "link",
      "background", "surface", "surfaceMuted", "statusPill", "sayBubble",
      "border", "controlBorder",
      "foreground", "textMuted", "textSubtle", "monoText",
      "radius", "radiusSm", "radiusPill",
    ];
    for (const key of keys) {
      expect(typeof tokens[key]).toBe("string");
      expect(tokens[key].length).toBeGreaterThan(0);
    }
  });
});
