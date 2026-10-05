import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import App from "../../src/App";

describe("App (M4-T3)", () => {
  it("renders the demo panel and the PlaybackPage composing the organisms", () => {
    const { container, getByText, getByLabelText } = render(<App />);
    // Demo panel present.
    expect(getByText("Scene")).toBeTruthy();
    // SceneStage organism present with the office scene SVG.
    expect(getByText(/SceneView · Office scene playback/)).toBeTruthy();
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 1040 730");
    // A visible character is drawn on the stage.
    expect(container.querySelector("[data-character='maya']")).not.toBeNull();
    // PlaybackBar organism present.
    expect(getByText("Playback controls")).toBeTruthy();
    expect(getByLabelText("Play")).toBeTruthy();
    expect(getByLabelText("Timeline")).toBeTruthy();
    // SceneInfoPanel organism present with character cards.
    expect(getByText("Scene info")).toBeTruthy();
    expect(container.querySelector("[data-character-card='maya']")).not.toBeNull();
  });

  it("renders a clear error state (not a crash) when the scene JSON is malformed", () => {
    const malformed = {
      staticScene: { ...{} },
      liveScene: {},
      scenario: {},
    };
    const { container, getByText } = render(<App rawScene={malformed} />);
    expect(getByText("Scene failed to load")).toBeTruthy();
    const pre = container.querySelector("[data-error-message]");
    expect(pre).not.toBeNull();
    expect(pre!.textContent).toContain("must be");
    // No playback UI is rendered when the scene failed to load.
    expect(container.querySelector("[data-character='maya']")).toBeNull();
  });
});
