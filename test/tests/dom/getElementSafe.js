/* @flow */

import { getElementSafe, getElement } from '../../../src';

describe('dom getElementSafe cases', () => {
    it('getElementSafe should return the same id param', () => {
        const element = document.createElement('div');

        element.id = 'test-id';
        const result = getElementSafe(element);

        if (result?.getAttribute('id') !== element.id) {
            throw new Error(`should return the same element with same attribute id, but got: ${ String(result?.getAttribute('id')) }`);
        }
    });

    it('getElement and getElementSafe should return the found element', () => {
        const element = document.createElement('div');

        element.id = 'test-id';
        // eslint-disable-next-line compat/compat
        document.body?.appendChild(element);
        const resultSafe = getElementSafe('#test-id');
        const result = getElement('#test-id');

        if (resultSafe?.getAttribute('id') !== element.id ||
            result?.getAttribute('id') !== element.id) {
            throw new Error(`should found the element by attribute id`);
        }
        element.remove();
    });

    it('getElement should thrown an error if element was not found', () => {
        const expectedErrorMessage = 'Can not find element: #test-id';
        try {
            getElement('#test-id');
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error message "${ expectedErrorMessage }"`);
            }
        }
    });
});
