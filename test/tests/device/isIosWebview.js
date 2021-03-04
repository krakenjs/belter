// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-nested-callbacks */
/* @flow */

import { isIosWebview } from '../../../src/device';
import { iPhoneScreenHeightMatrix } from '../../../src/screenHeights';

describe('isIosWebview', () => {
    beforeEach(() => {
        window.outerHeight = 926;
    });
    
    it('should return true when both isIos and isGoogleSearchApp functions return true', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'iPhone GSA';
        const { webview } = isIosWebview();
        if (!webview) {
            throw new Error(`Expected true, got ${ JSON.stringify(webview) }`);
        }
    });

    Object.keys(iPhoneScreenHeightMatrix).forEach(height => {
        if (height === '568') {
            return;
        }

        const device = iPhoneScreenHeightMatrix[height].device;
        const textSizeHeights = iPhoneScreenHeightMatrix[height].textSizeHeights;

        describe(`${ device }`, () => {
            textSizeHeights.forEach(textSize => {
                it(`${ textSize } text size should not be a web view`, () => {
                    // eslint-disable-next-line compat/compat
                    window.navigator.userAgent = 'iPhone';
                    const { webview } = isIosWebview();
                    if (webview) {
                        throw new Error(`Expected text size, ${ textSize }, to not be a web view.`);
                    }
                });
            });
        });
    });

    it('should return false when isIos function returns false', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'potatoIOS';
        const { webview } = isIosWebview();
        if (webview) {
            throw new Error(`Expected false, got ${ JSON.stringify(webview) }`);
        }
    });
});
