// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-nested-callbacks */
/* @flow */

import { isWebView } from '../../../src/device';
import { iPhoneScreenHeightMatrix } from '../../../src/screenHeights';

describe('isWebView', () => {
    Object.keys(iPhoneScreenHeightMatrix).forEach(height => {
        if (height === '568') {
            return;
        }

        const device = iPhoneScreenHeightMatrix[height].device;
        const textSizeHeights = iPhoneScreenHeightMatrix[height].textSizeHeights;

        describe(`${ device }`, () => {
            textSizeHeights.forEach(textSize => {
                it(`${ textSize } text size should not be a web view`, () => {
                    if (isWebView()) {
                        throw new Error(`Expected text size, ${ textSize }, to not be a web view.`);
                    }
                });
            });
        });
    });
});

