import { describe, it, expect } from "vitest";

import {
  perc,
  min,
  max,
  roundUp,
  regexMap,
  svgToBase64,
  objFilter,
  regexTokenize,
  camelToDasherize,
  dasherizeToCamel,
  capitalizeFirstLetter,
  arrayFrom,
  isObject,
  isObjectObject,
} from "../../src/util";

describe("util cases", () => {
  const sourceValues = [7, 30, 1];

  it("perc", () => {
    const result = perc(1000, 50);
    expect(result).toEqual(500);
  });

  it("min", () => {
    const result = min(...sourceValues);
    expect(result).toEqual(1);
  });

  it("max", () => {
    const result = max(...sourceValues);
    expect(result).toEqual(30);
  });

  it("roundUp", () => {
    const result = roundUp(10, 5);
    expect(result).toEqual(10);
  });

  it("roundUp", () => {
    const result = roundUp(10, 6);
    expect(result).toEqual(12);
  });

  it("regexMap", () => {
    const expectedResult = "test";
    const result = regexMap(expectedResult, /[a-z]*/);

    expect(result[0]).toEqual(expectedResult);
  });

  it("svgToBase64", () => {
    const expectedResult = "data:image/svg+xml;base64,YQ";
    // $FlowFixMe incompatible-call
    const result = svgToBase64("a");
    expect(result).toEqual(expectedResult);
  });

  it("objFilter", () => {
    const result = objFilter({ value: true, value1: false }, (value) => value);
    expect(result.value).toBeTruthy();
  });

  it("regexTokenize", () => {
    const expectedResult = "test";
    const result = regexTokenize(expectedResult, /[a-z]+/);
    expect(result[0]).toEqual(expectedResult);
  });

  it("camelToDasherize and dasherizeToCamel", () => {
    const dasherize = camelToDasherize("TestCase");
    const undasherize = dasherizeToCamel(dasherize);
    expect(dasherize).toEqual("-test-case");
    expect(undasherize).toEqual("TestCase");
  });

  it("capitalizeFirstLetter", () => {
    const expectedResult = "Test";
    const result = capitalizeFirstLetter("test");
    expect(result).toEqual(expectedResult);
  });

  it("arrayFrom", () => {
    const result = arrayFrom([1, 2, 3]);

    expect(result).toHaveLength(3);
  });

  it("isObject", () => {
    const result = isObject({});
    expect(result).toBeTruthy();
  });

  it("isObjectObject", () => {
    const result = isObjectObject({});
    expect(result).toBeTruthy();
  });
});
