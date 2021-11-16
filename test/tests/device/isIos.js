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
    it('should return false when userAgent is Yandex browser', () => {
        
        window.navigator.userAgent = 'Mozilla/5.0 (iPad; CPU OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 YaBrowser/21.11.1.882.11 Mobile/15E148 Safari/604.1';
        const bool = isIos();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
