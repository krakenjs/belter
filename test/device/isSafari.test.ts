import { describe, it, expect } from "vitest";

import { isSafari } from "../../src/device";

describe("isSafari", () => {
  it("should return false when userAgent does NOT contain Safari", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "potato";
    const bool = isSafari();

    expect(bool).toBeFalsy();
  });

  describe("user agents other than safari", () => {
    const ineligibleUserAgents = [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4", // Firefox - iPhone
      "Mozilla/5.0 (iPad; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4", // Firefox - iPad
      "Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 EdgiOS/44.5.0.10 Mobile/15E148 Safari/604.1", // Microsoft Edge - iPhone
    ];

    for (const userAgent of ineligibleUserAgents) {
      // unsafe access of window in a loop
      // eslint-disable-next-line  @typescript-eslint/no-loop-func
      it(`should return false when userAgent is ${userAgent} `, () => {
        // @ts-expect-error userAgent is a readonly property
        window.navigator.userAgent = userAgent;
        const bool = isSafari();

        expect(bool).toBeFalsy();
      });
    }
  });
});
