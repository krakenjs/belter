/* @flow */

import { isIos } from '../../../src/device';

describe('isIos', () => {
    beforeEach(() => {
        
        window.navigator = {};
    });
    it('should return true when userAgent contains iPhone', () => {
        
        window.navigator.userAgent = 'iPhone';
        const bool = isIos();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent contains iPod', () => {
        
        window.navigator.userAgent = 'iPod';
        const bool = isIos();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent contains iPad', () => {
        
        window.navigator.userAgent = 'iPad';
        const bool = isIos();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent is NOT an IOS', () => {
        
        window.navigator.userAgent = 'iPotato';
        const bool = isIos();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
