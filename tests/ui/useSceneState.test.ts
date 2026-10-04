import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSceneState } from "../../src/ui/viewModels/useSceneState";
import { loadOfficeScene } from "../../src/data/officeScene";
import { computeSceneState } from "../../src/core/scene";

describe("useSceneState (M2-T4)", () => {
  it("returns the core computeSceneState result for a scene + timestamp", () => {
    const scene = loadOfficeScene();
    const { result } = renderHook(() => useSceneState(scene, 4));
    const expected = computeSceneState(scene, 4);
    expect(result.current).toEqual(expected);
  });

  it("recomputes when the timestamp changes", () => {
    const scene = loadOfficeScene();
    const { result, rerender } = renderHook(
      ({ ts }: { ts: number }) => useSceneState(scene, ts),
      { initialProps: { ts: 0 } },
    );
    const atZero = computeSceneState(scene, 0);
    expect(result.current).toEqual(atZero);
    rerender({ ts: 10 });
    expect(result.current).toEqual(computeSceneState(scene, 10));
    // The state actually changed with the new timestamp.
    expect(result.current).not.toEqual(atZero);
  });

  it("recomputes when the scene changes", () => {
    const sceneA = loadOfficeScene();
    const { result, rerender } = renderHook(
      ({ scene }: { scene: ReturnType<typeof loadOfficeScene> }) =>
        useSceneState(scene, 0),
      { initialProps: { scene: sceneA } },
    );
    const atZeroA = computeSceneState(sceneA, 0);
    expect(result.current).toEqual(atZeroA);

    // A scene with the same shape but a different character count.
    const sceneB = {
      ...sceneA,
      liveScene: {
        ...sceneA.liveScene,
        characters: sceneA.liveScene.characters.filter((c) => c.id === "maya"),
      },
    } as ReturnType<typeof loadOfficeScene>;
    rerender({ scene: sceneB });
    expect(result.current).toEqual(computeSceneState(sceneB, 0));
    expect(result.current.characters.map((c) => c.id)).toEqual(["maya"]);
  });
});
