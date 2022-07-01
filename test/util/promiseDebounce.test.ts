import { describe, it, expect } from "vitest";

import { promiseDebounce } from "../../src";

describe("promiseDebounce cases", () => {
  it("promiseDebounce should return original function", () => {
    const debouncedFunc = promiseDebounce(() => true);
    const result = debouncedFunc();

    expect(result).toBeTruthy();
  });

  it("promiseDebounce should throw and error", () => {
    const debouncedFunc = promiseDebounce(() => {
      throw new Error("unexpected");
    });

    debouncedFunc().catch((err: unknown) => {
      expect((err as Error).message).toEqual("unexpected");
    });
  });
});
