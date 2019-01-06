/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';

import { noop, tryCatch } from './util';

type Handler = <T, A : $ReadOnlyArray<mixed>>(name : string, fn? : (...args : A) => T) => (...args : A) => T; // eslint-disable-line no-undef
type Wrapper<T> = ({ expect : Handler, avoid : Handler, expectError : Handler, error : Handler }) => (ZalgoPromise<T> | void);

export function wrapPromise<T>(method : Wrapper<T>, { timeout = 5000 } : { timeout? : number } = {}) : ZalgoPromise<void> {
    let expected : Array<string> = [];
    let promises : Array<ZalgoPromise<*>> = [];

    let timeoutPromise = ZalgoPromise.delay(timeout);

    let expect : Handler = (name, fn = noop) => {
        expected.push(name);
        
        // $FlowFixMe
        return function expectWrapper(...args) : * {
            expected.splice(expected.indexOf(name), 1);

            // $FlowFixMe
            let { result, error } = tryCatch(() => fn.call(this, ...args));

            if (error) {
                promises.push(ZalgoPromise.asyncReject(error));
                throw error;
            }

            promises.push(ZalgoPromise.resolve(result));
            return result;
        };
    };

    let avoid : Handler = (name : string, fn = noop) => {

        // $FlowFixMe
        return function avoidWrapper(...args) : * {
            promises.push(ZalgoPromise.asyncReject(new Error(`Expected ${ name } to not be called`)));
            // $FlowFixMe
            return fn.call(this, ...args);
        };
    };

    let expectError : Handler = (name, fn = noop) => {
        expected.push(name);

        // $FlowFixMe
        return function expectErrorWrapper(...args) : * {
            expected.splice(expected.indexOf(name), 1);

            // $FlowFixMe
            let { result, error } = tryCatch(() => fn.call(this, ...args));

            if (error) {
                throw error;
            }

            promises.push(ZalgoPromise.resolve(result).then(() => {
                throw new Error(`Expected ${ name } to throw an error`);
            }, noop));
            return result;
        };
    };

    promises.push(ZalgoPromise.try(() => method({ expect, avoid, expectError, error: avoid })));

    let drain = () => {
        return ZalgoPromise.try(() => {
            if (promises.length) {
                return promises.pop();
            }
        }).then(() => {
            if (promises.length) {
                return drain();
            }
        });
    };

    return drain().then(() => {
        if (expected.length) {
            return timeoutPromise.then(drain);
        }
    }).then(() => {
        if (expected.length) {
            throw new Error(`Expected ${ expected[0] } to be called`);
        }
    });
}
