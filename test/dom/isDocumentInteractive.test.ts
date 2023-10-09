import { describe, expect, it } from "vitest";

import { isDocumentInteractive } from "../../src";

describe("document interactive cases", () => {
  it("should return false when document is not interactive", () => {
    // document.readyState will be equal to 'complete' as it was set to be in the last test
    const result = isDocumentInteractive();

    expect(result).toBeFalsy();
  });

  it("should return true when document is interactive", () => {
    const oldState = document.readyState;
    // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
    document.readyState = "interactive";
    const result = isDocumentInteractive();
    // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
    document.readyState = oldState;

    expect(result).toBeTruthy();
  });
});
