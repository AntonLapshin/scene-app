import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  SceneStage,
  PlaybackBar,
  SceneInfoPanel,
} from "../../../src/ui/components/organisms";
import { ReplayContext } from "../../../src/ui/context";
import type { ReplayContextValue } from "../../../src/ui/context";
import { loadOfficeScene } from "../../../src/data/officeScene";
import { computeInitialState, scenarioDuration } from "../../../src/core/scene";

function officeScene() {
  const scene = loadOfficeScene();
  return {
    scene,
    renderState: computeInitialState(scene),
    world: scene.staticScene.meta.world,
    duration: scenarioDuration(scene.scenario),
  };
}

function contextValue(overrides: Partial<ReplayContextValue> = {}): ReplayContextValue {
  const { renderState, duration } = officeScene();
  return {
    timestamp: 0,
    duration,
    isPlaying: false,
    renderState,
    seek: vi.fn(),
    toggle: vi.fn(),
    stepForward: vi.fn(),
    stepBackward: vi.fn(),
    ...overrides,
  };
}

/** Render `ui` with a `ReplayContext.Provider` carrying `value`. */
function renderWithReplay(ui: ReactNode, value: ReplayContextValue) {
  return render(<ReplayContext.Provider value={value}>{ui}</ReplayContext.Provider>);
}

describe("SceneStage organism (M4-T3, M4-T4)", () => {
  it("renders the SceneView stage reading renderState from context", () => {
    const { renderState, world } = officeScene();
    const { container, getByText } = renderWithReplay(
      <SceneStage
        title="Stage"
        description="The scene stage."
        world={world}
      />,
      contextValue({ renderState }),
    );
    expect(getByText("Stage")).toBeTruthy();
    expect(getByText(/The scene stage/)).toBeTruthy();
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 1040 730");
    expect(container.querySelector("[data-character='maya']")).not.toBeNull();
  });

  it("defaults the title to Scene stage and omits the description when absent", () => {
    const { world } = officeScene();
    const { getByText, queryByText } = renderWithReplay(
      <SceneStage world={world} />,
      contextValue(),
    );
    expect(getByText("Scene stage")).toBeTruthy();
    expect(queryByText(/description/i)).toBeNull();
  });

  it("constrains and centers the stage to fit the container without overflowing", () => {
    const { world } = officeScene();
    const { container } = renderWithReplay(<SceneStage world={world} />, contextValue());
    const stage = container.querySelector("section")!;
    // Responsive section padding (tighter on mobile, roomier on larger screens).
    expect(stage.className).toContain("p-4");
    expect(stage.className).toContain("sm:p-6");
    // The SceneView wrapper constrains + centers the stage and clips overflow.
    const wrapper = Array.from(stage.querySelectorAll("div")).find((d) =>
      d.className.includes("max-w-4xl"),
    )!;
    expect(wrapper.className).toContain("mx-auto");
    expect(wrapper.className).toContain("w-full");
    expect(wrapper.className).toContain("overflow-hidden");
    // The stage SVG keeps its aspect-ratio behavior (h-auto w-full).
    const svgClass = wrapper.querySelector("svg")!.getAttribute("class")!;
    expect(svgClass).toContain("h-auto");
    expect(svgClass).toContain("w-full");
  });
});

describe("PlaybackBar organism (M4-T3, M4-T4)", () => {
  it("composes the controls molecule, timeline scrubber and time readout from context", () => {
    const value = contextValue({ timestamp: 12.5, isPlaying: true });
    const { getByLabelText, getByText, getAllByText } = renderWithReplay(
      <PlaybackBar />,
      value,
    );
    expect(getByText("Playback controls")).toBeTruthy();
    // Controls molecule.
    expect(getByLabelText("Pause")).toBeTruthy();
    expect(getByLabelText("Step forward")).toBeTruthy();
    expect(getByLabelText("Step backward")).toBeTruthy();
    // Timeline scrubber.
    expect(getByLabelText("Timeline")).toBeTruthy();
    // Time/duration readout (also shown by the molecule + scrubber).
    expect(getAllByText("12.5s / 41.0s").length).toBeGreaterThan(0);
  });

  it("forwards driver interactions from context to the callbacks", () => {
    const toggle = vi.fn();
    const seek = vi.fn();
    const stepForward = vi.fn();
    const stepBackward = vi.fn();
    const value = contextValue({ toggle, seek, stepForward, stepBackward });
    const { getByLabelText } = renderWithReplay(<PlaybackBar />, value);
    fireEvent.click(getByLabelText("Play"));
    expect(toggle).toHaveBeenCalledTimes(1);
    fireEvent.click(getByLabelText("Step forward"));
    expect(stepForward).toHaveBeenCalledTimes(1);
    fireEvent.click(getByLabelText("Step backward"));
    expect(stepBackward).toHaveBeenCalledTimes(1);
    fireEvent.change(getByLabelText("Timeline"), { target: { value: "20" } });
    expect(seek).toHaveBeenCalledWith(20);
  });

  it("lays out its section responsively and wraps the time readout", () => {
    const { container } = renderWithReplay(<PlaybackBar />, contextValue());
    const section = container.querySelector("section")!;
    expect(section.className).toContain("p-4");
    expect(section.className).toContain("sm:p-6");
    const readout = Array.from(section.querySelectorAll("div")).find((d) =>
      d.className.includes("flex-wrap") && d.className.includes("gap-2"),
    )!;
    expect(readout).toBeTruthy();
  });
});

describe("SceneInfoPanel organism (M4-T3, M4-T4)", () => {
  it("renders metadata badges and a CharacterCard per visible character from context", () => {
    const { renderState, duration } = officeScene();
    const { container, getByText, getAllByText } = renderWithReplay(
      <SceneInfoPanel title="Northlight Studio · Floor 3" style="gem-flat 2.5D" />,
      contextValue({ renderState, duration }),
    );
    expect(getByText("Scene info")).toBeTruthy();
    // Metadata badges.
    expect(getByText("Northlight Studio · Floor 3")).toBeTruthy();
    expect(getByText("gem-flat 2.5D")).toBeTruthy();
    expect(getByText("41.0s")).toBeTruthy();
    // Character count badge matches the visible characters.
    expect(getByText(`${renderState.characters.length} characters`)).toBeTruthy();
    // One CharacterCard per visible character.
    expect(container.querySelectorAll("[data-character-card]").length).toBe(
      renderState.characters.length,
    );
    expect(getAllByText("Maya").length).toBeGreaterThan(0);
  });

  it("renders an empty panel when the context has no visible characters", () => {
    const { duration } = officeScene();
    const { getByText } = renderWithReplay(
      <SceneInfoPanel title="t" style="s" />,
      contextValue({ renderState: { ...officeScene().renderState, characters: [] }, duration }),
    );
    expect(getByText("0 characters")).toBeTruthy();
  });

  it("uses responsive section padding and wraps its content rows", () => {
    const { renderState, duration } = officeScene();
    const { container } = renderWithReplay(
      <SceneInfoPanel title="t" style="s" />,
      contextValue({ renderState, duration }),
    );
    const section = container.querySelector("section")!;
    expect(section.className).toContain("p-4");
    expect(section.className).toContain("sm:p-6");
    // Metadata badges and character cards rows wrap on narrow widths.
    const rows = Array.from(section.querySelectorAll("div"))
      .filter((d) => d.className.includes("flex-wrap"));
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });
});
