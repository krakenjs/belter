/* @flow */

import { extend } from '../../../src';

describe('extend cases', () => {

    it('should return same object when second argument is empty', () => {
        const result = extend({ a: true });
        const arrayResult = Object.entries(result).flat();

        if (arrayResult[0] !== 'a' || !arrayResult[1]) {
            throw new Error(`should return the exact same first argument object, but got: ${ String(result) }`);
        }
    });

    it('should add keys from one object to another', () => {
        const obj1 : Object = {
            'foo': 1,
            'bar': 2,
            'baz': 3
        };

        const obj2 : Object = {
            'blep':  4,
            'blop':  5,
            'bloop': 6
        };

        extend(obj1, obj2);

        if (obj1.blep !== 4) {
            throw new Error(`Expected obj1.blep to equal 4, got ${ obj1.blep }`);
        }

        if (obj1.blop !== 5) {
            throw new Error(`Expected obj1.blop to equal 5, got ${ obj1.blop }`);
        }

        if (obj1.bloop !== 6) {
            throw new Error(`Expected obj1.bloop to equal 6, got ${ obj1.bloop }`);
        }
    });

    it('should return the extend object when Object.assign is not valid', () => {
        const originalFunc = Object.assign;
        Reflect.deleteProperty(Object, 'assign');
        const result = extend({ a: true }, { b: false });
        const arrayResult = Object.entries(result).flat();

        if (arrayResult[0] !== 'a' || !arrayResult[1] ||
            arrayResult[2] !== 'b' || arrayResult[3]) {
            throw new Error(`should return the extended object, but got: ${ String(result) }`);
        }
        Reflect.defineProperty(Object, 'assign', originalFunc);
    });
});
