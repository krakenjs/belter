/* @flow */

import { isChrome } from '../../../src/device';

describe('isChrome', () => {
    it('should return true when userAgent contains Chrome', () => {
        
        window.navigator.userAgent = 'Chrome';
        const bool = isChrome();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent contains Chromium', () => {
        
        window.navigator.userAgent = 'Chromium';
        const bool = isChrome();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent contains CriOS', () => {
        
        window.navigator.userAgent = 'CriOS';
        const bool = isChrome();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent is invalid', () => {
        
        window.navigator.userAgent = 'p0tatO';
        const bool = isChrome();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });

    describe('user agents other than chrome', () => {
        const ineligibleUserAgents = [
            'Mozilla/5.0 (Android 4.4; Mobile; rv:70.0) Gecko/70.0 Firefox/70.0', // Firefox - Android mobile
            'Mozilla/5.0 (Android 4.4; Tablet; rv:70.0) Gecko/70.0 Firefox/70.0', // Firefox - Android tablet
            'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4', // Firefox - iPhone
            'Mozilla/5.0 (iPad; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4', // Firefox - iPad
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 EdgiOS/44.5.0.10 Mobile/15E148 Safari/604.1', // Microsoft Edge - iPhone
            'Mozilla/5.0 (Linux; Android 8.1.0; Pixel Build/OPM4.171019.021.D1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.109 Mobile Safari/537.36 EdgA/42.0.0.2057', // Microsoft Edge - Android mobile
            'Opera/12.02 (Android 4.1; Linux; Opera Mobi/ADR-1111101157; U; en-US) Presto/2.9.201 Version/12.02', // Opera - Android mobile
            'Opera/9.80 (iPhone; Opera Mini/8.0.0/34.2336; U; en) Presto/2.8.119 Version/11.10', // Opera mini - iOS
            'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/15.0 Chrome/90.0.4430.210 Mobile Safari/537.36', // Samsung 15
            'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.2 Chrome/71.0.3578.99 Mobile Safari/537.36', // Samsung 10.2
            'Mozilla/5.0 (Linux; Android 7.0; SAMSUNG SM-G610M Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/7.4 Chrome/59.0.3071.125 Mobile Safari/537.36', // Samsung 7.4
            'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/15.0 Chrome/90.0.4430.210 Mobile Safari/537.36' // Samsung 15
        ];
        for (const userAgent of ineligibleUserAgents) {
            it(`should return false when userAgent is ${ userAgent } `, () => {
                // eslint-disable-next-line compat/compat
                window.navigator.userAgent = userAgent;
                const bool = isChrome();
                if (bool) {
                    throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
                }
            });
        }
    });
});
