import { describe, expect, it } from "vitest";

import { base64encode, base64decode } from "../../src";

describe("serialization cases", () => {
  function encodedecode(input: string) {
    const encoded = base64encode(input);
    const decoded = base64decode(encoded);

    expect(input).toEqual(decoded);
  }

  it("should base64 encode and decode basic strings", () => {
    encodedecode("basic");
  });

  it("should base64 encode and decode JSON strings", () => {
    const data = JSON.stringify({
      foo: "bar",
      baz: [1, 2, 3],
      bing: ["aaa", "bbb", "ccc"],
      bong: [
        {
          a: 1,
        },
        {
          b: 2,
        },
        {
          c: 3,
        },
      ],
      nested: {
        obj: {
          blerf: "foobar",
          blorf: 555,
        },
        zorg: "zerg",
        berk: "me,erk",
      },
    });
    encodedecode(data);
  });

  it("should base64 encode and decode unicode strings", () => {
    const cases = ["Привет! Это наш тест", "Tişört ve bluz"];
    cases.forEach(encodedecode);
  });
});
