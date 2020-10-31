/* @flow */

import { isSafari } from '../../../src/device';

describe('isSafari', () => {
    it('should return true when userAgent contains Safari and isChrome function returns false', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'Safari';
        const bool = isSafari();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent contains Safari and isChrome function returns true', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'SafariChrome';
        const bool = isSafari();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT contain Safari', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'potato';
        const bool = isSafari();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
