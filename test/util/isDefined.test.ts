import { describe, it, expect } from "vitest";

import { isDefined } from "../../src/util";

describe("isDefined", () => {
  it("should return true when value is neither undefined nor null", () => {
    const bool = isDefined("potato");

    expect(bool).toBeTruthy();
  });

  it("should return false when value is undefined", () => {
    const bool = isDefined(undefined);

    expect(bool).toBeFalsy();
  });

  it("should return false when value is null", () => {
    const bool = isDefined(null);

    expect(bool).toBeFalsy();
  });
});
