import _extends from "@babel/runtime/helpers/esm/extends";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import { getStorage } from "./storage";
import { uniqueID, getGlobal } from "./util";
import { isLocalStorageEnabled } from "./dom";
vi.mock("./util", _asyncToGenerator(function* () {
  var actual = yield vi.importActual("./util");
  return _extends({}, actual, {
    uniqueID: vi.fn(function () {
      return "unique-id-123";
    }),
    getGlobal: vi.fn(function () {
      return {};
    }),
    inlineMemoize: vi.fn(function (_, impl) {
      return impl();
    })
  });
}));
vi.mock("./dom", _asyncToGenerator(function* () {
  var actual = yield vi.importActual("./dom");
  return _extends({}, actual, {
    isLocalStorageEnabled: vi.fn(function () {
      return true;
    })
  });
}));
describe("storage", function () {
  beforeEach(function () {
    window.localStorage.clear();
  });
  test("happy path works", function () {
    uniqueID.mockReturnValue("fake-id");
    var _getStorage = getStorage({
        name: "test"
      }),
      getID = _getStorage.getID;
    expect(getID()).toEqual("fake-id");
  });
  test("unique id is used for session id", function () {
    uniqueID.mockReturnValue("fake-session-id");
    var _getStorage2 = getStorage({
        name: "test"
      }),
      getSessionID = _getStorage2.getSessionID;
    expect(getSessionID()).toEqual("fake-session-id");
  });
  test("sticky session id is used for session id", function () {
    uniqueID.mockReturnValue("fake-session-id");
    var _getStorage3 = getStorage({
        name: "test",
        stickySessionId: "sticky-session-id"
      }),
      getSessionID = _getStorage3.getSessionID;
    expect(getSessionID()).toEqual("sticky-session-id");
  });
  describe("when localStorage is unavailable mid-session", function () {
    var originalLocalStorage = window.localStorage;
    afterEach(function () {
      vi.restoreAllMocks();
      Object.defineProperty(window, "localStorage", {
        value: originalLocalStorage,
        configurable: true
      });
    });
    test("falls back to global storage when window.localStorage is null", function () {
      Object.defineProperty(window, "localStorage", {
        value: null,
        configurable: true
      });
      uniqueID.mockReturnValue("fake-id-null-storage");
      var globalStore = {};
      getGlobal.mockReturnValue(globalStore);
      var _getStorage4 = getStorage({
          name: "test-null-storage"
        }),
        getID = _getStorage4.getID;
      expect(function () {
        return getID();
      }).not.toThrow();
      expect(getID()).toEqual("fake-id-null-storage");
      expect(globalStore["__test-null-storage_storage__"]).toBeTruthy();
    });
    test("falls back to global storage when localStorage.getItem throws", function () {
      uniqueID.mockReturnValue("fake-id-getitem-throw");
      var globalStore = {};
      getGlobal.mockReturnValue(globalStore);
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: function getItem() {
            throw new Error("SecurityError: localStorage access denied");
          },
          setItem: function setItem() {}
        },
        configurable: true
      });
      var _getStorage5 = getStorage({
          name: "test-getitem-throw"
        }),
        getID = _getStorage5.getID;
      expect(function () {
        return getID();
      }).not.toThrow();
      expect(getID()).toEqual("fake-id-getitem-throw");
    });
    test("falls back to global storage when localStorage.setItem throws", function () {
      uniqueID.mockReturnValue("fake-id-setitem-throw");
      var globalStore = {};
      getGlobal.mockReturnValue(globalStore);
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: function getItem() {
            return null;
          },
          setItem: function setItem() {
            throw new Error("SecurityError: localStorage access denied");
          }
        },
        configurable: true
      });
      var _getStorage6 = getStorage({
          name: "test-setitem-throw"
        }),
        getID = _getStorage6.getID;
      expect(function () {
        return getID();
      }).not.toThrow();
      expect(getID()).toEqual("fake-id-setitem-throw");
      expect(globalStore["__test-setitem-throw_storage__"]).toBeTruthy();
    });
    test("does not let a stale localStorage read clobber newer fallback data once localStorage recovers", function () {
      uniqueID.mockReturnValue("fake-id-fallback-newer");
      var globalStore = {};
      getGlobal.mockReturnValue(globalStore);
      var store = null;
      var shouldFail = false;
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: function getItem() {
            return store;
          },
          setItem: function setItem(key, value) {
            if (shouldFail) {
              throw new Error("SecurityError: localStorage access denied");
            }
            store = value;
          }
        },
        configurable: true
      });
      var _getStorage7 = getStorage({
          name: "test-fallback-newer"
        }),
        getSessionState = _getStorage7.getSessionState;
      getSessionState(function (state) {
        state.remembered = false;
      });
      shouldFail = true;
      getSessionState(function (state) {
        state.remembered = true;
      });
      shouldFail = false;
      var remembered = getSessionState(function (state) {
        return state.remembered;
      });
      expect(remembered).toBe(true);
      expect(store).not.toBeNull();
      expect(JSON.parse(store || "").__session__.state.remembered).toBe(true);
    });
    test("does not throw when isLocalStorageEnabled itself throws", function () {
      uniqueID.mockReturnValue("fake-id-enabled-throw");
      var globalStore = {};
      getGlobal.mockReturnValue(globalStore);
      isLocalStorageEnabled.mockImplementationOnce(function () {
        throw new Error("SecurityError: The operation is insecure");
      });
      var _getStorage8 = getStorage({
          name: "test-enabled-throw"
        }),
        getID = _getStorage8.getID;
      expect(function () {
        return getID();
      }).not.toThrow();
      expect(getID()).toEqual("fake-id-enabled-throw");
    });
  });
});