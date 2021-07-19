/* @flow */

import { isOperaMini  } from '../../../src/device';

describe('isOperaMini', () => {
    beforeEach(() => {
        
        window.navigator = {};
    });
    it('should return true when userAgent contains `Opera Mini`', () => {
        
        window.navigator.userAgent = 'Opera Mini';
        const bool = isOperaMini();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT contain `Opera Mini`', () => {
        
        window.navigator.userAgent = 'Potato Mini';
        const bool = isOperaMini();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
