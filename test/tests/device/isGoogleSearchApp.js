/* @flow */

import { isGoogleSearchApp } from "../../../src/device";

describe("isGoogleSearchApp", () => {
  it("should return true when userAgent contains whole word GSA ", () => {
    window.navigator.userAgent = "GSA";
    const bool = isGoogleSearchApp();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when userAgent does NOT contain whole word GSA", () => {
    window.navigator.userAgent = "poGSAtato";
    const bool = isGoogleSearchApp();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
});
