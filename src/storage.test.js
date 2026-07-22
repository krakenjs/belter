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
          // eslint-disable-next-line no-empty-function
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

    test("does not let a stale localStorage read clobber newer fallback data once localStorage recovers", () => {
      // $FlowIssue mock
      uniqueID.mockReturnValue("fake-id-fallback-newer");
      const globalStore = {};
      // $FlowIssue mock
      getGlobal.mockReturnValue(globalStore);

      let store: string | null = null;
      let shouldFail = false;

      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: () => store,
          setItem: (key, value) => {
            if (shouldFail) {
              throw new Error("SecurityError: localStorage access denied");
            }

            store = value;
          },
        },
        configurable: true,
      });

      const { getSessionState } = getStorage({ name: "test-fallback-newer" });

      // establish a baseline successful write to localStorage
      getSessionState((state) => {
        state.remembered = false;
      });

      // localStorage fails transiently while writing newer data; the write
      // is redirected to the getGlobal() fallback instead
      shouldFail = true;
      getSessionState((state) => {
        state.remembered = true;
      });

      // localStorage recovers, but its on-disk value is still the stale one
      // written before the transient failure
      shouldFail = false;
      const remembered = getSessionState((state) => state.remembered);

      expect(remembered).toBe(true);
      expect(store).not.toBeNull();
      expect(JSON.parse(store || "").__session__.state.remembered).toBe(true);
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
