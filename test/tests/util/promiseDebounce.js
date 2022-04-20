/* @flow */

import { promiseDebounce } from '../../../src';

describe('promiseDebounce cases', () => {
    it('promiseDebounce should return original function', () => {
        const debouncedFunc = promiseDebounce(() => true);
        const result = debouncedFunc();

        if (!debouncedFunc()) {
            throw new Error(`should return the value "true", but got: ${ String(result) }`);
        }
    });

    it('promiseDebounce should throw and error', () => {
        const debouncedFunc = promiseDebounce(() => {
            throw new Error('unexpected');
        });
        
        debouncedFunc()
            .catch(err => {
                // $FlowFixMe incompatible-type
                if (err.message !== 'unexpected') {
                    throw new Error(`should throw the error message "unexpected", but got: ${ err.message }`);
                }
            });
    });
});
