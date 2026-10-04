import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import App from "../../src/App";

describe("App (M1-T4c)", () => {
  it("renders the demo panel and the office scene showcase without errors", () => {
    const { container, getByText } = render(<App />);
    // Demo panel present.
    expect(getByText("Scene")).toBeTruthy();
    // Showcase entry present.
    expect(getByText(/SceneView · Office scene at t=0/)).toBeTruthy();
    // The office scene renders as SVG with the world viewBox.
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 1040 730");
    // A visible character is drawn.
    expect(container.querySelector("[data-character='maya']")).not.toBeNull();
  });
});
