import { beforeEach, describe, it, expect } from "vitest";

import { isStandAlone } from "../../src/device";

describe("isStandAlone", () => {
  beforeEach(() => {
    // @ts-expect-error navigator does not match definition
    window.navigator = {};
    // @ts-expect-error doesnt have all properties of matchMedia
    window.matchMedia = () => ({
      matches: true,
    });
  });

  it("should return false when window.navigator.standalone is falsy and window.matchMedia().matches returns a falsy value", () => {
    // @ts-expect-error doesnt have all properties of matchMedia
    window.matchMedia = () => ({
      matches: false,
    });

    const bool = isStandAlone();

    expect(bool).toBeFalsy();
  });

  it("should return true when window.navigator.standalone is truthy", () => {
    // @ts-expect-error standalone does not exist
    window.navigator.standalone = true;
    const bool = isStandAlone();

    expect(bool).toBeTruthy();
  });

  it("should return true when navigator.standalone is falsy and window.matchMedia().matches returns a truthy value", () => {
    // @ts-expect-error standalone does not exist
    window.navigator.standalone = false;
    const bool = isStandAlone();

    expect(bool).toBeTruthy();
  });
});
