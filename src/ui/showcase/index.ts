/**
 * Showcase library barrel (M4-T5).
 *
 * Re-exports the showcase entry wrapper and the atom/molecule/organism showcase
 * entries so the `ShowcasePage` composes them from a single surface.
 */
export { ShowcaseEntry } from "./ShowcaseEntry";
export type { ShowcaseEntryProps } from "./ShowcaseEntry";
export * from "./atoms";
export * from "./molecules";
export * from "./organisms";
export * from "./variants";
export * from "./edge";
