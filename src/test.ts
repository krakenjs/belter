/* eslint @typescript-eslint/ban-ts-comment: 0 */

import { ZalgoPromise } from "@krakenjs/zalgo-promise";

import { noop, tryCatch, removeFromArray } from "./util";

type Prom<X> = Promise<X> | ZalgoPromise<X>;

type Handler = <T, A extends readonly unknown[]>(
  name: string,
  fn?: (...args: A) => T
) => (...args: A) => T;

type Wrapper<T> = (arg0: {
  expect: Handler;
  avoid: Handler;
  expectError: Handler;
  error: Handler;
  wait: () => Prom<void>;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
}) => Prom<T> | void;

export function wrapPromise<T>(
  method: Wrapper<T>,
  {
    timeout = 5000,
  }: {
    timeout?: number;
  } = {}
): ZalgoPromise<void> {
  const expected: Array<{
    name: string;
    handler: Handler;
  }> = [];
  const promises: Array<{
    name: string;
    promise: ZalgoPromise<any>;
  }> = [];
  return new ZalgoPromise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (expected.length) {
        reject(
          new Error(`Expected ${expected[0].name} to be called in ${timeout}ms`)
        );
      }

      if (promises.length) {
        reject(
          new Error(
            `Expected ${promises[0].name} promise to complete in ${timeout}ms`
          )
        );
      }
    }, timeout);

    // @ts-expect-error
    const expect: Handler = (name, handler = noop) => {
      const exp = {
        name,
        handler,
      };
      // @ts-expect-error
      expected.push(exp);
      return function expectWrapper(...args): any {
        // @ts-expect-error
        removeFromArray(expected, exp);
        // @ts-expect-error
        const { result, error } = tryCatch(() => handler.call(this, ...args));

        if (error) {
          promises.push({
            name,
            promise: ZalgoPromise.asyncReject(error),
          });
          // expected an error to be thrown
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw error;
        }

        // $FlowFixMe[escaped-generic]
        promises.push({
          name,
          promise: ZalgoPromise.resolve(result),
        });
        // $FlowFixMe[escaped-generic]
        return result;
      };
    };

    // @ts-expect-error
    const avoid: Handler = (name: string, fn = noop) => {
      // $FlowFixMe
      return function avoidWrapper(...args): any {
        promises.push({
          name,
          promise: ZalgoPromise.asyncReject(
            new Error(`Expected ${name} to not be called`)
          ),
        });
        // @ts-expect-error
        return fn.call(this, ...args);
      };
    };

    // @ts-expect-error
    const expectError: Handler = (name, handler = noop) => {
      const exp = {
        name,
        handler,
      };
      // @ts-expect-error
      expected.push(exp);
      // $FlowFixMe
      return function expectErrorWrapper(...args): any {
        // @ts-expect-error
        removeFromArray(expected, exp);
        // @ts-expect-error
        const { result, error } = tryCatch(() => handler.call(this, ...args));

        if (error) {
          // expected an error to be thrown
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw error;
        }

        promises.push({
          name,
          promise: ZalgoPromise.resolve(result).then(() => {
            throw new Error(`Expected ${name} to throw an error`);
          }, noop),
        });

        return result;
      };
    };

    const wait = (): ZalgoPromise<unknown> => {
      return ZalgoPromise.try(() => {
        if (promises.length) {
          const prom = promises[0];
          return prom.promise
            .finally(() => {
              removeFromArray(promises, prom);
            })
            .then(wait);
        }
      }).then(() => {
        if (expected.length) {
          return ZalgoPromise.delay(10).then(wait);
        }
      });
    };

    promises.push({
      name: "wrapPromise handler",
      promise: ZalgoPromise.try(() =>
        method({
          expect,
          avoid,
          expectError,
          error: avoid,
          wait: () => ZalgoPromise.resolve(),
        })
      ),
    });
    wait()
      .finally(() => {
        clearTimeout(timer);
      })
      // @ts-expect-error
      .then(resolve, reject);
  });
}
