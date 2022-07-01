import { describe, it, expect } from "vitest";

import { extend } from "../../src";

describe("extend cases", () => {
  it("should add keys from one object to another", () => {
    const obj1: Record<string, any> = {
      foo: 1,
      bar: 2,
      baz: 3,
    };
    const obj2: Record<string, any> = {
      blep: 4,
      blop: 5,
      bloop: 6,
    };
    extend(obj1, obj2);

    expect(obj1.blep).toEqual(4);
    expect(obj1.blop).toEqual(5);
    expect(obj1.bloop).toEqual(6);
  });

  it("should return same object when second argument is empty", () => {
    const result = extend({ a: true }, {});
    const arrayResult = Object.entries(result).flat();

    expect(arrayResult[0]).toEqual("a");
    expect(arrayResult[1]).toBeTruthy();
  });

  it("should return the extend object when Object.assign is not valid", () => {
    const originalFunc = Object.assign;
    Reflect.deleteProperty(Object, "assign");
    const result = extend({ a: true }, { b: false });
    const arrayResult = Object.entries(result).flat();

    if (
      arrayResult[0] !== "a" ||
      !arrayResult[1] ||
      arrayResult[2] !== "b" ||
      arrayResult[3]
    ) {
      throw new Error(
        `should return the extended object, but got: ${String(result)}`
      );
    }

    Reflect.defineProperty(Object, "assign", originalFunc);
  });
});
