/* @flow */

import { base64encode } from "../../../src";

describe("domainMatches", () => {
  it("should return true when domain matches", () => {
    const original = "ewewgweg";
    const expected = "ZXdld2d3ZWc";

    const result = base64encode(original);

    if (result !== expected) {
      throw new Error(
        `Expected base64 of ${original} to be ${expected}, got ${result}`
      );
    }
  });
});
