/* @flow */

import { once, memoize, inlineMemoize } from '../../src';

describe('util cases', () => {

    it('should create a one time function', () => {

        let counter = 0;

        let add = once(() => {
            counter += 1;
        });

        add();
        add();
        add();
        add();
        add();

        if (counter !== 1) {
            throw new Error(`Expected counter to be 1, got ${ counter }`);
        }
    });

    it('should create a memoized function', () => {

        let counter = 0;

        let add = memoize(() => {
            counter += 1;
        });

        add();
        add();
        add();
        add();
        add();

        if (counter !== 1) {
            throw new Error(`Expected counter to be 1, got ${ counter }`);
        }
    });

    it('should create a self-memoized function', () => {

        let counter = 0;

        let add = () => {
            return inlineMemoize(add, () => {
                counter += 1;
            });
        };

        add();
        add();
        add();
        add();
        add();

        if (counter !== 1) {
            throw new Error(`Expected counter to be 1, got ${ counter }`);
        }
    });

    it('should create a self-memoized function and error out when it is called recursively', () => {

        let counter = 0;

        let add = () => {
            return inlineMemoize(add, () => {
                counter += 1;
                if (counter === 1) {
                    add();
                }
            });
        };

        let expectedError;

        try {
            add();
        } catch (err) {
            expectedError = err;
        }

        if (!expectedError) {
            throw new Error(`Expected error to be thrown ${ counter }`);
        }
    });
});
