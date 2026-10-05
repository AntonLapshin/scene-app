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
        primary: "bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50",
        secondary: "border border-slate-600 text-slate-200 hover:bg-slate-800 disabled:opacity-50",
        accent: "accent-violet-500",
        link: "text-violet-400 underline hover:text-violet-300",
        background: "bg-slate-900",
        surface: "bg-slate-800",
        surfaceMuted: "bg-slate-700",
        statusPill: "bg-emerald-900 text-emerald-200",
        sayBubble: "bg-amber-900",
        border: "border-slate-700",
        controlBorder: "border-slate-600",
        foreground: "text-slate-100",
        textMuted: "text-slate-300",
        textSubtle: "text-slate-400",
        monoText: "font-mono text-slate-300",
        radius: "rounded-2xl",
        radiusSm: "rounded-lg",
        radiusPill: "rounded-full",
      },
    };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider theme={custom}>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current).toEqual(custom);
    expect(result.current.tokens.primary).toBe(
      "bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50",
    );
  });
});
