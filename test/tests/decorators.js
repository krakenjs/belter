/* @flow */

import { memoized, promise } from '../../src/decorators';

describe('Decorators test', () => {
    it('Should return an object with a value', () => {
        const result = {};
        memoized({}, 'test', result);
        if (!result.value) {
            throw new Error(`Expected result to have a value`);
        }
    });
    it('Should return an object with a value', () => {
        const result = { value: '' };
        promise({}, 'test', result);
        if (!result.value) {
            throw new Error(`Expected result to have a value`);
        }
    });
});
