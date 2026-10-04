import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ShowcasePanel } from "../../src/ui/components/ShowcasePanel";
import { loadOfficeScene } from "../../src/data/officeScene";
import { computeInitialState } from "../../src/core/scene";

function officeRender() {
  const scene = loadOfficeScene();
  return {
    renderState: computeInitialState(scene),
    world: scene.staticScene.meta.world,
  };
}

describe("ShowcasePanel (M1-T4c)", () => {
  it("renders title, description and the SceneView", () => {
    const { renderState, world } = officeRender();
    const { container, getByText } = render(
      <ShowcasePanel
        title="SceneView · Office scene at t=0"
        description="The office scene rendered at timestamp 0."
        renderState={renderState}
        world={world}
      />,
    );
    expect(getByText("SceneView · Office scene at t=0")).toBeTruthy();
    expect(getByText(/The office scene rendered at timestamp 0/)).toBeTruthy();
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 1040 730");
    expect(container.querySelector("[data-character='maya']")).not.toBeNull();
  });

  it("lists the SceneView props", () => {
    const { renderState, world } = officeRender();
    const { getByText } = render(
      <ShowcasePanel
        title="t"
        description="d"
        renderState={renderState}
        world={world}
      />,
    );
    expect(getByText(/renderState · world · imageAvailable/)).toBeTruthy();
  });
});
