import { beforeEach, describe, it, expect } from "vitest";

import { experiment } from "../src/experiment";

describe("experiment", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  const name = "potatoLicker";

  it("should call logComplete function that returns the result of experiment function call", () => {
    const expObj = experiment({
      name,
    });
    const logCompleteResult = expObj.logComplete({});

    expect(expObj).toEqual(logCompleteResult);
  });

  it("should call logStart function that returns the result of experiment function call", () => {
    const expObj = experiment({
      name,
    });
    const logStartResult = expObj.logStart({});

    expect(expObj).toEqual(logStartResult);
  });

  it("should call logStart function and NOT call logTreatment function when localStorage is not set", () => {
    let isCalled;

    const logTreatment = () => {
      isCalled = true;
    };

    const expObj = experiment({
      name,
      logTreatment,
    });
    expObj.logStart();
    expObj.log(name);

    expect(isCalled).toBeTruthy();
  });

  it("should return true when isDisabled is called", () => {
    const expObj = experiment({
      name,
    });
    const { isDisabled } = expObj;
    const bool = isDisabled();

    expect(bool).toBeTruthy();
  });

  it("should return false when isDisabled is called with set localStorage", () => {
    window.localStorage.setItem(name, "hi");
    const expObj = experiment({
      name,
    });
    const { isDisabled } = expObj;
    expect(isDisabled()).toBeFalsy();

    window.localStorage.removeItem(name);
  });

  it("should return false when isEnabled is called", () => {
    const expObj = experiment({
      name,
    });
    const { isEnabled } = expObj;
    const bool = isEnabled();

    expect(bool).toBeFalsy();
  });

  it("should return true when isEnabled is called with set localStorage", () => {
    window.localStorage.setItem(name, "hi");
    const expObj = experiment({
      name,
    });
    const { isEnabled } = expObj;
    const bool = isEnabled();

    expect(bool).toBeTruthy();

    window.localStorage.removeItem(name);
  });

  it("should return potatoLicker_control when getTreatment is called with sample 100", () => {
    const expObj = experiment({
      name,
      sample: 100,
    });
    const { getTreatment } = expObj;
    const getTreatmentResult = getTreatment();

    expect(getTreatmentResult).toEqual("potatoLicker_control");
  });

  it("should return potatoLicker_throttle when getTreatment is called with sample 0", () => {
    const expObj = experiment({
      name,
      sample: 0,
    });
    const { getTreatment } = expObj;
    const getTreatmentResult = getTreatment();

    expect(getTreatmentResult).toEqual("potatoLicker_throttle");
  });
});
