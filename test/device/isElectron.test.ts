import { describe, it, expect, vi, afterAll } from "vitest";

import { isElectron } from "../../src/device";

describe("isElectron", () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  it("should return false when process is undefined", () => {
    vi.mock("process", () => undefined);

    expect(isElectron()).toBeFalsy();
  });

  it("should return false when process.versions is a falsy value", () => {
    vi.stubGlobal("process", {
      ...process,
      versions: false,
    });

    expect(isElectron()).toBeFalsy();
  });

  it("should return false when process.versions.electron is a falsy value", () => {
    vi.stubGlobal("process", {
      ...process,
      versions: { electron: false },
    });

    expect(isElectron()).toBeFalsy();
  });

  it("should return true when process.versions.electron is a truthy value", () => {
    vi.stubGlobal("process", {
      ...process,
      versions: { electron: true },
    });

    expect(isElectron()).toBeTruthy();
  });
});
