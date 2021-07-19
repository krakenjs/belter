/* @flow */

import { isIE } from '../../../src/device';

describe('isIE', () => {
    beforeEach(() => {
        window.document.documentMode = null;
    });
    it('should return false when window.document.documentMode is a falsy value, and userAgent is an invalid truthy value', () => {
        
        window.navigator.userAgent = 'potato';
        const bool = isIE();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when window.document.documentMode is a falsy value, and userAgent is a falsy value', () => {
        const bool = isIE();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when window.document.documentMode is a falsy value, and window.navigator is a falsy value', () => {
        const bool = isIE();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when window.document.documentMode is a falsy value and userAgent contains edge(case insensitive)', () => {
        
        window.navigator.userAgent = 'edge';
        const bool = isIE();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when window.document.documentMode is a falsy value and userAgent contains msie(case insensitive)', () => {
        
        window.navigator.userAgent = 'msie';
        const bool = isIE();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when window.document.documentMode is a falsy value and userAgent contains rv:11(case insensitive)', () => {
        
        window.navigator.userAgent = 'rv:11';
        const bool = isIE();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when window.document.documentMode is a truthy value', () => {
        window.document.documentMode = true;
        const bool = isIE();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
});
