/* @flow */
import { describe, test, expect } from "vitest";

import { supportsPopups, isPopupSupportedWebview } from "./device";

describe("supportsPopups", () => {
  test("returns true when short circuited", () => {
    const ua = `Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv)
    AppleWebKit/537.36 (KHTML, like Gecko) 
    Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/44.25.0.1;FB/MW]`;
    expect(supportsPopups(ua)).toBe(true);
  });
});

describe("isPopupSupportedWebview", () => {
  test("returns true when fb webview supported user agent", () => {
    const ua = `Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv)
    AppleWebKit/537.36 (KHTML, like Gecko) 
    Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/44.25.0.1;FB/MW]`;
    expect(isPopupSupportedWebview(ua)).toBe(true);
  });
});
