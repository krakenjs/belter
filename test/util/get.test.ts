import { describe, it, expect } from "vitest";

import { get } from "../../src";

describe("get cases", () => {
  const expectedResult = 10;
  it("get should return default value", () => {
    const result = get({}, "", expectedResult);
    expect(result).toEqual(expectedResult);
  });

  it("get should get deep keys", () => {
    const result = get({ value: { result: expectedResult } }, "value.result");
    expect(result).toEqual(expectedResult);
  });

  it("get should get deep keys", () => {
    const result = get({ value: { result: expectedResult } }, "value.result");
    expect(result).toEqual(expectedResult);
  });

  it("get should get deep keys with default value", () => {
    const result = get({}, "value.result", expectedResult);
    expect(result).toEqual(expectedResult);
  });
});
