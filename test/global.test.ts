import { describe, it, expect } from "vitest";

import { getGlobalNameSpace } from "../src/global";

describe("experiment", () => {
  it("should return the right value from the namespace", () => {
    // @ts-expect-error unknown global
    window.__goku__latest_global__ = {
      vegeta: "kamehameha",
    };
    const { get } = getGlobalNameSpace({
      name: "goku",
    });
    const res = get("vegeta");

    expect(res).toEqual("kamehameha");

    // @ts-expect-error global
    delete window.__goku__latest_global__;
  });

  it("should return default value from the namespace", () => {
    const { get } = getGlobalNameSpace({
      name: "goku",
    });
    // @ts-expect-error Argument of type 'string' is not assignable to parameter of type 'Record<string, any>'.
    const res = get("vegeta", "testingDatDefaultValue");

    expect(res).toEqual("testingDatDefaultValue");
  });
});
