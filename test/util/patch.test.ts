import { describe, it, expect } from "vitest";

import { patchMethod } from "../../src";

describe("patchMethod cases", () => {
  it("patchMethod should return original function", () => {
    const obj = {
      custom(): string {
        return "first";
      },
    };

    const handler = ({ callOriginal }: { callOriginal: () => unknown }) => {
      return callOriginal();
    };

    patchMethod(obj, "custom", handler);
    const result = obj.custom();

    expect(result).toEqual("first");
  });
});
