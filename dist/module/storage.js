import { uniqueID, isLocalStorageEnabled, getGlobal } from './util';

export function getStorage(_ref) {
    var name = _ref.name,
        _ref$version = _ref.version,
        version = _ref$version === undefined ? 'latest' : _ref$version,
        _ref$lifetime = _ref.lifetime,
        lifetime = _ref$lifetime === undefined ? 5 * 60 * 1000 : _ref$lifetime;


    var STORAGE_KEY = '__' + name + '_' + version + '_storage__';

    var accessedStorage = void 0;

    function getState(handler) {

        var localStorageEnabled = isLocalStorageEnabled();
        var storage = void 0;

        if (accessedStorage) {
            storage = accessedStorage;
        }

        if (!storage && localStorageEnabled) {
            var rawStorage = window.localStorage.getItem(STORAGE_KEY);

            if (rawStorage) {
                storage = JSON.parse(rawStorage);
            }
        }

        if (!storage) {
            storage = getGlobal()[STORAGE_KEY];
        }

        if (!storage) {
            storage = {
                id: uniqueID()
            };
        }

        if (!storage.id) {
            storage.id = uniqueID();
        }

        accessedStorage = storage;

        var result = handler(storage);

        if (localStorageEnabled) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
        } else {
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

    function getSession(handler) {
        return getState(function (storage) {

            var session = storage.__session__;
            var now = Date.now();

            if (session && now - session.created > lifetime) {
                session = null;
            }

            if (!session) {
                session = {
                    guid: uniqueID(),
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
        getSessionState: getSessionState,
        getSessionID: getSessionID
    };
}