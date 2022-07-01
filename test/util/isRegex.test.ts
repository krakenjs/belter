import { describe, it, expect } from "vitest";

import { isRegex } from "../../src/util";

describe("isRegex", () => {
  it("should return true when item is a regex", () => {
    const bool = isRegex(/hi/);

    expect(bool).toBeTruthy();
  });

  it("should return false when item is NOT a regex", () => {
    const bool = isRegex("hi");

    expect(bool).toBeFalsy();
  });
});
