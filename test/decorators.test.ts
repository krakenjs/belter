import { describe, expect, it } from "vitest";

import { memoized, promise } from "../src/decorators";

describe("decorators cases", () => {
  it("memoized", () => {
    const descriptor = { value: () => 1 };
    memoized({}, "value", descriptor);
    const resultValue = descriptor.value();

    expect(resultValue).toEqual(1);
  });

  it("promise", async () => {
    const descriptor = { value: () => 1 };
    promise({}, "value", descriptor);

    // eslint-disable-next-line @typescript-eslint/await-thenable
    const resultValue = await descriptor.value();

    expect(resultValue).toEqual(1);
  });
});
