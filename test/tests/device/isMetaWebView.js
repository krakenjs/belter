/* @flow */

import { isMetaWebView } from "../../../src/device";

describe("isMetaWebView", () => {
  const IOS_INSTAGRAM_USER_AGENT =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F90 Instagram 339.0.3.12.91 (iPhone15,3; iOS 17_5_1; en_US; en; scale=3.00; 1290x2796; 619461904; IABMV/1)";

  const ANDROID_INSTAGRAM_USER_AGENT =
    "Mozilla/5.0 (Linux; Android 9; moto e(6) plus Build/PTAS29.401-58-8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.5615.101 Mobile Safari/537.36 Instagram 278.0.0.21.117 Android (28/9; 280dpi; 720x1418; motorola; moto e(6) plus; pokerp; mt6762; en_GB; 464315243)";

  const IOS_FACEBOOK_USERAGENT =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F90 [FBAN/FBIOS;FBAV/474.0.0.28.107;FBBV/625583284;FBDV/iPhone11,8;FBMD/iPhone;FBSN/iOS;FBSV/17.5.1;FBSS/2;FBID/phone;FBLC/es_LA;FBOP/5;FBRV/627786156]";

  const ANDROID_FACEBOOK_USERAGENT =
    "Mozilla/5.0 (Linux; Android 14; Pixel 6 Build/AP2A.240705.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.61 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/474.0.0.52.74;IABMV/1;]";
  beforeEach(() => {
    window.navigator = {};
  });
  // Tests using Instagram UA
  it("should return true for iOS Instagram Webview", () => {
    window.navigator.userAgent = IOS_INSTAGRAM_USER_AGENT;
    const bool = isMetaWebView();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true for Android Instagram Webview", () => {
    window.navigator.userAgent = ANDROID_INSTAGRAM_USER_AGENT;
    const bool = isMetaWebView();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return true for iOS Instagram Webview when User Agent is passed as param", () => {
    const bool = isMetaWebView(IOS_INSTAGRAM_USER_AGENT);
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true for Android Instagram Webview  when User Agent is passed as param", () => {
    const bool = isMetaWebView(ANDROID_INSTAGRAM_USER_AGENT);
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });

  // Tests using FB user agents

  it("should return true for iOS Facebook Webview", () => {
    window.navigator.userAgent = IOS_FACEBOOK_USERAGENT;
    const bool = isMetaWebView();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true for Android Facebook Webview", () => {
    window.navigator.userAgent = ANDROID_FACEBOOK_USERAGENT;
    const bool = isMetaWebView();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return true for iOS Facebook Webview when User Agent is passed as param", () => {
    const bool = isMetaWebView(IOS_FACEBOOK_USERAGENT);
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true for Android Facebook Webview  when User Agent is passed as param", () => {
    const bool = isMetaWebView(ANDROID_FACEBOOK_USERAGENT);
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return false when userAgent does NOT contain Instagram", () => {
    window.navigator.userAgent = "potato";
    const bool = isMetaWebView();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
});
