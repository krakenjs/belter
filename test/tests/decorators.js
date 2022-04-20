/* @flow */

import { memoized, promise } from '../../src/decorators';

describe('decorators cases', () => {
    it('memoized', () => {
        const descriptor = { value: () => 1 };
        memoized({  }, 'value', descriptor);
        const resultValue = descriptor.value();

        if (resultValue !== 1) {
            throw new Error(`memoized function should return the value "1", but got: ${ resultValue }`);
        }
    });

    it('promise', async () => {
        const descriptor = { value: () => 1 };
        promise({  }, 'value', descriptor);
        const resultValue = await descriptor.value();

        if (resultValue !== 1) {
            throw new TypeError(`promise function should return the value "1", but got: ${ resultValue }`);
        }
    });
});