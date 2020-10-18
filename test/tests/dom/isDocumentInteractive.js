/* @flow */

import { isDocumentInteractive } from '../../../src';

describe('document interactive cases', () => {
    it('should return false when document is not interactive', () => {
    // document.readyState will be equal to 'complete' as it was set to be in the last test
        const result = isDocumentInteractive();

        if (result) {
            throw new Error(`Expected result to be true, got ${ result }`);
        }
    });

    it('should return true when document is interactive', () => {
        const oldState = document.readyState;
        // document.readyState is a readonly property, we are using the 'set(ter)' from the last test to change readyState
        document.readyState = 'interactive';

        const result = isDocumentInteractive();
        document.readyState = oldState;

        if (!result) {
            throw new Error(`Expected result to equal true, got ${ result }`);
        }
    });
});
