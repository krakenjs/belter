/* @flow */

import { memoized, promise } from '../../src/decorators';

describe('Decorators test', () => {
    it('Should return a truthy value', () => {
        const result = {};
        memoized({}, 'test', result);
        if (!result.value) {
            throw new Error(`Expected result to have a value`);
        }
    });
    it('Should return a truthy value', () => {

        const result = {};
        promise({}, 'test', result);
        if (!result.value) {
            throw new Error(`Expected result to have a value`);
        }
    });
});

