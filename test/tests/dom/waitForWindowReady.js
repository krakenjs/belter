/* @flow */

import { waitForWindowReady } from "../../../src/dom";

describe("waitForWindowReady function", () => {
  const oldState = document.readyState;

  afterEach(() => {
    document.readyState = oldState;
  });

  it("should resolve when window ready", async () => {
    try {
      document.readyState = "complete";
      await waitForWindowReady();
    } catch (err) {
      throw new Error("Expected waitForWindowReady to resolve");
    }
  });

  it("should resolve when window eventually loads", async () => {
    try {
      document.readyState = "loading";
      setTimeout(() => {
        document.readyState = "complete";
      }, 500);
      await waitForWindowReady();
    } catch (err) {
      throw new Error("Expected waitForWindowReady to eventually resolve");
    }
  });
});
