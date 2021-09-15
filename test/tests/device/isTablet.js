/* @flow */

import { isTablet  } from '../../../src/device';

describe('isTablet', () => {
    beforeEach(() => {
        
        window.navigator = {};
    });
    it('should return true if userAgent contain tablet string', () => {
        
        window.navigator.userAgent = 'Mozilla/5.0 (iPad; CPU OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1';
        if (!isTablet()) {
            throw new Error(`Expected true, got false`);
        }
    });
    it('should return false if userAgent does NOT contain tablet string', () => {
        
        window.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1';
        if (isTablet()) {
            throw new Error(`Expected false, got true`);
        }
    });
});
