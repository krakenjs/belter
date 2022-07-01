import { beforeEach, describe, it, expect } from "vitest";

import { isFirefox } from "../../src/device";

describe("isFirefoxIOS", () => {
  beforeEach(() => {
    // @ts-expect-error navigator does not match definition
    window.navigator = {};
  });

  it("should return true when userAgent contains firefox(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:87.0) Gecko/20100101 Firefox/87.0";
    const bool = isFirefox();

    expect(bool).toBeTruthy();
  });

  it("should return false when userAgent does NOT contain firefox(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "fired potato";
    const bool = isFirefox();

    expect(bool).toBeFalsy();
  });
});
