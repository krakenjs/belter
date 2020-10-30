/* @flow */

import { isChrome  } from '../../../src/device';

describe('isChrome', () => {
    it('should return true when userAgent contains Chrome', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'Chrome';
        const bool = isChrome();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent contains Chromium', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'Chromium';
        const bool = isChrome();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent contains CriOS', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'CriOS';
        const bool = isChrome();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent is invalid', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'p0tatO';
        const bool = isChrome();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
