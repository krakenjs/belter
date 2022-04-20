/* @flow */
import { debounce, promiseDebounce, promisify } from '../../../src';

describe('promiseDebounce cases', () => {
    it('debounce', () => {
        let result;

        debounce(() => {
            result = true;
        }, 0)();
        debounce(() => {
            if (!result) {
                throw new Error(`should return the value "true", but got: ${ String(result) }`);
            }
        }, 100);
    });

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
                // $FlowFixMe[incompatible-type]
                if (err.message !== 'unexpected') {
                    throw new Error(`should throw the error message "unexpected", but got: ${ err.message }`);
                }
            });
    });

    it('promisify should execute the function as a promise', () => {
        [ undefined, { name: 'method' } ].forEach(async testCase => {
            const result = await promisify(() => true, testCase)();

            if (!result) {
                throw new Error(` should return value "true", but got: ${ result }`);
            }
        });
    });
});
