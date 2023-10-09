import { beforeEach, describe, it, expect } from "vitest";

import { isFirefoxIOS } from "../../src/device";

describe("isFirefoxIOS", () => {
  beforeEach(() => {
    // @ts-expect-error navigator does not match defintion
    window.navigator = {};
  });

  it("should return true when userAgent contains fxios(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "fxios";
    const bool = isFirefoxIOS();

    expect(bool).toBeTruthy();
  });

  it("should return false when userAgent does NOT contain fxios(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "firefox potato";
    const bool = isFirefoxIOS();

    expect(bool).toBeFalsy();
  });
});
