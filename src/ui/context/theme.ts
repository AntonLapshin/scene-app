import { createContext, useContext } from "react";

/**
 * A design-token surface (M4-T4 scaffold, ready for M5 theming).
 *
 * This is a thin, UI-only scaffold that establishes the theme injection
 * pattern. It carries no business logic — it only exposes a small set of
 * design tokens (colors + radius) that M5 will expand into a full theme.
 */
export interface ThemeTokens {
  /** Primary accent color used for interactive elements. */
  primary: string;
  /** Background color of the app surface. */
  background: string;
  /** Foreground / text color on the background surface. */
  foreground: string;
  /** Border color for cards and controls. */
  border: string;
  /** Border radius for cards and controls. */
  radius: string;
}

/** A named theme, comprising a design-token surface. */
export interface Theme {
  /** Human-readable theme name. */
  name: string;
  /** The design tokens that make up the theme surface. */
  tokens: ThemeTokens;
}

/** The default theme, injected when no `ThemeProvider` is mounted. */
export const defaultTheme: Theme = {
  name: "default",
  tokens: {
    primary: "#4f46e5",
    background: "#f1f5f9",
    foreground: "#0f172a",
    border: "#e2e8f0",
    radius: "0.75rem",
  },
};

/**
 * The React context that carries the active theme. Defaults to
 * `defaultTheme` so consumers get a sensible value even without a provider.
 */
export const ThemeContext = createContext<Theme>(defaultTheme);

/**
 * Thin hook (M4-T4) that reads the injected theme from `ThemeContext`.
 *
 * Contains no business logic — it only returns the context value, which falls
 * back to `defaultTheme` when no `ThemeProvider` is mounted.
 */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
