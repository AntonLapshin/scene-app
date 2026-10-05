/**
 * Context barrel (M4-T4).
 *
 * Re-exports the context providers and hooks from a single surface so
 * consumers can inject and read replay state + theme without prop drilling.
 */
export { ReplayContext, useReplay } from "./replay";
export type { ReplayContextValue } from "./replay";
export { ReplayProvider } from "./ReplayProvider";
export type { ReplayProviderProps } from "./ReplayProvider";
export { ThemeContext, useTheme, defaultTheme } from "./theme";
export type { Theme, ThemeTokens } from "./theme";
export { ThemeProvider } from "./ThemeProvider";
export type { ThemeProviderProps } from "./ThemeProvider";
