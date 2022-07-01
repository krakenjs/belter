import { beforeEach, describe, it, expect, vi } from "vitest";

import { supportsPopups } from "../../src/device";

describe("supportsPopups", () => {
  beforeEach(() => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "anthonykhoa wants to work at paypal :D";
    Object.defineProperty(window, "status", {
      writable: true,
      value: {},
    });
  });

  it("should return false when isIosWebview function returns true", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "iPhone GSA";
    const bool = supportsPopups();

    expect(bool).toBeFalsy();
  });

  it("should return false when isAndroidWebview function returns true", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "AndroidVersion/9";
    const bool = supportsPopups();

    expect(bool).toBeFalsy();
  });

  it("should return false when isOperaMini function returns true", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "Opera Mini";
    const bool = supportsPopups();

    expect(bool).toBeFalsy();
  });

  it("should return false when isFirefoxIOS function returns true", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "fxios";
    const bool = supportsPopups();

    expect(bool).toBeFalsy();
  });

  it("should return false when isEdgeIOS function returns true", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "edgios";
    const bool = supportsPopups();

    expect(bool).toBeFalsy();
  });

  it("should return false when isFacebookWebView function returns true", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "FBAN";
    const bool = supportsPopups();

    expect(bool).toBeFalsy();
  });

  it("should return false when QQBrowser function returns true", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "QQBrowser";
    const bool = supportsPopups();

    expect(bool).toBeFalsy();
  });

  it("should return false when isElectron function returns true", () => {
    // @ts-expect-error userAgent is a readonly property
    global.process.versions.electron = true;
    const bool = supportsPopups();

    expect(bool).toBeFalsy();
  });

  it("should return false when isMacOsCna function returns true", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.userAgent = "macintosh.potatoAppleWebKit";
    const bool = supportsPopups();

    expect(bool).toBeFalsy();
  });

  it("should return false when isStandAlone function returns true", () => {
    // @ts-expect-error userAgent is a readonly property
    window.navigator.standalone = true;
    const bool = supportsPopups();

    expect(bool).toBeFalsy();
  });

  it.skip("should return true when every function call returns false", () => {
    // makes isElectron function return false
    vi.mock("process", () => {
      return { version: false };
    });

    // matchMedia and navigator.standalone are set to make isStandAlone function return false
    // @ts-expect-error - doesnt have all properties of matchMedia
    window.matchMedia = () => ({
      matches: false,
    });

    // @ts-expect-error standalone does not exist
    window.navigator.standalone = false;

    expect(supportsPopups()).toBeTruthy();

    vi.clearAllMocks();
  });
});
