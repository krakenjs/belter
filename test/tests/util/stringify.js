/* @flow */

import {  stringify } from '../../../src';

describe('stringify cases', () => {
    it('stringify should return the exact same value when is a string value', () => {
        const result = stringify('1');

        if (result !== '1') {
            throw new Error(`should return value "1", but got: ${ result }`);
        }
    });
});
