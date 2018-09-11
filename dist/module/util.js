var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint max-lines: 0 */

import { ZalgoPromise } from 'zalgo-promise/src';

export function getGlobal() {
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof __GLOBAL__ !== 'undefined') {
        return __GLOBAL__;
    }
    throw new Error('No global found');
}

// eslint-disable-next-line flowtype/no-weak-types
export function memoize(method) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var cache = {};

    // eslint-disable-next-line no-unused-vars, flowtype/no-weak-types
    function memoizedFunction() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var key = void 0;

        try {
            key = JSON.stringify(Array.prototype.slice.call(arguments));
        } catch (err) {
            throw new Error('Arguments not serializable -- can not be used to memoize');
        }

        var cacheTime = options.time;
        if (cache[key] && cacheTime && Date.now() - cache[key].time < cacheTime) {
            delete cache[key];
        }

        var glob = getGlobal();

        if (glob.__CACHE_START_TIME__ && cache[key] && cache[key].time < glob.__CACHE_START_TIME__) {
            delete cache[key];
        }

        if (cache[key]) {
            return cache[key].value;
        }

        memoizedFunction.__calling__ = true;

        var time = Date.now();
        var value = method.apply(this, arguments);

        memoizedFunction.__calling__ = false;

        cache[key] = { time: time, value: value };

        return cache[key].value;
    }

    memoizedFunction.reset = function () {
        cache = {};
    };

    return memoizedFunction;
}

// eslint-disable-next-line flowtype/no-weak-types
export function inlineMemoize(method, logic) {
    var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (!method.__memoized__) {
        // $FlowFixMe
        method.__memoized__ = memoize(logic);
    }

    if (method.__memoized__ && method.__memoized__.__calling__) {
        throw new Error('Can not call memoized method recursively');
    }

    // $FlowFixMe
    return method.__memoized__.apply(method, args);
}

// eslint-disable-next-line no-unused-vars
export function noop() {
    // pass
}

export function once(method) {
    var called = false;

    return function onceFunction() {
        if (!called) {
            called = true;
            return method.apply(this, arguments);
        }
    };
}

export function base64encode(str) {
    if (typeof __WEB__ === 'undefined' || !__WEB__) {
        return require('Base64').btoa(str);
    }
    return window.btoa(str);
}

export function base64decode(str) {
    if (typeof __WEB__ === 'undefined' || !__WEB__) {
        return require('Base64').atob(str);
    }
    return window.atob(str);
}

export function uniqueID() {

    var chars = '0123456789abcdef';

    var randomID = 'xxxxxxxxxx'.replace(/./g, function () {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    });

    var timeID = base64encode(new Date().toISOString().slice(11, 19).replace('T', '.')).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    return randomID + '_' + timeID;
}

export function hashStr(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash += str[i].charCodeAt(0) * Math.pow(i % 10 + 1, 5);
    }
    return Math.floor(Math.pow(Math.sqrt(hash), 5));
}

export function strHashStr(str) {
    var hash = '';

    for (var i = 0; i < str.length; i++) {
        var total = str[i].charCodeAt(0) * i;

        if (str[i + 1]) {
            total += str[i + 1].charCodeAt(0) * (i - 1);
        }

        hash += String.fromCharCode(97 + Math.abs(total) % 26);
    }

    return hash;
}

export function match(str, pattern) {
    var regmatch = str.match(pattern);
    if (regmatch) {
        return regmatch[1];
    }
}

export function eventEmitter() {

    var listeners = [];

    return {
        listen: function listen(method) {
            listeners.push(method);

            return {
                cancel: function cancel() {
                    listeners.splice(listeners.indexOf(method), 1);
                }
            };
        },
        once: function once(method) {
            var listener = this.listen(function onceListener() {
                method.apply(null, arguments);
                listener.cancel();
            });
        },
        trigger: function trigger() {
            for (var _i2 = 0, _length2 = listeners == null ? 0 : listeners.length; _i2 < _length2; _i2++) {
                var listener = listeners[_i2];
                listener.apply(undefined, arguments);
            }
        }
    };
}

