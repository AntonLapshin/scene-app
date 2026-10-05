import type { Theme } from "../../context";

/**
 * A custom (dark) theme (M5-T4).
 *
 * An alternate `ThemeTokens` design-token surface injected via `ThemeProvider`.
 * It demonstrates that every themed component reads its styling from the active
 * theme, so swapping the theme re-skins the whole component set with no
 * component changes. This is UI-only presentational data — no business logic.
 */
export const darkTheme: Theme = {
  name: "dark",
  tokens: {
    primary: "bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50",
    secondary: "border border-slate-600 text-slate-200 hover:bg-slate-800 disabled:opacity-50",
    accent: "accent-indigo-400",
    link: "text-indigo-400 underline hover:text-indigo-300",

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

    radius: "rounded-xl",
    radiusSm: "rounded-md",
    radiusPill: "rounded-full",
  },
};
