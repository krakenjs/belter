/* @flow */

import { isMacOsCna } from '../../../src/device';

describe('isMacOsCna', () => {
    beforeEach(() => {
        
        window.navigator = {};
    });
    it('should return true when userAgent is valid', () => {
        
        window.navigator.userAgent = 'macintosh.potatoAppleWebKit';
        const bool = isMacOsCna();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent is invalid', () => {
        
        window.navigator.userAgent = 'potat0';
        const bool = isMacOsCna();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
