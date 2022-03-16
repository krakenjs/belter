/* @flow */

import { match } from '../../../src';

describe('match cases', () => {
    it('match should return original function', () => {
        const result = match('letters', /(t[a-z]*)/i);

        if (result !== 'tters') {
            throw new Error(`should return "tters", but got: ${ String(result) }`);
        }
    });
});
