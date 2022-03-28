/* @flow */

import { getBody } from '../../../src';

describe('get body cases', () => {

    it('should get the body', () => {
        if (getBody() !== document.body) {
            throw new Error(`Expected getBody to get the correct body element`);
        }
    });

    it('should throw and exception when body is empty', () => {
        const expectedErrorMessage = 'Body element not found';
        // eslint-disable-next-line compat/compat
        const originalBody = document.body;
        // eslint-disable-next-line compat/compat
        document.body = null;

        try {
            getBody();
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error message "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
        // eslint-disable-next-line compat/compat
        document.body = originalBody;
    });
});
