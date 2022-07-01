import { describe, it, expect } from "vitest";

import { dotify, undotify } from "../../src";

describe("dotify cases", () => {
  it("should dotify and undotify to give the same result", () => {
    const data = {
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
    };
    const dotified = dotify(data);
    const undotified = undotify(dotified);

    expect(JSON.stringify(data)).toEqual(JSON.stringify(undotified));
  });

  it("undotify should throw an error", () => {
    const expectedErrorMessage = "Disallowed key: constructor";
    const data = {
      test: Object.prototype,
      "constructor.part": "error",
    };

    try {
      undotify(data);
    } catch (err: unknown) {
      expect((err as Error).message).toEqual(expectedErrorMessage);
    }
  });
});
