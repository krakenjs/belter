/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';

import { noop } from './util';

type Handler = <T, A : $ReadOnlyArray<mixed>>(name : string, fn? : (...args : A) => T) => (...args : A) => T; // eslint-disable-line no-undef
type Wrapper<T> = ({ expect : Handler, avoid : Handler, expectError : Handler, error : Handler }) => ZalgoPromise<T>;

export function wrapPromise<T>(method : Wrapper<T>, { timeout = 5000 } : { timeout? : number } = {}) : ZalgoPromise<void> {
    let expected = [];
    let promises = [];

    let timeoutPromise = ZalgoPromise.delay(timeout);

    let expect : Handler = (name, fn = noop) => {
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
                const promise = ZalgoPromise.reject(err);
                promise.catch(noop);
                promises.push(promise);
                throw err;
            }
        };
    };

    let avoid : Handler = (name : string, fn = noop) => {
        // $FlowFixMe
        return function avoidWrapper(...args) : * {
            const promise = ZalgoPromise.reject(new Error(`Expected ${ name } to not be called`));
            promise.catch(noop);
            promises.push(promise);
            // $FlowFixMe
            return fn.call(this, ...args);
        };
    };

    let expectError : Handler = (name, fn = noop) => {
        // $FlowFixMe
        return expect(name, function expectErrorWrapper(...args) : * {
            // $FlowFixMe
            const result = fn.call(this, ...args);
            
            promises.push(ZalgoPromise.resolve(result).then(() => {
                throw new Error(`Expected ${ name } to throw an error`);
            }));

            // $FlowFixMe
            return result;
        });
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

    promises.push(ZalgoPromise.try(() => method({ expect, avoid, expectError, error: avoid })));

    return awaitPromises().then(() => {
        if (expected.length) {
            throw new Error(`Expected ${ expected[0].name } to be called`);
        }
    });
}
