/* @flow */

import { waitForDocumentReady } from '../../../src/dom';
import { memoize } from '../../../src/util';

describe('waitForDocumentReady cases', () => {
    beforeEach(memoize.clear);
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

            await waitForDocumentReady();
        } catch (err) {
            throw new Error(
                `Expected waitForDocumentReady to eventully resolve when document is ready: ${ err.message }`
            );
        }
    });
});
