import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PlaybackPage } from "../../../src/ui/pages/PlaybackPage";
import { ReplayProvider } from "../../../src/ui/context/ReplayProvider";
import { loadOfficeScene } from "../../../src/data/officeScene";

describe("PlaybackPage (M4-T3, M4-T4)", () => {
  it("composes the three organisms reading replay state from context", () => {
    const scene = loadOfficeScene();
    const { container, getByText, getByLabelText, getAllByText } = render(
      <ReplayProvider scene={scene}>
        <PlaybackPage scene={scene} />
      </ReplayProvider>,
    );

    // SceneStage.
    expect(getByText(/SceneView · Office scene playback/)).toBeTruthy();
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 1040 730");
    expect(container.querySelector("[data-character='maya']")).not.toBeNull();

    // PlaybackBar.
    expect(getByText("Playback controls")).toBeTruthy();
    expect(getByLabelText("Play")).toBeTruthy();
    expect(getByLabelText("Timeline")).toBeTruthy();
    expect(getAllByText("0.0s / 41.0s").length).toBeGreaterThan(0);

    // SceneInfoPanel with character cards + metadata.
    expect(getByText("Scene info")).toBeTruthy();
    expect(container.querySelector("[data-character-card='maya']")).not.toBeNull();
    expect(getByText("Northlight Studio · Floor 3")).toBeTruthy();
  });
});
