// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-nested-callbacks */
/* @flow */

import { isSFVC } from '../../../src/device';
import { iOS14, iOS15 } from '../../../src/screenHeights';

describe('isSFVC', () => {
    Object.keys(iOS14).forEach(height => {
        const device = iOS14[height].device;
        const textSizeHeights = iOS14[height].textSizeHeights;

        describe(`iOS 14 ${ device }`, () => {
            textSizeHeights.forEach(textSize => {
                it(`iOS14: ${ textSize } text size should not be a web view`, () => {
                    
                    window.navigator.userAgent = 'iPhone OS 14_2';
                    const sfvc = isSFVC();
                    if (sfvc) {
                        throw new Error(`Expected text size, ${ textSize }, to not be a web view.`);
                    }
                });
            });
        });
    });

    Object.keys(iOS15).forEach(height => {
        const device = iOS14[height].device;
        const textSizeHeights = iOS14[height].textSizeHeights;

        describe(`iOS15 ${ device }`, () => {
            textSizeHeights.forEach(textSize => {
                it(`iOS15: ${ textSize } text size should not be a web view`, () => {
                    
                    window.navigator.userAgent = 'iPhone OS 15_1';
                    const sfvc = isSFVC();
                    if (sfvc) {
                        throw new Error(`Expected text size, ${ textSize }, to not be a web view.`);
                    }
                });
            });
        });
    });

    it('should return false when isIos function returns false', () => {
        
        window.navigator.userAgent = 'potatoIOS';
        const sfvc = isSFVC();
        if (sfvc) {
            throw new Error(`Expected false, got ${ JSON.stringify(sfvc) }`);
        }
    });
});
