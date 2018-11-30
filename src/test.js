/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';

type Expect = <T : mixed, A : $ReadOnlyArray<mixed>>((...args : A) => T) => (...args : A) => T; // eslint-disable-line no-undef

export function wrapPromise<T>(method : ({ expect : Expect }) => ZalgoPromise<T>, { timeout = 2000 } : { timeout? : number } = {}) : ZalgoPromise<void> {
    let expected = [];
    let promises = [];

    let timeoutPromise = ZalgoPromise.delay(timeout);

    let expect = <TT : mixed, AA : $ReadOnlyArray<mixed>>(fn : (...args : AA) => TT) : ((...args : AA) => TT) => {
        expected.push(fn);
        return function expectWrapper(...args : AA) : TT {
            expected.splice(expected.indexOf(fn), 1);
            let result;
            try {
                result = fn.call(this, ...args);
                promises.push(ZalgoPromise.resolve(result));
                return result;
            } catch (err) {
                promises.push(ZalgoPromise.reject(err));
                throw err;
            }
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

    promises.push(ZalgoPromise.try(() => method({ expect })));

    return awaitPromises().then(() => {
        if (expected.length) {
            throw new Error(`Expected ${ expected[0].toString() } to be called`);
        }
    });
}
