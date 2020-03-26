/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';

import { noop, tryCatch, removeFromArray } from './util';

type Prom<X> = Promise<X> | ZalgoPromise<X>; // eslint-disable-line no-restricted-globals, promise/no-native

type Handler = <T, A : $ReadOnlyArray<mixed>>(name : string, fn? : (...args : A) => T) => (...args : A) => T; // eslint-disable-line no-undef
type Wrapper<T> = ({| expect : Handler, avoid : Handler, expectError : Handler, error : Handler, wait : () => Prom<void> |}) => (Prom<T> | void);

export function wrapPromise<T>(method : Wrapper<T>, { timeout = 5000 } : {| timeout? : number |} = {}) : ZalgoPromise<void> {
    const expected : Array<string> = [];
    const promises : Array<ZalgoPromise<*>> = [];

    const timer = setTimeout(() => {
        if (expected.length) {
            promises.push(ZalgoPromise.asyncReject(new Error(`Expected ${ expected[0] } to be called`)));
        }
    }, timeout);

    const expect : Handler = (name, fn = noop) => {
        expected.push(name);
        
        // $FlowFixMe
        return function expectWrapper(...args) : * {
            removeFromArray(expected, name);

            // $FlowFixMe
            const { result, error } = tryCatch(() => fn.call(this, ...args));

            if (error) {
                promises.push(ZalgoPromise.asyncReject(error));
                throw error;
            }

            promises.push(ZalgoPromise.resolve(result));
            return result;
        };
    };

    const avoid : Handler = (name : string, fn = noop) => {

        // $FlowFixMe
        return function avoidWrapper(...args) : * {
            promises.push(ZalgoPromise.asyncReject(new Error(`Expected ${ name } to not be called`)));
            // $FlowFixMe
            return fn.call(this, ...args);
        };
    };

    const expectError : Handler = (name, fn = noop) => {
        expected.push(name);

        // $FlowFixMe
        return function expectErrorWrapper(...args) : * {
            removeFromArray(expected, name);

            // $FlowFixMe
            const { result, error } = tryCatch(() => fn.call(this, ...args));

            if (error) {
                throw error;
            }

            promises.push(ZalgoPromise.resolve(result).then(() => {
                throw new Error(`Expected ${ name } to throw an error`);
            }, noop));
            return result;
        };
    };

    const wait = () => {
        return ZalgoPromise.try(() => {
            if (promises.length) {
                return promises.pop();
            }
        }).then(() => {
            if (promises.length) {
                return wait();
            }
            if (expected.length) {
                return ZalgoPromise.delay(10).then(wait);
            }
        });
    };

    promises.push(ZalgoPromise.try(() => method({ expect, avoid, expectError, error: avoid, wait })));

    return wait().then(() => {
        clearTimeout(timer);
    });
}
