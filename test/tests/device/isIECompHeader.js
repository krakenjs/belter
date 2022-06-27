/* @flow */

import { isIECompHeader } from "../../../src/device";

describe("isIECompHeader", () => {
  beforeEach(() => {
    window.document.querySelector = () => true;
  });
  it("should return true when both mHttp and mContent are truthy", () => {
    const bool = isIECompHeader();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when mHttp is falsy", () => {
    window.document.querySelector = (elem) =>
      elem !== 'meta[http-equiv="X-UA-Compatible"]';
    const bool = isIECompHeader();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when mContent is falsy", () => {
    window.document.querySelector = (elem) =>
      elem !== 'meta[content="IE=edge"]';
    const bool = isIECompHeader();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
});
