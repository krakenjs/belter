/* @flow */

import { isDocumentReady } from '../../../src/dom';

describe('isDocumentReady cases', () => {
    it('should return false when document is not ready', () => {
        const oldState = document.readyState;
        let readyState = 'loading';
        // since document.readyState is only a readonly property, we are creating a mock property
        // this allows us to switch readyState between 'loading', 'complete' and 'interactive'
        Object.defineProperty(document, 'readyState', {
            get() : string {
                return readyState;
            },

            set(newState : string) {
                readyState = newState;
            }
        });

        const result = isDocumentReady();
        document.readyState = oldState;

        if (result) {
            throw new Error(`Expected result to be false, got ${ result }`);
        }
    });

    it('should return true when document is ready', () => {
        const result = isDocumentReady();

        if (!result) {
            throw new Error(`Expected result to be true, got ${ result }`);
        }
    });
});
