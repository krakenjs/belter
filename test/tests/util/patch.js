/* @flow */

import { patchMethod } from '../../../src';

describe('patchMethod cases', () => {
    it('patchMethod should return original function', () => {
        const obj = {
            custom() : string {
                return 'first';
            }
        };
        const handler = ({ callOriginal }) => {
            return callOriginal();
        };

        patchMethod(obj, 'custom', handler);
        const result = obj.custom();

        if (result !== 'first') {
            throw new Error(`should return "first", but got: ${ result }`);
        }
    });
});
