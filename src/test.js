/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';

import { noop } from './util';

type ExpectHandler = <T, A : $ReadOnlyArray<mixed>>(name : string, ?(...args : A) => T) => (...args : A) => T; // eslint-disable-line no-undef
type ErrorHandler = <T, A : $ReadOnlyArray<mixed>>(name : string, ?(...args : A) => T) => (...args : A) => T; // eslint-disable-line no-undef

export function wrapPromise<T>(method : ({ expect : ExpectHandler, error : ErrorHandler }) => ZalgoPromise<T>, { timeout = 2000 } : { timeout? : number } = {}) : ZalgoPromise<void> {
    let expected = [];
    let promises = [];

    let timeoutPromise = ZalgoPromise.delay(timeout);

    let expect : ExpectHandler = (name, fn = noop) => {
        let obj = { name, fn };
        expected.push(obj);
        // $FlowFixMe
        return function expectWrapper(...args) : * {
            expected.splice(expected.indexOf(obj), 1);
            let result;
            try {
                // $FlowFixMe
                result = fn.call(this, ...args);
                promises.push(ZalgoPromise.resolve(result));
                return result;
            } catch (err) {
                promises.push(ZalgoPromise.reject(err));
                throw err;
            }
        };
    };

    let error : ErrorHandler = (name : string, fn = noop) => {
        // $FlowFixMe
        return function errorWrapper(...args) : * {
            promises.push(ZalgoPromise.try(() => {
                // $FlowFixMe
                return fn.call(this, ...args);
            }).then(() => {
                throw new Error(`Expected ${ name } to not be called`);
            }));
        };
    };

    let awaitPromises = () : ZalgoPromise<void> => {
        return ZalgoPromise.try(() => {
            if (promises.length) {
                let promise = promises.pop();
                return promise.then(awaitPromises);
            } else if (expected.length) {
                return timeoutPromise.then(() => {
                    if (!expected.length) {
                        return awaitPromises();
                    }
                });
            }
        });
    };

    promises.push(ZalgoPromise.try(() => method({ expect, error })));

    return awaitPromises().then(() => {
        if (expected.length) {
            throw new Error(`Expected ${ expected[0].name } to be called`);
        }
    });
}
