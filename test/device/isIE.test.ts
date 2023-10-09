import { beforeEach, describe, it, expect } from "vitest";

import { isIE } from "../../src/device";

describe("isIE", () => {
  beforeEach(() => {
    // @ts-expect-error documentMode does not exist
    window.document.documentMode = null;
  });

  it("should return false when window.document.documentMode is a falsy value, and userAgent is an invalid truthy value", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "potato";
    const bool = isIE();

    expect(bool).toBeFalsy();
  });

  it("should return false when window.document.documentMode is a falsy value, and userAgent is a falsy value", () => {
    const bool = isIE();

    expect(bool).toBeFalsy();
  });

  it("should return false when window.document.documentMode is a falsy value, and window.navigator is a falsy value", () => {
    const bool = isIE();

    expect(bool).toBeFalsy();
  });

  it("should return true when window.document.documentMode is a falsy value and userAgent contains edge(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "edge";
    const bool = isIE();

    expect(bool).toBeTruthy();
  });

  it("should return true when window.document.documentMode is a falsy value and userAgent contains msie(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "msie";
    const bool = isIE();

    expect(bool).toBeTruthy();
  });

  it("should return true when window.document.documentMode is a falsy value and userAgent contains rv:11(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "rv:11";
    const bool = isIE();

    expect(bool).toBeTruthy();
  });

  it("should return true when window.document.documentMode is a truthy value", () => {
    // @ts-expect-error documentMode does not exist
    window.document.documentMode = true;
    const bool = isIE();

    expect(bool).toBeTruthy();
  });
});
