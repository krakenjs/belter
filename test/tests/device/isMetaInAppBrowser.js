/* @flow */

import { isMetaInAppBrowser } from "../../../src/device";

describe("isMetaInAppBrowser", () => {
  const INSTAGRAM_USER_AGENT_IN_APP_BROWSER =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F90 Instagram 339.0.3.12.91 (iPhone15,3; iOS 17_5_1; en_US; en; scale=3.00; 1290x2796; 619461904; IABMV/1)";

  const INSTAGRAM_USER_AGENT_WEBVIEW =
    "Mozilla/5.0 (Linux; Android 9; moto e(6) plus Build/PTAS29.401-58-8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.5615.101 Mobile Safari/537.36 Instagram 278.0.0.21.117 Android (28/9; 280dpi; 720x1418; motorola; moto e(6) plus; pokerp; mt6762; en_GB; 464315243)";

  const FACEBOOK_USER_AGENT_WEBVIEW =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F90 [FBAN/FBIOS;FBAV/474.0.0.28.107;FBBV/625583284;FBDV/iPhone11,8;FBMD/iPhone;FBSN/iOS;FBSV/17.5.1;FBSS/2;FBID/phone;FBLC/es_LA;FBOP/5;FBRV/627786156]";

  const FACEBOOK_USER_AGENT_IN_APP_BROWSER =
    "Mozilla/5.0 (Linux; Android 14; Pixel 6 Build/AP2A.240705.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.61 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/474.0.0.52.74;IABMV/1;]";
  beforeEach(() => {
    window.navigator = {};
  });
  // Tests using Instagram UA
  it("should return true for Instagram In App Browser", () => {
    window.navigator.userAgent = INSTAGRAM_USER_AGENT_IN_APP_BROWSER;
    const bool = isMetaInAppBrowser();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false for Instagram Webview", () => {
    window.navigator.userAgent = INSTAGRAM_USER_AGENT_WEBVIEW;
    const bool = isMetaInAppBrowser();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return true for Instagram In App Browser when UA is passed as param", () => {
    const bool = isMetaInAppBrowser(INSTAGRAM_USER_AGENT_IN_APP_BROWSER);
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false for Instagram Webview when UA is passed as param", () => {
    const bool = isMetaInAppBrowser(INSTAGRAM_USER_AGENT_WEBVIEW);
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });

  // Tests using FB user agents

  it("should return true for Facebook In App Browser", () => {
    window.navigator.userAgent = FACEBOOK_USER_AGENT_IN_APP_BROWSER;
    const bool = isMetaInAppBrowser();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false for Facebook Webview", () => {
    window.navigator.userAgent = FACEBOOK_USER_AGENT_WEBVIEW;
    const bool = isMetaInAppBrowser();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return true for Facebook In App Browser when UA is passed as param", () => {
    const bool = isMetaInAppBrowser(FACEBOOK_USER_AGENT_IN_APP_BROWSER);
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false for Facebook Webview when UA is passed as param", () => {
    const bool = isMetaInAppBrowser(FACEBOOK_USER_AGENT_WEBVIEW);
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });

  it("should return false when userAgent does NOT contain IABMV/1", () => {
    window.navigator.userAgent = "potato";
    const bool = isMetaInAppBrowser();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
});
