/* @flow */

import { isQQBrowser } from "../../../src/device";

describe("isQQBrowser", () => {
  it("should return true when userAgent contains QQBrowser", () => {
    window.navigator.userAgent = "QQBrowser";
    const bool = isQQBrowser();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when userAgent does NOT contain QQBrowser", () => {
    window.navigator.userAgent = "QQPotato";
    const bool = isQQBrowser();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
});
