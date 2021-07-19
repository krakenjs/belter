/* @flow */

import { isChrome } from '../../../src/device';

describe('isChrome', () => {
    it('should return true when userAgent contains Chrome', () => {
        
        window.navigator.userAgent = 'Chrome';
        const bool = isChrome();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent contains Chromium', () => {
        
        window.navigator.userAgent = 'Chromium';
        const bool = isChrome();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent contains CriOS', () => {
        
        window.navigator.userAgent = 'CriOS';
        const bool = isChrome();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent is invalid', () => {
        
        window.navigator.userAgent = 'p0tatO';
        const bool = isChrome();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
