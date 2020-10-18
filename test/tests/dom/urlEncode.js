/* @flow */

import { urlEncode } from '../../../src';

describe('url encode cases', () => {
    it('should encode a valid url', () => {
        const url = 'https://example.com/search?q=foo+bar&p=fizz#';
        const result = urlEncode(url);
        const expectedResult =
      'https://example.com/search%3Fq=foo%2Bbar%26p=fizz%23';

        if (result !== expectedResult) {
            throw new Error(
                `Expected result to equal ${ expectedResult }, got ${ result }`
            );
        }
    });
});
