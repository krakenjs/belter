/* @flow */

import { isWebView } from '../../../src/device';

describe('isWebView', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
    });
    it('should return false when userAgent is invalid', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'invalid potato';
        const bool = isWebView();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is valid and begins with iPhone or iPod or iPad or Macintosh(case insensitive)', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'ipod.potatoAppleWebKit.potato';
        const bool = isWebView();
        if (!bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent contains whole word wv', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'wv';
        const bool = isWebView();
        if (!bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is valid and starts with android(case insensitive)', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'android.potatoVersion/9.3';
        const bool = isWebView();
        if (!bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
