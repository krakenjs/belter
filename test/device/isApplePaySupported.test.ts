import { describe, it, expect } from "vitest";

import { isApplePaySupported } from "../../src/device";

describe("isApplePaySupported", () => {
  it("should return true if ApplePaySession and canMakePayments is true", () => {
    // @ts-expect-error ApplePaySession does not exist on window
    window.ApplePaySession = {
      supportsVersion: () => {
        return true;
      },
      canMakePayments: () => {
        return true;
      },
    };
    const bool = isApplePaySupported();

    expect(bool).toBeTruthy();
  });

  it("should return false if ApplePaySession and canMakePayments is false", () => {
    // @ts-expect-error ApplePaySession does not exist on window
    window.ApplePaySession = null;
    const bool = isApplePaySupported();

    expect(bool).toBeFalsy();
  });
});
