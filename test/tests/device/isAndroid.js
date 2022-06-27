/* @flow */

import { isAndroid } from "../../../src/device";

describe("android", () => {
  beforeEach(() => {
    window.navigator = {};
  });
  it("should return true when userAgent contains Android", () => {
    window.navigator.userAgent = "Android";
    const bool = isAndroid();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when userAgent does NOT contain Android", () => {
    window.navigator.userAgent = "android";
    const bool = isAndroid();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
});
