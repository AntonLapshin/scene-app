import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import {
  PlaybackControlsMolecule,
  CharacterCard,
  TimelineScrubber,
} from "../../../src/ui/components/molecules";
import type { CharacterState } from "../../../src/core/scene";

const maya: CharacterState = {
  id: "maya",
  name: "Maya",
  role: "New hire",
  color: "#4f7cff",
  x: 300,
  y: 400,
  dir: "down",
  emotion: "happy",
  visible: true,
  prop: null,
  look: {
    skin: "#f2c79b",
    skin2: "#e8b58a",
    hair: "#5b3a1e",
    hairStyle: "bob",
    shirt: "#4f7cff",
    shirt2: "#7fb6ff",
    pants: "#2b3550",
    shoes: "#222",
  },
};

describe("PlaybackControlsMolecule (M4-T2)", () => {
  const baseProps = {
    isPlaying: false,
    timestamp: 0,
    duration: 41,
    onToggle: vi.fn(),
    onSeek: vi.fn(),
    onStepBackward: vi.fn(),
    onStepForward: vi.fn(),
  };

  it("composes play/pause, step, seek, and time display atoms", () => {
    const { getByLabelText, getByText } = render(
      <PlaybackControlsMolecule {...baseProps} />,
    );
    expect(getByLabelText("Play")).toBeTruthy();
    expect(getByLabelText("Step forward")).toBeTruthy();
    expect(getByLabelText("Step backward")).toBeTruthy();
    expect(getByLabelText("Seek")).toBeTruthy();
    expect(getByText("0.0s / 41.0s")).toBeTruthy();
  });

  it("shows Pause when playing and forwards interactions", () => {
    const onToggle = vi.fn();
    const onSeek = vi.fn();
    const { getByLabelText, getByText } = render(
      <PlaybackControlsMolecule {...baseProps} isPlaying onToggle={onToggle} onSeek={onSeek} />,
    );
    expect(getByLabelText("Pause")).toBeTruthy();
    expect(getByText("Pause")).toBeTruthy();
    fireEvent.click(getByLabelText("Pause"));
    expect(onToggle).toHaveBeenCalledTimes(1);
    fireEvent.change(getByLabelText("Seek"), { target: { value: "12.5" } });
    expect(onSeek).toHaveBeenCalledWith(12.5);
  });

  it("clamps the displayed timestamp to [0, duration]", () => {
    const { getByText } = render(
      <PlaybackControlsMolecule {...baseProps} timestamp={999} />,
    );
    expect(getByText("41.0s / 41.0s")).toBeTruthy();
  });
});

describe("TimelineScrubber (M4-T2)", () => {
  it("renders a seekable slider with a time readout", () => {
    const onChange = vi.fn();
    const { getByLabelText, getByText } = render(
      <TimelineScrubber value={10} duration={41} onChange={onChange} ariaLabel="Scrub" />,
    );
    const slider = getByLabelText("Scrub") as HTMLInputElement;
    expect(slider.type).toBe("range");
    expect(slider.min).toBe("0");
    expect(slider.max).toBe("41");
    expect(getByText("10.0s / 41.0s")).toBeTruthy();
    fireEvent.change(slider, { target: { value: "20" } });
    expect(onChange).toHaveBeenCalledWith(20);
  });

  it("defaults the accessible label to Timeline and clamps the value", () => {
    const { getByLabelText, getByText } = render(
      <TimelineScrubber value={999} duration={41} onChange={() => {}} />,
    );
    expect(getByLabelText("Timeline")).toBeTruthy();
    expect(getByText("41.0s / 41.0s")).toBeTruthy();
  });
});

describe("CharacterCard (M4-T2)", () => {
  it("renders name, role, emotion, look palette and sprite via Sprite", () => {
    const { container, getByText } = render(<CharacterCard character={maya} />);
    expect(getByText("Maya")).toBeTruthy();
    expect(getByText("New hire")).toBeTruthy();
    expect(container.textContent).toContain("Emotion: happy");
    // look palette swatches
    expect(container.querySelector("[data-palette='shirt']")).toBeTruthy();
    expect(container.querySelector("[data-palette='pants']")).toBeTruthy();
    expect(container.querySelector("[data-palette='skin']")).toBeTruthy();
    // sprite rendered via Sprite (head ellipse + glyph text)
    expect(container.querySelector("ellipse")).toBeTruthy();
    expect(container.querySelector("text")).toBeTruthy();
  });

  it("renders the say bubble when the character is speaking", () => {
    const speaking: CharacterState = {
      ...maya,
      say: { text: "Hello!", kind: "say", emotion: "happy" as const, until: 42 },
    };
    const { getByText, container } = render(<CharacterCard character={speaking} />);
    expect(getByText(/“Hello!”/)).toBeTruthy();
    expect(container.querySelector("[data-say-bubble]")).toBeTruthy();
  });

  it("omits the say bubble when the character is not speaking", () => {
    const { container } = render(<CharacterCard character={maya} />);
    expect(container.querySelector("[data-say-bubble]")).toBeNull();
  });
});
