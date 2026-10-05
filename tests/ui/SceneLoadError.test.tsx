import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SceneLoadError } from "../../src/ui/components/SceneLoadError";

describe("SceneLoadError (M5-T2)", () => {
  it("renders a clear user-facing heading and the descriptive message", () => {
    const { getByText, container } = render(
      <SceneLoadError message="scenario must be an object" />,
    );
    expect(getByText("Scene failed to load")).toBeTruthy();
    expect(container.querySelector("[data-scene-load-error]")).not.toBeNull();
    const pre = container.querySelector("[data-error-message]")!;
    expect(pre.textContent).toContain("scenario must be an object");
  });

  it("renders the message verbatim (including paths) so the failure is diagnosable", () => {
    const { container } = render(
      <SceneLoadError message="staticScene.floor.x must be a number" />,
    );
    expect(container.querySelector("[data-error-message]")!.textContent).toBe(
      "staticScene.floor.x must be a number",
    );
  });
});
