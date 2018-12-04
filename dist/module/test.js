import { ZalgoPromise } from 'zalgo-promise/src';

import { noop } from './util'; // eslint-disable-line no-undef
// eslint-disable-line no-undef

export function wrapPromise(method) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === undefined ? 2000 : _ref$timeout;

    var expected = [];
    var promises = [];

    var timeoutPromise = ZalgoPromise.delay(timeout);

    var expect = function expect(name) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        var obj = { name: name, fn: fn };
        expected.push(obj);
        // $FlowFixMe
        return function expectWrapper() {
            expected.splice(expected.indexOf(obj), 1);
            var result = void 0;
            try {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                // $FlowFixMe
                result = fn.call.apply(fn, [this].concat(args));
                promises.push(ZalgoPromise.resolve(result));
                return result;
            } catch (err) {
                promises.push(ZalgoPromise.reject(err));
                throw err;
            }
        };
    };

    var error = function error(name) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        // $FlowFixMe
        return function errorWrapper() {
            var _this = this;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            promises.push(ZalgoPromise['try'](function () {
                // $FlowFixMe
                return fn.call.apply(fn, [_this].concat(args));
            }).then(function () {
                throw new Error('Expected ' + name + ' to not be called');
            }));
        };
    };

    var awaitPromises = function awaitPromises() {
        return ZalgoPromise['try'](function () {
            if (promises.length) {
                var promise = promises.pop();
                return promise.then(awaitPromises);
            } else if (expected.length) {
                return timeoutPromise.then(function () {
                    if (!expected.length) {
                        return awaitPromises();
                    }
                });
            }
        });
    };

    promises.push(ZalgoPromise['try'](function () {
        return method({ expect: expect, error: error });
    }));

    return awaitPromises().then(function () {
        if (expected.length) {
            throw new Error('Expected ' + expected[0].name + ' to be called');
        }
    });
}