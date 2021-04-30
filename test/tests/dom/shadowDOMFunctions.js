
/* @flow */

import { isShadowElement } from '../../../src';

const body = document.body;

before(() => {
    customElements.define('custom-web-component', class extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const text = document.createElement('span');
            text.textContent = 'test';
            // Append it to the shadow root
            shadow.appendChild(text);
        }
    });

    if (!body) {
        throw new Error('Body not found');
    }
    
    const customComponent = document.createElement('custom-web-component');
    body.appendChild(customComponent);
});

describe('isShadowElement cases', () => {
  
    it('should return true if parent node is shadow root',  () => {
        
        const nestedElement = document.querySelector('custom-web-component');
        
        if (!nestedElement || !nestedElement.shadowRoot) {
            throw new Error('shadow root');
        }

        nestedElement.shadowRoot.querySelector('span');

        const result = isShadowElement(nestedElement);

        if (!result) {
            throw new Error(`Expected result to be true, got ${ String(result) }`);
        }
    });

    it('should return false if parent node is not shadow root');
});

describe('getShadowRoot cases', () => {
    it('should return shadow root host');
});

describe('getShadowHost cases', () => {
    it('should return shadow host');
});

describe('insert shadow slots cases', () => {
    it('should throw exception if element is no in shadow DOM');
    it('should throw exception if HOST ELEMENT is in shadow DOM');
    it('should return slotProvider ');
});
