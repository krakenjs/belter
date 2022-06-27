/* @flow */

import {
  getCurrentScriptUID,
  getCurrentScript,
  memoize,
  ATTRIBUTES,
  strHashStr,
} from "../../../src";

beforeEach(() => {
  const script = getCurrentScript();
  script.removeAttribute(`${ATTRIBUTES.UID}`);
  script.removeAttribute(`${ATTRIBUTES.UID}-auto`);
  script.setAttribute("src", "https://www.paypal.com/sdk/js?client-id=test");
  memoize.clear();
});

describe("get current script UID", () => {
  it("should create a data-uid-auto attribute", () => {
    getCurrentScriptUID();

    const currentScript = getCurrentScript();
    const uidAttr = currentScript.getAttribute(`${ATTRIBUTES.UID}-auto`);

    if (!uidAttr) {
      throw new Error(`Should have a 'data-uid-auto' attribute, got undefined`);
    }
  });

  it("should use script's src and attributes to create the script UID", () => {
    const currentScript: HTMLScriptElement = getCurrentScript();
    currentScript.setAttribute("data-csp-nonce", "654321");
    const { src, dataset } = currentScript;
    const stringToHash = JSON.stringify({ src, dataset });
    const hashedString = strHashStr(stringToHash);

    const uidString: string = getCurrentScriptUID();
    const uidStringWithoutPrefix = uidString.split("uid_")[1];

    if (!hashedString.includes(uidStringWithoutPrefix)) {
      throw new Error(
        `Should have generated a data-uid-auto hash value from ${stringToHash}`
      );
    }

    currentScript.removeAttribute(`${ATTRIBUTES.UID}-auto`);
    currentScript.setAttribute("data-custom-attribute", "123456");
    memoize.clear();
    const uidString2: string = getCurrentScriptUID();

    if (uidString === uidString2) {
      throw new Error(
        `Should have generated a new data-uid-auto hash value when the attributes change, got ${uidString2}`
      );
    }
  });

  it("should return data-uid if this was set", () => {
    const script: HTMLScriptElement = getCurrentScript();

    script.removeAttribute(`${ATTRIBUTES.UID}-auto`);
    script.setAttribute(`${ATTRIBUTES.UID}`, "123456");

    const uidString: string = getCurrentScriptUID();

    if (uidString !== "123456") {
      throw new Error(
        `Should have returned a data-uid with '123456', got ${uidString}`
      );
    }
  });
});
