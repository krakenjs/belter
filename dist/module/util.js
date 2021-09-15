import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _wrapNativeSuper from "@babel/runtime/helpers/esm/wrapNativeSuper";

/* eslint max-lines: 0 */
import { ZalgoPromise } from 'zalgo-promise/src';
import { WeakMap } from 'cross-domain-safe-weakmap/src';
export function getFunctionName(fn) {
  return fn.name || fn.__name__ || fn.displayName || 'anonymous';
}
export function setFunctionName(fn, name) {
  try {
    delete fn.name;
    fn.name = name;
  } catch (err) {// pass
  }

  fn.__name__ = fn.displayName = name;
  return fn;
}
export function base64encode(str) {
  if (typeof btoa === 'function') {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (m, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })).replace(/[=]/g, '');
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf8').toString('base64').replace(/[=]/g, '');
  }

  throw new Error("Can not find window.btoa or Buffer");
}
export function base64decode(str) {
  if (typeof atob === 'function') {
    // $FlowFixMe[method-unbinding]
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
      // eslint-disable-next-line prefer-template
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64').toString('utf8');
  }

  throw new Error("Can not find window.atob or Buffer");
}
export function uniqueID() {
  var chars = '0123456789abcdef';
  var randomID = 'xxxxxxxxxx'.replace(/./g, function () {
    return chars.charAt(Math.floor(Math.random() * chars.length));
  });
  var timeID = base64encode(new Date().toISOString().slice(11, 19).replace('T', '.')).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return "uid_" + randomID + "_" + timeID;
}
export function getGlobal() {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  if (typeof __GLOBAL__ !== 'undefined') {
    return __GLOBAL__;
  }

  throw new Error("No global found");
}
var objectIDs;
export function getObjectID(obj) {
  objectIDs = objectIDs || new WeakMap();

  if (obj === null || obj === undefined || typeof obj !== 'object' && typeof obj !== 'function') {
    throw new Error("Invalid object");
  }

  var uid = objectIDs.get(obj);

  if (!uid) {
    uid = typeof obj + ":" + uniqueID();
    objectIDs.set(obj, uid);
  }

  return uid;
}

function serializeArgs(args) {
  try {
    // $FlowFixMe[method-unbinding]
    return JSON.stringify(Array.prototype.slice.call(args), function (subkey, val) {
      if (typeof val === 'function') {
        return "memoize[" + getObjectID(val) + "]";
      }

      return val;
    });
  } catch (err) {
    throw new Error("Arguments not serializable -- can not be used to memoize");
  }
}

export function getEmptyObject() {
  // $FlowFixMe
  return {};
}

var getDefaultMemoizeOptions = function getDefaultMemoizeOptions() {
  // $FlowFixMe
  return {};
};

var memoizeGlobalIndex = 0;
var memoizeGlobalIndexValidFrom = 0;
export function memoize(method, options) {
  if (options === void 0) {
    options = getDefaultMemoizeOptions();
  }

  var _options = options,
      _options$thisNamespac = _options.thisNamespace,
      thisNamespace = _options$thisNamespac === void 0 ? false : _options$thisNamespac,
      cacheTime = _options.time;
  var simpleCache;
  var thisCache;
  var memoizeIndex = memoizeGlobalIndex;
  memoizeGlobalIndex += 1;

  var memoizedFunction = function memoizedFunction() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (memoizeIndex < memoizeGlobalIndexValidFrom) {
      simpleCache = null;
      thisCache = null;
      memoizeIndex = memoizeGlobalIndex;
      memoizeGlobalIndex += 1;
    }

    var cache;

    if (thisNamespace) {
      thisCache = thisCache || new WeakMap();
      cache = thisCache.getOrSet(this, getEmptyObject);
    } else {
      cache = simpleCache = simpleCache || {};
    }

    var cacheKey = serializeArgs(args);
    var cacheResult = cache[cacheKey];

    if (cacheResult && cacheTime && Date.now() - cacheResult.time < cacheTime) {
      delete cache[cacheKey];
      cacheResult = null;
    }

    if (cacheResult) {
      return cacheResult.value;
    }

    var time = Date.now();
    var value = method.apply(this, arguments);
    cache[cacheKey] = {
      time: time,
      value: value
    };
    return value;
  };

  memoizedFunction.reset = function () {
    simpleCache = null;
    thisCache = null;
  }; // $FlowFixMe


  var result = memoizedFunction;
  return setFunctionName(result, (options.name || getFunctionName(method)) + "::memoized");
}

