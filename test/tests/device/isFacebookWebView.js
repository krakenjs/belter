/* @flow */

import { isFacebookWebView  } from '../../../src/device';

describe('isFacebookWebView', () => {
    beforeEach(() => {
        
        window.navigator = {};
    });
    it('should return true when userAgent contains FBAN', () => {
        
        window.navigator.userAgent = 'FBAN';
        const bool = isFacebookWebView();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent contains FBAV', () => {
        
        window.navigator.userAgent = 'FBAV';
        const bool = isFacebookWebView();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT contain FBAV or FBAN', () => {
        
        window.navigator.userAgent = 'facebook potato';
        const bool = isFacebookWebView();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
