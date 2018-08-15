import base32 from 'hi-base32';
import { btoa } from 'Base64';
import { ZalgoPromise } from 'zalgo-promise/src';

export function getGlobal() {
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    throw new Error('No global found');
}

// eslint-disable-next-line flowtype/no-weak-types
export function memoize(method) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var cache = {};

    // eslint-disable-next-line no-unused-vars, flowtype/no-weak-types
    return function memoizedFunction() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var key = void 0;

        try {
            key = JSON.stringify(Array.prototype.slice.call(arguments));
        } catch (err) {
            throw new Error('Arguments not serializable -- can not be used to memoize');
        }

        var time = options.time;

        if (cache[key] && time && Date.now() - cache[key].time < time) {
            delete cache[key];
        }

        var glob = getGlobal();

        if (glob.__CACHE_START_TIME__ && cache[key] && cache[key].time < glob.__CACHE_START_TIME__) {
            delete cache[key];
        }

        if (cache[key]) {
            return cache[key].value;
        }

        cache[key] = {
            time: Date.now(),
            value: method.apply(this, arguments)
        };

        return cache[key].value;
    };
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

export function uniqueID() {

    var chars = '0123456789abcdef';

    var randomID = 'xxxxxxxxxx'.replace(/./g, function () {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    });

    var timeID = base32.encode(new Date().toISOString().slice(11, 19).replace('T', '.')).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

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

export var isLocalStorageEnabled = memoize(function () {
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
    str.replace(regex, function regexMapMatcher() {
        results.push(handler.apply(null, arguments));
    });

    return results;
}

export function svgToBase64(svg) {
    return 'data:image/svg+xml;base64,' + btoa(svg);
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
                return localPromise.resolve(result);
            }, function (err) {
                return localPromise.reject(err);
            });
        }, delay);

        return localPromise;
    };
}