memoize.clear = function () {
  memoizeGlobalIndexValidFrom = memoizeGlobalIndex;
};

export function promiseIdentity(item) {
  // $FlowFixMe
  return ZalgoPromise.resolve(item);
} // eslint-disable-next-line flowtype/no-weak-types

export function memoizePromise(method) {
  var cache = {}; // eslint-disable-next-line flowtype/no-weak-types

  function memoizedPromiseFunction() {
    var _arguments = arguments,
        _this = this;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var key = serializeArgs(args);

    if (cache.hasOwnProperty(key)) {
      return cache[key];
    }

    cache[key] = ZalgoPromise.try(function () {
      return method.apply(_this, _arguments);
    }).finally(function () {
      delete cache[key];
    });
    return cache[key];
  }

  memoizedPromiseFunction.reset = function () {
    cache = {};
  };

  return setFunctionName(memoizedPromiseFunction, getFunctionName(method) + "::promiseMemoized");
}

var getDefaultPromisifyOptions = function getDefaultPromisifyOptions() {
  // $FlowFixMe
  return {};
}; // eslint-disable-next-line flowtype/no-weak-types


export function promisify(method, options) {
  if (options === void 0) {
    options = getDefaultPromisifyOptions();
  }

  function promisifiedFunction() {
    return ZalgoPromise.try(method, this, arguments);
  }

  if (options.name) {
    promisifiedFunction.displayName = options.name + ":promisified";
  }

  return setFunctionName(promisifiedFunction, getFunctionName(method) + "::promisified");
} // eslint-disable-next-line flowtype/no-weak-types

export function inlineMemoize(method, logic, args) {
  if (args === void 0) {
    args = [];
  }

  // $FlowFixMe
  var cache = method.__inline_memoize_cache__ = method.__inline_memoize_cache__ || {};
  var key = serializeArgs(args);

  if (cache.hasOwnProperty(key)) {
    return cache[key];
  }

  var result = cache[key] = logic.apply(void 0, args);
  return result;
} // eslint-disable-next-line no-unused-vars

export function noop() {// pass
}
export function once(method) {
  var called = false;

  var onceFunction = function onceFunction() {
    if (!called) {
      called = true;
      return method.apply(this, arguments);
    }
  };

  return setFunctionName(onceFunction, getFunctionName(method) + "::once");
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
export function stringifyError(err, level) {
  if (level === void 0) {
    level = 1;
  }

  if (level >= 3) {
    return 'stringifyError stack overflow';
  }

  try {
    if (!err) {
      // $FlowFixMe[method-unbinding]
      return "<unknown error: " + Object.prototype.toString.call(err) + ">";
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
          return message + "\n" + stack;
        }
      } else if (stack) {
        return stack;
      } else if (message) {
        return message;
      }
    }

    if (err && err.toString && typeof err.toString === 'function') {
      // $FlowFixMe
      return err.toString();
    } // $FlowFixMe[method-unbinding]


    return Object.prototype.toString.call(err);
  } catch (newErr) {
    return "Error while stringifying error: " + stringifyError(newErr, level + 1);
  }
}
export function stringifyErrorMessage(err) {
  // $FlowFixMe[method-unbinding]
  var defaultMessage = "<unknown error: " + Object.prototype.toString.call(err) + ">";

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

  if (item && item.toString && typeof item.toString === 'function') {
    // $FlowFixMe
    return item.toString();
  } // $FlowFixMe[method-unbinding]


  return Object.prototype.toString.call(item);
}
export function domainMatches(hostname, domain) {
  hostname = hostname.split('://')[1];
  var index = hostname.indexOf(domain);
  return index !== -1 && hostname.slice(index) === domain;
}
export function patchMethod(obj, name, handler) {
  var original = obj[name];

  obj[name] = function patchedMethod() {
    var _arguments2 = arguments,
        _this2 = this;

    return handler({
      context: this,
      // $FlowFixMe[method-unbinding]
      args: Array.prototype.slice.call(arguments),
      original: original,
      callOriginal: function callOriginal() {
        return original.apply(_this2, _arguments2);
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

  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      obj[key] = source[key];
    }
  }

  return obj;
}
export function values(obj) {
  if (Object.values) {
    // $FlowFixMe
    return Object.values(obj);
  }

  var result = [];

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      // $FlowFixMe[escaped-generic]
      result.push(obj[key]);
    }
  } // $FlowFixMe


  return result;
} // eslint-disable-next-line no-undef

