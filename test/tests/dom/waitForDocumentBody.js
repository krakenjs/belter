/* @flow */

import { waitForDocumentBody } from '../../../src/dom';
import { memoize } from '../../../src/util';

describe('waitForDocumentReady cases', () => {
    const oldBody = document.body;
    const testBody = document.createElement('body');

    beforeEach(memoize.clear);

    afterEach(() => {
        document.body = oldBody;
    });
    it('should resolve when body is present', async () => {
        try {
            document.readyState = 'complete';
            document.body = testBody;
            await waitForDocumentBody();
        } catch (err) {
            throw new Error('Expected waitForDocumentReady to resolve');
        }
    });

    it('should eventully resolve when document is ready', async () => {
        try {
            document.readyState = 'loading';
            document.body = null;

            setTimeout(() => {
                document.readyState = 'complete';
                document.body = testBody;
            }, 20);

            await waitForDocumentBody();
        } catch (err) {
            throw new Error(
                `Expected waitForDocumentReady to eventully resolve when document is ready: ${ err.message }`
            );
        }
    });
});
