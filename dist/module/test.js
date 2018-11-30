import { ZalgoPromise } from 'zalgo-promise/src';

// eslint-disable-line no-undef

export function wrapPromise(method) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === undefined ? 2000 : _ref$timeout;

    var expected = [];
    var promises = [];

    var timeoutPromise = ZalgoPromise.delay(timeout);

    var expect = function expect(fn) {
        expected.push(fn);
        return function expectWrapper() {
            expected.splice(expected.indexOf(fn), 1);
            var result = void 0;
            try {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                result = fn.call.apply(fn, [this].concat(args));
                promises.push(ZalgoPromise.resolve(result));
                return result;
            } catch (err) {
                promises.push(ZalgoPromise.reject(err));
                throw err;
            }
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
        return method({ expect: expect });
    }));

    return awaitPromises().then(function () {
        if (expected.length) {
            throw new Error('Expected ' + expected[0].toString() + ' to be called');
        }
    });
}