/* @flow */

import { waitForDocumentReady } from '../../../src/dom';

describe('waitForDocumentReady cases', () => {
    const oldState = document.readyState;

    afterEach(() => {
        document.readyState = oldState;
    });

    it('should eventully resolve when document is ready', async () => {
        try {
            document.readyState = 'loading';
            setTimeout(() => {
                document.readyState = 'complete';
            }, 100);
            await waitForDocumentReady();
        } catch (err) {
            throw new Error('Expected waitForDocumentReady to resolve');
        }
    });

    it('should eventully resolve when document is interactive', async () => {
        try {
            document.readyState = 'loading';
            setTimeout(() => {
                document.readyState = 'interactive';
            }, 100);
            await waitForDocumentReady();
        } catch (err) {
            throw new Error('Expected waitForDocumentReady to resolve');
        }
    });
});
