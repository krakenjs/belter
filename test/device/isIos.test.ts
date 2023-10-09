import { beforeEach, describe, it, expect } from "vitest";

import { isIos, isIOS14 } from "../../src/device";

describe("isIos", () => {
  beforeEach(() => {
    // @ts-expect-error navigator does not match definition
    window.navigator = {};
  });

  it("should return true when userAgent contains iPhone", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPhone";
    const bool = isIos();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains iPod", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPod";
    const bool = isIos();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains iPad", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPad";
    const bool = isIos();

    expect(bool).toBeTruthy();
  });

  it("should return false when userAgent is NOT an IOS", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPotato";
    const bool = isIos();

    expect(bool).toBeFalsy();
  });

  describe("isIOS14", () => {
    beforeEach(() => {
      // @ts-expect-error userAgent is a readonly property
      window.navigator = {};
    });

    it("should return true when userAgent contains iPhone OS 14_", () => {
      // @ts-expect-error userAgent is a readonly property
      window.navigator.userAgent = "iPhone OS 14_2";
      const bool = isIOS14();

      expect(bool).toBeTruthy();
    });

    it("should return true when userAgent contains iPhone OS 7_", () => {
      // @ts-expect-error userAgent is a readonly property
      window.navigator.userAgent = "iPhone OS 7_1";
      const bool = isIOS14();

      expect(bool).toBeTruthy();
    });

    it("should return false if when userAgent is above iOS 14", () => {
      // @ts-expect-error userAgent is a readonly property
      window.navigator.userAgent = "iPhone OS 15_1";
      const bool = isIOS14();

      expect(bool).toBeFalsy();
    });
  });

  describe("isIOS15", () => {
    beforeEach(() => {
      // @ts-expect-error navigator does not match definition
      window.navigator = {};
    });

    it("should return true when userAgent contains iPhone OS 15_", () => {
      // @ts-expect-error userAgent is a readonly property
      window.navigator.userAgent = "iPhone OS 15_2";
      const bool = !isIOS14();

      expect(bool).toBeTruthy();
    });

    it("should return true when userAgent contains iPhone OS 16_", () => {
      // @ts-expect-error userAgent is a readonly property
      window.navigator.userAgent = "iPhone OS 16_1";
      const bool = !isIOS14();

      expect(bool).toBeTruthy();
    });

    it("should return false if when userAgent is below iOS 15", () => {
      // @ts-expect-error userAgent is a readonly property
      window.navigator.userAgent = "iPhone OS 14_1";
      const bool = !isIOS14();

      expect(bool).toBeFalsy();
    });
  });
});
