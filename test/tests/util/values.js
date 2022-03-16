/* @flow */

import { values } from '../../../src';

describe('values cases', () => {

    it('should return object values when Object.values is available', () => {
        const result = values({ a: true });

        if (!result[0]) {
            throw new Error(`should return the value from the original object, but got: ${ String(result) }`);
        }
    });

    it('should return object values when Object.values is unavailable', () => {
        const originalFunc = Object.values;
        Reflect.deleteProperty(Object, 'values');
        const result = values({ a: true });

        if (!result[0]) {
            throw new Error(`should return the value from the original object, but got: ${ String(result) }`);
        }
        Reflect.defineProperty(Object, 'values', originalFunc);
    });
});
