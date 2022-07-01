import { describe, it, expect } from "vitest";

import { stringify } from "../../src";

describe("stringify cases", () => {
  it("stringify should return the exact same value when is a string value", () => {
    const result = stringify("1");

    expect(result).toEqual("1");
  });
});
