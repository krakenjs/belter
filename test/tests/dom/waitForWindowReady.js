/* @flow */

import { waitForWindowReady } from '../../../src/dom';

describe('waitForWindowReady function', () => {
    const oldState = document.readyState;
    afterEach(() => {
        document.readyState = oldState;
    });

    it('should resolve when window is ready', async () => {
        try {
            document.readyState = 'complete';
            await waitForWindowReady();
        } catch (err) {
            throw new Error('Expected waitForWindowReady to be resolved');
        }
    });

    it('should resolve even when window not ready', async () => {
        try {
            document.readyState = 'loading';
            await waitForWindowReady();
        } catch (err) {
            throw new Error('Expected waitForWindowReady to be resolved');
        }
    });
});
