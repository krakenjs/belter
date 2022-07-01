import { describe, it, expect } from "vitest";

import { extendUrl } from "../../src";

describe("extend url cases", () => {
  it("should add query parameters to url", () => {
    const query1 = {
      query: {
        bar: "baz",
      },
    };
    const result1 = extendUrl("http://foo.com", query1);
    const expectedResult1 = "http://foo.com?bar=baz";

    expect(result1).toEqual(expectedResult1);
  });
  it("should add query parameters to url when one is already there", () => {
    const query2 = {
      query: {
        bar: "baz",
      },
    };
    const result2 = extendUrl("http://foo.com?a=b", query2);
    const expectedResult2 = "http://foo.com?a=b&bar=baz";

    expect(result2).toEqual(expectedResult2);
  });
  it("should add query parameters and hashes to url", () => {
    const query3 = {
      query: {
        bar: "baz",
      },
      hash: {
        blerp: "blorp",
      },
    };
    const result3 = extendUrl("http://foo.com", query3);
    const expectedResult3 = "http://foo.com?bar=baz#blerp=blorp";

    expect(result3).toEqual(expectedResult3);
  });

  it("should add query parameters and hashes to url when they already exist", () => {
    const query4 = {
      query: {
        bar: "baz",
      },
      hash: {
        blerp: "blorp",
      },
    };
    const result4 = extendUrl("http://foo.com?a=1#hello=goodbye", query4);
    const expectedResult4 =
      "http://foo.com?a=1&bar=baz#hello=goodbye&blerp=blorp";

    expect(result4).toEqual(expectedResult4);
  });
});
