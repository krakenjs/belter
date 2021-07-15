/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';

import { noop, tryCatch, removeFromArray } from './util';

type Prom<X> = Promise<X> | ZalgoPromise<X>; // eslint-disable-line no-restricted-globals, promise/no-native

type Handler = <T, A : $ReadOnlyArray<mixed>>(name : string, fn? : (...args : A) => T) => (...args : A) => T; // eslint-disable-line no-undef
type Wrapper<T> = ({| expect : Handler, avoid : Handler, expectError : Handler, error : Handler, wait : () => Prom<void> |}) => (Prom<T> | void);

export function wrapPromise<T>(method : Wrapper<T>, { timeout = 5000 } : {| timeout? : number |} = {}) : ZalgoPromise<void> {
    const expected : Array<{| name : string, handler : Handler |}> = [];
    const promises : Array<{| name : string, promise : ZalgoPromise<*> |}> = [];

    return new ZalgoPromise((resolve, reject) => {
        const timer = setTimeout(() => {
            if (expected.length) {
                reject(new Error(`Expected ${ expected[0].name } to be called in ${ timeout }ms`));
            }

            if (promises.length) {
                reject(new Error(`Expected ${ promises[0].name } promise to complete in ${ timeout }ms`));
            }
        }, timeout);

        // $FlowFixMe[escaped-generic]
        const expect : Handler = (name, handler = noop) => {
            const exp = { name, handler };
            // $FlowFixMe
            expected.push(exp);
            
            // $FlowFixMe
            return function expectWrapper(...args) : * {
                removeFromArray(expected, exp);

                // $FlowFixMe
                const { result, error } = tryCatch(() => handler.call(this, ...args));

                if (error) {
                    promises.push({ name, promise: ZalgoPromise.asyncReject(error) });
                    throw error;
                }

                // $FlowFixMe[escaped-generic]
                promises.push({ name, promise: ZalgoPromise.resolve(result) });

                // $FlowFixMe[escaped-generic]
                return result;
            };
        };

        // $FlowFixMe[escaped-generic]
        const avoid : Handler = (name : string, fn = noop) => {

            // $FlowFixMe
            return function avoidWrapper(...args) : * {
                promises.push({ name, promise: ZalgoPromise.asyncReject(new Error(`Expected ${ name } to not be called`)) });
                // $FlowFixMe
                return fn.call(this, ...args);
            };
        };

        // $FlowFixMe[escaped-generic]
        const expectError : Handler = (name, handler = noop) => {
            const exp = { name, handler };
            // $FlowFixMe
            expected.push(exp);

            // $FlowFixMe
            return function expectErrorWrapper(...args) : * {
                removeFromArray(expected, exp);

                // $FlowFixMe
                const { result, error } = tryCatch(() => handler.call(this, ...args));

                if (error) {
                    throw error;
                }

                promises.push({
                    name,
                    // $FlowFixMe[escaped-generic]
                    promise: ZalgoPromise.resolve(result).then(() => {
                        throw new Error(`Expected ${ name } to throw an error`);
                    }, noop)
                });

                // $FlowFixMe[escaped-generic]
                return result;
            };
        };

        const wait = () => {
            return ZalgoPromise.try(() => {
                if (promises.length) {
                    const prom = promises[0];
                    return prom.promise.finally(() => {
                        removeFromArray(promises, prom);
                    }).then(wait);
                }
            }).then(() => {
                if (expected.length) {
                    return ZalgoPromise.delay(10).then(wait);
                }
            });
        };

        promises.push({
            name:    'wrapPromise handler',
            promise: ZalgoPromise.try(() =>
                method({ expect, avoid, expectError, error: avoid, wait: () => ZalgoPromise.resolve() }))
        });

        wait().finally(() => {
            clearTimeout(timer);
        }).then(resolve, reject);
    });
}
