/* eslint max-nested-callbacks: off */
import { describe, it, expect } from "vitest";

import { isSFVCorSafari } from "../../src/device";
import { sfvcScreens } from "../../src/screenHeights";

describe("isSFVCorSafari", () => {
  (Object.keys(sfvcScreens) as Array<keyof typeof sfvcScreens>).forEach(
    (height) => {
      const textSizeHeights = sfvcScreens[height].textSizeHeights;
      describe(`Device with an outerHeight of ${height}`, () => {
        textSizeHeights.forEach((textSize) => {
          it(`iOS 14: ${textSize} text size should not be a web view`, () => {
            // @ts-expect-error height is string not a number
            window.outerHeight = height;
            window.innerHeight = textSize;
            window.innerWidth = 372;
            // @ts-expect-error not a full representation of screen
            window.screen = {
              width: 372,
            };

            // @ts-expect-error userAgent is a readonly property
            window.navigator.userAgent = "iPhone OS 14_1";
            const sfvc = isSFVCorSafari();

            expect(sfvc).toBeTruthy();
          });
        });
      });
    }
  );

  it("should return false when isIos function returns false", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "potatoIOS";
    const sfvc = isSFVCorSafari();

    expect(sfvc).toBeFalsy();
  });
});
