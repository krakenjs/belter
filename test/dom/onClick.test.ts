import { describe, it, expect } from "vitest";

import { onClick } from "../../src";

describe("onClick", () => {
  it("invokes the handler given for click-like events", async () => {
    const button = document.createElement("button");
    let handlerCalled = false;
    onClick(button, () => {
      handlerCalled = true;
    });

    button.dispatchEvent(new Event("click"));

    expect(handlerCalled).toBeTruthy();
  });
});
