import { beforeEach, describe, it, expect } from "vitest";

import { isAndroid } from "../../src/device";

describe("android", () => {
  beforeEach(() => {
    // @ts-expect-error not a full navigator type
    window.navigator = {};
  });

  it("should return true when userAgent contains Android", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "Android";
    const bool = isAndroid();

    expect(bool).toBeTruthy();
  });

  it("should return false when userAgent does NOT contain Android", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "android";
    const bool = isAndroid();

    expect(bool).toBeFalsy();
  });
});
