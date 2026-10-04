import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { PlaybackControls } from "../../src/ui/components/PlaybackControls";

describe("PlaybackControls (M3-T2)", () => {
  const baseProps = {
    isPlaying: false,
    timestamp: 0,
    duration: 41,
    onToggle: vi.fn(),
    onSeek: vi.fn(),
    onStepBackward: vi.fn(),
    onStepForward: vi.fn(),
  };

  it("renders play/pause, step, seek, and time display", () => {
    const { getByLabelText, getByText } = render(
      <PlaybackControls {...baseProps} />,
    );
    expect(getByLabelText("Play")).toBeTruthy();
    expect(getByLabelText("Step forward")).toBeTruthy();
    expect(getByLabelText("Step backward")).toBeTruthy();
    expect(getByLabelText("Seek")).toBeTruthy();
    expect(getByText("0.0s / 41.0s")).toBeTruthy();
  });

  it("shows Pause when playing", () => {
    const { getByLabelText, getByText } = render(
      <PlaybackControls {...baseProps} isPlaying />,
    );
    expect(getByLabelText("Pause")).toBeTruthy();
    expect(getByText("Pause")).toBeTruthy();
  });

  it("calls onToggle when the play/pause button is clicked", () => {
    const onToggle = vi.fn();
    const { getByLabelText } = render(
      <PlaybackControls {...baseProps} onToggle={onToggle} />,
    );
    fireEvent.click(getByLabelText("Play"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onStepForward / onStepBackward on button clicks", () => {
    const onStepForward = vi.fn();
    const onStepBackward = vi.fn();
    const { getByLabelText } = render(
      <PlaybackControls
        {...baseProps}
        onStepForward={onStepForward}
        onStepBackward={onStepBackward}
      />,
    );
    fireEvent.click(getByLabelText("Step forward"));
    expect(onStepForward).toHaveBeenCalledTimes(1);
    fireEvent.click(getByLabelText("Step backward"));
    expect(onStepBackward).toHaveBeenCalledTimes(1);
  });

  it("calls onSeek with the numeric slider value", () => {
    const onSeek = vi.fn();
    const { getByLabelText } = render(
      <PlaybackControls {...baseProps} onSeek={onSeek} />,
    );
    fireEvent.change(getByLabelText("Seek"), { target: { value: "12.5" } });
    expect(onSeek).toHaveBeenCalledWith(12.5);
  });

  it("clamps the displayed timestamp to [0, duration]", () => {
    const { getByText } = render(
      <PlaybackControls {...baseProps} timestamp={999} />,
    );
    expect(getByText("41.0s / 41.0s")).toBeTruthy();
  });
});
