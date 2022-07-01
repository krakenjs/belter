import { describe, it, expect } from "vitest";

import { isDocumentReady } from "../../src/dom";

describe("isDocumentReady cases", () => {
  const oldState = document.readyState;

  it("should return false when document is not ready", () => {
    // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
    document.readyState = "loading";
    const result = isDocumentReady();
    // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
    document.readyState = oldState;

    expect(result).toBeFalsy();
  });

  it("should return true when document is ready", () => {
    // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
    document.readyState = "complete";
    const result = isDocumentReady();
    // @ts-expect-error Cannot assign to 'readyState' because it is a read-only property.
    document.readyState = oldState;

    expect(result).toBeTruthy();
  });
});
