import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { Component } from "react";
import { renderHook, act, render } from "@testing-library/react";
import {
  ReplayProvider,
  useReplay,
  ThemeProvider,
  useTheme,
  defaultTheme,
} from "../../../src/ui/context";
import type { Theme } from "../../../src/ui/context";
import { loadOfficeScene } from "../../../src/data/officeScene";
import { computeSceneState, scenarioDuration } from "../../../src/core/scene";

const scene = loadOfficeScene();
const duration = scenarioDuration(scene.scenario);

interface ErrorBoundaryProps {
  onError: (error: Error) => void;
  children: ReactNode;
}

/** Captures a render error instead of letting it escape the test. */
class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

describe("ReplayProvider + useReplay (M4-T4)", () => {
  it("injects the initial replay state (timestamp 0, paused, t=0 render state)", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ReplayProvider scene={scene}>{children}</ReplayProvider>
    );
    const { result } = renderHook(() => useReplay(), { wrapper });
    expect(result.current.timestamp).toBe(0);
    expect(result.current.duration).toBe(duration);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.renderState).toEqual(computeSceneState(scene, 0));
  });

  it("forwards seek() to the driver and updates the injected timestamp", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ReplayProvider scene={scene}>{children}</ReplayProvider>
    );
    const { result } = renderHook(() => useReplay(), { wrapper });
    act(() => result.current.seek(10));
    expect(result.current.timestamp).toBe(10);
    expect(result.current.renderState).toEqual(computeSceneState(scene, 10));
  });

  it("forwards toggle() to the driver and flips isPlaying", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ReplayProvider scene={scene}>{children}</ReplayProvider>
    );
    const { result } = renderHook(() => useReplay(), { wrapper });
    act(() => result.current.toggle());
    expect(result.current.isPlaying).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isPlaying).toBe(false);
  });

  it("throws when useReplay is used outside a ReplayProvider", () => {
    let captured: Error | undefined;
    function Consumer() {
      useReplay();
      return null;
    }
    render(
      <ErrorBoundary onError={(e) => (captured = e)}>
        <Consumer />
      </ErrorBoundary>,
    );
    expect(captured).toBeInstanceOf(Error);
    expect(captured?.message).toContain("ReplayProvider");
  });
});

describe("ThemeProvider + useTheme (M4-T4 scaffold)", () => {
  it("injects defaultTheme when no ThemeProvider is mounted", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current).toEqual(defaultTheme);
  });

  it("injects a custom theme via ThemeProvider", () => {
    const custom: Theme = {
      name: "dark",
      tokens: {
        primary: "#000000",
        background: "#0f172a",
        foreground: "#f8fafc",
        border: "#334155",
        radius: "0.5rem",
      },
    };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider theme={custom}>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current).toEqual(custom);
    expect(result.current.tokens.primary).toBe("#000000");
  });
});
