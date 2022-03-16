
/* @flow */

import { replaceObject } from '../../../src/util';

describe('replaceObject cases', () => {

    it('replaceObject should replace the array', () => {
        const source = [ 1, 2, [ 3, 4 ] ];
        const result = replaceObject(source, el =>  el);

        if (result[0] !== 1 || result[2][1] !== 4) {
            throw new Error(`should get the exact same array, but got ${ JSON.stringify(source) }`);
        }
    });

    it('replaceObject should replace the object', () => {
        const source = {
            a: 1,
            b: 2,
            c: {
                d: 3
            },
            __proto__: {
                ignore: 1
            }
        };
        const result = replaceObject(source, el =>  el);

        if (result.a !== 1 || result.c.d !== 3) {
            throw new Error(`should get the exact same object, but got ${ JSON.stringify(source) }`);
        }
    });

    it('replaceObject should replace the object', () => {
        const expectedErrorMessage = 'Pass an object or array';
        try {
            replaceObject(1, el =>  el);
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error message "${ expectedErrorMessage }", but got ${ err.message }`);
            }
        }
    });
});
