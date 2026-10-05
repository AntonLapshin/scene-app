import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import {
  SceneStage,
  PlaybackBar,
  SceneInfoPanel,
} from "../../../src/ui/components/organisms";
import { loadOfficeScene } from "../../../src/data/officeScene";
import { computeInitialState, scenarioDuration } from "../../../src/core/scene";
import type { ReplayDriverResult } from "../../../src/ui/viewModels/useReplayDriver";

function officeScene() {
  const scene = loadOfficeScene();
  return {
    scene,
    renderState: computeInitialState(scene),
    world: scene.staticScene.meta.world,
    duration: scenarioDuration(scene.scenario),
  };
}

function driverResult(overrides: Partial<ReplayDriverResult> = {}): ReplayDriverResult {
  const { renderState, duration } = officeScene();
  return {
    timestamp: 0,
    duration,
    renderState,
    isPlaying: false,
    play: vi.fn(),
    pause: vi.fn(),
    toggle: vi.fn(),
    seek: vi.fn(),
    stepForward: vi.fn(),
    stepBackward: vi.fn(),
    ...overrides,
  };
}

describe("SceneStage organism (M4-T3)", () => {
  it("renders the SceneView stage with the world viewBox and a visible character", () => {
    const { renderState, world } = officeScene();
    const { container, getByText } = render(
      <SceneStage
        title="Stage"
        description="The scene stage."
        renderState={renderState}
        world={world}
      />,
    );
    expect(getByText("Stage")).toBeTruthy();
    expect(getByText(/The scene stage/)).toBeTruthy();
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 1040 730");
    expect(container.querySelector("[data-character='maya']")).not.toBeNull();
  });

  it("defaults the title to Scene stage and omits the description when absent", () => {
    const { renderState, world } = officeScene();
    const { getByText, queryByText } = render(
      <SceneStage renderState={renderState} world={world} />,
    );
    expect(getByText("Scene stage")).toBeTruthy();
    expect(queryByText(/description/i)).toBeNull();
  });
});

describe("PlaybackBar organism (M4-T3)", () => {
  it("composes the controls molecule, timeline scrubber and time readout", () => {
    const driver = driverResult({ timestamp: 12.5, isPlaying: true });
    const { getByLabelText, getByText, getAllByText } = render(<PlaybackBar driver={driver} />);
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

  it("forwards driver interactions to the callbacks", () => {
    const toggle = vi.fn();
    const seek = vi.fn();
    const stepForward = vi.fn();
    const stepBackward = vi.fn();
    const driver = driverResult({ toggle, seek, stepForward, stepBackward });
    const { getByLabelText } = render(<PlaybackBar driver={driver} />);
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

describe("SceneInfoPanel organism (M4-T3)", () => {
  it("renders metadata badges and a CharacterCard per visible character", () => {
    const { renderState, duration } = officeScene();
    const { container, getByText, getAllByText } = render(
      <SceneInfoPanel
        characters={renderState.characters}
        title="Northlight Studio · Floor 3"
        style="gem-flat 2.5D"
        duration={duration}
      />,
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

  it("renders an empty panel when there are no visible characters", () => {
    const { duration } = officeScene();
    const { getByText } = render(
      <SceneInfoPanel characters={[]} title="t" style="s" duration={duration} />,
    );
    expect(getByText("0 characters")).toBeTruthy();
  });
});
