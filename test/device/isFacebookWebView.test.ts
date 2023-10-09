import { beforeEach, describe, it, expect } from "vitest";

import { isFacebookWebView } from "../../src/device";

describe("isFacebookWebView", () => {
  beforeEach(() => {
    // @ts-expect-error navigator does not match definition
    window.navigator = {};
  });

  it("should return true when userAgent contains FBAN", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "FBAN";
    const bool = isFacebookWebView();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains FBAV", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "FBAV";
    const bool = isFacebookWebView();

    expect(bool).toBeTruthy();
  });

  it("should return false when userAgent does NOT contain FBAV or FBAN", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "facebook potato";
    const bool = isFacebookWebView();

    expect(bool).toBeFalsy();
  });
});
