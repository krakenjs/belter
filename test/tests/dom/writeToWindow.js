/* @flow */

import { writeToWindow, writeElementToWindow } from '../../../src';

describe('writeToWindow cases', () => {
    let windowClone;

    beforeEach(() => {
        windowClone = { ...window };
    });

    it('should write string element to window', () => {
        writeToWindow(windowClone, '<div id="test-container"></div>');
        const tagName = window.document.getElementById('test-container')?.tagName.toLocaleLowerCase();

        if (tagName !== 'div') {
            throw new Error(`should find inserted div tag, but got: ${ tagName }`);
        }
    });

    it('should fail writing element to window and set execution in window.location', () => {
        const html = '<div id="test-container"></div>';
        const expectedMessage = `javascript: document.open(); document.write(${ JSON.stringify(html) }); document.close();`;
        windowClone.document.open = () => {
            throw new Error('unknown error');
        };

        writeToWindow(windowClone, html);

        if (!windowClone.location.startsWith(expectedMessage)) {
            throw new Error(`should has location starting with "${ expectedMessage }", but got: ${ windowClone.location }`);
        }
    });

    it('should throw an exception writing a non html element', () => {
        const expectedErrorMessage = 'Expected element to be html, got p';

        try {
            writeElementToWindow(windowClone, windowClone.document.createElement('p'));
        } catch (err) {
            if (!err.message.startsWith(expectedErrorMessage)) {
                throw new Error(`should throw error message starting with "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
    });

    it('should insert the document into the window', () => {
        const element = windowClone.document.createElement('html');
        const divElement = windowClone.document.createElement('div');

        divElement.id = 'test-id';
        element.appendChild(divElement);
        writeElementToWindow(windowClone, element);

        const divFromDocument = windowClone.document.getElementById('test-id');

        if (!divFromDocument) {
            throw new Error('should found a div element');
        }
    });
});