export function awaitKey(obj, key) {
    return new ZalgoPromise(function (resolve) {

        var value = obj[key];

        if (value) {
            return resolve(value);
        }

        delete obj[key];

        Object.defineProperty(obj, key, {

            configurable: true,

            set: function set(item) {
                value = item;

                if (value) {
                    resolve(value);
                }
            },
            get: function get() {
                return value;
            }
        });
    });
}

export function stringifyError(err) {
    var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;


    if (level >= 3) {
        return 'stringifyError stack overflow';
    }

    try {
        if (!err) {
            return '<unknown error: ' + Object.prototype.toString.call(err) + '>';
        }

        if (typeof err === 'string') {
            return err;
        }

        if (err instanceof Error) {
            var stack = err && err.stack;
            var message = err && err.message;

            if (stack && message) {
                if (stack.indexOf(message) !== -1) {
                    return stack;
                } else {
                    return message + '\n' + stack;
                }
            } else if (stack) {
                return stack;
            } else if (message) {
                return message;
            }
        }

        if (typeof err.toString === 'function') {
            return err.toString();
        }

        return Object.prototype.toString.call(err);
    } catch (newErr) {
        // eslint-disable-line unicorn/catch-error-name
        return 'Error while stringifying error: ' + stringifyError(newErr, level + 1);
    }
}

export function stringifyErrorMessage(err) {

    var defaultMessage = '<unknown error: ' + Object.prototype.toString.call(err) + '>';

    if (!err) {
        return defaultMessage;
    }

    if (err instanceof Error) {
        return err.message || defaultMessage;
    }

    if (typeof err.message === 'string') {
        return err.message || defaultMessage;
    }

    return defaultMessage;
}

export function stringify(item) {
    if (typeof item === 'string') {
        return item;
    }

    if (item && typeof item.toString === 'function') {
        return item.toString();
    }

    return Object.prototype.toString.call(item);
}

export function isLocalStorageEnabled() {
    return inlineMemoize(isLocalStorageEnabled, function () {
        try {
            if (typeof window === 'undefined') {
                return false;
            }

            if (window.localStorage) {
                var _value = Math.random().toString();
                window.localStorage.setItem('__test__localStorage__', _value);
                var result = window.localStorage.getItem('__test__localStorage__');
                window.localStorage.removeItem('__test__localStorage__');
                if (_value === result) {
                    return true;
                }
            }
        } catch (err) {
            // pass
        }
        return false;
    });
}

export function domainMatches(hostname, domain) {
    hostname = hostname.split('://')[1];
    var index = hostname.indexOf(domain);
    return index !== -1 && hostname.slice(index) === domain;
}

export function patchMethod(obj, name, handler) {
    var original = obj[name];

    obj[name] = function patchedMethod() {
        var _this = this,
            _arguments = arguments;

        return handler({
            context: this,
            args: Array.prototype.slice.call(arguments),
            original: original,
            callOriginal: function callOriginal() {
                return original.apply(_this, _arguments);
            }
        });
    };
}

export function extend(obj, source) {
    if (!source) {
        return obj;
    }

    if (Object.assign) {
        return Object.assign(obj, source);
    }

    for (var _key2 in source) {
        if (source.hasOwnProperty(_key2)) {
            obj[_key2] = source[_key2];
        }
    }

    return obj;
}

export function values(obj) {
    var result = [];
    for (var _key3 in obj) {
        if (obj.hasOwnProperty(_key3)) {
            result.push(obj[_key3]);
        }
    }
    return result;
}

export function perc(pixels, percentage) {
    return Math.round(pixels * percentage / 100);
}

export function min() {
    return Math.min.apply(Math, arguments);
}

export function max() {
    return Math.max.apply(Math, arguments);
}

