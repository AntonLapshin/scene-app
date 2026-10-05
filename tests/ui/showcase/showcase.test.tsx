import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ShowcasePage } from "../../../src/ui/pages/ShowcasePage";
import { ShowcaseEntry } from "../../../src/ui/showcase";
import { loadOfficeScene } from "../../../src/data/officeScene";
import App from "../../../src/App";

describe("ShowcaseEntry (M4-T5)", () => {
  it("renders name, props signature, description and children", () => {
    const { getByText, getByRole } = render(
      <ShowcaseEntry name="Button" props="variant? · onClick?" description="A button.">
        <button type="button">Demo</button>
      </ShowcaseEntry>,
    );
    expect(getByText("Button")).toBeTruthy();
    expect(getByText(/variant\? · onClick\?/)).toBeTruthy();
    expect(getByText("A button.")).toBeTruthy();
    expect(getByRole("button", { name: "Demo" })).toBeTruthy();
  });
});

describe("ShowcasePage (M4-T5)", () => {
  const scene = loadOfficeScene();

  it("lists a showcase entry for every atom, molecule and organism", () => {
    const { container } = render(<ShowcasePage scene={scene} />);
    const names = [
      "Button",
      "Slider",
      "Badge",
      "Sprite",
      "PlaybackControlsMolecule",
      "CharacterCard",
      "TimelineScrubber",
      "SceneStage",
      "PlaybackBar",
      "SceneInfoPanel",
    ];
    for (const name of names) {
      expect(container.querySelector(`[data-showcase='${name}']`)).not.toBeNull();
    }
  });

  it("shows representative states for the atom entries", () => {
    const { container } = render(<ShowcasePage scene={scene} />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(3); // primary, secondary, disabled
    const ranges = container.querySelectorAll('input[type="range"]');
    expect(ranges.length).toBeGreaterThanOrEqual(3); // slider min/mid/max
    // Sprite image vs procedural fallback.
    expect(container.querySelector("image")).not.toBeNull();
    expect(container.querySelectorAll("rect").length).toBeGreaterThan(0);
  });

  it("shows representative states for the molecule entries", () => {
    const { getAllByLabelText, getAllByText } = render(<ShowcasePage scene={scene} />);
    // PlaybackControlsMolecule.
    expect(getAllByLabelText("Play").length).toBeGreaterThan(0);
    expect(getAllByLabelText("Step forward").length).toBeGreaterThan(0);
    // TimelineScrubber.
    expect(getAllByLabelText("Timeline").length).toBeGreaterThan(0);
    // CharacterCard (first office character).
    expect(getAllByText("Maya").length).toBeGreaterThan(0);
  });

  it("shows the organism entries reading from ReplayContext", () => {
    const { container, getByText, getAllByText } = render(<ShowcasePage scene={scene} />);
    // SceneStage renders the office scene SVG.
    const stage = container.querySelector("[data-showcase='SceneStage']")!;
    const svg = stage.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 1040 730");
    expect(container.querySelector("[data-character='maya']")).not.toBeNull();
    // PlaybackBar.
    expect(getByText("Playback controls")).toBeTruthy();
    // SceneInfoPanel with character cards + metadata.
    expect(getByText("Scene info")).toBeTruthy();
    expect(container.querySelector("[data-character-card='maya']")).not.toBeNull();
    expect(getAllByText("Maya").length).toBeGreaterThan(0);
  });

  it("retains and integrates the ShowcasePanel (SceneView) entry", () => {
    const { getByText, container } = render(<ShowcasePage scene={scene} />);
    expect(getByText("SceneView · Office scene at t=0")).toBeTruthy();
    expect(container.querySelector("[data-character='maya']")).not.toBeNull();
  });
});

describe("App showcase navigation (M4-T5)", () => {
  it("toggles between the playback page and the showcase page", () => {
    const { getByLabelText, getByText, queryByText } = render(<App />);
    // Defaults to playback.
    expect(getByText(/SceneView · Office scene playback/)).toBeTruthy();
    expect(queryByText("Component showcase")).toBeNull();

    fireEvent.click(getByLabelText("Show showcase"));
    expect(getByText("Component showcase")).toBeTruthy();
    expect(getByText("Button")).toBeTruthy();
    expect(getByText("Molecules")).toBeTruthy();

    fireEvent.click(getByLabelText("Show playback"));
    expect(queryByText("Component showcase")).toBeNull();
    expect(getByText(/SceneView · Office scene playback/)).toBeTruthy();
  });
});
