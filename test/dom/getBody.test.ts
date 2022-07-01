import { describe, it, expect } from "vitest";

import { getBody } from "../../src";

describe("get body cases", () => {
  it("should get the body", () => {
    expect(getBody()).toEqual(document.body);
  });
});
