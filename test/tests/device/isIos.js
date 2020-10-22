/* @flow */

import { isIos } from '../../../src/device';

describe('isIos', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
    });
    it('should return true when userAgent equals iPhone', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'iPhone';
        const bool = isIos();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent equals iPod', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'iPod';
        const bool = isIos();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent equals iPad', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'iPad';
        const bool = isIos();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent is NOT an IOS', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'fake potato';
        const bool = isIos();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
