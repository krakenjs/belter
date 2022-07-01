import { describe, it, expect } from "vitest";

import { isAndroidWebview } from "../../src/device";

describe("isAndroidWebview", () => {
  it("should return true when isAndroid function returns true, Version regex test passes, and isOperaMini function returns false", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "AndroidVersion/9";
    const bool = isAndroidWebview();

    expect(bool).toBeTruthy();
  });

  it("should return false when isAndroid function returns false, ", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "PotatoVersion/9";
    const bool = isAndroidWebview();

    expect(bool).toBeFalsy();
  });

  it("should return false when isAndroid function returns true, Version regex test passes, and isOperaMini function returns true", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "AndroidVersion/9Opera Mini";
    const bool = isAndroidWebview();

    expect(bool).toBeFalsy();
  });

  it("should return false when isAndroid function returns true and Version regex test fails", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "AndroidPotato/9";
    const bool = isAndroidWebview();

    expect(bool).toBeFalsy();
  });
});
