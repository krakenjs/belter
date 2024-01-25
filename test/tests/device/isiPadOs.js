/* @flow */

import { isIpadOs } from "../../../src/device";

describe("isIpadOs", () => {
  beforeEach(() => {
    window.navigator = {};
  });

  it("should return true when userAgent is Safari and has multiple maxTouchPoints", () => {
    window.navigator.userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15";
    // eslint-disable-next-line compat/compat
    window.navigator.maxTouchPoints = 5;
    const bool = isIpadOs();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return true when userAgent is Firefox and has multiple maxTouchPoints", () => {
    window.navigator.userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15";
    // eslint-disable-next-line compat/compat
    window.navigator.maxTouchPoints = 5;
    const bool = isIpadOs();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return true when userAgent is Chrome and has multiple maxTouchPoints", () => {
    window.navigator.userAgent =
      "Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1";
    // eslint-disable-next-line compat/compat
    window.navigator.maxTouchPoints = 5;
    const bool = isIpadOs();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return true when userAgent is iPad", () => {
    window.navigator.userAgent = "iPad";
    const bool = isIpadOs();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return false when userAgent is Safari but has no touchpoints", () => {
    window.navigator.userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15";
    // eslint-disable-next-line compat/compat
    window.navigator.maxTouchPoints = 0;
    const bool = isIpadOs();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return false when userAgent contains iPhone", () => {
    window.navigator.userAgent = "iPhone";
    const bool = isIpadOs();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return false when userAgent contains iPod", () => {
    window.navigator.userAgent = "iPod";
    const bool = isIpadOs();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
});
