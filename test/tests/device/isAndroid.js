/* @flow */

import { isAndroid  } from '../../../src/device';

describe('android', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
    });
    it('should return true when userAgent contains Android', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'Android';
        const bool = isAndroid();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT contain Android', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'android';
        const bool = isAndroid();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
