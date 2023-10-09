import { beforeEach, describe, it, expect } from "vitest";

import { isWebView } from "../../src/device";

describe("isWebView", () => {
  beforeEach(() => {
    // @ts-expect-error navigator does not match definition
    window.navigator = {};
  });

  it("should return false when userAgent is invalid", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "invalid potato";
    const bool = isWebView();

    expect(bool).toBeFalsy();
  });

  it("should return true when userAgent is valid and begins with iPhone or iPod or iPad or Macintosh(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "ipod.potatoAppleWebKit.potato";
    const bool = isWebView();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains whole word wv", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "wv";
    const bool = isWebView();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains Mobile but not Safari and not WKWebView", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
    const bool = isWebView();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains Mobile and Safari and WKWebView", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_18.5.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US ByteFullLocale/en isDarkMode/0 Safari/604.1 WKWebView/1";
    const bool = isWebView();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent is valid and starts with android(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "android.potatoVersion/9.3";
    const bool = isWebView();

    expect(bool).toBeTruthy();
  });
});
