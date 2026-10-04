/**
 * Scene core module — typed models + parse/validate (M1-T1).
 *
 * Re-exports the typed scene models and the pure `parse*` functions so callers
 * (M1-T2 state computation, UI view models) have a single import surface.
 */
export * from "./types";
export * from "./guards";
export * from "./parse";
