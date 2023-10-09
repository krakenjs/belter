import { beforeEach, describe, it } from "vitest";

import { waitForDocumentReady } from "../../src/dom";
import { memoize } from "../../src/util";

describe("waitForDocumentReady cases", () => {
  beforeEach(memoize.clear);

  it("should resolve when document is interactive", async () => {
    try {
      // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
      document.readyState = "interactive";
      await waitForDocumentReady();
    } catch (err) {
      throw new Error("Expected waitForDocumentReady to resolve");
    }
  });

  it("should eventully resolve when document is ready", async () => {
    try {
      // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
      document.readyState = "loading";
      setTimeout(() => {
        // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
        document.readyState = "complete";
      }, 20);
      await waitForDocumentReady();
    } catch (err) {
      throw new Error(
        `Expected waitForDocumentReady to eventully resolve when document is ready: ${
          (err as Error).message
        }`
      );
    }
  });
});
