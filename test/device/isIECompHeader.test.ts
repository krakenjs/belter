import { beforeEach, describe, it, expect } from "vitest";

import { isIECompHeader } from "../../src/device";

describe("isIECompHeader", () => {
  beforeEach(() => {
    window.document.querySelector = () => true;
  });

  it("should return true when both mHttp and mContent are truthy", () => {
    const bool = isIECompHeader();

    expect(bool).toBeTruthy();
  });

  it("should return false when mHttp is falsy", () => {
    window.document.querySelector = (elem: string) =>
      elem !== 'meta[http-equiv="X-UA-Compatible"]';

    const bool = isIECompHeader();

    expect(bool).toBeFalsy();
  });

  it("should return false when mContent is falsy", () => {
    window.document.querySelector = (elem: string) =>
      elem !== 'meta[content="IE=edge"]';

    const bool = isIECompHeader();

    expect(bool).toBeFalsy();
  });
});
