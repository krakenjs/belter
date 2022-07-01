import { beforeEach, describe, it, expect } from "vitest";

import {
  getCurrentScriptUID,
  getCurrentScript,
  memoize,
  ATTRIBUTES,
  strHashStr,
} from "../../src";

beforeEach(() => {
  const script = getCurrentScript();
  script.removeAttribute(`${ATTRIBUTES.UID}`);
  script.removeAttribute(`${ATTRIBUTES.UID}-auto`);
  script.setAttribute("src", "https://www.paypal.com/sdk/js?client-id=test");
  memoize.clear();
});

/**
 * This test needs a real DOM environment. It use to run in karma, but we migrated to vitest.
 */
describe.skip("get current script UID", () => {
  it("should create a data-uid-auto attribute", () => {
    getCurrentScriptUID();
    const currentScript = getCurrentScript();
    const uidAttr = currentScript.getAttribute(`${ATTRIBUTES.UID}-auto`);

    expect(uidAttr).toBeTruthy();
  });

  it("should use script's src and attributes to create the script UID", () => {
    const currentScript: HTMLScriptElement = getCurrentScript();
    currentScript.setAttribute("data-csp-nonce", "654321");
    const { src, dataset } = currentScript;
    const stringToHash = JSON.stringify({
      src,
      dataset,
    });
    const hashedString = strHashStr(stringToHash);
    const uidString: string = getCurrentScriptUID();
    const uidStringWithoutPrefix = uidString.split("uid_")[1];

    expect(hashedString.includes(uidStringWithoutPrefix)).toBeTruthy();

    currentScript.removeAttribute(`${ATTRIBUTES.UID}-auto`);
    currentScript.setAttribute("data-custom-attribute", "123456");
    memoize.clear();
    const uidString2: string = getCurrentScriptUID();

    expect(uidString).not.toEqual(uidString2);
  });

  it("should return data-uid if this was set", () => {
    const script: HTMLScriptElement = getCurrentScript();
    script.removeAttribute(`${ATTRIBUTES.UID}-auto`);
    script.setAttribute(`${ATTRIBUTES.UID}`, "123456");
    const uidString: string = getCurrentScriptUID();

    expect(uidString).toEqual("123456");
  });
});
