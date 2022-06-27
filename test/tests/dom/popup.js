/* @flow */

import { popup } from "../../../src";

describe("popup", () => {
  let listeners = {};

  beforeEach(() => {
    window.addEventListener = (name, listener) => {
      listeners[name] = listener;
    };
  });

  afterEach(() => {
    listeners = {};
  });

  it("should close popup if parent is closed and closeOnUnload is true", () => {
    try {
      popup("https://www.paypal.com", {
        width: 100,
        height: 100,
        closeOnUnload: 1,
      });

      if (!listeners.unload) {
        throw new Error(`Popup should have unload listener registered.`);
      }
    } catch (e) {
      throw new Error(
        `Test should not fail with closeOnUnload option - ${e.message}`
      );
    }
  });

  it("should not close popup if parent is closed and closeOnUnload is false", () => {
    try {
      popup("https://www.paypal.com", {
        width: 100,
        height: 100,
        closeOnUnload: 0,
      });

      if (listeners.unload) {
        throw new Error(`Popup should not have unload listener registered.`);
      }
    } catch (e) {
      throw new Error(
        `Test should not fail with closeOnUnload option - ${e.message}`
      );
    }
  });
});
