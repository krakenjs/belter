/* @flow */

import { memoize, inlineMemoize } from '../../../src';

describe('memoize cases', () => {

    it('should create a memoized function', () => {

        let counter = 0;

        const add = memoize(() => {
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

    it('should create a memoized function with a parameter', () => {

        let counter = 0;

        const add = memoize((number) => {
            counter += number;
        });

        add(1);
        add(2);
        add(2);
        add(3);
        add(3);
        add(3);

        if (counter !== 6) {
            throw new Error(`Expected counter to be 6, got ${ counter }`);
        }
    });

    it('should create a self-memoized function', () => {

        let counter = 0;

        const add = () => {
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

    it('should create a self-memoized function with a parameter', () => {

        let counter = 0;

        const add = (number) => {
            return inlineMemoize(add, () => {
                counter += number;
            }, [ number ]);
        };

        add(1);
        add(2);
        add(2);
        add(3);
        add(3);
        add(3);

        if (counter !== 6) {
            throw new Error(`Expected counter to be 6, got ${ counter }`);
        }
    });

    it('should create a self-memoized function and call recursively', () => {

        let counter = 0;

        const add = () => {
            return inlineMemoize(add, () => {
                counter += 1;
                if (counter === 1) {
                    add();
                }
            });
        };

        add();

        if (counter !== 2) {
            throw new Error(`Expected counter to be 2, got ${ counter }`);
        }
    });

    it('should create a memoized function with cache based on this', () => {

        let counter = 0;

        const add = memoize(() => {
            counter += 1;
        }, { thisNamespace: true });

        const obj1 = {};
        const obj2 = {};

        add.call(obj1);
        add.call(obj1);
        add.call(obj1);
        add.call(obj1);

        add.call(obj2);
        add.call(obj2);
        add.call(obj2);
        add.call(obj2);

        if (counter !== 2) {
            throw new Error(`Expected counter to be 2, got ${ counter }`);
        }
    });

    it('should create a memoized function with cache based on this and a parameter', () => {

        let counter = 0;

        const add = memoize((number) => {
            counter += number;
        }, { thisNamespace: true });

        const obj1 = {};
        const obj2 = {};

        add.call(obj1, 1);
        add.call(obj1, 2);
        add.call(obj1, 2);
        add.call(obj1, 3);
        add.call(obj1, 3);
        add.call(obj1, 3);

        add.call(obj2, 1);
        add.call(obj2, 2);
        add.call(obj2, 2);
        add.call(obj2, 3);
        add.call(obj2, 3);
        add.call(obj2, 3);

        if (counter !== 12) {
            throw new Error(`Expected counter to be 12, got ${ counter }`);
        }
    });
});
