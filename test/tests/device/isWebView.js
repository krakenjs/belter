/* @flow */

import { isWebView } from "../../../src/device";

describe("isWebView", () => {
  beforeEach(() => {
    window.navigator = {};
  });
  it("should return false when userAgent is invalid", () => {
    window.navigator.userAgent = "invalid potato";
    const bool = isWebView();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when userAgent is valid and begins with iPhone or iPod or iPad or Macintosh(case insensitive)", () => {
    window.navigator.userAgent = "ipod.potatoAppleWebKit.potato";
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when userAgent contains whole word wv", () => {
    window.navigator.userAgent = "wv";
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when userAgent contains Mobile but not Safari and not WKWebView", () => {
    window.navigator.userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when userAgent contains Mobile and Safari and WKWebView", () => {
    window.navigator.userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_18.5.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US ByteFullLocale/en isDarkMode/0 Safari/604.1 WKWebView/1";
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when userAgent is valid and starts with android(case insensitive)", () => {
    window.navigator.userAgent = "android.potatoVersion/9.3";
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
});
