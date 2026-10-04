/**
 * Low-level validation helpers for parsing scene JSON (plan.md §19.1).
 *
 * These are pure, dependency-free helpers shared by the `parse*` functions.
 * They throw descriptive `SceneParseError`s so malformed input is reported
 * with a clear field path.
 */

/** Thrown when scene JSON is malformed or missing required fields. */
export class SceneParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SceneParseError";
  }
}

/** Whether a value is a plain object (not null, not an array). */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Whether a value is a string. */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/** Whether a value is a finite number. */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** Whether a value is a boolean. */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/** Require a value to be a plain object. */
export function requireRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) throw new SceneParseError(`${path} must be an object`);
  return value;
}

/** Require a value to be a string. */
export function requireString(value: unknown, path: string): string {
  if (!isString(value)) throw new SceneParseError(`${path} must be a string`);
  return value;
}

/** Require a value to be a finite number. */
export function requireNumber(value: unknown, path: string): number {
  if (!isNumber(value)) throw new SceneParseError(`${path} must be a number`);
  return value;
}

/** Require a value to be a boolean. */
export function requireBoolean(value: unknown, path: string): boolean {
  if (!isBoolean(value)) throw new SceneParseError(`${path} must be a boolean`);
  return value;
}

/** Require a value to be an array. */
export function requireArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) throw new SceneParseError(`${path} must be an array`);
  return value;
}

/** Read an optional string field, validating it when present. */
export function optionalString(
  record: Record<string, unknown>,
  key: string,
  path: string,
): string | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  return requireString(value, `${path}.${key}`);
}

/** Read an optional number field, validating it when present. */
export function optionalNumber(
  record: Record<string, unknown>,
  key: string,
  path: string,
): number | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  return requireNumber(value, `${path}.${key}`);
}

/** Read an optional boolean field, validating it when present. */
export function optionalBoolean(
  record: Record<string, unknown>,
  key: string,
  path: string,
): boolean | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  return requireBoolean(value, `${path}.${key}`);
}

/** Read an optional string-or-null field (e.g. character prop). */
export function optionalStringOrNull(
  record: Record<string, unknown>,
  key: string,
  path: string,
): string | null | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (value === null) return null;
  return requireString(value, `${path}.${key}`);
}

/** Read an optional [number, number] tuple field. */
export function optionalPoint(
  record: Record<string, unknown>,
  key: string,
  path: string,
): [number, number] | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  return requirePoint(value, `${path}.${key}`);
}

/** Require a value to be a [number, number] tuple. */
export function requirePoint(value: unknown, path: string): [number, number] {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new SceneParseError(`${path} must be a [x, y] pair`);
  }
  return [
    requireNumber(value[0], `${path}[0]`),
    requireNumber(value[1], `${path}[1]`),
  ];
}
