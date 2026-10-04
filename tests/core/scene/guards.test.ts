import { describe, it, expect } from "vitest";
import {
  SceneParseError,
  isRecord,
  isString,
  isNumber,
  isBoolean,
  requireRecord,
  requireString,
  requireNumber,
  requireBoolean,
  requireArray,
  optionalString,
  optionalNumber,
  optionalBoolean,
  optionalStringOrNull,
  optionalPoint,
  requirePoint,
} from "../../../src/core/scene/guards";

describe("scene guards", () => {
  it("SceneParseError sets its name", () => {
    const err = new SceneParseError("boom");
    expect(err.name).toBe("SceneParseError");
    expect(err.message).toBe("boom");
  });

  it("isRecord distinguishes plain objects from null/arrays/primitives", () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord([])).toBe(false);
    expect(isRecord("x")).toBe(false);
  });

  it("isString / isNumber / isBoolean narrow primitive types", () => {
    expect(isString("x")).toBe(true);
    expect(isString(5)).toBe(false);
    expect(isNumber(5)).toBe(true);
    expect(isNumber(Infinity)).toBe(false);
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber("5")).toBe(false);
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(1)).toBe(false);
  });

  it("require* helpers accept valid values", () => {
    expect(requireRecord({ a: 1 }, "p")).toEqual({ a: 1 });
    expect(requireString("s", "p")).toBe("s");
    expect(requireNumber(3, "p")).toBe(3);
    expect(requireBoolean(false, "p")).toBe(false);
    expect(requireArray([1, 2], "p")).toEqual([1, 2]);
  });

  it("require* helpers throw descriptive errors on invalid values", () => {
    expect(() => requireRecord(null, "p")).toThrow(/p must be an object/);
    expect(() => requireRecord([], "p")).toThrow(/p must be an object/);
    expect(() => requireString(1, "p")).toThrow(/p must be a string/);
    expect(() => requireNumber("x", "p")).toThrow(/p must be a number/);
    expect(() => requireNumber(Infinity, "p")).toThrow(/p must be a number/);
    expect(() => requireBoolean("x", "p")).toThrow(/p must be a boolean/);
    expect(() => requireArray("x", "p")).toThrow(/p must be an array/);
  });

  it("optional* helpers return undefined when absent", () => {
    expect(optionalString({}, "k", "p")).toBeUndefined();
    expect(optionalNumber({}, "k", "p")).toBeUndefined();
    expect(optionalBoolean({}, "k", "p")).toBeUndefined();
    expect(optionalStringOrNull({}, "k", "p")).toBeUndefined();
    expect(optionalPoint({}, "k", "p")).toBeUndefined();
  });

  it("optional* helpers validate values when present", () => {
    expect(optionalString({ k: "v" }, "k", "p")).toBe("v");
    expect(optionalNumber({ k: 2 }, "k", "p")).toBe(2);
    expect(optionalBoolean({ k: true }, "k", "p")).toBe(true);
    expect(optionalStringOrNull({ k: null }, "k", "p")).toBeNull();
    expect(optionalStringOrNull({ k: "bag" }, "k", "p")).toBe("bag");
    expect(optionalPoint({ k: [1, 2] }, "k", "p")).toEqual([1, 2]);
  });

  it("optional* helpers throw on wrong types when present", () => {
    expect(() => optionalString({ k: 1 }, "k", "p")).toThrow(/p.k must be a string/);
    expect(() => optionalNumber({ k: "x" }, "k", "p")).toThrow(/p.k must be a number/);
    expect(() => optionalBoolean({ k: 1 }, "k", "p")).toThrow(/p.k must be a boolean/);
    expect(() => optionalStringOrNull({ k: 1 }, "k", "p")).toThrow(/p.k must be a string/);
    expect(() => optionalPoint({ k: "x" }, "k", "p")).toThrow(/p.k must be a \[x, y\] pair/);
  });

  it("requirePoint validates a [x, y] pair", () => {
    expect(requirePoint([1, 2], "p")).toEqual([1, 2]);
    expect(() => requirePoint([1], "p")).toThrow(/p must be a \[x, y\] pair/);
    expect(() => requirePoint([1, 2, 3], "p")).toThrow(/p must be a \[x, y\] pair/);
    expect(() => requirePoint("x", "p")).toThrow(/p must be a \[x, y\] pair/);
    expect(() => requirePoint(["a", 2], "p")).toThrow(/p\[0\] must be a number/);
    expect(() => requirePoint([1, "b"], "p")).toThrow(/p\[1\] must be a number/);
  });
});
