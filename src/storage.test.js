/* @flow */
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";

import { getStorage } from "./storage";
import { uniqueID, getGlobal } from "./util";
import { isLocalStorageEnabled } from "./dom";

vi.mock("./util", async () => {
  const actual = await vi.importActual("./util");

  return {
    ...actual,
    uniqueID: vi.fn(() => "unique-id-123"),
    getGlobal: vi.fn(() => ({})),
    inlineMemoize: vi.fn((_, impl) => impl()),
  };
});

vi.mock("./dom", async () => {
  const actual = await vi.importActual("./dom");

  return {
    ...actual,
    isLocalStorageEnabled: vi.fn(() => true),
  };
});

describe("storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("happy path works", () => {
    // $FlowIssue mock
    uniqueID.mockReturnValue("fake-id");
    const { getID } = getStorage({ name: "test" });

    expect(getID()).toEqual("fake-id");
  });

  test("unique id is used for session id", () => {
    // $FlowIssue mock
    uniqueID.mockReturnValue("fake-session-id");
    const { getSessionID } = getStorage({ name: "test" });

    expect(getSessionID()).toEqual("fake-session-id");
  });

  test("sticky session id is used for session id", () => {
    // $FlowIssue mock
    uniqueID.mockReturnValue("fake-session-id");
    const { getSessionID } = getStorage({
      name: "test",
      stickySessionId: "sticky-session-id",
    });

    expect(getSessionID()).toEqual("sticky-session-id");
  });

  describe("when localStorage is unavailable mid-session", () => {
    const originalLocalStorage = window.localStorage;

    afterEach(() => {
      vi.restoreAllMocks();
      Object.defineProperty(window, "localStorage", {
        value: originalLocalStorage,
        configurable: true,
      });
    });

    test("falls back to global storage when window.localStorage is null", () => {
      Object.defineProperty(window, "localStorage", {
        value: null,
        configurable: true,
      });

      // $FlowIssue mock
      uniqueID.mockReturnValue("fake-id-null-storage");
      const globalStore = {};
      // $FlowIssue mock
      getGlobal.mockReturnValue(globalStore);

      const { getID } = getStorage({ name: "test-null-storage" });

      expect(() => getID()).not.toThrow();
      expect(getID()).toEqual("fake-id-null-storage");
      expect(globalStore["__test-null-storage_storage__"]).toBeTruthy();
    });

    test("falls back to global storage when localStorage.getItem throws", () => {
      // $FlowIssue mock
      uniqueID.mockReturnValue("fake-id-getitem-throw");
      const globalStore = {};
      // $FlowIssue mock
      getGlobal.mockReturnValue(globalStore);
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: () => {
            throw new Error("SecurityError: localStorage access denied");
          },
          setItem: () => {},
        },
        configurable: true,
      });

      const { getID } = getStorage({ name: "test-getitem-throw" });

      expect(() => getID()).not.toThrow();
      expect(getID()).toEqual("fake-id-getitem-throw");
    });

    test("falls back to global storage when localStorage.setItem throws", () => {
      // $FlowIssue mock
      uniqueID.mockReturnValue("fake-id-setitem-throw");
      const globalStore = {};
      // $FlowIssue mock
      getGlobal.mockReturnValue(globalStore);
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: () => null,
          setItem: () => {
            throw new Error("SecurityError: localStorage access denied");
          },
        },
        configurable: true,
      });

      const { getID } = getStorage({ name: "test-setitem-throw" });

      expect(() => getID()).not.toThrow();
      expect(getID()).toEqual("fake-id-setitem-throw");
      expect(globalStore["__test-setitem-throw_storage__"]).toBeTruthy();
    });

    test("does not throw when isLocalStorageEnabled itself throws", () => {
      // $FlowIssue mock
      uniqueID.mockReturnValue("fake-id-enabled-throw");
      const globalStore = {};
      // $FlowIssue mock
      getGlobal.mockReturnValue(globalStore);
      // $FlowIssue mock
      isLocalStorageEnabled.mockImplementationOnce(() => {
        throw new Error("SecurityError: The operation is insecure");
      });

      const { getID } = getStorage({ name: "test-enabled-throw" });

      expect(() => getID()).not.toThrow();
      expect(getID()).toEqual("fake-id-enabled-throw");
    });
  });
});
