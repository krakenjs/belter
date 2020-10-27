/* @flow */

import { waitForDocumentReady } from '../../../src/dom';

describe('waitForDocumentReady cases', () => {
    it('should resolve when document is interactive', async () => {
        try {
            document.readyState = 'interactive';
            await waitForDocumentReady();
        } catch (err) {
            throw new Error('Expected waitForDocumentReady to resolve');
        }
    });

    it('should eventully resolve when document is ready', async () => {
        try {
            document.readyState = 'loading';

            setTimeout(() => {
                document.readyState = 'complete';
            }, 20);

            // the argument 'test' is passed in just to bust the cache, as the function is memoized
            await waitForDocumentReady('test');
        } catch (err) {
            throw new Error(
                `Expected waitForDocumentReady to eventully resolve when document is ready: ${ err.message }`
            );
        }
    });
});
