/* @flow */

import { get } from '../../../src';

describe('get cases', () => {
    const expectedResult = 10;
    it('get should return default value', () => {
        const result = get({}, '', expectedResult);

        if (result !== expectedResult) {
            throw new Error(`should return value "10", but got: ${ String(result) }`);
        }
    });

    it('get should get deep keys', () => {
        const result = get({ value: { result: expectedResult } }, 'value.result');
        
        if (result !== expectedResult) {
            throw new Error(`should return value "true", but got: ${ String(result) }`);
        }
    });

    it('get should get deep keys', () => {
        const result = get({ value: { result: expectedResult } }, 'value.result');
        
        if (result !== expectedResult) {
            throw new Error(`should return value "true", but got: ${ String(result) }`);
        }
    });

    it('get should get deep keys with default value', () => {
        const result = get({}, 'value.result', expectedResult);
        
        if (result !== expectedResult) {
            throw new Error(`should return value "true", but got: ${ String(result) }`);
        }
    });
});
