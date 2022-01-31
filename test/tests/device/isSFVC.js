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
                    window.outerHeight = height;
                    window.innerHeight = textSize;
                    window.innerWidth = 372;
                    window.screen = {
                        width:      372
                    };

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
                    window.outerHeight = height;
                    window.innerHeight = textSize;
                    window.innerWidth = 372;
                    window.screen = {
                        width:      372
                    };

                    const sfvc = isSFVC();
                    if (!sfvc) {
                        throw new Error(`Expected text size, ${ textSize }, to be a SFVC.`);
                    }
                });
            });
        });
    });

    it('should return false when not iOS device', () => {
        
        window.navigator.userAgent = 'potatoIOS';
        const sfvc = isSFVC();
        if (sfvc) {
            throw new Error(`Expected false, got ${ JSON.stringify(sfvc) }`);
        }
    });

    it('should return true if device is not supported', () => {
        window.navigator.userAgent = 'iPhone OS 15_2';
        window.outerHeight = 647;
        window.innerHeight = 647;
        window.innerWidth = 372;
        window.screen = {
            width:      372
        };

        const sfvc = isSFVC();
        if (!sfvc) {
            throw new Error(`Expected to be SFVC when user device is not supported.`);
        }
    });

    it('should return true if device dimension is SFVC dimension with scale=1.0 with tabbar showing', () => {
        window.navigator.userAgent = 'iPhone OS 15_2';
        window.outerHeight = 844;
        window.innerHeight = 670;
        window.innerWidth = 372;
        window.screen = {
            width:      372
        };

        const sfvc = isSFVC();
        if (!sfvc) {
            throw new Error(`Expected to be SFVC when user device is not supported.`);
        }
    });

    it('should return true if device dimension is SFVC dimension with scale=1.0 with tabbar not showing', () => {
        window.navigator.userAgent = 'iPhone OS 15_2';
        window.outerHeight = 844;
        window.innerHeight = 778;
        window.innerWidth = 372;
        window.screen = {
            width:      372
        };

        const sfvc = isSFVC();
        if (!sfvc) {
            throw new Error(`Expected to be SFVC when user device is not supported.`);
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

    it('should return false if device is supported but innerHeight does not match SFVC dimensions and scale is 1 for iOS 14', () => {
        window.navigator.userAgent = 'iPhone OS 14_2';
        window.outerHeight = 926;
        window.innerHeight = 740;
        window.innerWidth = 428;
        window.screen = {
            width:      428
        };

        const sfvc = isSFVC();
        if (sfvc) {
            throw new Error(`Expected to not be SFVC when not matching SFVC dimensions.`);
        }
    });

    it('should return false if device is supported but innerHeight does not match SFVC dimensions and scale is greater than 1 for iOS 14', () => {
        window.navigator.userAgent = 'iPhone OS 14_2';
        window.outerHeight = 926;
        window.innerHeight = 740;
        window.innerWidth = 372;
        window.screen = {
            width:      428
        };

        const sfvc = isSFVC();
        if (sfvc) {
            throw new Error(`Expected to not be SFVC when not matching SFVC dimensions.`);
        }
    });

    it('should return false if device is supported but innerHeight does not match SFVC dimensions and scale is 1 for iOS 15', () => {
        window.navigator.userAgent = 'iPhone OS 15_2';
        window.outerHeight = 926;
        window.innerHeight = 740;
        window.innerWidth = 428;
        window.screen = {
            width:      428
        };

        const sfvc = isSFVC();
        if (sfvc) {
            throw new Error(`Expected to not be SFVC when not matching SFVC dimensions.`);
        }
    });
});
