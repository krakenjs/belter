import { describe, it, expect } from "vitest";

import { deserializePrimitive } from "../../src";

describe("deserializePrimitive cases", () => {
  it("deserializePrimitive should return true", () => {
    const result = deserializePrimitive("true");

    expect(result).toBeTruthy();
  });

  it("deserializePrimitive should return false", () => {
    const result = deserializePrimitive("false");

    expect(result).toBeFalsy();
  });

  it("deserializePrimitive should return numeric value", () => {
    const result = deserializePrimitive("10");

    expect(result).toEqual(10);
  });

  it("deserializePrimitive should return float value", () => {
    const result = deserializePrimitive("10.57");

    expect(result).toEqual(10.57);
  });
});
