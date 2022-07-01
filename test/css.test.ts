import { describe, expect, it } from "vitest";

import {
  isPerc,
  isPx,
  toNum,
  toPx,
  toCSS,
  percOf,
  normalizeDimension,
} from "../src/css";

describe("Css test cases", () => {
  it("should return false when given string", () => {
    const result = isPerc("hello");
    const expectedResult = false;

    expect(result).toEqual(expectedResult);
  });

  it("should return true when given percentage", () => {
    const result = isPerc("42%");
    const expectedResult = true;

    expect(result).toEqual(expectedResult);
  });

  it("should return false when given number", () => {
    const result = isPerc("42");
    const expectedResult = false;

    expect(result).toEqual(expectedResult);
  });

  it("should return true when given a value in px", () => {
    const result = isPx("42px");
    const expectedResult = true;

    expect(result).toEqual(expectedResult);
  });

  it("should return number when given a percentage", () => {
    const result = toNum("42%");
    const expectedResult = 42;

    expect(result).toEqual(expectedResult);
  });

  it("should return number when given a value in px", () => {
    const result = toNum("42px");
    const expectedResult = 42;

    expect(result).toEqual(expectedResult);
  });

  it("should return number when given a number", () => {
    const result = toNum(42);
    const expectedResult = 42;

    expect(result).toEqual(expectedResult);
  });

  it("should return an error when given a string", () => {
    try {
      toNum("test");
      throw new Error(`Expected to return an error.`);
    } catch (err) {
      if ((err as Error).message !== "Could not match css value from test") {
        throw new Error((err as Error).message);
      }
    }
  });

  it("should return a px value when given a number", () => {
    const result = toPx(42);
    const expectedResult = "42px";

    expect(result).toEqual(expectedResult);
  });

  it("should return a px value when given a percentage", () => {
    const result = toPx("42%");
    const expectedResult = "42px";

    expect(result).toEqual(expectedResult);
  });

  it("should return a px value when given a px value", () => {
    const result = toPx("42px");
    const expectedResult = "42px";

    expect(result).toEqual(expectedResult);
  });

  it("should return a px value when given a number", () => {
    const result = toCSS(42);
    const expectedResult = "42px";

    expect(result).toEqual(expectedResult);
  });

  it("should return a percentage value when given a percentage", () => {
    const result = toCSS("42%");
    const expectedResult = "42%";

    expect(result).toEqual(expectedResult);
  });

  it("should return a px value when given a px value", () => {
    const result = toCSS("42px");
    const expectedResult = "42px";

    expect(result).toEqual(expectedResult);
  });

  it("should return the percentage of a value when given a number and a percentage", () => {
    const result = percOf(50, "10%");
    const expectedResult = 5;

    expect(result).toEqual(expectedResult);
  });

  it("should return a percentage value when given a percentage dimension", () => {
    const result = normalizeDimension("50%", 10);
    const expectedResult = 5;

    expect(result).toEqual(expectedResult);
  });

  it("should return a px value when given a px dimension", () => {
    const result = normalizeDimension("50px", 10);
    const expectedResult = 50;

    expect(result).toEqual(expectedResult);
  });

  it("should return a number when given a number dimension", () => {
    const result = normalizeDimension(50, 10);
    const expectedResult = 50;

    expect(result).toEqual(expectedResult);
  });

  it("should return an error when given a string dimension", () => {
    try {
      normalizeDimension("test", 1);
      throw new Error(`Expected to return an error.`);
    } catch (err) {
      if ((err as Error).message !== "Can not normalize dimension: test") {
        throw new Error((err as Error).message);
      }
    }
  });
});
