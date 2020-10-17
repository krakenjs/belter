/* @flow */
import { isDocumentReady } from '../../../src/dom';

describe('isDocumentReady cases', () => {
    it('should return a boolean', () => {
        const result = isDocumentReady();

        if (typeof result !== 'boolean') {
            throw new TypeError(`Expected result to be boolean, got ${ result }`);
        }
    });
});
