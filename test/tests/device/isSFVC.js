// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-nested-callbacks */
/* @flow */

import { isSFVC } from '../../../src/device';
import { sfvcScreens } from '../../../src/screenHeights';

describe('isSFVC', () => {
    Object.keys(sfvcScreens).forEach(height => {
        const device = sfvcScreens[height].device;
        const textSizeHeights = sfvcScreens[height].textSizeHeights;

        describe(`iOS 14 ${ device }`, () => {
            textSizeHeights.forEach(textSize => {
                it(`iOS14: ${ textSize } text size should be a SFVC`, () => {
                    window.navigator.userAgent = 'iPhone OS 14_2';

                    const sfvc = isSFVC();
                    if (!sfvc) {
                        throw new Error(`Expected text size, ${ textSize }, to be a SFVC.`);
                    }
                });
            });
        });
    });

    Object.keys(sfvcScreens).forEach(height => {
        const device = sfvcScreens[height].device;
        const textSizeHeights = sfvcScreens[height].textSizeHeights;

        describe(`iOS 15 ${ device }`, () => {
            textSizeHeights.forEach(textSize => {
                it(`iOS15: ${ textSize } text size should be a SFVC`, () => {
                    
                    window.navigator.userAgent = 'iPhone OS 15_2';
                    const sfvc = isSFVC();
                    if (!sfvc) {
                        throw new Error(`Expected text size, ${ textSize }, to be a SFVC.`);
                    }
                });
            });
        });
    });

    it('should return true when user has scrolled', () => {
        window.navigator.userAgent = 'iPhone OS 15_2';
        window.pageYOffset = 10;

        const sfvc = isSFVC();
        if (!sfvc) {
            throw new Error(`Expected to be SFVC when user has scrolled.`);
        }
    });

    it('should return true if browser scale is greater than 1 for iOS 15', () => {
        window.navigator.userAgent = 'iPhone OS 15_2';
        window.innerWidth = 372;
        window.screen = {
            width:      428
        };

        const sfvc = isSFVC();
        if (!sfvc) {
            throw new Error(`Expected to be SFVC when user has zoomed in iOS 15.`);
        }
    });

    it('should calculate SFVC based on browser zoom for iOS 14', () => {
        window.navigator.userAgent = 'iPhone OS 14_2';
        window.outerHeight = 926;
        window.innerHeight = 650;
        window.innerWidth = 372;
        window.screen = {
            width:      428
        };

        const sfvc = isSFVC();
        if (!sfvc) {
            throw new Error(`Expected to be SFVC when user has zoomed to 115% with SFVC dimensions.`);
        }
    });

    it('should return false when isIos function returns false', () => {
        
        window.navigator.userAgent = 'potatoIOS';
        const sfvc = isSFVC();
        if (sfvc) {
            throw new Error(`Expected false, got ${ JSON.stringify(sfvc) }`);
        }
    });
});
