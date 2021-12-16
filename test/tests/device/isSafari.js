/* @flow */

import { isSafari } from '../../../src/device';

describe('isSafari', () => {
    it('should return true when userAgent contains Safari and isChrome function returns false', () => {
        
        window.navigator.userAgent = 'Safari';
        const bool = isSafari();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent contains Safari and isChrome function returns true', () => {
        
        window.navigator.userAgent = 'SafariChrome';
        const bool = isSafari();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT contain Safari', () => {
        
        window.navigator.userAgent = 'potato';
        const bool = isSafari();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });

    describe('user agents other than chrome', () => {
        const ineligibleUserAgents = [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4', // Firefox - iPhone
            'Mozilla/5.0 (iPad; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4', // Firefox - iPad
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 EdgiOS/44.5.0.10 Mobile/15E148 Safari/604.1' // Microsoft Edge - iPhone
        ];
        for (const userAgent of ineligibleUserAgents) {
            it(`should return false when userAgent is ${ userAgent } `, () => {
                window.navigator.userAgent = userAgent;
                const bool = isSafari();
                if (bool) {
                    throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
                }
            });
        }
    });
});
