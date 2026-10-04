/**
 * PlaybackControls (M3-T2) — backward-compatible alias for the M4-T2
 * `PlaybackControlsMolecule`.
 *
 * The play/pause + seek + step control strip was extracted into the reusable
 * `PlaybackControlsMolecule` in `molecules/`. This module re-exports it so
 * existing consumers keep a stable import surface and the old tests keep
 * passing.
 */
export { PlaybackControlsMolecule as PlaybackControls } from "./molecules/PlaybackControlsMolecule";
export type { PlaybackControlsMoleculeProps as PlaybackControlsProps } from "./molecules/PlaybackControlsMolecule";
