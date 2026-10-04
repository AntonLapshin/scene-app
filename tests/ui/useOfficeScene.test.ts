import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useOfficeScene } from "../../src/ui/viewModels/useOfficeScene";
import { loadOfficeScene } from "../../src/data/officeScene";
import { computeInitialState } from "../../src/core/scene";

describe("useOfficeScene (M1-T4b)", () => {
  it("loads the office scene and computes its t=0 render state", () => {
    const { result } = renderHook(() => useOfficeScene());
    const scene = loadOfficeScene();
    const expected = computeInitialState(scene);
    expect(result.current.world).toEqual({ w: 1040, h: 730 });
    expect(result.current.renderState.characters).toEqual(expected.characters);
    expect(result.current.renderState.objects).toEqual(expected.objects);
    expect(result.current.renderState.background).toEqual(expected.background);
  });
});
