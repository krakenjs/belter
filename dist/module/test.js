import { ZalgoPromise } from 'zalgo-promise/src';

import { noop } from './util'; // eslint-disable-line no-undef


export function wrapPromise(method) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === undefined ? 5000 : _ref$timeout;

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
                var promise = ZalgoPromise.reject(err);
                promise['catch'](noop);
                promises.push(promise);
                throw err;
            }
        };
    };

    var avoid = function avoid(name) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        // $FlowFixMe
        return function avoidWrapper() {
            var promise = ZalgoPromise.reject(new Error('Expected ' + name + ' to not be called'));
            promise['catch'](noop);
            promises.push(promise);
            // $FlowFixMe

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return fn.call.apply(fn, [this].concat(args));
        };
    };

    var expectError = function expectError(name) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        // $FlowFixMe
        return expect(name, function expectErrorWrapper() {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            // $FlowFixMe
            var result = fn.call.apply(fn, [this].concat(args));

            promises.push(ZalgoPromise.resolve(result).then(function () {
                throw new Error('Expected ' + name + ' to throw an error');
            }));

            return result;
        })();
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
        return method({ expect: expect, avoid: avoid, expectError: expectError, error: avoid });
    }));

    return awaitPromises().then(function () {
        if (expected.length) {
            throw new Error('Expected ' + expected[0].name + ' to be called');
        }
    });
}