export var memoizedValues = memoize(values);
export function perc(pixels, percentage) {
  return Math.round(pixels * percentage / 100);
}
export function min() {
  return Math.min.apply(Math, arguments);
}
export function max() {
  return Math.max.apply(Math, arguments);
}
export function roundUp(num, nearest) {
  var remainder = num % nearest;
  return remainder ? num - remainder + nearest : num;
}
export function regexMap(str, regexp, handler) {
  var results = []; // $FlowFixMe

  str.replace(regexp, function regexMapMatcher(item) {
    results.push(handler ? handler.apply(null, arguments) : item);
  }); // $FlowFixMe

  return results;
}
export function svgToBase64(svg) {
  return "data:image/svg+xml;base64," + base64encode(svg);
}
export function objFilter(obj, filter) {
  if (filter === void 0) {
    filter = Boolean;
  }

  var result = {};

  for (var key in obj) {
    if (!obj.hasOwnProperty(key) || !filter(obj[key], key)) {
      continue;
    }

    result[key] = obj[key];
  }

  return result;
}
export function identity(item) {
  return item;
}
export function regexTokenize(text, regexp) {
  var result = [];
  text.replace(regexp, function (token) {
    result.push(token);
    return '';
  });
  return result;
}
export function promiseDebounce(method, delay) {
  if (delay === void 0) {
    delay = 50;
  }

  var promise;
  var timeout;

  var promiseDebounced = function promiseDebounced() {
    if (timeout) {
      clearTimeout(timeout);
    }

    var localPromise = promise = promise || new ZalgoPromise();
    timeout = setTimeout(function () {
      promise = null;
      timeout = null;
      ZalgoPromise.try(method).then(function (result) {
        localPromise.resolve(result);
      }, function (err) {
        localPromise.reject(err);
      });
    }, delay);
    return localPromise;
  };

  return setFunctionName(promiseDebounced, getFunctionName(method) + "::promiseDebounced");
}
export function safeInterval(method, time) {
  var timeout;

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
export function dotify(obj, prefix, newobj) {
  if (prefix === void 0) {
    prefix = '';
  }

  if (newobj === void 0) {
    newobj = {};
  }

  prefix = prefix ? prefix + "." : prefix;

  for (var key in obj) {
    if (!obj.hasOwnProperty(key) || obj[key] === undefined || obj[key] === null || typeof obj[key] === 'function') {
      continue;
    } else if (obj[key] && Array.isArray(obj[key]) && obj[key].length && obj[key].every(function (val) {
      return typeof val !== 'object';
    })) {
      newobj["" + prefix + key + "[]"] = obj[key].join(',');
    } else if (obj[key] && typeof obj[key] === 'object') {
      newobj = dotify(obj[key], "" + prefix + key, newobj);
    } else {
      newobj["" + prefix + key] = serializePrimitive(obj[key]);
    }
  }

  return newobj;
}
export function undotify(obj) {
  var result = {};

  for (var key in obj) {
    if (!obj.hasOwnProperty(key) || typeof obj[key] !== 'string') {
      continue;
    }

    var value = obj[key];

    if (key.match(/^.+\[\]$/)) {
      key = key.slice(0, -2);
      value = value.split(',').map(deserializePrimitive);
    } else {
      value = deserializePrimitive(value);
    }

    var keyResult = result;
    var parts = key.split('.');

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var isLast = i + 1 === parts.length;
      var isIndex = !isLast && isInteger(parts[i + 1]);

      if (part === 'constructor' || part === 'prototype' || part === '__proto__') {
        throw new Error("Disallowed key: " + part);
      }

      if (isLast) {
        // $FlowFixMe
        keyResult[part] = value;
      } else {
        // $FlowFixMe
        keyResult = keyResult[part] = keyResult[part] || (isIndex ? [] : {});
      }
    }
  }

  return result;
}
export function eventEmitter() {
  var triggered = {};
  var handlers = {};
  var emitter = {
    on: function on(eventName, handler) {
      var handlerList = handlers[eventName] = handlers[eventName] || [];
      handlerList.push(handler);
      var cancelled = false;
      return {
        cancel: function cancel() {
          if (!cancelled) {
            cancelled = true;
            handlerList.splice(handlerList.indexOf(handler), 1);
          }
        }
      };
    },
    once: function once(eventName, handler) {
      var listener = emitter.on(eventName, function () {
        listener.cancel();
        handler();
      });
      return listener;
    },
    trigger: function trigger(eventName) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      var handlerList = handlers[eventName];
      var promises = [];

      if (handlerList) {
        var _loop = function _loop(_i2) {
          var handler = handlerList[_i2];
          promises.push(ZalgoPromise.try(function () {
            return handler.apply(void 0, args);
          }));
        };

        for (var _i2 = 0; _i2 < handlerList.length; _i2++) {
          _loop(_i2);
        }
      }

      return ZalgoPromise.all(promises).then(noop);
    },
    triggerOnce: function triggerOnce(eventName) {
      if (triggered[eventName]) {
        return ZalgoPromise.resolve();
      }

      triggered[eventName] = true;

      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      return emitter.trigger.apply(emitter, [eventName].concat(args));
    },
    reset: function reset() {
      handlers = {};
    }
  };
  return emitter;
}
export function camelToDasherize(string) {
  return string.replace(/([A-Z])/g, function (g) {
    return "-" + g.toLowerCase();
  });
}
export function dasherizeToCamel(string) {
  return string.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
export function get(item, path, def) {
  if (!path) {
    return def;
  }

  var pathParts = path.split('.'); // Loop through each section of our key path

  for (var i = 0; i < pathParts.length; i++) {
    // If we have an object, we can get the key
    if (typeof item === 'object' && item !== null) {
      item = item[pathParts[i]]; // Otherwise, we should return the default (undefined if not provided)
    } else {
      return def;
    }
  } // If our final result is undefined, we should return the default


  return item === undefined ? def : item;
}
export function safeTimeout(method, time) {
  var interval = safeInterval(function () {
    time -= 100;

    if (time <= 0) {
      interval.cancel();
      method();
    }
  }, 100);
}
export function defineLazyProp(obj, key, getter) {
  if (Array.isArray(obj)) {
    if (typeof key !== 'number') {
      throw new TypeError("Array key must be number");
    }
  } else if (typeof obj === 'object' && obj !== null) {
    if (typeof key !== 'string') {
      throw new TypeError("Object key must be string");
    }
  }

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get: function get() {
      // $FlowFixMe
      delete obj[key];
      var value = getter(); // $FlowFixMe

      obj[key] = value;
      return value;
    },
    set: function set(value) {
      // $FlowFixMe
      delete obj[key]; // $FlowFixMe

      obj[key] = value;
    }
  });
}
export function arrayFrom(item) {
  // eslint-disable-line no-undef
  // $FlowFixMe[method-unbinding]
  return Array.prototype.slice.call(item);
}
export function isObject(item) {
  return typeof item === 'object' && item !== null;
}
export function isObjectObject(obj) {
  // $FlowFixMe[method-unbinding]
  return isObject(obj) && Object.prototype.toString.call(obj) === '[object Object]';
}
export function isPlainObject(obj) {
  if (!isObjectObject(obj)) {
    return false;
  } // $FlowFixMe


  var constructor = obj.constructor;

  if (typeof constructor !== 'function') {
    return false;
  }

  var prototype = constructor.prototype;

  if (!isObjectObject(prototype)) {
    return false;
  }

  if (!prototype.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  return true;
}
export function replaceObject(item, replacer, fullKey) {
  if (fullKey === void 0) {
    fullKey = '';
  }

  if (Array.isArray(item)) {
    var length = item.length;
    var result = [];

    var _loop2 = function _loop2(i) {
      defineLazyProp(result, i, function () {
        var itemKey = fullKey ? fullKey + "." + i : "" + i;
        var el = item[i];
        var child = replacer(el, i, itemKey);

        if (isPlainObject(child) || Array.isArray(child)) {
          // $FlowFixMe
          child = replaceObject(child, replacer, itemKey);
        }

        return child;
      });
    };

    for (var i = 0; i < length; i++) {
      _loop2(i);
    } // $FlowFixMe


    return result;
  } else if (isPlainObject(item)) {
    var _result = {};

    var _loop3 = function _loop3(key) {
      if (!item.hasOwnProperty(key)) {
        return "continue";
      }

      defineLazyProp(_result, key, function () {
        var itemKey = fullKey ? fullKey + "." + key : "" + key; // $FlowFixMe

        var el = item[key];
        var child = replacer(el, key, itemKey);

        if (isPlainObject(child) || Array.isArray(child)) {
          // $FlowFixMe
          child = replaceObject(child, replacer, itemKey);
        }

        return child;
      });
    };

    for (var key in item) {
      var _ret = _loop3(key);

      if (_ret === "continue") continue;
    } // $FlowFixMe


    return _result;
  } else {
    throw new Error("Pass an object or array");
  }
}
export function copyProp(source, target, name, def) {
  if (source.hasOwnProperty(name)) {
    var descriptor = Object.getOwnPropertyDescriptor(source, name); // $FlowFixMe

    Object.defineProperty(target, name, descriptor);
  } else {
    target[name] = def;
  }
}
export function regex(pattern, string, start) {
  if (start === void 0) {
    start = 0;
  }

  if (typeof pattern === 'string') {
    // eslint-disable-next-line security/detect-non-literal-regexp
    pattern = new RegExp(pattern);
  }

  var result = string.slice(start).match(pattern);

  if (!result) {
    return;
  } // $FlowFixMe


  var index = result.index;
  var regmatch = result[0];
  return {
    text: regmatch,
    groups: result.slice(1),
    start: start + index,
    end: start + index + regmatch.length,
    length: regmatch.length,
    replace: function replace(text) {
      if (!regmatch) {
        return '';
      }

      return "" + regmatch.slice(0, start + index) + text + regmatch.slice(index + regmatch.length);
    }
  };
}
export function regexAll(pattern, string) {
  var matches = [];
  var start = 0; // eslint-disable-next-line no-constant-condition

  while (true) {
    var regmatch = regex(pattern, string, start);

    if (!regmatch) {
      break;
    }

    matches.push(regmatch);
    start = match.end;
  }

  return matches;
}
export function isDefined(value) {
  return value !== null && value !== undefined;
}
export function cycle(method) {
  return ZalgoPromise.try(method).then(function () {
    return cycle(method);
  });
}
export function debounce(method, time) {
  if (time === void 0) {
    time = 100;
  }

  var timeout;

  var debounceWrapper = function debounceWrapper() {
    var _arguments3 = arguments,
        _this3 = this;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      return method.apply(_this3, _arguments3);
    }, time);
  };

  return setFunctionName(debounceWrapper, getFunctionName(method) + "::debounced");
}
export function isRegex(item) {
  // $FlowFixMe[method-unbinding]
  return Object.prototype.toString.call(item) === '[object RegExp]';
}
// eslint-disable-next-line flowtype/no-weak-types
export var weakMapMemoize = function weakMapMemoize(method) {
  var weakmap = new WeakMap(); // eslint-disable-next-line flowtype/no-weak-types

  return function weakmapMemoized(arg) {
    var _this4 = this;

    return weakmap.getOrSet(arg, function () {
      return method.call(_this4, arg);
    });
  };
};
// eslint-disable-next-line flowtype/no-weak-types
export var weakMapMemoizePromise = function weakMapMemoizePromise(method) {
  var weakmap = new WeakMap(); // eslint-disable-next-line flowtype/no-weak-types

  return function weakmapMemoizedPromise(arg) {
    var _this5 = this;

    return weakmap.getOrSet(arg, function () {
      return method.call(_this5, arg).finally(function () {
        weakmap.delete(arg);
      });
    });
  };
};
export function getOrSet(obj, key, getter) {
  if (obj.hasOwnProperty(key)) {
    return obj[key];
  }

  var val = getter();
  obj[key] = val;
  return val;
}
export function cleanup(obj) {
  var tasks = [];
  var cleaned = false;
  var cleanErr;
  var cleaner = {
    set: function set(name, item) {
      if (!cleaned) {
        obj[name] = item;
        cleaner.register(function () {
          delete obj[name];
        });
      }

      return item;
    },
    register: function register(method) {
      var task = once(function () {
        return method(cleanErr);
      });

      if (cleaned) {
        method(cleanErr);
      } else {
        tasks.push(task);
      }

      return {
        cancel: function cancel() {
          var index = tasks.indexOf(task);

          if (index !== -1) {
            tasks.splice(index, 1);
          }
        }
      };
    },
    all: function all(err) {
      cleanErr = err;
      var results = [];
      cleaned = true;

      while (tasks.length) {
        var task = tasks.shift();
        results.push(task());
      }

      return ZalgoPromise.all(results).then(noop);
    }
  };
  return cleaner;
}
export function tryCatch(fn) {
  var result;
  var error;

  try {
    result = fn();
  } catch (err) {
    error = err;
  } // $FlowFixMe


  return {
    result: result,
    error: error
  };
} // eslint-disable-next-line flowtype/no-mutable-array

