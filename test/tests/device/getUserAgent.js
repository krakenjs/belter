/* @flow */

import { getUserAgent } from '../../../src/device';

describe('getUserAgent', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
    });
    it('should return value of window.navigator.mockUserAgent', () => {
        const expectedResult = 'mock potato';
        // eslint-disable-next-line compat/compat
        window.navigator.mockUserAgent = expectedResult;
        const mockUserAgent = getUserAgent();
        if (mockUserAgent !== expectedResult) {
            throw new Error(`Expected ${ expectedResult }, got ${ mockUserAgent }`);
        }
    });
    it('should return value of window.navigator.userAgent', () => {
        const expectedResult = 'userAgent potato';
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = expectedResult;
        const userAgent = getUserAgent();
        if (userAgent !== expectedResult) {
            throw new Error(`Expected ${ expectedResult }, got ${ userAgent }`);
        }
    });
});