export function regexMap(str, regex, handler) {
    var results = [];

    // $FlowFixMe
    str.replace(regex, function regexMapMatcher(item) {
        results.push(handler ? handler.apply(null, arguments) : item);
    });

    // $FlowFixMe
    return results;
}

export function svgToBase64(svg) {
    return 'data:image/svg+xml;base64,' + base64encode(svg);
}

export function objFilter(obj) {
    var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Boolean;

    var result = {};

    for (var _key4 in obj) {
        if (!obj.hasOwnProperty(_key4) || !filter(obj[_key4], _key4)) {
            continue;
        }

        result[_key4] = obj[_key4];
    }

    return result;
}

export function identity(item) {
    return item;
}

export function regexTokenize(text, regex) {
    var result = [];
    text.replace(regex, function (token) {
        result.push(token);
        return '';
    });
    return result;
}

export function promiseDebounce(method) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;


    var promise = void 0;
    var timeout = void 0;

    return function promiseDebouncedMethod() {
        if (timeout) {
            clearTimeout(timeout);
        }

        var localPromise = promise = promise || new ZalgoPromise();

        timeout = setTimeout(function () {
            promise = null;
            timeout = null;

            ZalgoPromise['try'](method).then(function (result) {
                localPromise.resolve(result);
            }, function (err) {
                localPromise.reject(err);
            });
        }, delay);

        return localPromise;
    };
}

export function safeInterval(method, time) {

    var timeout = void 0;

    function loop() {
        timeout = setTimeout(function () {
            method();
            loop();
        }, time);
    }

    loop();

    return {
        cancel: function cancel() {
            clearTimeout(timeout);
        }
    };
}

export function isInteger(str) {
    return Boolean(str.match(/^[0-9]+$/));
}

export function isFloat(str) {
    return Boolean(str.match(/^[0-9]+\.[0-9]+$/));
}

export function serializePrimitive(value) {
    return value.toString();
}

export function deserializePrimitive(value) {
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    } else if (isInteger(value)) {
        return parseInt(value, 10);
    } else if (isFloat(value)) {
        return parseFloat(value);
    } else {
        return value;
    }
}

export function dotify(obj) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var newobj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    prefix = prefix ? prefix + '.' : prefix;
    for (var _key5 in obj) {
        if (!obj.hasOwnProperty(_key5) || obj[_key5] === undefined || obj[_key5] === null || typeof obj[_key5] === 'function') {
            continue;
        } else if (obj[_key5] && Array.isArray(obj[_key5]) && obj[_key5].length && obj[_key5].every(function (val) {
            return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) !== 'object';
        })) {
            newobj['' + prefix + _key5 + '[]'] = obj[_key5].join(',');
        } else if (obj[_key5] && _typeof(obj[_key5]) === 'object') {
            newobj = dotify(obj[_key5], '' + prefix + _key5, newobj);
        } else {
            newobj['' + prefix + _key5] = serializePrimitive(obj[_key5]);
        }
    }
    return newobj;
}

export function undotify(obj) {

    var result = {};

    for (var _key6 in obj) {
        if (!obj.hasOwnProperty(_key6) || typeof obj[_key6] !== 'string') {
            continue;
        }

        var _value2 = obj[_key6];

        if (_key6.match(/^.+\[\]$/)) {
            _key6 = _key6.slice(0, _key6.length - 2);
            _value2 = _value2.split(',').map(deserializePrimitive);
        } else {
            _value2 = deserializePrimitive(_value2);
        }

        var keyResult = result;
        var parts = _key6.split('.');
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var isLast = i + 1 === parts.length;
            var isIndex = !isLast && isInteger(parts[i + 1]);

            if (isLast) {
                // $FlowFixMe
                keyResult[part] = _value2;
            } else {
                // $FlowFixMe
                keyResult = keyResult[part] = keyResult[part] || (isIndex ? [] : {});
            }
        }
    }

    return result;
}