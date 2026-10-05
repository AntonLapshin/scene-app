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
});
