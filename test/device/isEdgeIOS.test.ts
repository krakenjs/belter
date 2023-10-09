import { beforeEach, describe, it, expect } from "vitest";

import { isEdgeIOS } from "../../src/device";

describe("isEdgeIOS", () => {
  beforeEach(() => {
    // @ts-expect-error navigator does not match definition
    window.navigator = {};
  });

  it("should return true when userAgent contains edgios(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "edgios";
    const bool = isEdgeIOS();

    expect(bool).toBeTruthy();
  });

  it("should return false when userAgent does NOT contain edgios(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "edgey potato";
    const bool = isEdgeIOS();

    expect(bool).toBeFalsy();
  });
});
