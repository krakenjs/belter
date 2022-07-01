import { describe, it, expect } from "vitest";

import { awaitKey } from "../../src";

describe("awaitKey cases", () => {
  it("awaitKey should return the value when existing", () => {
    const obj = {
      custom: true,
    };
    const result = awaitKey(obj, "custom");
    expect(result).toBeTruthy();
  });

  it("awaitKey should return the configured value when does not exists", () => {
    const obj: { custom?: unknown } = {};

    void awaitKey(obj, "custom");
    obj.custom = "result";

    const result = obj.custom;

    expect(result).toEqual("result");
  });
});
