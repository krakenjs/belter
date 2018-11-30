!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define("belter", [], factory) : "object" == typeof exports ? exports.belter = factory() : root.belter = factory();
}("undefined" != typeof self ? self : this, function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = !0;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                configurable: !1,
                enumerable: !0,
                get: getter
            });
        };
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
        };
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = "./src/index.js");
    }({
        "./node_modules/cross-domain-safe-weakmap/src/index.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d({}, "WeakMap", function() {
                return weakmap_CrossDomainSafeWeakMap;
            });
            var src = __webpack_require__("./node_modules/cross-domain-utils/src/index.js");
            function safeIndexOf(collection, item) {
                for (var i = 0; i < collection.length; i++) try {
                    if (collection[i] === item) return i;
                } catch (err) {}
                return -1;
            }
            var defineProperty = Object.defineProperty, counter = Date.now() % 1e9, weakmap_CrossDomainSafeWeakMap = function() {
                function CrossDomainSafeWeakMap() {
                    !function(instance, Constructor) {
                        if (!(instance instanceof CrossDomainSafeWeakMap)) throw new TypeError("Cannot call a class as a function");
                    }(this);
                    counter += 1;
                    this.name = "__weakmap_" + (1e9 * Math.random() >>> 0) + "__" + counter;
                    if (function() {
                        if ("undefined" == typeof WeakMap) return !1;
                        if (void 0 === Object.freeze) return !1;
                        try {
                            var testWeakMap = new WeakMap(), testKey = {};
                            Object.freeze(testKey);
                            testWeakMap.set(testKey, "__testvalue__");
                            return "__testvalue__" === testWeakMap.get(testKey);
                        } catch (err) {
                            return !1;
                        }
                    }()) try {
                        this.weakmap = new WeakMap();
                    } catch (err) {}
                    this.keys = [];
                    this.values = [];
                }
                CrossDomainSafeWeakMap.prototype._cleanupClosedWindows = function() {
                    for (var weakmap = this.weakmap, keys = this.keys, i = 0; i < keys.length; i++) {
                        var value = keys[i];
                        if (Object(src.isWindow)(value) && Object(src.isWindowClosed)(value)) {
                            if (weakmap) try {
                                weakmap.delete(value);
                            } catch (err) {}
                            keys.splice(i, 1);
                            this.values.splice(i, 1);
                            i -= 1;
                        }
                    }
                };
                CrossDomainSafeWeakMap.prototype.isSafeToReadWrite = function(key) {
                    if (Object(src.isWindow)(key)) return !1;
                    try {
                        key && key.self;
                        key && key[this.name];
                    } catch (err) {
                        return !1;
                    }
                    return !0;
                };
                CrossDomainSafeWeakMap.prototype.set = function(key, value) {
                    if (!key) throw new Error("WeakMap expected key");
                    var weakmap = this.weakmap;
                    if (weakmap) try {
                        weakmap.set(key, value);
                    } catch (err) {
                        delete this.weakmap;
                    }
                    if (this.isSafeToReadWrite(key)) {
                        var name = this.name, entry = key[name];
                        entry && entry[0] === key ? entry[1] = value : defineProperty(key, name, {
                            value: [ key, value ],
                            writable: !0
                        });
                    } else {
                        this._cleanupClosedWindows();
                        var keys = this.keys, values = this.values, index = safeIndexOf(keys, key);
                        if (-1 === index) {
                            keys.push(key);
                            values.push(value);
                        } else values[index] = value;
                    }
                };
                CrossDomainSafeWeakMap.prototype.get = function(key) {
                    if (!key) throw new Error("WeakMap expected key");
                    var weakmap = this.weakmap;
                    if (weakmap) try {
                        if (weakmap.has(key)) return weakmap.get(key);
                    } catch (err) {
                        delete this.weakmap;
                    }
                    if (!this.isSafeToReadWrite(key)) {
                        this._cleanupClosedWindows();
                        var index = safeIndexOf(this.keys, key);
                        if (-1 === index) return;
                        return this.values[index];
                    }
                    var entry = key[this.name];
                    if (entry && entry[0] === key) return entry[1];
                };
                CrossDomainSafeWeakMap.prototype.delete = function(key) {
                    if (!key) throw new Error("WeakMap expected key");
                    var weakmap = this.weakmap;
                    if (weakmap) try {
                        weakmap.delete(key);
                    } catch (err) {
                        delete this.weakmap;
                    }
                    if (this.isSafeToReadWrite(key)) {
                        var entry = key[this.name];
                        entry && entry[0] === key && (entry[0] = entry[1] = void 0);
                    } else {
                        this._cleanupClosedWindows();
                        var keys = this.keys, index = safeIndexOf(keys, key);
                        if (-1 !== index) {
                            keys.splice(index, 1);
                            this.values.splice(index, 1);
                        }
                    }
                };
                CrossDomainSafeWeakMap.prototype.has = function(key) {
                    if (!key) throw new Error("WeakMap expected key");
                    var weakmap = this.weakmap;
                    if (weakmap) try {
                        return weakmap.has(key);
                    } catch (err) {
                        delete this.weakmap;
                    }
                    if (this.isSafeToReadWrite(key)) {
                        var entry = key[this.name];
                        return !(!entry || entry[0] !== key);
                    }
                    this._cleanupClosedWindows();
                    return -1 !== safeIndexOf(this.keys, key);
                };
                CrossDomainSafeWeakMap.prototype.getOrSet = function(key, getter) {
                    if (this.has(key)) return this.get(key);
                    var value = getter();
                    this.set(key, value);
                    return value;
                };
                return CrossDomainSafeWeakMap;
            }();
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return weakmap_CrossDomainSafeWeakMap;
            });
        },
        "./node_modules/cross-domain-utils/src/constants.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return PROTOCOL;
            });
            __webpack_require__.d(__webpack_exports__, "b", function() {
                return WILDCARD;
            });
            var PROTOCOL = {
                MOCK: "mock:",
                FILE: "file:",
                ABOUT: "about:"
            }, WILDCARD = "*";
        },
        "./node_modules/cross-domain-utils/src/index.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__("./node_modules/cross-domain-utils/src/utils.js");
            __webpack_require__.d(__webpack_exports__, "isWindow", function() {
                return __WEBPACK_IMPORTED_MODULE_0__utils__.a;
            });
            __webpack_require__.d(__webpack_exports__, "isWindowClosed", function() {
                return __WEBPACK_IMPORTED_MODULE_0__utils__.b;
            });
            __webpack_require__.d(__webpack_exports__, "linkFrameWindow", function() {
                return __WEBPACK_IMPORTED_MODULE_0__utils__.c;
            });
            var __WEBPACK_IMPORTED_MODULE_1__types__ = __webpack_require__("./node_modules/cross-domain-utils/src/types.js");
            __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__types__), __webpack_require__("./node_modules/cross-domain-utils/src/constants.js");
        },
        "./node_modules/cross-domain-utils/src/types.js": function(module, exports) {},
        "./node_modules/cross-domain-utils/src/utils.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var constants = __webpack_require__("./node_modules/cross-domain-utils/src/constants.js");
            __webpack_exports__.b = isWindowClosed;
            __webpack_exports__.c = function(frame) {
                !function() {
                    for (var i = 0; i < iframeFrames.length; i++) if (isFrameWindowClosed(iframeFrames[i])) {
                        iframeFrames.splice(i, 1);
                        iframeWindows.splice(i, 1);
                    }
                    for (var _i8 = 0; _i8 < iframeWindows.length; _i8++) if (isWindowClosed(iframeWindows[_i8])) {
                        iframeFrames.splice(_i8, 1);
                        iframeWindows.splice(_i8, 1);
                    }
                }();
                if (frame && frame.contentWindow) try {
                    iframeWindows.push(frame.contentWindow);
                    iframeFrames.push(frame);
                } catch (err) {}
            };
            __webpack_exports__.a = function(obj) {
                try {
                    if (obj === window) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if ("[object Window]" === Object.prototype.toString.call(obj)) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (window.Window && obj instanceof window.Window) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (obj && obj.self === obj) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (obj && obj.parent === obj) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (obj && obj.top === obj) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    obj && obj.__cross_domain_utils_window_check__;
                } catch (err) {
                    return !0;
                }
                return !1;
            };
            var IE_WIN_ACCESS_ERROR = "Call was rejected by callee.\r\n";
            function isAboutProtocol() {
                return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window).location.protocol === constants.a.ABOUT;
            }
            function canReadFromWindow(win) {
                try {
                    win && win.location && win.location.href;
                    return !0;
                } catch (err) {}
                return !1;
            }
            function getActualDomain(win) {
                var location = (win = win || window).location;
                if (!location) throw new Error("Can not read window location");
                var protocol = location.protocol;
                if (!protocol) throw new Error("Can not read window protocol");
                if (protocol === constants.a.FILE) return constants.a.FILE + "//";
                if (protocol === constants.a.ABOUT) {
                    var parent = function(win) {
                        if (win) try {
                            if (win.parent && win.parent !== win) return win.parent;
                        } catch (err) {}
                    }(win);
                    return parent && canReadFromWindow(parent) ? getActualDomain(parent) : constants.a.ABOUT + "//";
                }
                var host = location.host;
                if (!host) throw new Error("Can not read window host");
                return protocol + "//" + host;
            }
            function getDomain(win) {
                var domain = getActualDomain(win = win || window);
                return domain && win.mockDomain && 0 === win.mockDomain.indexOf(constants.a.MOCK) ? win.mockDomain : domain;
            }
            function isFrameWindowClosed(frame) {
                if (!frame.contentWindow) return !0;
                if (!frame.parentNode) return !0;
                var doc = frame.ownerDocument;
                return !(!doc || !doc.documentElement || doc.documentElement.contains(frame));
            }
            var iframeWindows = [], iframeFrames = [];
            function isWindowClosed(win) {
                var allowMock = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                try {
                    if (win === window) return !1;
                } catch (err) {
                    return !0;
                }
                try {
                    if (!win) return !0;
                } catch (err) {
                    return !0;
                }
                try {
                    if (win.closed) return !0;
                } catch (err) {
                    return !err || err.message !== IE_WIN_ACCESS_ERROR;
                }
                if (allowMock && function(win) {
                    if (!function(win) {
                        try {
                            if (win === window) return !0;
                        } catch (err) {}
                        try {
                            var desc = Object.getOwnPropertyDescriptor(win, "location");
                            if (desc && !1 === desc.enumerable) return !1;
                        } catch (err) {}
                        try {
                            if (isAboutProtocol(win) && canReadFromWindow(win)) return !0;
                        } catch (err) {}
                        try {
                            if (getActualDomain(win) === getActualDomain(window)) return !0;
                        } catch (err) {}
                        return !1;
                    }(win)) return !1;
                    try {
                        if (win === window) return !0;
                        if (isAboutProtocol(win) && canReadFromWindow(win)) return !0;
                        if (getDomain(window) === getDomain(win)) return !0;
                    } catch (err) {}
                    return !1;
                }(win)) try {
                    if (win.mockclosed) return !0;
                } catch (err) {}
                try {
                    if (!win.parent || !win.top) return !0;
                } catch (err) {}
                var iframeIndex = function(collection, item) {
                    for (var i = 0; i < collection.length; i++) try {
                        if (collection[i] === item) return i;
                    } catch (err) {}
                    return -1;
                }(iframeWindows, win);
                if (-1 !== iframeIndex) {
                    var frame = iframeFrames[iframeIndex];
                    if (frame && isFrameWindowClosed(frame)) return !0;
                }
                return !1;
            }
        },
        "./node_modules/zalgo-promise/src/index.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            function utils_isPromise(item) {
                try {
                    if (!item) return !1;
                    if ("undefined" != typeof Promise && item instanceof Promise) return !0;
                    if ("undefined" != typeof window && window.Window && item instanceof window.Window) return !1;
                    if ("undefined" != typeof window && window.constructor && item instanceof window.constructor) return !1;
                    var _toString = {}.toString;
                    if (_toString) {
                        var name = _toString.call(item);
                        if ("[object Window]" === name || "[object global]" === name || "[object DOMWindow]" === name) return !1;
                    }
                    if ("function" == typeof item.then) return !0;
                } catch (err) {
                    return !1;
                }
                return !1;
            }
            function getGlobal() {
                var glob = void 0;
                if ("undefined" != typeof window) glob = window; else {
                    if ("undefined" == typeof window) throw new TypeError("Can not find global");
                    glob = window;
                }
                var zalgoGlobal = glob.__zalgopromise__ = glob.__zalgopromise__ || {};
                zalgoGlobal.flushPromises = zalgoGlobal.flushPromises || [];
                zalgoGlobal.activeCount = zalgoGlobal.activeCount || 0;
                zalgoGlobal.possiblyUnhandledPromiseHandlers = zalgoGlobal.possiblyUnhandledPromiseHandlers || [];
                zalgoGlobal.dispatchedErrors = zalgoGlobal.dispatchedErrors || [];
                return zalgoGlobal;
            }
            var promise_ZalgoPromise = function() {
                function ZalgoPromise(handler) {
                    var _this = this;
                    !function(instance, Constructor) {
                        if (!(instance instanceof ZalgoPromise)) throw new TypeError("Cannot call a class as a function");
                    }(this);
                    this.resolved = !1;
                    this.rejected = !1;
                    this.errorHandled = !1;
                    this.handlers = [];
                    if (handler) {
                        var _result = void 0, _error = void 0, resolved = !1, rejected = !1, isAsync = !1;
                        try {
                            handler(function(res) {
                                if (isAsync) _this.resolve(res); else {
                                    resolved = !0;
                                    _result = res;
                                }
                            }, function(err) {
                                if (isAsync) _this.reject(err); else {
                                    rejected = !0;
                                    _error = err;
                                }
                            });
                        } catch (err) {
                            this.reject(err);
                            return;
                        }
                        isAsync = !0;
                        resolved ? this.resolve(_result) : rejected && this.reject(_error);
                    }
                }
                ZalgoPromise.prototype.resolve = function(result) {
                    if (this.resolved || this.rejected) return this;
                    if (utils_isPromise(result)) throw new Error("Can not resolve promise with another promise");
                    this.resolved = !0;
                    this.value = result;
                    this.dispatch();
                    return this;
                };
                ZalgoPromise.prototype.reject = function(error) {
                    var _this2 = this;
                    if (this.resolved || this.rejected) return this;
                    if (utils_isPromise(error)) throw new Error("Can not reject promise with another promise");
                    if (!error) {
                        var _err = error && "function" == typeof error.toString ? error.toString() : Object.prototype.toString.call(error);
                        error = new Error("Expected reject to be called with Error, got " + _err);
                    }
                    this.rejected = !0;
                    this.error = error;
                    this.errorHandled || setTimeout(function() {
                        _this2.errorHandled || function(err, promise) {
                            if (-1 === getGlobal().dispatchedErrors.indexOf(err)) {
                                getGlobal().dispatchedErrors.push(err);
                                setTimeout(function() {
                                    throw err;
                                }, 1);
                                for (var j = 0; j < getGlobal().possiblyUnhandledPromiseHandlers.length; j++) getGlobal().possiblyUnhandledPromiseHandlers[j](err, promise);
                            }
                        }(error, _this2);
                    }, 1);
                    this.dispatch();
                    return this;
                };
                ZalgoPromise.prototype.asyncReject = function(error) {
                    this.errorHandled = !0;
                    this.reject(error);
                };
                ZalgoPromise.prototype.dispatch = function() {
                    var _this3 = this, dispatching = this.dispatching, resolved = this.resolved, rejected = this.rejected, handlers = this.handlers;
                    if (!dispatching && (resolved || rejected)) {
                        this.dispatching = !0;
                        getGlobal().activeCount += 1;
                        for (var _loop = function(i) {
                            var _handlers$i = handlers[i], onSuccess = _handlers$i.onSuccess, onError = _handlers$i.onError, promise = _handlers$i.promise, result = void 0;
                            if (resolved) try {
                                result = onSuccess ? onSuccess(_this3.value) : _this3.value;
                            } catch (err) {
                                promise.reject(err);
                                return "continue";
                            } else if (rejected) {
                                if (!onError) {
                                    promise.reject(_this3.error);
                                    return "continue";
                                }
                                try {
                                    result = onError(_this3.error);
                                } catch (err) {
                                    promise.reject(err);
                                    return "continue";
                                }
                            }
                            if (result instanceof ZalgoPromise && (result.resolved || result.rejected)) {
                                result.resolved ? promise.resolve(result.value) : promise.reject(result.error);
                                result.errorHandled = !0;
                            } else utils_isPromise(result) ? result instanceof ZalgoPromise && (result.resolved || result.rejected) ? result.resolved ? promise.resolve(result.value) : promise.reject(result.error) : result.then(function(res) {
                                promise.resolve(res);
                            }, function(err) {
                                promise.reject(err);
                            }) : promise.resolve(result);
                        }, i = 0; i < handlers.length; i++) _loop(i);
                        handlers.length = 0;
                        this.dispatching = !1;
                        getGlobal().activeCount -= 1;
                        0 === getGlobal().activeCount && ZalgoPromise.flushQueue();
                    }
                };
                ZalgoPromise.prototype.then = function(onSuccess, onError) {
                    if (onSuccess && "function" != typeof onSuccess && !onSuccess.call) throw new Error("Promise.then expected a function for success handler");
                    if (onError && "function" != typeof onError && !onError.call) throw new Error("Promise.then expected a function for error handler");
                    var promise = new ZalgoPromise();
                    this.handlers.push({
                        promise: promise,
                        onSuccess: onSuccess,
                        onError: onError
                    });
                    this.errorHandled = !0;
                    this.dispatch();
                    return promise;
                };
                ZalgoPromise.prototype.catch = function(onError) {
                    return this.then(void 0, onError);
                };
                ZalgoPromise.prototype.finally = function(onFinally) {
                    if (onFinally && "function" != typeof onFinally && !onFinally.call) throw new Error("Promise.finally expected a function");
                    return this.then(function(result) {
                        return ZalgoPromise.try(onFinally).then(function() {
                            return result;
                        });
                    }, function(err) {
                        return ZalgoPromise.try(onFinally).then(function() {
                            throw err;
                        });
                    });
                };
                ZalgoPromise.prototype.timeout = function(time, err) {
                    var _this4 = this;
                    if (this.resolved || this.rejected) return this;
                    var timeout = setTimeout(function() {
                        _this4.resolved || _this4.rejected || _this4.reject(err || new Error("Promise timed out after " + time + "ms"));
                    }, time);
                    return this.then(function(result) {
                        clearTimeout(timeout);
                        return result;
                    });
                };
                ZalgoPromise.prototype.toPromise = function() {
                    if ("undefined" == typeof Promise) throw new TypeError("Could not find Promise");
                    return Promise.resolve(this);
                };
                ZalgoPromise.resolve = function(value) {
                    return value instanceof ZalgoPromise ? value : utils_isPromise(value) ? new ZalgoPromise(function(resolve, reject) {
                        return value.then(resolve, reject);
                    }) : new ZalgoPromise().resolve(value);
                };
                ZalgoPromise.reject = function(error) {
                    return new ZalgoPromise().reject(error);
                };
                ZalgoPromise.all = function(promises) {
                    var promise = new ZalgoPromise(), count = promises.length, results = [];
                    if (!count) {
                        promise.resolve(results);
                        return promise;
                    }
                    for (var _loop2 = function(i) {
                        var prom = promises[i];
                        if (prom instanceof ZalgoPromise) {
                            if (prom.resolved) {
                                results[i] = prom.value;
                                count -= 1;
                                return "continue";
                            }
                        } else if (!utils_isPromise(prom)) {
                            results[i] = prom;
                            count -= 1;
                            return "continue";
                        }
                        ZalgoPromise.resolve(prom).then(function(result) {
                            results[i] = result;
                            0 == (count -= 1) && promise.resolve(results);
                        }, function(err) {
                            promise.reject(err);
                        });
                    }, i = 0; i < promises.length; i++) _loop2(i);
                    0 === count && promise.resolve(results);
                    return promise;
                };
                ZalgoPromise.hash = function(promises) {
                    var result = {};
                    return ZalgoPromise.all(Object.keys(promises).map(function(key) {
                        return ZalgoPromise.resolve(promises[key]).then(function(value) {
                            result[key] = value;
                        });
                    })).then(function() {
                        return result;
                    });
                };
                ZalgoPromise.map = function(items, method) {
                    return ZalgoPromise.all(items.map(method));
                };
                ZalgoPromise.onPossiblyUnhandledException = function(handler) {
                    return function(handler) {
                        getGlobal().possiblyUnhandledPromiseHandlers.push(handler);
                        return {
                            cancel: function() {
                                getGlobal().possiblyUnhandledPromiseHandlers.splice(getGlobal().possiblyUnhandledPromiseHandlers.indexOf(handler), 1);
                            }
                        };
                    }(handler);
                };
                ZalgoPromise.try = function(method, context, args) {
                    if (method && "function" != typeof method && !method.call) throw new Error("Promise.try expected a function");
                    var result = void 0;
                    try {
                        result = method.apply(context, args || []);
                    } catch (err) {
                        return ZalgoPromise.reject(err);
                    }
                    return ZalgoPromise.resolve(result);
                };
                ZalgoPromise.delay = function(_delay) {
                    return new ZalgoPromise(function(resolve) {
                        setTimeout(resolve, _delay);
                    });
                };
                ZalgoPromise.isPromise = function(value) {
                    return !!(value && value instanceof ZalgoPromise) || utils_isPromise(value);
                };
                ZalgoPromise.flush = function() {
                    var promise = new ZalgoPromise();
                    getGlobal().flushPromises.push(promise);
                    0 === getGlobal().activeCount && ZalgoPromise.flushQueue();
                    return promise;
                };
                ZalgoPromise.flushQueue = function() {
                    var promisesToFlush = getGlobal().flushPromises;
                    getGlobal().flushPromises = [];
                    for (var _i2 = 0, _length2 = null == promisesToFlush ? 0 : promisesToFlush.length; _i2 < _length2; _i2++) promisesToFlush[_i2].resolve();
                };
                return ZalgoPromise;
            }();
            __webpack_require__.d(__webpack_exports__, "a", function() {
                return promise_ZalgoPromise;
            });
        },
        "./src/css.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.a = isPerc;
            __webpack_exports__.b = isPx;
            __webpack_exports__.f = toNum;
            __webpack_exports__.g = toPx;
            __webpack_exports__.e = function(val) {
                return "number" == typeof val ? toPx(val) : isPerc(val) ? val : toPx(val);
            };
            __webpack_exports__.d = percOf;
            __webpack_exports__.c = function(dim, max) {
                if ("number" == typeof dim) return dim;
                if (isPerc(dim)) return percOf(max, dim);
                if (isPx(dim)) return toNum(dim);
                throw new Error("Can not normalize dimension: " + dim);
            };
            function isPerc(str) {
                return "string" == typeof str && /^[0-9]+%$/.test(str);
            }
            function isPx(str) {
                return "string" == typeof str && /^[0-9]+px$/.test(str);
            }
            function toNum(val) {
                if ("number" == typeof val) return val;
                var match = val.match(/^([0-9]+)(px|%)$/);
                if (!match) throw new Error("Could not match css value from " + val);
                return parseInt(match[1], 10);
            }
            function toPx(val) {
                return toNum(val) + "px";
            }
            function percOf(num, perc) {
                return parseInt(num * toNum(perc) / 100, 10);
            }
        },
        "./src/decorators.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.a = function(target, name, descriptor) {
                descriptor.value = Object(__WEBPACK_IMPORTED_MODULE_0__util__.F)(descriptor.value, {
                    name: name,
                    thisNamespace: !0
                });
            };
            __webpack_exports__.b = function(target, name, descriptor) {
                descriptor.value = Object(__WEBPACK_IMPORTED_MODULE_0__util__.O)(descriptor.value, {
                    name: name
                });
            };
            var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__("./src/util.js");
        },
        "./src/device.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.a = getUserAgent;
            __webpack_exports__.d = function() {
                return !!getUserAgent().match(/Android|webOS|iPhone|iPad|iPod|bada|Symbian|Palm|CriOS|BlackBerry|IEMobile|WindowsMobile|Opera Mini/i);
            };
            __webpack_exports__.s = function() {
                var userAgent = getUserAgent();
                return /(iPhone|iPod|iPad|Macintosh).*AppleWebKit(?!.*Safari)/i.test(userAgent) || /\bwv\b/.test(userAgent) || /Android.*Version\/(\d)\.(\d)/i.test(userAgent);
            };
            __webpack_exports__.r = isStandAlone;
            __webpack_exports__.g = isFacebookWebView;
            __webpack_exports__.h = isFirefoxIOS;
            __webpack_exports__.e = isEdgeIOS;
            __webpack_exports__.p = isOperaMini;
            __webpack_exports__.b = isAndroid;
            __webpack_exports__.m = isIos;
            __webpack_exports__.i = isGoogleSearchApp;
            __webpack_exports__.q = isQQBrowser;
            __webpack_exports__.n = isIosWebview;
            __webpack_exports__.c = isAndroidWebview;
            __webpack_exports__.j = function() {
                return !!window.document.documentMode || Boolean(window.navigator && window.navigator.userAgent && /Edge|MSIE/i.test(window.navigator.userAgent));
            };
            __webpack_exports__.k = function() {
                var mHttp = window.document.querySelector('meta[http-equiv="X-UA-Compatible"]'), mContent = window.document.querySelector('meta[content="IE=edge"]');
                return !(!mHttp || !mContent);
            };
            __webpack_exports__.f = isElectron;
            __webpack_exports__.l = function() {
                if (window.document.documentMode) try {
                    var status = window.status;
                    window.status = "testIntranetMode";
                    if ("testIntranetMode" === window.status) {
                        window.status = status;
                        return !0;
                    }
                    return !1;
                } catch (err) {
                    return !1;
                }
                return !1;
            };
            __webpack_exports__.o = isMacOsCna;
            __webpack_exports__.t = function() {
                var ua = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getUserAgent();
                return !(isIosWebview(ua) || isAndroidWebview(ua) || isOperaMini(ua) || isFirefoxIOS(ua) || isEdgeIOS(ua) || isFacebookWebView(ua) || isQQBrowser(ua) || isElectron() || isMacOsCna() || isStandAlone());
            };
            function getUserAgent() {
                return window.navigator.mockUserAgent || window.navigator.userAgent;
            }
            function isStandAlone() {
                return !0 === window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
            }
            function isFacebookWebView() {
                var ua = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getUserAgent();
                return -1 !== ua.indexOf("FBAN") || -1 !== ua.indexOf("FBAV");
            }
            function isFirefoxIOS() {
                var ua = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getUserAgent();
                return /FxiOS/i.test(ua);
            }
            function isEdgeIOS() {
                var ua = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getUserAgent();
                return /EdgiOS/i.test(ua);
            }
            function isOperaMini() {
                return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getUserAgent()).indexOf("Opera Mini") > -1;
            }
            function isAndroid() {
                var ua = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getUserAgent();
                return /Android/.test(ua);
            }
            function isIos() {
                var ua = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getUserAgent();
                return /iPhone|iPod|iPad/.test(ua);
            }
            function isGoogleSearchApp() {
                var ua = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getUserAgent();
                return /\bGSA\b/.test(ua);
            }
            function isQQBrowser() {
                var ua = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getUserAgent();
                return /QQBrowser/.test(ua);
            }
            function isIosWebview() {
                var ua = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getUserAgent();
                return !!isIos(ua) && (!!isGoogleSearchApp(ua) || /.+AppleWebKit(?!.*Safari)/.test(ua));
            }
            function isAndroidWebview() {
                var ua = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getUserAgent();
                return !!isAndroid(ua) && /Version\/[\d.]+/.test(ua) && !isOperaMini(ua);
            }
            function isElectron() {
                return !("undefined" == typeof process || !process.versions || !process.versions.electron);
            }
            function isMacOsCna() {
                var userAgent = getUserAgent();
                return /Macintosh.*AppleWebKit(?!.*Safari)/i.test(userAgent);
            }
        },
        "./src/dom.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var src = __webpack_require__("./node_modules/zalgo-promise/src/index.js"), cross_domain_utils_src = __webpack_require__("./node_modules/cross-domain-utils/src/index.js"), cross_domain_safe_weakmap_src = __webpack_require__("./node_modules/cross-domain-safe-weakmap/src/index.js"), util = __webpack_require__("./src/util.js"), device = __webpack_require__("./src/device.js");
            __webpack_exports__.F = isDocumentReady;
            __webpack_exports__.Z = urlEncode;
            __webpack_exports__._3 = function waitForWindowReady() {
                return Object(util.v)(waitForWindowReady, function() {
                    return new src.a(function(resolve) {
                        isDocumentReady() && resolve();
                        window.addEventListener("load", function() {
                            return resolve();
                        });
                    });
                });
            };
            __webpack_exports__._2 = waitForDocumentReady;
            __webpack_exports__._1 = function() {
                return waitForDocumentReady.then(function() {
                    if (document.body) return document.body;
                    throw new Error("Document ready but document.body not present");
                });
            };
            __webpack_exports__.O = parseQuery;
            __webpack_exports__.y = function(name) {
                return parseQuery(window.location.search.slice(1))[name];
            };
            __webpack_exports__._0 = urlWillRedirectPage;
            __webpack_exports__.s = formatQuery;
            __webpack_exports__.p = extendQuery;
            __webpack_exports__.q = function(url) {
                var originalHash, options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, query = options.query || {}, hash = options.hash || {}, originalUrl = void 0, _url$split = url.split("#");
                originalUrl = _url$split[0];
                originalHash = _url$split[1];
                var _originalUrl$split = originalUrl.split("?");
                originalUrl = _originalUrl$split[0];
                var queryString = extendQuery(_originalUrl$split[1], query), hashString = extendQuery(originalHash, hash);
                queryString && (originalUrl = originalUrl + "?" + queryString);
                hashString && (originalUrl = originalUrl + "#" + hashString);
                return originalUrl;
            };
            __webpack_exports__.R = function(url) {
                var win = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : window;
                return new src.a(function(resolve) {
                    win.location = url;
                    urlWillRedirectPage(url) || resolve();
                });
            };
            __webpack_exports__.A = function() {
                var meta = document.querySelector("meta[name=viewport]");
                return !(Object(device.d)() && window.screen.width < 660 && !meta);
            };
            __webpack_exports__.I = function(el) {
                return Boolean(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
            };
            __webpack_exports__.o = enablePerformance;
            __webpack_exports__.x = function() {
                return waitForDocumentReady().then(function() {
                    if (enablePerformance()) {
                        var timing = window.performance.timing;
                        return timing.connectEnd && timing.domInteractive ? timing.domInteractive - timing.connectEnd : void 0;
                    }
                });
            };
            __webpack_exports__.C = function() {
                return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "").toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\//g, "&#x2F;");
            };
            __webpack_exports__.E = function() {
                return "undefined" != typeof window;
            };
            __webpack_exports__.Q = querySelectorAll;
            __webpack_exports__.M = function(element, handler) {
                element.addEventListener("touchstart", util.I);
                element.addEventListener("click", handler);
                element.addEventListener("keypress", function(event) {
                    if (13 === event.keyCode) return handler(event);
                });
            };
            __webpack_exports__.z = function getScript(_ref) {
                var _ref$host = _ref.host, host = void 0 === _ref$host ? window.location.host : _ref$host, path = _ref.path;
                return Object(util.v)(getScript, function() {
                    for (var url = "" + host + path, scripts = Array.prototype.slice.call(document.getElementsByTagName("script")), _i4 = 0, _length4 = null == scripts ? 0 : scripts.length; _i4 < _length4; _i4++) {
                        var script = scripts[_i4];
                        if (script.src && script.src.replace(/^https?:\/\//, "").split("?")[0] === url) return script;
                    }
                }, [ path ]);
            };
            __webpack_exports__.J = function isLocalStorageEnabled() {
                return Object(util.v)(isLocalStorageEnabled, function() {
                    try {
                        if ("undefined" == typeof window) return !1;
                        if (window.localStorage) {
                            var value = Math.random().toString();
                            window.localStorage.setItem("__test__localStorage__", value);
                            var result = window.localStorage.getItem("__test__localStorage__");
                            window.localStorage.removeItem("__test__localStorage__");
                            if (value === result) return !0;
                        }
                    } catch (err) {}
                    return !1;
                });
            };
            __webpack_exports__.t = function() {
                var nav = window.navigator, locales = nav.languages ? Array.prototype.slice.apply(nav.languages) : [];
                nav.language && locales.push(nav.language);
                nav.userLanguage && locales.push(nav.userLanguage);
                return locales.map(function(locale) {
                    if (locale && locale.match(/^[a-z]{2}[-_][A-Z]{2}$/)) {
                        var _locale$split = locale.split(/[-_]/), _lang = _locale$split[0];
                        return {
                            country: _locale$split[1],
                            lang: _lang
                        };
                    }
                    return locale && locale.match(/^[a-z]{2}$/) ? {
                        lang: locale
                    } : null;
                }).filter(Boolean);
            };
            __webpack_exports__.f = appendChild;
            __webpack_exports__.G = isElement;
            __webpack_exports__.w = getElementSafe;
            __webpack_exports__.v = getElement;
            __webpack_exports__.m = function(id) {
                return new src.a(function(resolve, reject) {
                    var name = Object(util.Y)(id), el = getElementSafe(id);
                    if (el) return resolve(el);
                    if (isDocumentReady()) return reject(new Error("Document is ready and element " + name + " does not exist"));
                    var interval = setInterval(function() {
                        if (el = getElementSafe(id)) {
                            clearInterval(interval);
                            return resolve(el);
                        }
                        if (isDocumentReady()) {
                            clearInterval(interval);
                            return reject(new Error("Document is ready and element " + name + " does not exist"));
                        }
                    }, 10);
                });
            };
            __webpack_exports__.a = PopupOpenError;
            __webpack_exports__.P = function(url, options) {
                var _options = options = options || {}, width = _options.width, height = _options.height, top = 0, left = 0;
                width && (window.outerWidth ? left = Math.round((window.outerWidth - width) / 2) + window.screenX : window.screen.width && (left = Math.round((window.screen.width - width) / 2)));
                height && (window.outerHeight ? top = Math.round((window.outerHeight - height) / 2) + window.screenY : window.screen.height && (top = Math.round((window.screen.height - height) / 2)));
                var name = (options = _extends({
                    top: top,
                    left: left,
                    width: width,
                    height: height,
                    status: 1,
                    toolbar: 0,
                    menubar: 0,
                    resizable: 1,
                    scrollbars: 1
                }, options)).name || Object(util._3)();
                delete options.name;
                var params = Object.keys(options).map(function(key) {
                    if (options[key]) return key + "=" + Object(util.Y)(options[key]);
                }).filter(Boolean).join(","), win = void 0;
                try {
                    win = window.open(url, name, params, !0);
                } catch (err) {
                    throw new PopupOpenError("Can not open popup window - " + (err.stack || err.message));
                }
                if (Object(cross_domain_utils_src.isWindowClosed)(win)) {
                    var err;
                    throw new PopupOpenError("Can not open popup window - blocked");
                }
                return win;
            };
            __webpack_exports__._6 = writeToWindow;
            __webpack_exports__._5 = function(win, el) {
                var tag = el.tagName.toLowerCase();
                if ("html" !== tag) throw new Error("Expected element to be html, got " + tag);
                for (var documentElement = win.document.documentElement; documentElement.children && documentElement.children.length; ) documentElement.removeChild(documentElement.children[0]);
                for (;el.children.length; ) documentElement.appendChild(el.children[0]);
            };
            __webpack_exports__.U = setStyle;
            __webpack_exports__.g = awaitFrameLoad;
            __webpack_exports__.h = function(frame) {
                return frame.contentWindow ? src.a.resolve(frame.contentWindow) : awaitFrameLoad(frame).then(function(loadedFrame) {
                    if (!loadedFrame.contentWindow) throw new Error("Could not find window in iframe");
                    return loadedFrame.contentWindow;
                });
            };
            __webpack_exports__.j = createElement;
            __webpack_exports__.D = function() {
                var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, el = getElement(arguments[1]), attributes = options.attributes || {}, style = options.style || {}, frame = createElement("iframe", {
                    attributes: _extends({
                        frameBorder: "0",
                        allowTransparency: "true"
                    }, attributes),
                    style: _extends({
                        backgroundColor: "transparent"
                    }, style),
                    html: options.html,
                    class: options.class
                });
                awaitFrameLoad(frame);
                el.appendChild(frame);
                (options.url || window.navigator.userAgent.match(/MSIE|Edge/i)) && frame.setAttribute("src", options.url || "about:blank");
                return frame;
            };
            __webpack_exports__.c = function(obj, event, handler) {
                obj.addEventListener(event, handler);
                return {
                    cancel: function() {
                        obj.removeEventListener(event, handler);
                    }
                };
            };
            __webpack_exports__.n = function(element) {
                var timeout = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 5e3;
                return new src.a(function(resolve, reject) {
                    var el = getElement(element), start = el.getBoundingClientRect(), interval = void 0, timer = void 0;
                    interval = setInterval(function() {
                        var end = el.getBoundingClientRect();
                        if (start.top === end.top && start.bottom === end.bottom && start.left === end.left && start.right === end.right && start.width === end.width && start.height === end.height) {
                            clearTimeout(timer);
                            clearInterval(interval);
                            return resolve();
                        }
                        start = end;
                    }, 50);
                    timer = setTimeout(function() {
                        clearInterval(interval);
                        reject(new Error("Timed out waiting for element to stop animating after " + timeout + "ms"));
                    }, timeout);
                });
            };
            __webpack_exports__.u = getCurrentDimensions;
            __webpack_exports__.T = function(el) {
                var value = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "auto", _el$style = el.style, overflow = _el$style.overflow, overflowX = _el$style.overflowX, overflowY = _el$style.overflowY;
                el.style.overflow = el.style.overflowX = el.style.overflowY = value;
                return {
                    reset: function() {
                        el.style.overflow = overflow;
                        el.style.overflowX = overflowX;
                        el.style.overflowY = overflowY;
                    }
                };
            };
            __webpack_exports__.Y = trackDimensions;
            __webpack_exports__.N = function(el, _ref4) {
                var _ref4$width = _ref4.width, width = void 0 === _ref4$width || _ref4$width, _ref4$height = _ref4.height, height = void 0 === _ref4$height || _ref4$height, _ref4$delay = _ref4.delay, delay = void 0 === _ref4$delay ? 50 : _ref4$delay, _ref4$threshold = _ref4.threshold, threshold = void 0 === _ref4$threshold ? 0 : _ref4$threshold;
                return new src.a(function(resolve) {
                    var tracker = trackDimensions(el, {
                        width: width,
                        height: height,
                        threshold: threshold
                    }), interval = void 0, resolver = Object(util.i)(function(dimensions) {
                        clearInterval(interval);
                        return resolve(dimensions);
                    }, 4 * delay);
                    interval = setInterval(function() {
                        var _tracker$check = tracker.check(), changed = _tracker$check.changed, dimensions = _tracker$check.dimensions;
                        if (changed) {
                            tracker.reset();
                            return resolver(dimensions);
                        }
                    }, delay);
                    window.addEventListener("resize", function onWindowResize() {
                        var _tracker$check2 = tracker.check(), changed = _tracker$check2.changed, dimensions = _tracker$check2.dimensions;
                        if (changed) {
                            tracker.reset();
                            window.removeEventListener("resize", onWindowResize);
                            resolver(dimensions);
                        }
                    });
                });
            };
            __webpack_exports__.l = function(el, _ref5) {
                var width = _ref5.width, height = _ref5.height, dimensions = getCurrentDimensions(el);
                return !(width && dimensions.width !== window.innerWidth || height && dimensions.height !== window.innerHeight);
            };
            __webpack_exports__.i = bindEvents;
            __webpack_exports__.V = setVendorCSS;
            __webpack_exports__.d = animate;
            __webpack_exports__.L = function(element) {
                element.style.setProperty("visibility", "");
            };
            __webpack_exports__.K = function(element) {
                element.style.setProperty("visibility", STYLE.VISIBILITY.HIDDEN, STYLE.IMPORTANT);
            };
            __webpack_exports__.X = showElement;
            __webpack_exports__.B = hideElement;
            __webpack_exports__.k = function(element) {
                element.parentNode && element.parentNode.removeChild(element);
            };
            __webpack_exports__.W = function(element, name, clean) {
                var animation = animate(element, name, clean);
                showElement(element);
                return animation;
            };
            __webpack_exports__.e = function(element, name, clean) {
                return animate(element, name, clean).then(function() {
                    hideElement(element);
                });
            };
            __webpack_exports__.b = function(element, name) {
                element.classList ? element.classList.add(name) : -1 === element.className.split(/\s+/).indexOf(name) && (element.className += " " + name);
            };
            __webpack_exports__.S = function(element, name) {
                element.classList ? element.classList.remove(name) : -1 !== element.className.split(/\s+/).indexOf(name) && (element.className = element.className.replace(name, ""));
            };
            __webpack_exports__.H = isElementClosed;
            __webpack_exports__._4 = function(element, handler) {
                handler = Object(util.K)(handler);
                var interval = void 0;
                isElementClosed(element) ? handler() : interval = Object(util.U)(function() {
                    if (isElementClosed(element)) {
                        interval.cancel();
                        handler();
                    }
                }, 50);
                return {
                    cancel: function() {
                        interval && interval.cancel();
                    }
                };
            };
            __webpack_exports__.r = function(el) {
                for (var doc = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : window.document, _i14 = 0, _querySelectorAll2 = querySelectorAll("script", el), _length14 = null == _querySelectorAll2 ? 0 : _querySelectorAll2.length; _i14 < _length14; _i14++) {
                    var script = _querySelectorAll2[_i14], parentNode = script.parentNode;
                    if (parentNode) {
                        var newScript = doc.createElement("script");
                        newScript.text = script.textContent;
                        parentNode.replaceChild(newScript, script);
                    }
                }
            };
            var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            }, _extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                }
                return target;
            };
            function isDocumentReady() {
                return Boolean(document.body) && "complete" === document.readyState;
            }
            function urlEncode(str) {
                return str.replace(/\?/g, "%3F").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2B");
            }
            function waitForDocumentReady() {
                return Object(util.v)(waitForDocumentReady, function() {
                    return new src.a(function(resolve) {
                        if (isDocumentReady()) return resolve();
                        var interval = setInterval(function() {
                            if (isDocumentReady()) {
                                clearInterval(interval);
                                return resolve();
                            }
                        }, 10);
                    });
                });
            }
            function parseQuery(queryString) {
                return Object(util.v)(parseQuery, function() {
                    var params = {};
                    if (!queryString) return params;
                    if (-1 === queryString.indexOf("=")) return params;
                    for (var _i2 = 0, _queryString$split2 = queryString.split("&"), _length2 = null == _queryString$split2 ? 0 : _queryString$split2.length; _i2 < _length2; _i2++) {
                        var pair = _queryString$split2[_i2];
                        (pair = pair.split("="))[0] && pair[1] && (params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]));
                    }
                    return params;
                }, [ queryString ]);
            }
            function urlWillRedirectPage(url) {
                return -1 === url.indexOf("#") || 0 !== url.indexOf("#") && url.split("#")[0] !== window.location.href.split("#")[0];
            }
            function formatQuery() {
                var obj = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                return Object.keys(obj).filter(function(key) {
                    return "string" == typeof obj[key];
                }).map(function(key) {
                    return urlEncode(key) + "=" + urlEncode(obj[key]);
                }).join("&");
            }
            function extendQuery(originalQuery) {
                var props = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                return props && Object.keys(props).length ? formatQuery(_extends({}, parseQuery(originalQuery), props)) : originalQuery;
            }
            function enablePerformance() {
                return Object(util.v)(enablePerformance, function() {
                    return Boolean(window.performance && performance.now && performance.timing && performance.timing.connectEnd && performance.timing.navigationStart && Math.abs(performance.now() - Date.now()) > 1e3 && performance.now() - (performance.timing.connectEnd - performance.timing.navigationStart) > 0);
                });
            }
            function querySelectorAll(selector) {
                var doc = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : window.document;
                return Array.prototype.slice.call(doc.querySelectorAll(selector));
            }
            function appendChild(container, child) {
                container.appendChild(child);
            }
            function isElement(element) {
                return element instanceof window.Element || null !== element && "object" === (void 0 === element ? "undefined" : _typeof(element)) && 1 === element.nodeType && "object" === _typeof(element.style) && "object" === _typeof(element.ownerDocument);
            }
            function getElementSafe(id) {
                if (isElement(id)) return id;
                if ("string" == typeof id) {
                    var element = document.getElementById(id);
                    if (element) return element;
                    document.querySelector && (element = document.querySelector(id));
                    if (element) return element;
                }
            }
            function getElement(id) {
                var element = getElementSafe(id);
                if (element) return element;
                throw new Error("Can not find element: " + Object(util.Y)(id));
            }
            function PopupOpenError(message) {
                this.message = message;
            }
            PopupOpenError.prototype = Object.create(Error.prototype);
            function writeToWindow(win, html) {
                try {
                    win.document.open();
                    win.document.write(html);
                    win.document.close();
                } catch (err) {
                    try {
                        win.location = "javascript: document.open(); document.write(" + JSON.stringify(html) + "); document.close();";
                    } catch (err2) {}
                }
            }
            function setStyle(el, styleText) {
                var doc = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : window.document;
                el.styleSheet ? el.styleSheet.cssText = styleText : el.appendChild(doc.createTextNode(styleText));
            }
            var awaitFrameLoadPromises = void 0;
            function awaitFrameLoad(frame) {
                if ((awaitFrameLoadPromises = awaitFrameLoadPromises || new cross_domain_safe_weakmap_src.a()).has(frame)) {
                    var _promise = awaitFrameLoadPromises.get(frame);
                    if (_promise) return _promise;
                }
                var promise = new src.a(function(resolve, reject) {
                    frame.addEventListener("load", function() {
                        Object(cross_domain_utils_src.linkFrameWindow)(frame);
                        resolve(frame);
                    });
                    frame.addEventListener("error", function(err) {
                        frame.contentWindow ? resolve(frame) : reject(err);
                    });
                });
                awaitFrameLoadPromises.set(frame, promise);
                return promise;
            }
            function createElement() {
                var tag = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "div", options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, container = arguments[2];
                tag = tag.toLowerCase();
                var element = document.createElement(tag);
                options.style && Object(util.o)(element.style, options.style);
                options.class && (element.className = options.class.join(" "));
                if (options.attributes) for (var _i6 = 0, _Object$keys2 = Object.keys(options.attributes), _length6 = null == _Object$keys2 ? 0 : _Object$keys2.length; _i6 < _length6; _i6++) {
                    var key = _Object$keys2[_i6];
                    element.setAttribute(key, options.attributes[key]);
                }
                options.styleSheet && setStyle(element, options.styleSheet);
                container && appendChild(container, element);
                if (options.html) if ("iframe" === tag) {
                    if (!container || !element.contentWindow) throw new Error("Iframe html can not be written unless container provided and iframe in DOM");
                    writeToWindow(element.contentWindow, options.html);
                } else element.innerHTML = options.html;
                return element;
            }
            function getCurrentDimensions(el) {
                return {
                    width: el.offsetWidth,
                    height: el.offsetHeight
                };
            }
            function trackDimensions(el, _ref3) {
                var _ref3$width = _ref3.width, width = void 0 === _ref3$width || _ref3$width, _ref3$height = _ref3.height, height = void 0 === _ref3$height || _ref3$height, _ref3$threshold = _ref3.threshold, threshold = void 0 === _ref3$threshold ? 0 : _ref3$threshold, currentDimensions = getCurrentDimensions(el);
                return {
                    check: function() {
                        var newDimensions = getCurrentDimensions(el);
                        return {
                            changed: function(one, two, _ref2) {
                                var _ref2$width = _ref2.width, _ref2$height = _ref2.height, height = void 0 === _ref2$height || _ref2$height, _ref2$threshold = _ref2.threshold, threshold = void 0 === _ref2$threshold ? 0 : _ref2$threshold;
                                return !(void 0 !== _ref2$width && !_ref2$width || !(Math.abs(one.width - two.width) > threshold)) || !!(height && Math.abs(one.height - two.height) > threshold);
                            }(currentDimensions, newDimensions, {
                                width: width,
                                height: height,
                                threshold: threshold
                            }),
                            dimensions: newDimensions
                        };
                    },
                    reset: function() {
                        currentDimensions = getCurrentDimensions(el);
                    }
                };
            }
            function bindEvents(element, eventNames, handler) {
                handler = Object(util.K)(handler);
                for (var _i8 = 0, _length8 = null == eventNames ? 0 : eventNames.length; _i8 < _length8; _i8++) {
                    var eventName = eventNames[_i8];
                    element.addEventListener(eventName, handler);
                }
                return {
                    cancel: Object(util.K)(function() {
                        for (var _i10 = 0, _length10 = null == eventNames ? 0 : eventNames.length; _i10 < _length10; _i10++) {
                            var _eventName = eventNames[_i10];
                            element.removeEventListener(_eventName, handler);
                        }
                    })
                };
            }
            var VENDOR_PREFIXES = [ "webkit", "moz", "ms", "o" ];
            function setVendorCSS(element, name, value) {
                element.style[name] = value;
                for (var capitalizedName = Object(util.e)(name), _i12 = 0, _length12 = null == VENDOR_PREFIXES ? 0 : VENDOR_PREFIXES.length; _i12 < _length12; _i12++) {
                    var prefix = VENDOR_PREFIXES[_i12];
                    element.style["" + prefix + capitalizedName] = value;
                }
            }
            var ANIMATION_START_EVENTS = [ "animationstart", "webkitAnimationStart", "oAnimationStart", "MSAnimationStart" ], ANIMATION_END_EVENTS = [ "animationend", "webkitAnimationEnd", "oAnimationEnd", "MSAnimationEnd" ];
            function animate(element, name, clean) {
                var timeout = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1e3;
                return new src.a(function(resolve, reject) {
                    var el = getElement(element);
                    if (!el || !function(element, name) {
                        var CSSRule = window.CSSRule, KEYFRAMES_RULE = CSSRule.KEYFRAMES_RULE || CSSRule.WEBKIT_KEYFRAMES_RULE || CSSRule.MOZ_KEYFRAMES_RULE || CSSRule.O_KEYFRAMES_RULE || CSSRule.MS_KEYFRAMES_RULE, stylesheets = element.ownerDocument.styleSheets;
                        try {
                            for (var i = 0; i < stylesheets.length; i++) {
                                var cssRules = stylesheets[i].cssRules;
                                if (cssRules) for (var j = 0; j < cssRules.length; j++) {
                                    var cssRule = cssRules[j];
                                    if (cssRule && cssRule.type === KEYFRAMES_RULE && cssRule.name === name) return !0;
                                }
                            }
                        } catch (err) {
                            return !1;
                        }
                        return !1;
                    }(el, name)) return resolve();
                    var hasStarted = !1, startTimeout = void 0, endTimeout = void 0, startEvent = void 0, endEvent = void 0;
                    function cleanUp() {
                        setVendorCSS(el, "animationName", "");
                        clearTimeout(startTimeout);
                        clearTimeout(endTimeout);
                        startEvent.cancel();
                        endEvent.cancel();
                    }
                    startEvent = bindEvents(el, ANIMATION_START_EVENTS, function(event) {
                        if (event.target === el && event.animationName === name) {
                            clearTimeout(startTimeout);
                            event.stopPropagation();
                            startEvent.cancel();
                            hasStarted = !0;
                            endTimeout = setTimeout(function() {
                                cleanUp();
                                resolve();
                            }, timeout);
                        }
                    });
                    endEvent = bindEvents(el, ANIMATION_END_EVENTS, function(event) {
                        if (event.target === el && event.animationName === name) {
                            cleanUp();
                            return "string" == typeof event.animationName && event.animationName !== name ? reject("Expected animation name to be " + name + ", found " + event.animationName) : resolve();
                        }
                    });
                    setVendorCSS(el, "animationName", name);
                    startTimeout = setTimeout(function() {
                        if (!hasStarted) {
                            cleanUp();
                            return resolve();
                        }
                    }, 200);
                    clean && clean(cleanUp);
                });
            }
            var STYLE = {
                DISPLAY: {
                    NONE: "none",
                    BLOCK: "block"
                },
                VISIBILITY: {
                    VISIBLE: "visible",
                    HIDDEN: "hidden"
                },
                IMPORTANT: "important"
            };
            function showElement(element) {
                element.style.setProperty("display", "");
            }
            function hideElement(element) {
                element.style.setProperty("display", STYLE.DISPLAY.NONE, STYLE.IMPORTANT);
            }
            function isElementClosed(el) {
                return !el || !el.parentNode;
            }
        },
        "./src/experiment.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.a = function(_ref) {
                var group, name = _ref.name, _ref$sample = _ref.sample, sample = void 0 === _ref$sample ? 50 : _ref$sample, _ref$logTreatment = _ref.logTreatment, logTreatment = void 0 === _ref$logTreatment ? __WEBPACK_IMPORTED_MODULE_0__util__.I : _ref$logTreatment, _ref$logCheckpoint = _ref.logCheckpoint, logCheckpoint = void 0 === _ref$logCheckpoint ? __WEBPACK_IMPORTED_MODULE_0__util__.I : _ref$logCheckpoint, throttle = function(name) {
                    return getBelterExperimentStorage().getState(function(state) {
                        state.throttlePercentiles = state.throttlePercentiles || {};
                        state.throttlePercentiles[name] = state.throttlePercentiles[name] || Math.floor(100 * Math.random());
                        return state.throttlePercentiles[name];
                    });
                }(name);
                group = throttle < sample ? THROTTLE_GROUP.TEST : sample >= 50 || sample <= throttle && throttle < 2 * sample ? THROTTLE_GROUP.CONTROL : THROTTLE_GROUP.THROTTLE;
                var treatment = name + "_" + group, started = !1, forced = !1;
                try {
                    window.localStorage && window.localStorage.getItem(name) && (forced = !0);
                } catch (err) {}
                return {
                    isEnabled: function() {
                        return group === THROTTLE_GROUP.TEST || forced;
                    },
                    isDisabled: function() {
                        return group !== THROTTLE_GROUP.TEST && !forced;
                    },
                    getTreatment: function() {
                        return treatment;
                    },
                    log: function(checkpoint) {
                        var payload = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                        if (!started) return this;
                        isEventUnique(name + "_" + treatment) && logTreatment({
                            name: name,
                            treatment: treatment
                        });
                        isEventUnique(name + "_" + treatment + "_" + checkpoint) && logCheckpoint({
                            name: name,
                            treatment: treatment,
                            checkpoint: checkpoint,
                            payload: payload
                        });
                        return this;
                    },
                    logStart: function() {
                        var payload = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        started = !0;
                        return this.log("start", payload);
                    },
                    logComplete: function() {
                        var payload = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        return this.log("complete", payload);
                    }
                };
            };
            var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__("./src/util.js"), __WEBPACK_IMPORTED_MODULE_1__storage__ = __webpack_require__("./src/storage.js");
            function getBelterExperimentStorage() {
                return Object(__WEBPACK_IMPORTED_MODULE_1__storage__.a)({
                    name: "belter_experiment"
                });
            }
            function isEventUnique(name) {
                return getBelterExperimentStorage().getSessionState(function(state) {
                    state.loggedBeacons = state.loggedBeacons || [];
                    if (-1 === state.loggedBeacons.indexOf(name)) {
                        state.loggedBeacons.push(name);
                        return !0;
                    }
                    return !1;
                });
            }
            var THROTTLE_GROUP = {
                TEST: "test",
                CONTROL: "control",
                THROTTLE: "throttle"
            };
        },
        "./src/global.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.a = function(_ref) {
                var name = _ref.name, _ref$version = _ref.version, version = void 0 === _ref$version ? "latest" : _ref$version, global = Object(__WEBPACK_IMPORTED_MODULE_0__util__.q)(), globalKey = "__" + name + "__" + version + "_global__", namespace = global[globalKey] = global[globalKey] || {};
                return {
                    get: function(key, defValue) {
                        defValue = defValue || {};
                        return namespace[key] = namespace[key] || defValue;
                    }
                };
            };
            var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__("./src/util.js");
        },
        "./src/http.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.b = function(_ref) {
                var url = _ref.url, _ref$method = _ref.method, method = void 0 === _ref$method ? "get" : _ref$method, _ref$headers = _ref.headers, headers = void 0 === _ref$headers ? {} : _ref$headers, json = _ref.json, data = _ref.data, body = _ref.body, _ref$win = _ref.win, win = void 0 === _ref$win ? window : _ref$win, _ref$timeout = _ref.timeout, timeout = void 0 === _ref$timeout ? 0 : _ref$timeout;
                return new __WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__.a(function(resolve, reject) {
                    if (json && data || json && body || data && json) throw new Error("Only options.json or options.data or options.body should be passed");
                    for (var normalizedHeaders = {}, _i4 = 0, _Object$keys2 = Object.keys(headers), _length4 = null == _Object$keys2 ? 0 : _Object$keys2.length; _i4 < _length4; _i4++) {
                        var _key2 = _Object$keys2[_i4];
                        normalizedHeaders[_key2.toLowerCase()] = headers[_key2];
                    }
                    json ? normalizedHeaders[HEADERS.CONTENT_TYPE] = normalizedHeaders[HEADERS.CONTENT_TYPE] || "application/json" : (data || body) && (normalizedHeaders[HEADERS.CONTENT_TYPE] = normalizedHeaders[HEADERS.CONTENT_TYPE] || "application/x-www-form-urlencoded; charset=utf-8");
                    normalizedHeaders[HEADERS.ACCEPT] = normalizedHeaders[HEADERS.ACCEPT] || "application/json";
                    for (var _i6 = 0, _length6 = null == headerBuilders ? 0 : headerBuilders.length; _i6 < _length6; _i6++) for (var builtHeaders = (0, 
                    headerBuilders[_i6])(), _i8 = 0, _Object$keys4 = Object.keys(builtHeaders), _length8 = null == _Object$keys4 ? 0 : _Object$keys4.length; _i8 < _length8; _i8++) {
                        var _key3 = _Object$keys4[_i8];
                        normalizedHeaders[_key3.toLowerCase()] = builtHeaders[_key3];
                    }
                    var xhr = new win.XMLHttpRequest();
                    xhr.addEventListener("load", function() {
                        var responseHeaders = function() {
                            for (var result = {}, _i2 = 0, _rawHeaders$trim$spli2 = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "").trim().split("\n"), _length2 = null == _rawHeaders$trim$spli2 ? 0 : _rawHeaders$trim$spli2.length; _i2 < _length2; _i2++) {
                                var _line$split = _rawHeaders$trim$spli2[_i2].split(":"), _key = _line$split[0], values = _line$split.slice(1);
                                result[_key.toLowerCase()] = values.join(":").trim();
                            }
                            return result;
                        }(this.getAllResponseHeaders());
                        if (!this.status) return reject(new Error("Request to " + method.toLowerCase() + " " + url + " failed: no response status code."));
                        var contentType = responseHeaders["content-type"], isJSON = contentType && (0 === contentType.indexOf("application/json") || 0 === contentType.indexOf("text/json")), responseBody = this.responseText;
                        try {
                            responseBody = JSON.parse(responseBody);
                        } catch (err) {
                            if (isJSON) return reject(new Error("Invalid json: " + this.responseText + "."));
                        }
                        var res = {
                            status: this.status,
                            headers: responseHeaders,
                            body: responseBody
                        };
                        return resolve(res);
                    }, !1);
                    xhr.addEventListener("error", function(evt) {
                        reject(new Error("Request to " + method.toLowerCase() + " " + url + " failed: " + evt.toString() + "."));
                    }, !1);
                    xhr.open(method, url, !0);
                    for (var _key4 in normalizedHeaders) normalizedHeaders.hasOwnProperty(_key4) && xhr.setRequestHeader(_key4, normalizedHeaders[_key4]);
                    json ? body = JSON.stringify(json) : data && (body = Object.keys(data).map(function(key) {
                        return encodeURIComponent(key) + "=" + (data ? encodeURIComponent(data[key]) : "");
                    }).join("&"));
                    xhr.timeout = timeout;
                    xhr.ontimeout = function() {
                        reject(new Error("Request to " + method.toLowerCase() + " " + url + " has timed out"));
                    };
                    xhr.send(body);
                });
            };
            __webpack_exports__.a = function(method) {
                headerBuilders.push(method);
            };
            var __WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__ = __webpack_require__("./node_modules/zalgo-promise/src/index.js"), HEADERS = (__webpack_require__("./node_modules/cross-domain-utils/src/index.js"), 
            {
                CONTENT_TYPE: "content-type",
                ACCEPT: "accept"
            }), headerBuilders = [];
        },
        "./src/index.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            Object.defineProperty(__webpack_exports__, "__esModule", {
                value: !0
            });
            var __WEBPACK_IMPORTED_MODULE_0__device__ = __webpack_require__("./src/device.js");
            __webpack_require__.d(__webpack_exports__, "getUserAgent", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.a;
            });
            __webpack_require__.d(__webpack_exports__, "isDevice", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.d;
            });
            __webpack_require__.d(__webpack_exports__, "isWebView", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.s;
            });
            __webpack_require__.d(__webpack_exports__, "isStandAlone", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.r;
            });
            __webpack_require__.d(__webpack_exports__, "isFacebookWebView", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.g;
            });
            __webpack_require__.d(__webpack_exports__, "isFirefoxIOS", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.h;
            });
            __webpack_require__.d(__webpack_exports__, "isEdgeIOS", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.e;
            });
            __webpack_require__.d(__webpack_exports__, "isOperaMini", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.p;
            });
            __webpack_require__.d(__webpack_exports__, "isAndroid", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.b;
            });
            __webpack_require__.d(__webpack_exports__, "isIos", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.m;
            });
            __webpack_require__.d(__webpack_exports__, "isGoogleSearchApp", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.i;
            });
            __webpack_require__.d(__webpack_exports__, "isQQBrowser", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.q;
            });
            __webpack_require__.d(__webpack_exports__, "isIosWebview", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.n;
            });
            __webpack_require__.d(__webpack_exports__, "isAndroidWebview", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.c;
            });
            __webpack_require__.d(__webpack_exports__, "isIE", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.j;
            });
            __webpack_require__.d(__webpack_exports__, "isIECompHeader", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.k;
            });
            __webpack_require__.d(__webpack_exports__, "isElectron", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.f;
            });
            __webpack_require__.d(__webpack_exports__, "isIEIntranet", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.l;
            });
            __webpack_require__.d(__webpack_exports__, "isMacOsCna", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.o;
            });
            __webpack_require__.d(__webpack_exports__, "supportsPopups", function() {
                return __WEBPACK_IMPORTED_MODULE_0__device__.t;
            });
            var __WEBPACK_IMPORTED_MODULE_1__dom__ = __webpack_require__("./src/dom.js");
            __webpack_require__.d(__webpack_exports__, "isDocumentReady", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.F;
            });
            __webpack_require__.d(__webpack_exports__, "urlEncode", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.Z;
            });
            __webpack_require__.d(__webpack_exports__, "waitForWindowReady", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__._3;
            });
            __webpack_require__.d(__webpack_exports__, "waitForDocumentReady", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__._2;
            });
            __webpack_require__.d(__webpack_exports__, "waitForDocumentBody", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__._1;
            });
            __webpack_require__.d(__webpack_exports__, "parseQuery", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.O;
            });
            __webpack_require__.d(__webpack_exports__, "getQueryParam", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.y;
            });
            __webpack_require__.d(__webpack_exports__, "urlWillRedirectPage", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__._0;
            });
            __webpack_require__.d(__webpack_exports__, "formatQuery", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.s;
            });
            __webpack_require__.d(__webpack_exports__, "extendQuery", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.p;
            });
            __webpack_require__.d(__webpack_exports__, "extendUrl", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.q;
            });
            __webpack_require__.d(__webpack_exports__, "redirect", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.R;
            });
            __webpack_require__.d(__webpack_exports__, "hasMetaViewPort", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.A;
            });
            __webpack_require__.d(__webpack_exports__, "isElementVisible", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.I;
            });
            __webpack_require__.d(__webpack_exports__, "enablePerformance", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.o;
            });
            __webpack_require__.d(__webpack_exports__, "getPageRenderTime", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.x;
            });
            __webpack_require__.d(__webpack_exports__, "htmlEncode", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.C;
            });
            __webpack_require__.d(__webpack_exports__, "isBrowser", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.E;
            });
            __webpack_require__.d(__webpack_exports__, "querySelectorAll", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.Q;
            });
            __webpack_require__.d(__webpack_exports__, "onClick", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.M;
            });
            __webpack_require__.d(__webpack_exports__, "getScript", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.z;
            });
            __webpack_require__.d(__webpack_exports__, "isLocalStorageEnabled", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.J;
            });
            __webpack_require__.d(__webpack_exports__, "getBrowserLocales", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.t;
            });
            __webpack_require__.d(__webpack_exports__, "appendChild", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.f;
            });
            __webpack_require__.d(__webpack_exports__, "isElement", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.G;
            });
            __webpack_require__.d(__webpack_exports__, "getElementSafe", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.w;
            });
            __webpack_require__.d(__webpack_exports__, "getElement", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.v;
            });
            __webpack_require__.d(__webpack_exports__, "elementReady", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.m;
            });
            __webpack_require__.d(__webpack_exports__, "PopupOpenError", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.a;
            });
            __webpack_require__.d(__webpack_exports__, "popup", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.P;
            });
            __webpack_require__.d(__webpack_exports__, "writeToWindow", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__._6;
            });
            __webpack_require__.d(__webpack_exports__, "writeElementToWindow", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__._5;
            });
            __webpack_require__.d(__webpack_exports__, "setStyle", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.U;
            });
            __webpack_require__.d(__webpack_exports__, "awaitFrameLoad", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.g;
            });
            __webpack_require__.d(__webpack_exports__, "awaitFrameWindow", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.h;
            });
            __webpack_require__.d(__webpack_exports__, "createElement", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.j;
            });
            __webpack_require__.d(__webpack_exports__, "iframe", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.D;
            });
            __webpack_require__.d(__webpack_exports__, "addEventListener", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.c;
            });
            __webpack_require__.d(__webpack_exports__, "elementStoppedMoving", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.n;
            });
            __webpack_require__.d(__webpack_exports__, "getCurrentDimensions", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.u;
            });
            __webpack_require__.d(__webpack_exports__, "setOverflow", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.T;
            });
            __webpack_require__.d(__webpack_exports__, "trackDimensions", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.Y;
            });
            __webpack_require__.d(__webpack_exports__, "onDimensionsChange", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.N;
            });
            __webpack_require__.d(__webpack_exports__, "dimensionsMatchViewport", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.l;
            });
            __webpack_require__.d(__webpack_exports__, "bindEvents", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.i;
            });
            __webpack_require__.d(__webpack_exports__, "setVendorCSS", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.V;
            });
            __webpack_require__.d(__webpack_exports__, "animate", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.d;
            });
            __webpack_require__.d(__webpack_exports__, "makeElementVisible", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.L;
            });
            __webpack_require__.d(__webpack_exports__, "makeElementInvisible", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.K;
            });
            __webpack_require__.d(__webpack_exports__, "showElement", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.X;
            });
            __webpack_require__.d(__webpack_exports__, "hideElement", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.B;
            });
            __webpack_require__.d(__webpack_exports__, "destroyElement", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.k;
            });
            __webpack_require__.d(__webpack_exports__, "showAndAnimate", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.W;
            });
            __webpack_require__.d(__webpack_exports__, "animateAndHide", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.e;
            });
            __webpack_require__.d(__webpack_exports__, "addClass", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.b;
            });
            __webpack_require__.d(__webpack_exports__, "removeClass", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.S;
            });
            __webpack_require__.d(__webpack_exports__, "isElementClosed", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.H;
            });
            __webpack_require__.d(__webpack_exports__, "watchElementForClose", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__._4;
            });
            __webpack_require__.d(__webpack_exports__, "fixScripts", function() {
                return __WEBPACK_IMPORTED_MODULE_1__dom__.r;
            });
            var __WEBPACK_IMPORTED_MODULE_2__experiment__ = __webpack_require__("./src/experiment.js");
            __webpack_require__.d(__webpack_exports__, "experiment", function() {
                return __WEBPACK_IMPORTED_MODULE_2__experiment__.a;
            });
            var __WEBPACK_IMPORTED_MODULE_3__global__ = __webpack_require__("./src/global.js");
            __webpack_require__.d(__webpack_exports__, "getGlobalNameSpace", function() {
                return __WEBPACK_IMPORTED_MODULE_3__global__.a;
            });
            var __WEBPACK_IMPORTED_MODULE_4__storage__ = __webpack_require__("./src/storage.js");
            __webpack_require__.d(__webpack_exports__, "getStorage", function() {
                return __WEBPACK_IMPORTED_MODULE_4__storage__.a;
            });
            var __WEBPACK_IMPORTED_MODULE_5__util__ = __webpack_require__("./src/util.js");
            __webpack_require__.d(__webpack_exports__, "base64encode", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.c;
            });
            __webpack_require__.d(__webpack_exports__, "base64decode", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.b;
            });
            __webpack_require__.d(__webpack_exports__, "uniqueID", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__._3;
            });
            __webpack_require__.d(__webpack_exports__, "getGlobal", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.q;
            });
            __webpack_require__.d(__webpack_exports__, "getObjectID", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.r;
            });
            __webpack_require__.d(__webpack_exports__, "memoize", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.F;
            });
            __webpack_require__.d(__webpack_exports__, "memoizePromise", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.G;
            });
            __webpack_require__.d(__webpack_exports__, "promisify", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.O;
            });
            __webpack_require__.d(__webpack_exports__, "inlineMemoize", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.v;
            });
            __webpack_require__.d(__webpack_exports__, "noop", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.I;
            });
            __webpack_require__.d(__webpack_exports__, "once", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.K;
            });
            __webpack_require__.d(__webpack_exports__, "hashStr", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.t;
            });
            __webpack_require__.d(__webpack_exports__, "strHashStr", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.X;
            });
            __webpack_require__.d(__webpack_exports__, "match", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.D;
            });
            __webpack_require__.d(__webpack_exports__, "awaitKey", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.a;
            });
            __webpack_require__.d(__webpack_exports__, "stringifyError", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.Z;
            });
            __webpack_require__.d(__webpack_exports__, "stringifyErrorMessage", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__._0;
            });
            __webpack_require__.d(__webpack_exports__, "stringify", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.Y;
            });
            __webpack_require__.d(__webpack_exports__, "domainMatches", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.l;
            });
            __webpack_require__.d(__webpack_exports__, "patchMethod", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.L;
            });
            __webpack_require__.d(__webpack_exports__, "extend", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.o;
            });
            __webpack_require__.d(__webpack_exports__, "values", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__._4;
            });
            __webpack_require__.d(__webpack_exports__, "perc", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.M;
            });
            __webpack_require__.d(__webpack_exports__, "min", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.H;
            });
            __webpack_require__.d(__webpack_exports__, "max", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.E;
            });
            __webpack_require__.d(__webpack_exports__, "regexMap", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.R;
            });
            __webpack_require__.d(__webpack_exports__, "svgToBase64", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__._1;
            });
            __webpack_require__.d(__webpack_exports__, "objFilter", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.J;
            });
            __webpack_require__.d(__webpack_exports__, "identity", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.u;
            });
            __webpack_require__.d(__webpack_exports__, "regexTokenize", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.S;
            });
            __webpack_require__.d(__webpack_exports__, "promiseDebounce", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.N;
            });
            __webpack_require__.d(__webpack_exports__, "safeInterval", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.U;
            });
            __webpack_require__.d(__webpack_exports__, "isInteger", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.y;
            });
            __webpack_require__.d(__webpack_exports__, "isFloat", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.x;
            });
            __webpack_require__.d(__webpack_exports__, "serializePrimitive", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.W;
            });
            __webpack_require__.d(__webpack_exports__, "deserializePrimitive", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.k;
            });
            __webpack_require__.d(__webpack_exports__, "dotify", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.m;
            });
            __webpack_require__.d(__webpack_exports__, "undotify", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__._2;
            });
            __webpack_require__.d(__webpack_exports__, "eventEmitter", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.n;
            });
            __webpack_require__.d(__webpack_exports__, "camelToDasherize", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.d;
            });
            __webpack_require__.d(__webpack_exports__, "dasherizeToCamel", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.h;
            });
            __webpack_require__.d(__webpack_exports__, "capitalizeFirstLetter", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.e;
            });
            __webpack_require__.d(__webpack_exports__, "get", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.p;
            });
            __webpack_require__.d(__webpack_exports__, "safeTimeout", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.V;
            });
            __webpack_require__.d(__webpack_exports__, "defineLazyProp", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.j;
            });
            __webpack_require__.d(__webpack_exports__, "isObject", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.z;
            });
            __webpack_require__.d(__webpack_exports__, "isObjectObject", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.A;
            });
            __webpack_require__.d(__webpack_exports__, "isPlainObject", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.B;
            });
            __webpack_require__.d(__webpack_exports__, "replaceObject", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.T;
            });
            __webpack_require__.d(__webpack_exports__, "copyProp", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.f;
            });
            __webpack_require__.d(__webpack_exports__, "regex", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.P;
            });
            __webpack_require__.d(__webpack_exports__, "regexAll", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.Q;
            });
            __webpack_require__.d(__webpack_exports__, "isDefined", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.w;
            });
            __webpack_require__.d(__webpack_exports__, "cycle", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.g;
            });
            __webpack_require__.d(__webpack_exports__, "debounce", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.i;
            });
            __webpack_require__.d(__webpack_exports__, "isRegex", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.C;
            });
            __webpack_require__.d(__webpack_exports__, "weakMapMemoize", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__._5;
            });
            __webpack_require__.d(__webpack_exports__, "weakMapMemoizePromise", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__._6;
            });
            __webpack_require__.d(__webpack_exports__, "getOrSet", function() {
                return __WEBPACK_IMPORTED_MODULE_5__util__.s;
            });
            var __WEBPACK_IMPORTED_MODULE_6__http__ = __webpack_require__("./src/http.js");
            __webpack_require__.d(__webpack_exports__, "request", function() {
                return __WEBPACK_IMPORTED_MODULE_6__http__.b;
            });
            __webpack_require__.d(__webpack_exports__, "addHeaderBuilder", function() {
                return __WEBPACK_IMPORTED_MODULE_6__http__.a;
            });
            var __WEBPACK_IMPORTED_MODULE_7__types__ = __webpack_require__("./src/types.js");
            __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__types__);
            for (var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_7__types__) [ "getUserAgent", "isDevice", "isWebView", "isStandAlone", "isFacebookWebView", "isFirefoxIOS", "isEdgeIOS", "isOperaMini", "isAndroid", "isIos", "isGoogleSearchApp", "isQQBrowser", "isIosWebview", "isAndroidWebview", "isIE", "isIECompHeader", "isElectron", "isIEIntranet", "isMacOsCna", "supportsPopups", "isDocumentReady", "urlEncode", "waitForWindowReady", "waitForDocumentReady", "waitForDocumentBody", "parseQuery", "getQueryParam", "urlWillRedirectPage", "formatQuery", "extendQuery", "extendUrl", "redirect", "hasMetaViewPort", "isElementVisible", "enablePerformance", "getPageRenderTime", "htmlEncode", "isBrowser", "querySelectorAll", "onClick", "getScript", "isLocalStorageEnabled", "getBrowserLocales", "appendChild", "isElement", "getElementSafe", "getElement", "elementReady", "PopupOpenError", "popup", "writeToWindow", "writeElementToWindow", "setStyle", "awaitFrameLoad", "awaitFrameWindow", "createElement", "iframe", "addEventListener", "elementStoppedMoving", "getCurrentDimensions", "setOverflow", "trackDimensions", "onDimensionsChange", "dimensionsMatchViewport", "bindEvents", "setVendorCSS", "animate", "makeElementVisible", "makeElementInvisible", "showElement", "hideElement", "destroyElement", "showAndAnimate", "animateAndHide", "addClass", "removeClass", "isElementClosed", "watchElementForClose", "fixScripts", "experiment", "getGlobalNameSpace", "getStorage", "base64encode", "base64decode", "uniqueID", "getGlobal", "getObjectID", "memoize", "memoizePromise", "promisify", "inlineMemoize", "noop", "once", "hashStr", "strHashStr", "match", "awaitKey", "stringifyError", "stringifyErrorMessage", "stringify", "domainMatches", "patchMethod", "extend", "values", "perc", "min", "max", "regexMap", "svgToBase64", "objFilter", "identity", "regexTokenize", "promiseDebounce", "safeInterval", "isInteger", "isFloat", "serializePrimitive", "deserializePrimitive", "dotify", "undotify", "eventEmitter", "camelToDasherize", "dasherizeToCamel", "capitalizeFirstLetter", "get", "safeTimeout", "defineLazyProp", "isObject", "isObjectObject", "isPlainObject", "replaceObject", "copyProp", "regex", "regexAll", "isDefined", "cycle", "debounce", "isRegex", "weakMapMemoize", "weakMapMemoizePromise", "getOrSet", "request", "addHeaderBuilder", "default" ].indexOf(__WEBPACK_IMPORT_KEY__) < 0 && function(key) {
                __webpack_require__.d(__webpack_exports__, key, function() {
                    return __WEBPACK_IMPORTED_MODULE_7__types__[key];
                });
            }(__WEBPACK_IMPORT_KEY__);
            var __WEBPACK_IMPORTED_MODULE_8__decorators__ = __webpack_require__("./src/decorators.js");
            __webpack_require__.d(__webpack_exports__, "memoized", function() {
                return __WEBPACK_IMPORTED_MODULE_8__decorators__.a;
            });
            __webpack_require__.d(__webpack_exports__, "promise", function() {
                return __WEBPACK_IMPORTED_MODULE_8__decorators__.b;
            });
            var __WEBPACK_IMPORTED_MODULE_9__css__ = __webpack_require__("./src/css.js");
            __webpack_require__.d(__webpack_exports__, "isPerc", function() {
                return __WEBPACK_IMPORTED_MODULE_9__css__.a;
            });
            __webpack_require__.d(__webpack_exports__, "isPx", function() {
                return __WEBPACK_IMPORTED_MODULE_9__css__.b;
            });
            __webpack_require__.d(__webpack_exports__, "toNum", function() {
                return __WEBPACK_IMPORTED_MODULE_9__css__.f;
            });
            __webpack_require__.d(__webpack_exports__, "toPx", function() {
                return __WEBPACK_IMPORTED_MODULE_9__css__.g;
            });
            __webpack_require__.d(__webpack_exports__, "toCSS", function() {
                return __WEBPACK_IMPORTED_MODULE_9__css__.e;
            });
            __webpack_require__.d(__webpack_exports__, "percOf", function() {
                return __WEBPACK_IMPORTED_MODULE_9__css__.d;
            });
            __webpack_require__.d(__webpack_exports__, "normalizeDimension", function() {
                return __WEBPACK_IMPORTED_MODULE_9__css__.c;
            });
            var __WEBPACK_IMPORTED_MODULE_10__test__ = __webpack_require__("./src/test.js");
            __webpack_require__.d(__webpack_exports__, "wrapPromise", function() {
                return __WEBPACK_IMPORTED_MODULE_10__test__.a;
            });
        },
        "./src/storage.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.a = function getStorage(_ref) {
                var name = _ref.name, _ref$version = _ref.version, version = void 0 === _ref$version ? "latest" : _ref$version, _ref$lifetime = _ref.lifetime, lifetime = void 0 === _ref$lifetime ? 3e5 : _ref$lifetime;
                return Object(__WEBPACK_IMPORTED_MODULE_0__util__.v)(getStorage, function() {
                    var STORAGE_KEY = "__" + name + "_" + version + "_storage__", accessedStorage = void 0;
                    function getState(handler) {
                        var localStorageEnabled = Object(__WEBPACK_IMPORTED_MODULE_1__dom__.J)(), storage = void 0;
                        accessedStorage && (storage = accessedStorage);
                        if (!storage && localStorageEnabled) {
                            var rawStorage = window.localStorage.getItem(STORAGE_KEY);
                            rawStorage && (storage = JSON.parse(rawStorage));
                        }
                        storage || (storage = Object(__WEBPACK_IMPORTED_MODULE_0__util__.q)()[STORAGE_KEY]);
                        storage || (storage = {
                            id: Object(__WEBPACK_IMPORTED_MODULE_0__util__._3)()
                        });
                        storage.id || (storage.id = Object(__WEBPACK_IMPORTED_MODULE_0__util__._3)());
                        accessedStorage = storage;
                        var result = handler(storage);
                        localStorageEnabled ? window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storage)) : Object(__WEBPACK_IMPORTED_MODULE_0__util__.q)()[STORAGE_KEY] = storage;
                        accessedStorage = null;
                        return result;
                    }
                    function getSession(handler) {
                        return getState(function(storage) {
                            var session = storage.__session__, now = Date.now();
                            session && now - session.created > lifetime && (session = null);
                            session || (session = {
                                guid: Object(__WEBPACK_IMPORTED_MODULE_0__util__._3)(),
                                created: now
                            });
                            storage.__session__ = session;
                            return handler(session);
                        });
                    }
                    return {
                        getState: getState,
                        getID: function() {
                            return getState(function(storage) {
                                return storage.id;
                            });
                        },
                        getSessionState: function(handler) {
                            return getSession(function(session) {
                                session.state = session.state || {};
                                return handler(session.state);
                            });
                        },
                        getSessionID: function() {
                            return getSession(function(session) {
                                return session.guid;
                            });
                        }
                    };
                }, [ {
                    name: name,
                    version: version,
                    lifetime: lifetime
                } ]);
            };
            var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__("./src/util.js"), __WEBPACK_IMPORTED_MODULE_1__dom__ = __webpack_require__("./src/dom.js");
        },
        "./src/test.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.a = function(method) {
                var _ref$timeout = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).timeout, timeout = void 0 === _ref$timeout ? 2e3 : _ref$timeout, expected = [], promises = [], timeoutPromise = __WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__.a.delay(timeout), expect = function(fn) {
                    expected.push(fn);
                    return function() {
                        expected.splice(expected.indexOf(fn), 1);
                        var result = void 0;
                        try {
                            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                            result = fn.call.apply(fn, [ this ].concat(args));
                            promises.push(__WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__.a.resolve(result));
                            return result;
                        } catch (err) {
                            promises.push(__WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__.a.reject(err));
                            throw err;
                        }
                    };
                };
                promises.push(__WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__.a.try(function() {
                    return method({
                        expect: expect
                    });
                }));
                return function awaitPromises() {
                    return __WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__.a.try(function() {
                        return promises.length ? promises.pop().then(awaitPromises) : expected.length ? timeoutPromise.then(function() {
                            if (!expected.length) return awaitPromises();
                        }) : void 0;
                    });
                }().then(function() {
                    if (expected.length) throw new Error("Expected " + expected[0].toString() + " to be called");
                });
            };
            var __WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__ = __webpack_require__("./node_modules/zalgo-promise/src/index.js");
        },
        "./src/types.js": function(module, exports) {},
        "./src/util.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_exports__.c = base64encode;
            __webpack_exports__.b = function(str) {
                return window.atob(str);
            };
            __webpack_exports__._3 = uniqueID;
            __webpack_exports__.q = function() {
                if ("undefined" != typeof window) return window;
                if ("undefined" != typeof window) return window;
                if ("undefined" != typeof global) return global;
                throw new Error("No global found");
            };
            __webpack_exports__.r = getObjectID;
            __webpack_exports__.F = function(method) {
                var _this = this, options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, cacheMap = new __WEBPACK_IMPORTED_MODULE_1_cross_domain_safe_weakmap_src__.a();
                function memoizedFunction() {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                    var cache = cacheMap.getOrSet(options.thisNamespace ? this : method, function() {
                        return {};
                    }), key = serializeArgs(args), cacheTime = options.time;
                    cache[key] && cacheTime && Date.now() - cache[key].time < cacheTime && delete cache[key];
                    if (cache[key]) return cache[key].value;
                    var time = Date.now(), value = method.apply(this, arguments);
                    cache[key] = {
                        time: time,
                        value: value
                    };
                    return cache[key].value;
                }
                memoizedFunction.reset = function() {
                    cacheMap.delete(options.thisNamespace ? _this : method);
                };
                options.name && (memoizedFunction.displayName = options.name + ":memoized");
                return memoizedFunction;
            };
            __webpack_exports__.G = function(method) {
                var cache = {};
                function memoizedPromiseFunction() {
                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
                    var key = serializeArgs(args);
                    if (cache.hasOwnProperty(key)) return cache[key];
                    cache[key] = method.apply(this, arguments).finally(function() {
                        delete cache[key];
                    });
                    return cache[key];
                }
                memoizedPromiseFunction.reset = function() {
                    cache = {};
                };
                return memoizedPromiseFunction;
            };
            __webpack_exports__.O = function(method) {
                var options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                function promisifiedFunction() {
                    return __WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__.a.try(method, this, arguments);
                }
                options.name && (promisifiedFunction.displayName = options.name + ":promisified");
                return promisifiedFunction;
            };
            __webpack_exports__.v = function(method, logic) {
                var args = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], cache = method.__inline_memoize_cache__ = method.__inline_memoize_cache__ || {}, key = serializeArgs(args);
                return cache.hasOwnProperty(key) ? cache[key] : cache[key] = logic.apply(void 0, args);
            };
            __webpack_exports__.I = function() {};
            __webpack_exports__.K = function(method) {
                var called = !1;
                return function() {
                    if (!called) {
                        called = !0;
                        return method.apply(this, arguments);
                    }
                };
            };
            __webpack_exports__.t = function(str) {
                for (var hash = 0, i = 0; i < str.length; i++) hash += str[i].charCodeAt(0) * Math.pow(i % 10 + 1, 5);
                return Math.floor(Math.pow(Math.sqrt(hash), 5));
            };
            __webpack_exports__.X = function(str) {
                for (var hash = "", i = 0; i < str.length; i++) {
                    var total = str[i].charCodeAt(0) * i;
                    str[i + 1] && (total += str[i + 1].charCodeAt(0) * (i - 1));
                    hash += String.fromCharCode(97 + Math.abs(total) % 26);
                }
                return hash;
            };
            __webpack_exports__.D = match;
            __webpack_exports__.a = function(obj, key) {
                return new __WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__.a(function(resolve) {
                    var value = obj[key];
                    if (value) return resolve(value);
                    delete obj[key];
                    Object.defineProperty(obj, key, {
                        configurable: !0,
                        set: function(item) {
                            (value = item) && resolve(value);
                        },
                        get: function() {
                            return value;
                        }
                    });
                });
            };
            __webpack_exports__.Z = function stringifyError(err) {
                var level = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
                if (level >= 3) return "stringifyError stack overflow";
                try {
                    if (!err) return "<unknown error: " + Object.prototype.toString.call(err) + ">";
                    if ("string" == typeof err) return err;
                    if (err instanceof Error) {
                        var stack = err && err.stack, message = err && err.message;
                        if (stack && message) return -1 !== stack.indexOf(message) ? stack : message + "\n" + stack;
                        if (stack) return stack;
                        if (message) return message;
                    }
                    return "function" == typeof err.toString ? err.toString() : Object.prototype.toString.call(err);
                } catch (newErr) {
                    return "Error while stringifying error: " + stringifyError(newErr, level + 1);
                }
            };
            __webpack_exports__._0 = function(err) {
                var defaultMessage = "<unknown error: " + Object.prototype.toString.call(err) + ">";
                return err ? err instanceof Error ? err.message || defaultMessage : "string" == typeof err.message && err.message || defaultMessage : defaultMessage;
            };
            __webpack_exports__.Y = function(item) {
                return "string" == typeof item ? item : item && "function" == typeof item.toString ? item.toString() : Object.prototype.toString.call(item);
            };
            __webpack_exports__.l = function(hostname, domain) {
                var index = (hostname = hostname.split("://")[1]).indexOf(domain);
                return -1 !== index && hostname.slice(index) === domain;
            };
            __webpack_exports__.L = function(obj, name, handler) {
                var original = obj[name];
                obj[name] = function() {
                    var _this2 = this, _arguments = arguments;
                    return handler({
                        context: this,
                        args: Array.prototype.slice.call(arguments),
                        original: original,
                        callOriginal: function() {
                            return original.apply(_this2, _arguments);
                        }
                    });
                };
            };
            __webpack_exports__.o = function(obj, source) {
                if (!source) return obj;
                if (Object.assign) return Object.assign(obj, source);
                for (var key in source) source.hasOwnProperty(key) && (obj[key] = source[key]);
                return obj;
            };
            __webpack_exports__._4 = function(obj) {
                var result = [];
                for (var key in obj) obj.hasOwnProperty(key) && result.push(obj[key]);
                return result;
            };
            __webpack_exports__.M = function(pixels, percentage) {
                return Math.round(pixels * percentage / 100);
            };
            __webpack_exports__.H = function() {
                return Math.min.apply(Math, arguments);
            };
            __webpack_exports__.E = function() {
                return Math.max.apply(Math, arguments);
            };
            __webpack_exports__.R = function(str, regexp, handler) {
                var results = [];
                str.replace(regexp, function(item) {
                    results.push(handler ? handler.apply(null, arguments) : item);
                });
                return results;
            };
            __webpack_exports__._1 = function(svg) {
                return "data:image/svg+xml;base64," + base64encode(svg);
            };
            __webpack_exports__.J = function(obj) {
                var filter = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Boolean, result = {};
                for (var key in obj) obj.hasOwnProperty(key) && filter(obj[key], key) && (result[key] = obj[key]);
                return result;
            };
            __webpack_exports__.u = function(item) {
                return item;
            };
            __webpack_exports__.S = function(text, regexp) {
                var result = [];
                text.replace(regexp, function(token) {
                    result.push(token);
                    return "";
                });
                return result;
            };
            __webpack_exports__.N = function(method) {
                var delay = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 50, promise = void 0, timeout = void 0;
                return function() {
                    timeout && clearTimeout(timeout);
                    var localPromise = promise = promise || new __WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__.a();
                    timeout = setTimeout(function() {
                        promise = null;
                        timeout = null;
                        __WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__.a.try(method).then(function(result) {
                            localPromise.resolve(result);
                        }, function(err) {
                            localPromise.reject(err);
                        });
                    }, delay);
                    return localPromise;
                };
            };
            __webpack_exports__.U = safeInterval;
            __webpack_exports__.y = isInteger;
            __webpack_exports__.x = isFloat;
            __webpack_exports__.W = serializePrimitive;
            __webpack_exports__.k = deserializePrimitive;
            __webpack_exports__.m = function dotify(obj) {
                var prefix = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", newobj = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                prefix = prefix ? prefix + "." : prefix;
                for (var key in obj) obj.hasOwnProperty(key) && void 0 !== obj[key] && null !== obj[key] && "function" != typeof obj[key] && (obj[key] && Array.isArray(obj[key]) && obj[key].length && obj[key].every(function(val) {
                    return "object" !== (void 0 === val ? "undefined" : _typeof(val));
                }) ? newobj["" + prefix + key + "[]"] = obj[key].join(",") : obj[key] && "object" === _typeof(obj[key]) ? newobj = dotify(obj[key], "" + prefix + key, newobj) : newobj["" + prefix + key] = serializePrimitive(obj[key]));
                return newobj;
            };
            __webpack_exports__._2 = function(obj) {
                var result = {};
                for (var key in obj) if (obj.hasOwnProperty(key) && "string" == typeof obj[key]) {
                    var value = obj[key];
                    if (key.match(/^.+\[\]$/)) {
                        key = key.slice(0, key.length - 2);
                        value = value.split(",").map(deserializePrimitive);
                    } else value = deserializePrimitive(value);
                    for (var keyResult = result, parts = key.split("."), i = 0; i < parts.length; i++) {
                        var part = parts[i], isLast = i + 1 === parts.length, isIndex = !isLast && isInteger(parts[i + 1]);
                        isLast ? keyResult[part] = value : keyResult = keyResult[part] = keyResult[part] || (isIndex ? [] : {});
                    }
                }
                return result;
            };
            __webpack_exports__.n = function() {
                var triggered = {}, handlers = {};
                return {
                    on: function(eventName, handler) {
                        var handlerList = handlers[eventName] = handlers[eventName] || [];
                        handlerList.push(handler);
                        var cancelled = !1;
                        return {
                            cancel: function() {
                                if (!cancelled) {
                                    cancelled = !0;
                                    handlerList.splice(handlerList.indexOf(handler), 1);
                                }
                            }
                        };
                    },
                    once: function(eventName, handler) {
                        var listener = this.on(eventName, function() {
                            listener.cancel();
                            handler();
                        });
                        return listener;
                    },
                    trigger: function(eventName) {
                        var handlerList = handlers[eventName];
                        if (handlerList) for (var _i2 = 0, _length2 = null == handlerList ? 0 : handlerList.length; _i2 < _length2; _i2++) (0, 
                        handlerList[_i2])();
                    },
                    triggerOnce: function(eventName) {
                        if (!triggered[eventName]) {
                            triggered[eventName] = !0;
                            this.trigger(eventName);
                        }
                    }
                };
            };
            __webpack_exports__.d = function(string) {
                return string.replace(/([A-Z])/g, function(g) {
                    return "-" + g.toLowerCase();
                });
            };
            __webpack_exports__.h = function(string) {
                return string.replace(/-([a-z])/g, function(g) {
                    return g[1].toUpperCase();
                });
            };
            __webpack_exports__.e = function(string) {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            };
            __webpack_exports__.p = function(item, path, def) {
                if (!path) return def;
                for (var pathParts = path.split("."), i = 0; i < pathParts.length; i++) {
                    if ("object" !== (void 0 === item ? "undefined" : _typeof(item)) || null === item) return def;
                    item = item[pathParts[i]];
                }
                return void 0 === item ? def : item;
            };
            __webpack_exports__.V = function(method, time) {
                var interval = safeInterval(function() {
                    if ((time -= 100) <= 0) {
                        interval.cancel();
                        method();
                    }
                }, 100);
            };
            __webpack_exports__.j = defineLazyProp;
            __webpack_exports__.z = isObject;
            __webpack_exports__.A = isObjectObject;
            __webpack_exports__.B = isPlainObject;
            __webpack_exports__.T = function replaceObject(item, replacer) {
                var fullKey = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
                if (Array.isArray(item)) {
                    for (var _length3 = item.length, result = [], _loop = function(i) {
                        defineLazyProp(result, i, function() {
                            var itemKey = fullKey ? fullKey + "." + i : "" + i, el = item[i], child = replacer(el, i, itemKey);
                            (isPlainObject(child) || Array.isArray(child)) && (child = replaceObject(child, replacer, itemKey));
                            return child;
                        });
                    }, i = 0; i < _length3; i++) _loop(i);
                    return result;
                }
                if (isPlainObject(item)) {
                    var _result = {}, _loop2 = function(key) {
                        if (!item.hasOwnProperty(key)) return "continue";
                        defineLazyProp(_result, key, function() {
                            var itemKey = fullKey ? fullKey + "." + key : "" + key, el = item[key], child = replacer(el, key, itemKey);
                            (isPlainObject(child) || Array.isArray(child)) && (child = replaceObject(child, replacer, itemKey));
                            return child;
                        });
                    };
                    for (var key in item) _loop2(key);
                    return _result;
                }
                throw new Error("Pass an object or array");
            };
            __webpack_exports__.f = function(source, target, name, def) {
                if (source.hasOwnProperty(name)) {
                    var descriptor = Object.getOwnPropertyDescriptor(source, name);
                    Object.defineProperty(target, name, descriptor);
                } else target[name] = def;
            };
            __webpack_exports__.P = regex;
            __webpack_exports__.Q = function(pattern, string) {
                for (var matches = [], start = 0; ;) {
                    var regmatch = regex(pattern, string, start);
                    if (!regmatch) break;
                    matches.push(regmatch);
                    start = match.end;
                }
                return matches;
            };
            __webpack_exports__.w = function(value) {
                return null !== value && void 0 !== value;
            };
            __webpack_exports__.g = function cycle(method) {
                return __WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__.a.try(method).then(function() {
                    return cycle(method);
                });
            };
            __webpack_exports__.i = function(method) {
                var time = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 100, timeout = void 0;
                return function() {
                    var _this3 = this, _arguments2 = arguments;
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        return method.apply(_this3, _arguments2);
                    }, time);
                };
            };
            __webpack_exports__.C = function(item) {
                return "[object RegExp]" === Object.prototype.toString.call(item);
            };
            __webpack_require__.d(__webpack_exports__, "_5", function() {
                return weakMapMemoize;
            });
            __webpack_require__.d(__webpack_exports__, "_6", function() {
                return weakMapMemoizePromise;
            });
            __webpack_exports__.s = function(obj, key, getter) {
                if (obj.hasOwnProperty(key)) return obj[key];
                var val = getter();
                obj[key] = val;
                return val;
            };
            var __WEBPACK_IMPORTED_MODULE_0_zalgo_promise_src__ = __webpack_require__("./node_modules/zalgo-promise/src/index.js"), __WEBPACK_IMPORTED_MODULE_1_cross_domain_safe_weakmap_src__ = __webpack_require__("./node_modules/cross-domain-safe-weakmap/src/index.js"), _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            function base64encode(str) {
                return window.btoa(str);
            }
            function uniqueID() {
                var chars = "0123456789abcdef";
                return "xxxxxxxxxx".replace(/./g, function() {
                    return chars.charAt(Math.floor(Math.random() * chars.length));
                }) + "_" + base64encode(new Date().toISOString().slice(11, 19).replace("T", ".")).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
            }
            var objectIDs = void 0;
            function getObjectID(obj) {
                objectIDs = objectIDs || new __WEBPACK_IMPORTED_MODULE_1_cross_domain_safe_weakmap_src__.a();
                if (null === obj || void 0 === obj || "object" !== (void 0 === obj ? "undefined" : _typeof(obj)) && "function" != typeof obj) throw new Error("Invalid object");
                var uid = objectIDs.get(obj);
                if (!uid) {
                    uid = (void 0 === obj ? "undefined" : _typeof(obj)) + ":" + uniqueID();
                    objectIDs.set(obj, uid);
                }
                return uid;
            }
            function serializeArgs(args) {
                try {
                    return JSON.stringify(Array.prototype.slice.call(args), function(subkey, val) {
                        return "function" == typeof val ? "memoize[" + getObjectID(val) + "]" : val;
                    });
                } catch (err) {
                    throw new Error("Arguments not serializable -- can not be used to memoize");
                }
            }
            function match(str, pattern) {
                var regmatch = str.match(pattern);
                if (regmatch) return regmatch[1];
            }
            function safeInterval(method, time) {
                var timeout = void 0;
                !function loop() {
                    timeout = setTimeout(function() {
                        method();
                        loop();
                    }, time);
                }();
                return {
                    cancel: function() {
                        clearTimeout(timeout);
                    }
                };
            }
            function isInteger(str) {
                return Boolean(str.match(/^[0-9]+$/));
            }
            function isFloat(str) {
                return Boolean(str.match(/^[0-9]+\.[0-9]+$/));
            }
            function serializePrimitive(value) {
                return value.toString();
            }
            function deserializePrimitive(value) {
                return "true" === value || "false" !== value && (isInteger(value) ? parseInt(value, 10) : isFloat(value) ? parseFloat(value) : value);
            }
            function defineLazyProp(obj, key, getter) {
                if (Array.isArray(obj)) {
                    if ("number" != typeof key) throw new TypeError("Array key must be number");
                } else if ("object" === (void 0 === obj ? "undefined" : _typeof(obj)) && null !== obj && "string" != typeof key) throw new TypeError("Object key must be string");
                Object.defineProperty(obj, key, {
                    configurable: !0,
                    enumerable: !0,
                    get: function() {
                        delete obj[key];
                        var value = getter();
                        obj[key] = value;
                        return value;
                    },
                    set: function(value) {
                        delete obj[key];
                        obj[key] = value;
                    }
                });
            }
            function isObject(item) {
                return "object" === (void 0 === item ? "undefined" : _typeof(item)) && null !== item;
            }
            function isObjectObject(obj) {
                return isObject(obj) && "[object Object]" === Object.prototype.toString.call(obj);
            }
            function isPlainObject(obj) {
                if (!isObjectObject(obj)) return !1;
                var constructor = obj.constructor;
                if ("function" != typeof constructor) return !1;
                var prototype = constructor.prototype;
                return !!isObjectObject(prototype) && !!prototype.hasOwnProperty("isPrototypeOf");
            }
            function regex(pattern, string) {
                var start = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
                "string" == typeof pattern && (pattern = new RegExp(pattern));
                var result = string.slice(start).match(pattern);
                if (result) {
                    var index = result.index, regmatch = result[0];
                    return {
                        text: regmatch,
                        groups: result.slice(1),
                        start: start + index,
                        end: start + index + regmatch.length,
                        length: regmatch.length,
                        replace: function(text) {
                            return regmatch ? "" + regmatch.slice(0, start + index) + text + regmatch.slice(index + regmatch.length) : "";
                        }
                    };
                }
            }
            var weakMapMemoize = function(method) {
                var weakmap = new __WEBPACK_IMPORTED_MODULE_1_cross_domain_safe_weakmap_src__.a();
                return function(arg) {
                    var _this4 = this;
                    return weakmap.getOrSet(arg, function() {
                        return method.call(_this4, arg);
                    });
                };
            }, weakMapMemoizePromise = function(method) {
                var weakmap = new __WEBPACK_IMPORTED_MODULE_1_cross_domain_safe_weakmap_src__.a();
                return function(arg) {
                    var _this5 = this;
                    return weakmap.getOrSet(arg, function() {
                        return method.call(_this5, arg).finally(function() {
                            weakmap.delete(arg);
                        });
                    });
                };
            };
        }
    });
});
//# sourceMappingURL=belter.js.map