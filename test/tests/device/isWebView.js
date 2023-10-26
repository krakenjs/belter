/* @flow */

import { isWebView } from "../../../src/device";

describe("isWebView", () => {
  beforeEach(() => {
    window.navigator = {};
  });
  it("should return false when userAgent is invalid", () => {
    window.navigator.userAgent = "invalid potato";
    const bool = isWebView();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when userAgent is valid and begins with iPhone or iPod or iPad or Macintosh(case insensitive)", () => {
    window.navigator.userAgent = "ipod.potatoAppleWebKit.potato";
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when userAgent contains whole word wv", () => {
    window.navigator.userAgent = "wv";
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when userAgent contains Mobile but not Safari and not WKWebView", () => {
    window.navigator.userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when userAgent contains Mobile and Safari and WKWebView", () => {
    window.navigator.userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_18.5.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US ByteFullLocale/en isDarkMode/0 Safari/604.1 WKWebView/1";
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when userAgent is valid and starts with android(case insensitive)", () => {
    window.navigator.userAgent = "android.potatoVersion/9.3";
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when userAgent is valid and contains the wv field", () => {
    window.navigator.userAgent =
      "dkdfsna/5.25.638 Dalvik/2.1.0 (Linux; U; Android 13; SM-S908U1 Build/TP1A.220624.014; wv )";
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when userAgent is valid and contains 'wv' in the word 'Dalwvik' only", () => {
    window.navigator.userAgent = `dkdfsna/5.25.638 Dalwvik/2.1.0 (Linux; U; Android 13; SM-S908U1 Build/TP1A.220624.014;)`;
    const bool = isWebView();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when it is a valid WebView UA in Android 10 and above", () => {
    window.navigator.userAgent = `Mozilla/5.0 (Linux; U; Android 10; SM-G960F Build/QP1A.190711.020; wv)
    AppleWebKit/537.36 (KHTML, like Gecko) 
    Version/4.0 Chrome/95.0.4638.50 Mobile Safari/537.36 OPR/60.0.2254.59405`;
    const bool = isWebView();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
});
