import { beforeEach, describe, it, expect } from "vitest";

import { isTablet } from "../../src/device";

describe("isTablet", () => {
  beforeEach(() => {
    // @ts-expect-error navigator does not match definition
    window.navigator = {};
  });

  it("should return true if userAgent contain tablet string", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent =
      "Mozilla/5.0 (iPad; CPU OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1";

    expect(isTablet()).toBeTruthy();
  });

  it("should return false if userAgent does NOT contain tablet string", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1";

    expect(isTablet()).toBeFalsy();
  });
});
