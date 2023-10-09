import { describe, it, expect } from "vitest";

import { base64encode } from "../../src";

describe("domainMatches", () => {
  it("should return true when domain matches", () => {
    const original = "ewewgweg";
    const expected = "ZXdld2d3ZWc";
    const result = base64encode(original);

    expect(result).toEqual(expected);
  });
});
