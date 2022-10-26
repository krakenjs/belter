// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-nested-callbacks */
/* @flow */

import { isSFVCorSafari } from "../../../src/device";
import { sfvcScreens } from "../../../src/screenHeights";

describe("isSFVCorSafari", () => {
  Object.keys(sfvcScreens).forEach((height) => {
    const textSizeHeights = sfvcScreens[height].textSizeHeights;

    describe(`Device with an outerHeight of ${height}`, () => {
      textSizeHeights.forEach((textSize) => {
        it(`iOS 14: ${textSize} text size should not be a web view`, () => {
          window.navigator.userAgent = "iPhone OS 14_1";
          const sfvc = isSFVCorSafari();
          if (!sfvc) {
            throw new Error(
              `Expected text size, ${textSize}, to not be a web view.`
            );
          }
        });
      });
    });
  });

  it("should return false when isIos function returns false", () => {
    window.navigator.userAgent = "potatoIOS";
    const sfvc = isSFVCorSafari();
    if (sfvc) {
      throw new Error(`Expected false, got ${JSON.stringify(sfvc)}`);
    }
  });
});
