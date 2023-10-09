import { beforeEach, describe, it, expect } from "vitest";

import { getUserAgent } from "../../src/device";

describe("getUserAgent", () => {
  beforeEach(() => {
    // @ts-expect-error not a full navigator type
    window.navigator = {};
  });

  it("should return value of window.navigator.mockUserAgent", () => {
    const expectedResult = "mock potato";
    // @ts-expect-error mockUserAgent is not a real var
    window.navigator.mockUserAgent = expectedResult;
    const mockUserAgent = getUserAgent();

    expect(mockUserAgent).toEqual(expectedResult);
  });

  it("should return value of window.navigator.userAgent", () => {
    const expectedResult = "userAgent potato";
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = expectedResult;
    const userAgent = getUserAgent();

    expect(userAgent).toEqual(expectedResult);
  });
});
