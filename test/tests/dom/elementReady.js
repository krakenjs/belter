/* @flow */

import { elementReady } from '../../../src';

describe('dom elementReady cases', () => {
    it('elementReady should be ready', () => {
        const element = document.createElement('div');

        element.id = 'test-id';
        elementReady(element)
            .then(result => {
                // $FlowFixMe[prop-missing]
                if (result?.getAttribute('id') !== element.id) {
                    throw new Error('should be ready the element');
                }
            });
    });

    it('elementReady should throw an error if the element was not found', () => {
        const expectedErrorMessage = 'Document is ready and element';
        const error = new Error(`should throw and error starting with : ${ expectedErrorMessage }`);

        elementReady('mock-id')
            .then(() => {
                throw error;
            })
            .catch(err => {
                // $FlowFixMe[incompatible-use]
                if (!err.message.startsWith(expectedErrorMessage)) {
                    throw error;
                }
            });
    });
});
