/* @flow */

import { isRegex } from '../../../src/util';

describe('isRegex', () => {
    it('should return true when item is a regex', () => {
        const bool = isRegex(/hi/)
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`)
        }
    });

    it('should return false when item is NOT a regex', () => {
        const bool = isRegex('hi')
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`)
        }
    });
});
