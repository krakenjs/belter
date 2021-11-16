/* @flow */

import { isSafari } from '../../../src/device';

describe('isSafari', () => {
    it('should return true when userAgent contains Safari and isChrome function returns false', () => {
        
        window.navigator.userAgent = 'Safari';
        const bool = isSafari();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent contains Safari and isChrome function returns true', () => {
        
        window.navigator.userAgent = 'SafariChrome';
        const bool = isSafari();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT contain Safari', () => {
        
        window.navigator.userAgent = 'potato';
        const bool = isSafari();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent is Yandex browser', () => {
        
        window.navigator.userAgent = 'Mozilla/5.0 (iPad; CPU OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 YaBrowser/21.11.1.882.11 Mobile/15E148 Safari/604.1';
        const bool = isSafari();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
