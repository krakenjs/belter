import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { waitForDocumentBody } from "../../src/dom";
import { memoize } from "../../src/util";

/**
 * This test needs a real DOM environment. It use to run in karma, but we migrated to vitest.
 */
describe.skip("waitForDocumentBody cases", () => {
  const oldBody = document.body;
  const testBody = document.createElement("body");

  beforeEach(memoize.clear);

  afterEach(() => {
    document.body = oldBody;
  });

  it("should resolve when body is present", async () => {
    // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
    document.readyState = "complete";

    document.body = testBody;
    const result = await waitForDocumentBody();

    expect(result).toEqual(testBody);
  });

  it("should eventully resolve when document is ready", async () => {
    // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
    document.readyState = "loading";

    document.body = null as unknown as HTMLElement;

    setTimeout(() => {
      // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
      document.readyState = "complete";

      document.body = testBody;
    }, 20);

    const result = await waitForDocumentBody();

    expect(result).toEqual(testBody);
  });
});
