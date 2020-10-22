/* @flow */

import { isFacebookWebView  } from '../../../src/device';

describe('isFacebookWebView', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
    });
    it('should return true when userAgent equals FBAN', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'FBAN';
        const bool = isFacebookWebView();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent equals FBAV', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'FBAV';
        const bool = isFacebookWebView();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT equal FBAV or FBAN', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'facebook potato';
        const bool = isFacebookWebView();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
