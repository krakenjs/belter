/* @flow */

import { getUserAgent } from '../../../src/device';

describe('getUserAgent', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
    });
    it('should return value of window.navigator.mockUserAgent', () => {
        const expectedResult = 'incredible potato';
        // eslint-disable-next-line compat/compat
        window.navigator.mockUserAgent = expectedResult;
        const mockUserAgent = getUserAgent();
        if (mockUserAgent !== expectedResult) {
            throw new Error(`Expected ${ expectedResult }, got ${ mockUserAgent }`);
        }
    });
    it('should return value of window.navigator.userAgent', () => {
        const expectedResult = 'subpar potato';
        // eslint-disable-next-line compat/compat
        window.navigator.mockUserAgent = expectedResult;
        const userAgent = getUserAgent();
        if (userAgent !== expectedResult) {
            throw new Error(`Expected ${ expectedResult }, got ${ userAgent }`);
        }
    });
});
