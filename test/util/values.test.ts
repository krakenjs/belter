import { describe, expect, it } from "vitest";

import { values } from "../../src";

describe("values cases", () => {
  it("should return object values when Object.values is available", () => {
    const result = values({ a: true });
    expect(result[0]).toBeTruthy();
  });

  it("should return object values when Object.values is unavailable", () => {
    const originalFunc = Object.values;
    Reflect.deleteProperty(Object, "values");
    const result = values({ a: true });
    expect(result[0]).toBeTruthy();
    Reflect.defineProperty(Object, "values", originalFunc);
  });
});
