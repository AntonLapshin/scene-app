import type { ReactNode } from "react";
import { ThemeContext, defaultTheme } from "./theme";
import type { Theme } from "./theme";

export interface ThemeProviderProps {
  /** The theme to inject. Defaults to `defaultTheme`. */
  theme?: Theme;
  /** The subtree that consumes the theme via `useTheme`. */
  children: ReactNode;
}

/**
 * ThemeProvider (M4-T4 scaffold).
 *
 * Injects a `Theme` (design-token surface) via `ThemeContext`. It is a thin,
 * UI-only wrapper with no business logic — it only sets the context value. M5
 * will expand this into a full theming system.
 */
export function ThemeProvider({ theme = defaultTheme, children }: ThemeProviderProps) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
