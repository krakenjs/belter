/* @flow */

import { urlEncode, urlWillRedirectPage } from '../../../src';

describe('url encode cases', () => {
    const baseUrl = 'https://www.paypal.com';

    it('should encode a valid url', () => {
        const url = 'https://example.com/search?q=foo+bar&p=fizz#';
        const result = urlEncode(url);
        const expectedResult = encodeURIComponent(url);

        if (result !== expectedResult) {
            throw new Error(
                `Expected result to equal ${ expectedResult }, got ${ result }`
            );
        }
    });

    it('urlWillRedirectPage should return "true"', () => {
        [ baseUrl, 'https://www.google.com/#' ].forEach(sourceUrl => {
            const result = urlWillRedirectPage(sourceUrl);

            if (result.toString() !== 'true') {
                throw new Error(`should return the boolean "true", but got: ${ String(result) }`);
            }
        });
    });

    it('urlWillRedirectPage should return "false"', () => {
        [ '#'.concat(baseUrl), `${ window.location.href }#` ].forEach(sourceUrl => {
            const result = urlWillRedirectPage(sourceUrl);

            if (result.toString() !== 'false') {
                throw new Error(`should return the boolean "false", but got: ${ String(result) }`);
            }
        });
    });
});
