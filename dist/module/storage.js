import { uniqueID, getGlobal, inlineMemoize } from "./util";
import { isLocalStorageEnabled } from "./dom";
var DEFAULT_SESSION_STORAGE = 20 * 60 * 1000;
export function getStorage(_ref) {
  var name = _ref.name,
    _ref$lifetime = _ref.lifetime,
    lifetime = _ref$lifetime === void 0 ? DEFAULT_SESSION_STORAGE : _ref$lifetime,
    stickySessionId = _ref.stickySessionId;
  return inlineMemoize(getStorage, function () {
    var STORAGE_KEY = "__" + name + "_storage__";
    var newStateID = uniqueID();
    var accessedStorage;
    var fallbackHasNewerData = false;
    function getState(handler) {
      var localStorageEnabled;
      try {
        var _window;
        localStorageEnabled = ((_window = window) == null ? void 0 : _window.localStorage) && isLocalStorageEnabled();
      } catch (err) {
        localStorageEnabled = false;
      }
      var storage;
      if (accessedStorage) {
        storage = accessedStorage;
      }
      if (!storage && fallbackHasNewerData) {
        storage = getGlobal()[STORAGE_KEY];
      }
      if (!storage && localStorageEnabled) {
        try {
          var rawStorage = window.localStorage.getItem(STORAGE_KEY);
          if (rawStorage) {
            storage = JSON.parse(rawStorage);
          }
        } catch (err) {}
      }
      if (!storage) {
        storage = getGlobal()[STORAGE_KEY];
      }
      if (!storage) {
        storage = {
          id: newStateID
        };
      }
      if (!storage.id) {
        storage.id = newStateID;
      }
      accessedStorage = storage;
      var result = handler(storage);
      var wroteToLocalStorage = false;
      if (localStorageEnabled) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
          wroteToLocalStorage = true;
          fallbackHasNewerData = false;
        } catch (err) {
          fallbackHasNewerData = true;
        }
      }
      if (!wroteToLocalStorage) {
        getGlobal()[STORAGE_KEY] = storage;
      }
      accessedStorage = null;
      return result;
    }
    function getID() {
      return getState(function (storage) {
        return storage.id;
      });
    }
    function isStateFresh() {
      return getID() === newStateID;
    }
    function getSession(handler) {
      return getState(function (storage) {
        var session = storage.__session__;
        var now = Date.now();
        if (session && now - session.created > lifetime) {
          session = null;
        }
        if (!session) {
          session = {
            guid: stickySessionId || uniqueID(),
            created: now
          };
        }
        storage.__session__ = session;
        return handler(session);
      });
    }
    function getSessionState(handler) {
      return getSession(function (session) {
        session.state = session.state || {};
        return handler(session.state);
      });
    }
    function getSessionID() {
      return getSession(function (session) {
        return session.guid;
      });
    }
    return {
      getState: getState,
      getID: getID,
      isStateFresh: isStateFresh,
      getSessionState: getSessionState,
      getSessionID: getSessionID
    };
  }, [{
    name: name,
    lifetime: lifetime
  }]);
}