/* @flow */

import { base64encode, base64decode } from "../../../src";

describe("serialization cases", () => {
  function encodedecode(input) {
    const encoded = base64encode(input);
    const decoded = base64decode(encoded);

    if (input !== decoded) {
      throw new Error(
        `Encoding mismatch. Original data:\n\n${input}\n\nBase64 Encoded:\n\n${encoded}\n\nBase64 Decoded:\n\n${decoded}`
      );
    }
  }

  it("should base64 encode and decode basic strings", () => {
    encodedecode("basic");
  });

  it("should base64 encode and decode JSON strings", () => {
    const data = JSON.stringify({
      foo: "bar",
      baz: [1, 2, 3],
      bing: ["aaa", "bbb", "ccc"],
      bong: [{ a: 1 }, { b: 2 }, { c: 3 }],
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
