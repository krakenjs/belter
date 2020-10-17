/* @flow */

import { isDocumentInteractive } from '../../../src';

describe('document interactive cases', () => {
    it('should return a boolean', () => {
        const result = isDocumentInteractive();

        if (typeof result !== 'boolean') {
            throw new TypeError(`Expected result to equal boolean, got ${ result }`);
        }
    });
});
