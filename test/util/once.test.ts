import { describe, it, expect } from "vitest";

import { once } from "../../src";

describe("once cases", () => {
  it("should create a one time function", () => {
    let counter = 0;
    const add = once(() => {
      counter += 1;
    });
    add();
    add();
    add();
    add();
    add();

    expect(counter).toEqual(1);
  });
});
