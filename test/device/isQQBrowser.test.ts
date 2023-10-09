import { describe, it, expect } from "vitest";

import { isQQBrowser } from "../../src/device";

describe("isQQBrowser", () => {
  it("should return true when userAgent contains QQBrowser", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "QQBrowser";
    const bool = isQQBrowser();

    expect(bool).toBeTruthy();
  });

  it("should return false when userAgent does NOT contain QQBrowser", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "QQPotato";
    const bool = isQQBrowser();

    expect(bool).toBeFalsy();
  });
});
