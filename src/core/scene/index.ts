/**
 * Scene core module — typed models + parse/validate + initial state + asset
 * rendering (M1-T1/T2/T3).
 *
 * Re-exports the typed scene models, the pure `parse*` functions, the
 * initial-state computation, and the asset renderer so callers (UI view
 * models) have a single import surface.
 */
export * from "./types";
export * from "./guards";
export * from "./parse";
export * from "./state";
export * from "./replay";
export * from "./draw";
