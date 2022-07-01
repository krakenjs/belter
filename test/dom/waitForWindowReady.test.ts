import { afterEach, describe, it } from "vitest";

import { waitForWindowReady } from "../../src/dom";

describe("waitForWindowReady function", () => {
  const oldState = document.readyState;

  afterEach(() => {
    // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
    document.readyState = oldState;
  });

  it("should resolve when window ready", async () => {
    try {
      // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
      document.readyState = "complete";
      await waitForWindowReady();
    } catch (err) {
      throw new Error("Expected waitForWindowReady to resolve");
    }
  });

  it("should resolve when window eventually loads", async () => {
    try {
      // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
      document.readyState = "loading";
      setTimeout(() => {
        // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
        document.readyState = "complete";
      }, 500);
      await waitForWindowReady();
    } catch (err) {
      throw new Error("Expected waitForWindowReady to eventually resolve");
    }
  });
});
