/* @flow */

import { isFirefox  } from '../../../src/device';

describe('isFirefoxIOS', () => {
    beforeEach(() => {
        
        window.navigator = {};
    });
    it('should return true when userAgent contains firefox(case insensitive)', () => {
        
        window.navigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:87.0) Gecko/20100101 Firefox/87.0';
        const bool = isFirefox();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT contain firefox(case insensitive)', () => {
        
        window.navigator.userAgent = 'fired potato';
        const bool = isFirefox();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
