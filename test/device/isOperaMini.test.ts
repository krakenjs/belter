import { beforeEach, describe, it, expect } from "vitest";

import { isOperaMini } from "../../src/device";

describe("isOperaMini", () => {
  beforeEach(() => {
    // @ts-expect-error navigator does not match definition
    window.navigator = {};
  });

  it("should return true when userAgent contains `Opera Mini`", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "Opera Mini";
    const bool = isOperaMini();

    expect(bool).toBeTruthy();
  });

  it("should return false when userAgent does NOT contain `Opera Mini`", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "Potato Mini";
    const bool = isOperaMini();

    expect(bool).toBeFalsy();
  });
});
