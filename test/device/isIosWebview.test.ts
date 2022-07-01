import { describe, it, expect } from "vitest";

import { isIosWebview } from "../../src/device";

describe("isIosWebview", () => {
  it("should return true when both isIos and isGoogleSearchApp functions return true", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPhone GSA";
    const bool = isIosWebview();

    expect(bool).toBeTruthy();
  });

  it("should return true when isIos function returns true, and Applekit regex test passes", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = ".iPhoneAppleWebKit";
    const bool = isIosWebview();

    expect(bool).toBeTruthy();
  });

  it("should return true when isIos function returns true, and Mobile Not Safari regex test passes", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
    const bool = isIosWebview();

    expect(bool).toBeTruthy();
  });

  it("should return true when isIos function returns true, and Mobile, Safari and WKWebKit regex test passes", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_18.5.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US ByteFullLocale/en isDarkMode/0 Safari/604.1 WKWebView/1";
    const bool = isIosWebview();

    expect(bool).toBeTruthy();
  });

  it("should return false when isIos function returns false", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "potatoIOS";
    const bool = isIosWebview();

    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
});
