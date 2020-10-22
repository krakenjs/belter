/* @flow */

import { isQQBrowser  } from '../../../src/device';

describe('isQQBrowser', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
    });
    it('should return true when userAgent equals QQBrowser', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'QQBrowser';
        const bool = isQQBrowser();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT equal QQBrowser', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'QQ potato';
        const bool = isQQBrowser();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
