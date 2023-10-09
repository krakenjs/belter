import { describe, it, expect } from "vitest";

import { isGoogleSearchApp } from "../../src/device";

describe("isGoogleSearchApp", () => {
  it("should return true when userAgent contains whole word GSA ", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "GSA";
    const bool = isGoogleSearchApp();

    expect(bool).toBeTruthy();
  });

  it("should return false when userAgent does NOT contain whole word GSA", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "poGSAtato";
    const bool = isGoogleSearchApp();

    expect(bool).toBeFalsy();
  });
});
