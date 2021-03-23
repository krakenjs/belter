/* @flow */

import { isSupportedNativeBrowser  } from '../../../src/device';

describe('isSupportedNativeBrowser', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
    });
    it('should return false if it no support for popups', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
        
        const bool = isSupportedNativeBrowser();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true if iOS && Safari', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'iPhone Safari';
        
        const bool = isSupportedNativeBrowser();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true if Android && Chrome', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'Android Chrome';
        
        const bool = isSupportedNativeBrowser();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
});
