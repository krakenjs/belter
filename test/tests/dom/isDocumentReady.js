/* @flow */

import { isDocumentReady } from '../../../src/dom';

describe('isDocumentReady cases', () => {
<<<<<<< HEAD
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

=======
    const oldState = document.readyState;
  
    it('should return false when document is not ready', () => {
        document.readyState = 'loading';
>>>>>>> 602f9bc59837395d47fc3061f027fb44ae0b7245
        const result = isDocumentReady();
        document.readyState = oldState;

        if (result) {
            throw new Error(`Expected result to be false, got ${ String(result) }`);
        }
    });

    it('should return true when document is ready', () => {
<<<<<<< HEAD
        const result = isDocumentReady();

=======
        document.readyState = 'complete';
        const result = isDocumentReady();
        document.readyState = oldState;
      
>>>>>>> 602f9bc59837395d47fc3061f027fb44ae0b7245
        if (!result) {
            throw new Error(`Expected result to be true, got ${ String(result) }`);
        }
    });
});
