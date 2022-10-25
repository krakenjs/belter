/* @flow */

import { onClick } from "../../../src";

describe("onClick", () => {
  it("invokes the handler given for click-like events", async () => {
    const button = document.createElement("button");
    let handlerCalled = false;
    onClick(button, () => {
      handlerCalled = true;
    });
    await button.dispatchEvent(new Event("click"));
    if (!handlerCalled) {
      throw new Error(`Expected handler to be called`);
    }
  });
});
