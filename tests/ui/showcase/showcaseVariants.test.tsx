import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ShowcasePage } from "../../../src/ui/pages/ShowcasePage";
import {
  ThemeVariantShowcase,
  darkTheme,
} from "../../../src/ui/showcase/variants";
import {
  SceneLoadErrorShowcase,
  EmptyTimelineShowcase,
  OutOfRangeShowcase,
} from "../../../src/ui/showcase/edge";
import { loadOfficeScene } from "../../../src/data/officeScene";

describe("ThemeVariantShowcase (M5-T4)", () => {
  it("renders key atoms under the alternate theme", () => {
    const { container } = render(<ThemeVariantShowcase />);
    // Primary, secondary, disabled buttons.
    expect(container.querySelectorAll("button").length).toBeGreaterThanOrEqual(3);
    // Badges.
    expect(container.querySelectorAll("span").length).toBeGreaterThan(0);
    // Slider.
    expect(container.querySelector('input[type="range"]')).not.toBeNull();
    // SceneStage organism renders the office scene SVG.
    const svg = container.querySelector("svg[viewBox='0 0 1040 730']");
    expect(svg).not.toBeNull();
  });

  it("exposes a dark theme with non-default tokens", () => {
    expect(darkTheme.name).toBe("dark");
    expect(darkTheme.tokens.primary).toContain("bg-indigo-500");
    expect(darkTheme.tokens.surface).toContain("bg-slate-800");
    expect(darkTheme.tokens.foreground).toContain("text-slate-100");
    // Alternate surface vs default.
    expect(darkTheme.tokens.surface).not.toBe("bg-white");
  });
});

describe("SceneLoadErrorShowcase (M5-T4)", () => {
  it("renders the error panel with a descriptive message", () => {
    const { container, getByText } = render(<SceneLoadErrorShowcase />);
    expect(container.querySelector("[data-scene-load-error]")).not.toBeNull();
    expect(getByText(/staticScene\.floor must be an object/)).toBeTruthy();
    expect(container.querySelector("[data-error-message]")).not.toBeNull();
  });
});

describe("EmptyTimelineShowcase (M5-T4)", () => {
  it("renders the initial state with no events fired", () => {
    const { container, getByText } = render(<EmptyTimelineShowcase />);
    expect(getByText("Empty timeline · initial state")).toBeTruthy();
    expect(container.querySelector("svg[viewBox]")).not.toBeNull();
    // Noah is not visible yet in the initial state (he appears at 0.7s).
    expect(container.querySelector("[data-character='noah']")).toBeNull();
    expect(container.querySelector("[data-character='maya']")).not.toBeNull();
  });
});

describe("OutOfRangeShowcase (M5-T4)", () => {
  it("renders the clamped end-of-timeline state", () => {
    const { container, getByText } = render(<OutOfRangeShowcase />);
    expect(getByText(/End of timeline · t ≥ 41s/)).toBeTruthy();
    // All events fired → Noah visible at his desk.
    expect(container.querySelector("[data-character='noah']")).not.toBeNull();
    expect(container.querySelector("svg[viewBox]")).not.toBeNull();
  });
});

describe("ShowcasePage integration (M5-T4)", () => {
  const scene = loadOfficeScene();

  it("lists the new theme-variant and edge-state entries with titles", () => {
    const { container, getByText } = render(<ShowcasePage scene={scene} />);
    expect(getByText("Theme variants")).toBeTruthy();
    expect(getByText("Edge states")).toBeTruthy();
    for (const name of [
      "Theme variant · dark",
      "SceneLoadError",
      "Empty timeline",
      "Out-of-range timestamp",
    ]) {
      expect(container.querySelector(`[data-showcase='${name}']`)).not.toBeNull();
    }
  });
});
