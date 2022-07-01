import { beforeEach, describe, it, expect } from "vitest";

import { isDevice } from "../../src/device";

describe("isDevice", () => {
  beforeEach(() => {
    // @ts-expect-error navigator does not match requirements
    window.navigator = {};
  });

  it("should return true when userAgent contains android(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "android";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains webos(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "webos";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains iphone(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iphone";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains ipad(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "ipad";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains ipod(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "ipod";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains bada(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "bada";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains symbian(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "symbian";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains palm(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "palm";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains crios(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "crios";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains blackberry(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "blackberry";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains blackberry(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "blackberry";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains iemobile(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iemobile";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains windowsmobile(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "windowsmobile";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return true when userAgent contains `opera mini`(case insensitive)", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "opera mini";
    const bool = isDevice();

    expect(bool).toBeTruthy();
  });

  it("should return false when userAgent is NOT a valid choice", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "potato device";
    const bool = isDevice();

    expect(bool).toBeFalsy();
  });
});
