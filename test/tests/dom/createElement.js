/* @flow */

import { createElement, iframe } from '../../../src';

describe('createElement cases', () => {
    it('createElement should get a new element', () => {
        const container = window.document.createElement('div');
        const element = createElement('div', {
            id:         'test',
            attributes: { 'data-link': 'test-value' },
            class:      [ 'classOne', 'classTwo' ],
            html:       '<p>text</p>',
            style:      { color: 'red' },
            styleSheet: 'font-size: 16px'
        }, container);

        
        if (element.id !== 'test') {
            throw new Error(`should get the created element id, but got: ${ element.id }`);
        }
    });

    it('createElement should throw and error when iframe has empty contentWindow', () => {
        const expectedErrorMessage = 'Iframe html can not be written unless container provided and iframe in DOM';
        const container = window.document.createElement('div');

        try {
            createElement('iframe', {
                id:   'test',
                html: '<span>text</span>'
            }, container);
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
    });

    it('createElement should get a new iframe element', () => {
        const expectedErrorMessage = 'Iframe html can not be written unless container provided and iframe in DOM';
        const container = window.document.createElement('div');

        try {
            createElement('iframe', {
                id:   'test',
                html: '<span>text</span>'
            }, container);
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
    });

    it('iframe should create the element in a container', () => {
        const userAgentCopy = window.navigator.userAgent;

        window.navigator.userAgent = 'Mozilla/5.0';
        const container = window.document.createElement('div');

        const frame = iframe({
            class:      [ 'classOne' ],
            attributes: { 'data-link': 'test-value' },
            style:      { color: 'red' },
            styleSheet: 'font-size: 16px',
            url:        window.location.href
        }, container);

        if (frame.src !== window.location.href) {
            throw new Error(`should get the iframe src`);
        }
        window.navigator.userAgent = userAgentCopy;
    });
});
