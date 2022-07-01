/* eslint max-nested-callbacks: off */
import { describe, it, expect } from "vitest";

import { isSFVC } from "../../src/device";
import { sfvcScreens } from "../../src/screenHeights";

describe("isSFVC", () => {
  (Object.keys(sfvcScreens) as Array<keyof typeof sfvcScreens>).forEach(
    (height) => {
      const textSizeHeights = sfvcScreens[height].textSizeHeights;
      describe(`iOS 14 device with an outerHeight of ${height}`, () => {
        textSizeHeights.forEach((textSize) => {
          it(`iOS14: ${textSize} text size should be a SFVC`, () => {
            // @ts-expect-error userAgent is a readonly property
            window.navigator.userAgent = "iPhone OS 14_2";
            // @ts-expect-error height is a string not a number
            window.outerHeight = height;
            window.innerHeight = textSize;
            window.innerWidth = 372;
            // @ts-expect-error not a full representation of screen
            window.screen = {
              width: 372,
            };
            const sfvc = isSFVC();

            expect(sfvc).toBeTruthy();
          });
        });
      });
    }
  );

  (Object.keys(sfvcScreens) as Array<keyof typeof sfvcScreens>).forEach(
    (height) => {
      const textSizeHeights = sfvcScreens[height].textSizeHeights;
      describe(`iOS 15 device with an outer height of ${height}`, () => {
        textSizeHeights.forEach((textSize) => {
          it(`iOS15: ${textSize} text size should be a SFVC`, () => {
            // @ts-expect-error userAgent is a readonly property
            window.navigator.userAgent = "iPhone OS 15_2";
            // @ts-expect-error height is a string not a number
            window.outerHeight = height;
            window.innerHeight = textSize;
            window.innerWidth = 372;
            // @ts-expect-error not a full representation of screen
            window.screen = {
              width: 372,
            };
            const sfvc = isSFVC();

            expect(sfvc).toBeTruthy();
          });
        });
      });
    }
  );

  it("should return false when not iOS device", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "potatoIOS";
    const sfvc = isSFVC();

    expect(sfvc).toBeFalsy();
  });

  it("should return true if device is not supported", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPhone OS 15_2";
    window.outerHeight = 647;
    window.innerHeight = 647;
    window.innerWidth = 372;
    // @ts-expect-error not a full representation of screen
    window.screen = {
      width: 372,
    };
    const sfvc = isSFVC();

    expect(sfvc).toBeTruthy();
  });

  it("should return true if device dimension is SFVC dimension with scale=1.0 with tabbar showing", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPhone OS 15_2";
    window.outerHeight = 844;
    window.innerHeight = 670;
    window.innerWidth = 372;
    // @ts-expect-error not a full representation of screen
    window.screen = {
      width: 372,
    };
    const sfvc = isSFVC();

    expect(sfvc).toBeTruthy();
  });

  it("should return true if device dimension is SFVC dimension with scale=1.0 with tabbar not showing", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPhone OS 15_2";
    window.outerHeight = 844;
    window.innerHeight = 778;
    window.innerWidth = 372;
    // @ts-expect-error not a full representation of screen
    window.screen = {
      width: 372,
    };
    const sfvc = isSFVC();

    expect(sfvc).toBeTruthy();
  });

  it("should return true if browser scale is greater than 1 for iOS 15", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPhone OS 15_2";
    window.innerWidth = 372;
    // @ts-expect-error not a full representation of screen
    window.screen = {
      width: 428,
    };
    const sfvc = isSFVC();

    expect(sfvc).toBeTruthy();
  });

  it("should calculate SFVC based on browser zoom for iOS 14", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPhone OS 14_2";
    window.outerHeight = 926;
    window.innerHeight = 650;
    window.innerWidth = 372;
    // @ts-expect-error not a full representation of screen
    window.screen = {
      width: 428,
    };
    const sfvc = isSFVC();

    expect(sfvc).toBeTruthy();
  });

  it("should return false if device is supported but innerHeight does not match SFVC dimensions and scale is 1 for iOS 14", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPhone OS 14_2";
    window.outerHeight = 926;
    window.innerHeight = 740;
    window.innerWidth = 428;
    // @ts-expect-error not a full representation of screen
    window.screen = {
      width: 428,
    };
    const sfvc = isSFVC();

    expect(sfvc).toBeFalsy();
  });

  it("should return false if device is supported but innerHeight does not match SFVC dimensions and scale is greater than 1 for iOS 14", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPhone OS 14_2";
    window.outerHeight = 926;
    window.innerHeight = 740;
    window.innerWidth = 372;
    // @ts-expect-error not a full representation of screen
    window.screen = {
      width: 428,
    };
    const sfvc = isSFVC();

    expect(sfvc).toBeFalsy();
  });

  it("should return false if device is supported but innerHeight does not match SFVC dimensions and scale is 1 for iOS 15", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPhone OS 15_2";
    window.outerHeight = 926;
    window.innerHeight = 740;
    window.innerWidth = 428;
    // @ts-expect-error not a full representation of screen
    window.screen = {
      width: 428,
    };
    const sfvc = isSFVC();

    expect(sfvc).toBeFalsy();
  });
});
