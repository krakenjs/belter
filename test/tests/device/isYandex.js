/* @flow */

import { isYandex } from '../../../src/device';

describe('isYandex', () => {
    it('should be truthy for valid Yandex user agent', () => {
        const ua = 'Mozilla/5.0 (iPad; CPU OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 YaBrowser/21.11.1.882.11 Mobile/15E148 Safari/604.1';
        const result = isYandex(ua);

        if (!result) {
            throw new Error('Expected isYandex() to be truthy.');
        }
    });

    it('should be falsy for invalid Yandex user agent', () => {
        const ua = 'Mozilla/5.0 (iPad; CPU OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
        const result = isYandex(ua);

        if (result) {
            throw new Error('Expected isYandex() to be falsy.');
        }
    });
});
