import { ZalgoPromise } from 'zalgo-promise/src';
import { noop, tryCatch, removeFromArray } from './util';
export function wrapPromise(method, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 5000 : _ref$timeout;

  var expected = [];
  var promises = [];
  return new ZalgoPromise(function (resolve, reject) {
    var timer = setTimeout(function () {
      if (expected.length) {
        reject(new Error("Expected " + expected[0].name + " to be called in " + timeout + "ms"));
      }

      if (promises.length) {
        reject(new Error("Expected " + promises[0].name + " promise to complete in " + timeout + "ms"));
      }
    }, timeout); // $FlowFixMe[escaped-generic]

    var expect = function expect(name, handler) {
      if (handler === void 0) {
        handler = noop;
      }

      var exp = {
        name: name,
        handler: handler
      }; // $FlowFixMe

      expected.push(exp); // $FlowFixMe

      return function expectWrapper() {
        var _this = this;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        removeFromArray(expected, exp); // $FlowFixMe

        var _tryCatch = tryCatch(function () {
          var _handler;

          return (_handler = handler).call.apply(_handler, [_this].concat(args));
        }),
            result = _tryCatch.result,
            error = _tryCatch.error;

        if (error) {
          promises.push({
            name: name,
            promise: ZalgoPromise.asyncReject(error)
          });
          throw error;
        } // $FlowFixMe[escaped-generic]


        promises.push({
          name: name,
          promise: ZalgoPromise.resolve(result)
        }); // $FlowFixMe[escaped-generic]

        return result;
      };
    }; // $FlowFixMe[escaped-generic]


    var avoid = function avoid(name, fn) {
      if (fn === void 0) {
        fn = noop;
      }

      // $FlowFixMe
      return function avoidWrapper() {
        var _fn;

        promises.push({
          name: name,
          promise: ZalgoPromise.asyncReject(new Error("Expected " + name + " to not be called"))
        }); // $FlowFixMe

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return (_fn = fn).call.apply(_fn, [this].concat(args));
      };
    }; // $FlowFixMe[escaped-generic]


    var expectError = function expectError(name, handler) {
      if (handler === void 0) {
        handler = noop;
      }

      var exp = {
        name: name,
        handler: handler
      }; // $FlowFixMe

      expected.push(exp); // $FlowFixMe

      return function expectErrorWrapper() {
        var _this2 = this;

        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        removeFromArray(expected, exp); // $FlowFixMe

        var _tryCatch2 = tryCatch(function () {
          var _handler2;

          return (_handler2 = handler).call.apply(_handler2, [_this2].concat(args));
        }),
            result = _tryCatch2.result,
            error = _tryCatch2.error;

        if (error) {
          throw error;
        }

        promises.push({
          name: name,
          // $FlowFixMe[escaped-generic]
          promise: ZalgoPromise.resolve(result).then(function () {
            throw new Error("Expected " + name + " to throw an error");
          }, noop)
        }); // $FlowFixMe[escaped-generic]

        return result;
      };
    };

    var wait = function wait() {
      return ZalgoPromise.try(function () {
        if (promises.length) {
          var prom = promises[0];
          return prom.promise.finally(function () {
            removeFromArray(promises, prom);
          }).then(wait);
        }
      }).then(function () {
        if (expected.length) {
          return ZalgoPromise.delay(10).then(wait);
        }
      });
    };

    promises.push({
      name: 'wrapPromise handler',
      promise: ZalgoPromise.try(function () {
        return method({
          expect: expect,
          avoid: avoid,
          expectError: expectError,
          error: avoid,
          wait: function wait() {
            return ZalgoPromise.resolve();
          }
        });
      })
    });
    wait().finally(function () {
      clearTimeout(timer);
    }).then(resolve, reject);
  });
}