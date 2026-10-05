import { createContext, useContext } from "react";

/**
 * A design-token surface (M5-T1) that drives all component styling.
 *
 * Each token is a Tailwind utility-class fragment (e.g. "bg-white",
 * "text-slate-500", "rounded-xl"). Components read the active theme via
 * `useTheme()` and compose these class fragments instead of hard-coding colors
 * and radius. This keeps styling theme-driven and consistent while remaining
 * pure Tailwind — no runtime style computation.
 *
 * This is a thin, UI-only surface with no business logic. It only carries
 * presentational tokens (accent, surfaces, borders, text, radius).
 */
export interface ThemeTokens {
  /** Primary interactive surface (filled button): bg + text + hover. */
  primary: string;
  /** Secondary interactive surface (outlined button): border + text + hover. */
  secondary: string;
  /** Accent color for form controls (range/slider thumb). */
  accent: string;
  /** Inline link: color + underline + hover. */
  link: string;

  /** App page background. */
  background: string;
  /** Card / surface background. */
  surface: string;
  /** Muted surface background (sprite wells, quiet chips). */
  surfaceMuted: string;
  /** Status-pill surface (status badge). */
  statusPill: string;
  /** Say-bubble surface. */
  sayBubble: string;

  /** Card / surface border. */
  border: string;
  /** Control border (secondary button, palette swatch). */
  controlBorder: string;

  /** Strong foreground / text (headings). */
  foreground: string;
  /** Muted body text. */
  textMuted: string;
  /** Subtle label text. */
  textSubtle: string;
  /** Monospace text. */
  monoText: string;

  /** Card / surface radius. */
  radius: string;
  /** Small radius (buttons, inputs, chips). */
  radiusSm: string;
  /** Pill radius (badges, status pills, swatches). */
  radiusPill: string;
}

/** A named theme, comprising a design-token surface. */
export interface Theme {
  /** Human-readable theme name. */
  name: string;
  /** The design tokens that make up the theme surface. */
  tokens: ThemeTokens;
}

/**
 * The default theme, injected when no `ThemeProvider` is mounted. Its token
 * values reproduce the pre-M5 hard-coded styling exactly (no visual
 * regressions under the default theme).
 */
export const defaultTheme: Theme = {
  name: "default",
  tokens: {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50",
    secondary: "border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50",
    accent: "accent-indigo-600",
    link: "text-indigo-600 underline hover:text-indigo-800",

    background: "bg-slate-100",
    surface: "bg-white",
    surfaceMuted: "bg-slate-50",
    statusPill: "bg-emerald-50 text-emerald-700",
    sayBubble: "bg-amber-50",

    border: "border-slate-200",
    controlBorder: "border-slate-300",

    foreground: "text-slate-900",
    textMuted: "text-slate-600",
    textSubtle: "text-slate-500",
    monoText: "font-mono text-slate-700",

    radius: "rounded-xl",
    radiusSm: "rounded-md",
    radiusPill: "rounded-full",
  },
};

/**
 * The React context that carries the active theme. Defaults to
 * `defaultTheme` so consumers get a sensible value even without a provider.
 */
export const ThemeContext = createContext<Theme>(defaultTheme);

/**
 * Thin hook (M4-T4 scaffold, expanded M5-T1) that reads the injected theme
 * from `ThemeContext`.
 *
 * Contains no business logic — it only returns the context value, which falls
 * back to `defaultTheme` when no `ThemeProvider` is mounted.
 */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
