import _extends from "@babel/runtime/helpers/esm/extends";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { getStorage } from "./storage";
import { uniqueID } from "./util";
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
});