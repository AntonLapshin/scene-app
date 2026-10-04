import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SceneView } from "../../src/ui/components/SceneView";
import { loadOfficeScene } from "../../src/data/officeScene";
import { computeInitialState } from "../../src/core/scene";

/** The real office scene's t=0 render state + world, as the app uses it. */
function officeRender() {
  const scene = loadOfficeScene();
  return {
    renderState: computeInitialState(scene),
    world: scene.staticScene.meta.world,
  };
}

describe("SceneView", () => {
  it("renders the scene svg with the world viewBox", () => {
    const { renderState, world } = officeRender();
    const { container } = render(<SceneView renderState={renderState} world={world} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 1040 730");
    expect(svg).toHaveAttribute("width", "1040");
  });

  it("renders the floor, corridor, walls, windows, door, decals and light patches", () => {
    const { renderState, world } = officeRender();
    const { container } = render(<SceneView renderState={renderState} world={world} />);
    expect(container.querySelector("rect[fill='#efe3cf']")).not.toBeNull();
    expect(container.querySelector("rect[fill='#1b2438']")).not.toBeNull();
    expect(container.querySelector("[data-wall]")).not.toBeNull();
    expect(container.querySelector("polygon")).not.toBeNull();
    expect(container.querySelector("text")).not.toBeNull();
    expect(container.querySelector("svg")).toHaveAttribute("role", "img");
  });

  it("renders visible characters with their look palette and emotion", () => {
    const { renderState, world } = officeRender();
    const { container } = render(<SceneView renderState={renderState} world={world} />);
    const maya = renderState.characters.find((c) => c.id === "maya")!;
    const g = container.querySelector(`[data-character="${maya.id}"]`)!;
    expect(g).not.toBeNull();
    expect(g.querySelectorAll("rect")).toHaveLength(6); // pants/shoes + torso/shirt2/shirt
    expect(g.querySelectorAll("circle")).toHaveLength(1); // head
    // emotion glyph rendered
    expect(g.querySelector("text")!.textContent).toBeTruthy();
  });

  it("renders external image assets as <image> when available", () => {
    const { renderState, world } = officeRender();
    const asset = { ...renderState.objects[0].asset!, image: "/sprite.png" };
    const { container } = render(
      <SceneView
        renderState={{ ...renderState, objects: [{ kind: "asset", sortKey: 0, asset }] }}
        world={world}
        imageAvailable={(src) => src === "/sprite.png"}
      />,
    );
    expect(container.querySelector("image")).not.toBeNull();
    expect(container.querySelector("image")).toHaveAttribute("href", "/sprite.png");
  });

  it("falls back to procedural drawing when an image is unavailable", () => {
    const { renderState, world } = officeRender();
    const asset = { ...renderState.objects[0].asset!, image: "/missing.png" };
    const { container } = render(
      <SceneView
        renderState={{ ...renderState, objects: [{ kind: "asset", sortKey: 0, asset }] }}
        world={world}
        imageAvailable={() => false}
      />,
    );
    expect(container.querySelector("image")).toBeNull();
    expect(container.querySelector("rect")).not.toBeNull();
  });
});
