/* @flow */

import { isIos, isIOS14 } from '../../../src/device';

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

    describe('isIOS14', () => {
        beforeEach(() => {
            window.navigator = {};
        });
        it('should return true when userAgent contains iPhone OS 14_', () => {
            
            window.navigator.userAgent = 'iPhone OS 14_2';
            const bool = isIOS14();
            if (!bool) {
                throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
            }
        });
        it('should return true when userAgent contains iPhone OS 7_', () => {
            
            window.navigator.userAgent = 'iPhone OS 7_1';
            const bool = isIOS14();
            if (!bool) {
                throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
            }
        });
        it('should return false if when userAgent is above iOS 14', () => {
            
            window.navigator.userAgent = 'iPhone OS 15_1';
            const bool = isIOS14();
            if (bool) {
                throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
            }
        });
    });
});