export function removeFromArray(arr, item) {
  var index = arr.indexOf(item);

  if (index !== -1) {
    arr.splice(index, 1);
  }
}
export function assertExists(name, thing) {
  if (thing === null || typeof thing === 'undefined') {
    throw new Error("Expected " + name + " to be present");
  }

  return thing;
}
export function unique(arr) {
  var result = {};

  for (var _i4 = 0; _i4 < arr.length; _i4++) {
    var item = arr[_i4];
    result[item] = true;
  }

  return Object.keys(result);
}
export var constHas = function constHas(constant, value) {
  return memoizedValues(constant).indexOf(value) !== -1;
};
export function dedupeErrors(handler) {
  var seenErrors = [];
  var seenStringifiedErrors = {};
  return function (err) {
    if (seenErrors.indexOf(err) !== -1) {
      return;
    }

    seenErrors.push(err);
    var stringifiedError = stringifyError(err);

    if (seenStringifiedErrors[stringifiedError]) {
      return;
    }

    seenStringifiedErrors[stringifiedError] = true;
    return handler(err);
  };
}
export var ExtendableError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(ExtendableError, _Error);

  function ExtendableError(message) {
    var _this6;

    _this6 = _Error.call(this, message) || this; // eslint-disable-next-line unicorn/custom-error-definition

    _this6.name = _this6.constructor.name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(_assertThisInitialized(_this6), _this6.constructor);
    } else {
      _this6.stack = new Error(message).stack;
    }

    return _this6;
  }

  return ExtendableError;
}( /*#__PURE__*/_wrapNativeSuper(Error));