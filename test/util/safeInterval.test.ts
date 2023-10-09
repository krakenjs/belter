import { describe, it } from "vitest";

import { safeInterval } from "../../src";

describe("safeInterval cases", () => {
  it("safeInterval should safely debounce the function", () => {
    safeInterval(() => true, 50);
  });

  it("safeInterval should cancel the debounced function", () => {
    const result = safeInterval(() => true, 50);

    result.cancel();
  });
});
