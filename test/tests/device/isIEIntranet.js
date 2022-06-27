/* @flow */

import { isIEIntranet } from "../../../src/device";

describe("isIEIntranet", () => {
  beforeEach(() => {
    window.document.documentMode = true;
    Object.defineProperty(window, "status", { writable: true });
  });
  it("should return false when window.document.documentMode is a truthy value and window.status does not equal testIntranetMode", () => {
    Object.defineProperty(window, "status", {
      // returning something in a setter causes window.status to equal undefined when someone sets a value to it
      // eslint-disable-next-line flowtype/no-weak-types
      set(_): any {
        // eslint-disable-next-line no-setter-return
        return `potato${_}`;
      },
    });

    const bool = isIEIntranet();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should jump to catch block error and return false when there is an error", () => {
    // Doing this will cause an error of writing to a read-only variable
    Object.defineProperty(window, "status", { writable: false });
    const bool = isIEIntranet();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return false when window.document.documentMode is a falsy value", () => {
    window.document.documentMode = false;
    const bool = isIEIntranet();
    if (bool) {
      throw new Error(`Expected false, got ${JSON.stringify(bool)}`);
    }
  });
  it("should return true when window.document.documentMode is a truthy value and window.status gets set to testIntranetMode", () => {
    const bool = isIEIntranet();
    if (!bool) {
      throw new Error(`Expected true, got ${JSON.stringify(bool)}`);
    }
  });
});
