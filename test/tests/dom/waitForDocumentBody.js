/* @flow */

import { waitForDocumentBody } from '../../../src/dom';
import { memoize } from '../../../src/util';

describe('waitForDocumentBody cases', () => {
    // eslint-disable-next-line compat/compat
    const oldBody = document.body;
    const testBody = document.createElement('body');

    beforeEach(memoize.clear);

    afterEach(() => {
        // eslint-disable-next-line compat/compat
        document.body = oldBody;
    });

    it('should resolve when body is present', async () => {
        document.readyState = 'complete';
        // eslint-disable-next-line compat/compat
        document.body = testBody;
        const result = await waitForDocumentBody();

        if (result !== testBody) {
            throw new Error('Expected result to be the same as testBody');
        }
    });

    it('should eventually resolve when document is ready', async () => {
        document.readyState = 'loading';
        // eslint-disable-next-line compat/compat
        document.body = null;

        setTimeout(() => {
            document.readyState = 'complete';
            // eslint-disable-next-line compat/compat
            document.body = testBody;
        }, 20);

        const result = await waitForDocumentBody();

        if (result !== testBody) {
            throw new Error('Expected result to be the same as testBody');
        }
    });
});
