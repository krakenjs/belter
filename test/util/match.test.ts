import { describe, it, expect } from "vitest";

import { match } from "../../src";

describe("match cases", () => {
  it("match should return original function", () => {
    const result = match("letters", /(t[a-z]*)/i);
    expect(result).toEqual("tters");
  });
});
