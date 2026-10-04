/**
 * Scene core module — typed models + parse/validate + initial state (M1-T1/T2).
 *
 * Re-exports the typed scene models, the pure `parse*` functions, and the
 * initial-state computation so callers (UI view models) have a single import
 * surface.
 */
export * from "./types";
export * from "./guards";
export * from "./parse";
export * from "./state";
