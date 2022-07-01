import { beforeEach, describe, it, expect } from "vitest";

import { isMacOsCna } from "../../src/device";

describe("isMacOsCna", () => {
  beforeEach(() => {
    // @ts-expect-error navigator does not match definition
    window.navigator = {};
  });

  it("should return true when userAgent is valid", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "macintosh.potatoAppleWebKit";
    const bool = isMacOsCna();

    expect(bool).toBeTruthy();
  });

  it("should return false when userAgent is invalid", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "potat0";
    const bool = isMacOsCna();

    expect(bool).toBeFalsy();
  });
});
