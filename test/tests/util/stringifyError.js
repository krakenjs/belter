/* @flow */

import { stringifyError } from '../../../src';

describe('stringifyError cases', () => {
    it('stringifyError should return stack overflow error message', () => {
        const expectedResult = 'stringifyError stack overflow';
        const result = stringifyError('custom error', 4);

        if (result !== expectedResult) {
            throw new Error(`should throw the error message "${ expectedResult }", but got: ${ result }`);
        }
    });

    it('stringifyError should return unknown error message', () => {
        const expectedResult = `<unknown error: [object Number]>`;
        const result = stringifyError(0, 1);

        if (result !== expectedResult) {
            throw new Error(`should throw the error messagee "${ expectedResult }", but got: ${ result }`);
        }
    });

    it('stringifyError should return the exact same error message when is a string type', () => {
        const expectedResult = `my error`;
        const result = stringifyError(expectedResult, 1);

        if (result !== expectedResult) {
            throw new Error(`should throw the error message "${ expectedResult }", but got: ${ result }`);
        }
    });

    it('stringifyError should return only the stack when is an Error instance', () => {
        const expectedResult = `custom`;
        const error = new Error(expectedResult);
        const result = stringifyError(error, 1);

        if (!result.startsWith(`Error: ${ expectedResult }`)) {
            throw new Error(`should throw the error message starting with "Error: ${ expectedResult }", but got: ${ result }`);
        }
    });

    it('stringifyError should return the only the stack when is an Error instance with empty message', () => {
        const expectedResult = `at Context.<anonymous>`;
        const error = new Error('anything not important');

        error.message = '';
        const result = stringifyError(error, 1);

        if (!result.includes(expectedResult)) {
            throw new Error(`should throw the error message starting with "${ expectedResult }", but got: ${ result }`);
        }
    });

    it('stringifyError should return the only the message when is an Error instance with empty stack', () => {
        const expectedResult = `error instance`;
        const error = new Error(expectedResult);

        error.stack = '';
        const result = stringifyError(error, 1);

        if (result !== expectedResult) {
            throw new Error(`should throw the error message "${ expectedResult }", but got: ${ result }`);
        }
    });

    it('stringifyError should return the message and stack when is and Error instance and message is not include in the stack', () => {
        const expectedErrorMessage = 'Error: custom at line whatever';
        const error = new Error('custom');

        error.message = 'message';
        error.stack = expectedErrorMessage;
        const result = stringifyError(error, 1);

        if (!result.endsWith(expectedErrorMessage)) {
            throw new Error(`should throw the error message ending with "${ expectedErrorMessage }", but got: ${ result }`);
        }
    });

    it('stringifyError should return call toString when error message is an object', () => {
        const expectedErrorMessage = '[object Object]';
        const result = stringifyError({}, 1);

        if (result !== expectedErrorMessage) {
            throw new Error(`should throw the error message "${ expectedErrorMessage }", but got: ${ result }`);
        }
    });

    it('stringifyError should return call toString from Object.prototype when error message is object', () => {
        const expectedErrorMessage = '[object Object]';
        const result = stringifyError({ toString: null }, 1);

        if (result !== expectedErrorMessage) {
            throw new Error(`should throw the error message "${ expectedErrorMessage }", but got: ${ result }`);
        }
    });

    it('stringifyError should handle error when something when wrong', () => {
        const expectedErrorMessage = 'Error while stringifying error';
        const result = stringifyError({ toString: () => {
            throw new Error('unexpected error');
        } }, 2);

        if (!result.startsWith(expectedErrorMessage)) {
            throw new Error(`should throw the error message starting wit "${ expectedErrorMessage }", but got: ${ result }`);
        }
    });
});
