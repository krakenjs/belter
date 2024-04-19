/* @flow */

import { supportsPopups } from "../../../src/device";

describe("supportsPopups", () => {
  beforeEach(() => {
    window.navigator.userAgent = "anthonykhoa wants to work at paypal :D";
    Object.defineProperty(window, "status", { writable: true, value: {} });
  });
  it("should return false when isIosWebview function returns true", () => {
    window.navigator.userAgent = "iPhone GSA";
    const bool = supportsPopups();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when isAndroidWebview function returns true", () => {
    window.navigator.userAgent = "AndroidVersion/9";
    const bool = supportsPopups();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when isOperaMini function returns true", () => {
    window.navigator.userAgent = "Opera Mini";
    const bool = supportsPopups();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when isFirefoxIOS function returns true", () => {
    window.navigator.userAgent = "fxios";
    const bool = supportsPopups();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when isEdgeIOS function returns true", () => {
    window.navigator.userAgent = "edgios";
    const bool = supportsPopups();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when isFacebookWebView function returns true", () => {
    window.navigator.userAgent = "FBAN";
    const bool = supportsPopups();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when QQBrowser function returns true", () => {
    window.navigator.userAgent = "QQBrowser";
    const bool = supportsPopups();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when isElectron function returns true", () => {
    global.process.versions.electron = true;
    const bool = supportsPopups();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when isMacOsCna function returns true", () => {
    window.navigator.userAgent = "macintosh.potatoAppleWebKit";
    const bool = supportsPopups();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when isStandAlone function returns true", () => {
    window.navigator.standalone = true;
    const bool = supportsPopups();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when every function call returns false", () => {
    // makes isElectron function return false
    global.process = {};
    // matchMedia and navigator.standalone are set to make isStandAlone function return false
    window.matchMedia = () => ({ matches: false });

    window.navigator.standalone = false;
    const bool = supportsPopups();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  describe("Chrome for Android", () => {
    it("should return true when it is a valid Phone UA", () => {
      window.navigator.userAgent = `Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) 
      AppleWebKit/535.19 (KHTML, like Gecko) 
      Chrome/18.0.1025.133 Mobile Safari/535.19`;
      const bool = supportsPopups();
      if (!bool) {
        throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
      }
    });
    it("should return true when it is a valid Tablet UA", () => {
      window.navigator.userAgent = `Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) 
      AppleWebKit/535.19 (KHTML, like Gecko) 
      Chrome/18.0.1025.133 Safari/535.19`;
      const bool = supportsPopups();
      if (!bool) {
        throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
      }
    });
  });
  describe("Chrome for iOS", () => {
    it("should return true when it is a valid Chrome UA on iPhone", () => {
      window.navigator.userAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1`;
      const bool = supportsPopups();
      if (!bool) {
        throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
      }
    });
    it("should return true when it is a valid Mobile Safari UA", () => {
      window.navigator.userAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/603.1.23 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1`;
      const bool = supportsPopups();
      if (!bool) {
        throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
      }
    });
    it("should return true when it is a valid Desktop Safari UA", () => {
      window.navigator.userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5)
      AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/85
      Version/11.1.1 Safari/605.1.15`;
      const bool = supportsPopups();
      if (!bool) {
        throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
      }
    });
    it("should return true when in facebook multiwindow experiment", () => {
      window.navigator.userAgent = `Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv)
      AppleWebKit/537.36 (KHTML, like Gecko) 
      Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/44.25.0.1;FB/MW]`;
      const result = supportsPopups();
      if (!result) {
        throw new Error(
          `Expected to support popups, got ${JSON.stringify(result)}`
        );
      }
    });
  });
  describe("WebView on Android", () => {
    it("should return false when it is a valid WebView UA in KitKat to Lollipop", () => {
      window.navigator.userAgent = `Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) 
      AppleWebKit/537.36 (KHTML, like Gecko) 
      Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36`;
      const bool = supportsPopups();
      if (bool) {
        throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
      }
    });
    it("should return false when it is a valid WebView UA in Lollipop to Android 10", () => {
      window.navigator.userAgent = `Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv)
      AppleWebKit/537.36 (KHTML, like Gecko) 
      Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36`;
      const bool = supportsPopups();
      if (bool) {
        throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
      }
    });
  });
});
