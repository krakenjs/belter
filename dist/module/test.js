import { ZalgoPromise } from 'zalgo-promise/src';

import { noop, tryCatch, removeFromArray } from './util'; // eslint-disable-line no-restricted-globals, promise/no-native

// eslint-disable-line no-undef


export function wrapPromise(method) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === undefined ? 5000 : _ref$timeout;

    var expected = [];
    var promises = [];

    var timer = setTimeout(function () {
        if (expected.length) {
            promises.push(ZalgoPromise.asyncReject(new Error('Expected ' + expected[0] + ' to be called')));
        }
    }, timeout);

    var expect = function expect(name) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        expected.push(name);

        // $FlowFixMe
        return function expectWrapper() {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            removeFromArray(expected, name);

            // $FlowFixMe

            var _tryCatch = tryCatch(function () {
                return fn.call.apply(fn, [_this].concat(args));
            }),
                result = _tryCatch.result,
                error = _tryCatch.error;

            if (error) {
                promises.push(ZalgoPromise.asyncReject(error));
                throw error;
            }

            promises.push(ZalgoPromise.resolve(result));
            return result;
        };
    };

    var avoid = function avoid(name) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;


        // $FlowFixMe
        return function avoidWrapper() {
            promises.push(ZalgoPromise.asyncReject(new Error('Expected ' + name + ' to not be called')));
            // $FlowFixMe

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return fn.call.apply(fn, [this].concat(args));
        };
    };

    var expectError = function expectError(name) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        expected.push(name);

        // $FlowFixMe
        return function expectErrorWrapper() {
            var _this2 = this;

            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            removeFromArray(expected, name);

            // $FlowFixMe

            var _tryCatch2 = tryCatch(function () {
                return fn.call.apply(fn, [_this2].concat(args));
            }),
                result = _tryCatch2.result,
                error = _tryCatch2.error;

            if (error) {
                throw error;
            }

            promises.push(ZalgoPromise.resolve(result).then(function () {
                throw new Error('Expected ' + name + ' to throw an error');
            }, noop));
            return result;
        };
    };

    promises.push(ZalgoPromise['try'](function () {
        return method({ expect: expect, avoid: avoid, expectError: expectError, error: avoid });
    }));

    var drain = function drain() {
        return ZalgoPromise['try'](function () {
            if (promises.length) {
                return promises.pop();
            }
        }).then(function () {
            if (promises.length) {
                return drain();
            }
            if (expected.length) {
                return ZalgoPromise.delay(10).then(drain);
            }
        });
    };

    return drain().then(function () {
        clearTimeout(timer);
    });
}