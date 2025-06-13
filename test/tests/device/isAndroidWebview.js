/* @flow */

import { isAndroidWebview } from "../../../src/device";

describe("isAndroidWebview", () => {
  it("should return true when isAndroid function returns true, Version regex test passes, and isOperaMini function returns false", () => {
    window.navigator.userAgent = "AndroidVersion/9";
    const bool = isAndroidWebview();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when isAndroid function returns true, wv is present in user agent, and isOperaMini function returns false", () => {
    window.navigator.userAgent = "AndroidVersion/9wv";
    const bool = isAndroidWebview();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when isAndroid function returns true, WebView is present in user agent, and isOperaMini function returns false", () => {
    window.navigator.userAgent = "AndroidVersion/9 WebView";
    const bool = isAndroidWebview();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when isAndroid function returns false, ", () => {
    window.navigator.userAgent = "PotatoVersion/9";
    const bool = isAndroidWebview();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when isAndroid function returns true, Version regex test passes, and isOperaMini function returns true", () => {
    window.navigator.userAgent = "AndroidVersion/9Opera Mini";
    const bool = isAndroidWebview();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when isAndroid function returns true and Version regex test fails", () => {
    window.navigator.userAgent = "AndroidPotato/9";
    const bool = isAndroidWebview();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
});
