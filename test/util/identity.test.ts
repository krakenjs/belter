import { describe, it, expect } from "vitest";

import { identity } from "../../src";

describe("identity", () => {
  it("should return the same value as argument passed", () => {
    const args = [null, undefined, "", 0, 22, "hello"];
    args.forEach((arg) => {
      expect(identity(arg)).toEqual(arg);
    });
    const someObj = {
      a: "a",
    };

    expect(identity(someObj)).toEqual(someObj);
  });
});
