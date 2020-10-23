/* @flow */

import { isIosWebview  } from '../../../src/device';

describe('isIosWebview', () => {
    it('should return true when both isIos and isGoogleSearchApp functions return true', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'iPhone GSA';
        const bool = isIosWebview();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when isIos function returns true, and Applekit regex test passes', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = '.iPhoneAppleWebKit';
        const bool = isIosWebview();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when isIos function returns false', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'potatoIOS';
        const bool = isIosWebview();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
