/**
 * Image-availability adapter (M1-T4b).
 *
 * Core's `renderAsset` needs a synchronous `ImageAvailability` predicate to
 * decide between external-image and procedural rendering. This adapter owns the
 * impure browser I/O: it preloads external image sources and records their
 * availability in a cache, then exposes a predicate reading that cache.
 *
 * This lives in `src/adapters` (not core) because it touches the DOM / browser
 * `Image` API, which core forbids. UI components and view models consume the
 * predicate, keeping core pure.
 */

import type { ImageAvailability } from "../core/scene";

/** Cached availability per image source. */
const availabilityCache = new Map<string, boolean>();

/**
 * Preload an external image source and record whether it loads.
 *
 * A no-op when the source is already known. Uses the browser `Image` API, so
 * this adapter is not usable in core (which stays pure) — only here.
 */
export function preloadImage(src: string): void {
  if (availabilityCache.has(src)) return;
  const img = new Image();
  img.onload = () => availabilityCache.set(src, true);
  img.onerror = () => availabilityCache.set(src, false);
  img.src = src;
}

/**
 * The `ImageAvailability` predicate for core `renderAsset`.
 *
 * Reports whether a source is known to have loaded; unknown sources are treated
 * as unavailable so core falls back to procedural drawing.
 */
export const imageAvailability: ImageAvailability = (src) =>
  availabilityCache.get(src) ?? false;

/** Clear the cache (used in tests). */
export function resetImageAvailability(): void {
  availabilityCache.clear();
}
