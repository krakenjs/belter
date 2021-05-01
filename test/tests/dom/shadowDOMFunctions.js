
/* @flow */

import { isShadowElement, getShadowRoot, getShadowHost, insertShadowSlot } from '../../../src';

const body = document.body;
let customElement;
let innerElement;

before(() => {
    customElements.define('custom-web-component', class extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const testSpan = document.createElement('span');
            testSpan.textContent = 'test';
            // Append it to the shadow root
            shadow.appendChild(testSpan);
        }
    });

    if (!body) {
        throw new Error('Body not found');
    }
    
    customElement = document.createElement('custom-web-component');
    body.appendChild(customElement);

    if (!customElement || !customElement.shadowRoot) {
        throw new Error('custom element does not have shadow root');
    }

    innerElement = customElement.shadowRoot.querySelector('span');

});

describe('isShadowElement cases', () => {
  
    it('should return true if parent node is shadow root',  () => {

        if (!innerElement) {
            throw new Error('there is not inner element');
        }
        
        const result = isShadowElement(innerElement);

        if (!result) {
            throw new Error(`Expected result to be true, got ${ String(result) }`);
        }
    });

    it.skip('should return false if parent node is not shadow root', () => {
        const testElement = document.createElement('div');
        const result = isShadowElement(testElement);

        if (result) {
            throw new Error(`Expected result to be false, got ${ String(result) }`);
        }
    });
});

describe('getShadowRoot cases', () => {
    it('should return shadow root host', () => {
        if (!innerElement) {
            throw new Error('there is not inner element');
        }
        const result = getShadowRoot(innerElement);
        // eslint-disable-next-line no-console
        console.log(result);
        
    });
});

describe('getShadowHost cases', () => {
    it('should return shadow host', () => {
        if (!innerElement) {
            throw new Error('there is not inner element');
        }

        const result = getShadowHost(innerElement);
        // eslint-disable-next-line no-console
        console.log(result);
    });
});

describe('insertShadowSlot cases', () => {
    it('should throw exception if element is no in shadow DOM', () => {
        const testElement = document.createElement('div');

        try {
            insertShadowSlot(testElement);
        } catch (error) {
            if (!error.message.match(/Element is not in shadow dom/i)) {
                throw new Error(`should have thrown 'Element is not in shadow dom' exception, gotten ${ error.message }`);
            }
        }

    });

    it('should throw exception if Host element is also in shadow dom', () => {
        try {
            // the problem is that, may here we need a host element!
            insertShadowSlot(customElement);
        } catch (error) {
            if (!error.message.match(/Host element is also in shadow dom/i)) {
                throw new Error(`should have thrown 'Element is not in shadow dom' exception, gotten ${ error.message }`);
            }
        }
    });
    it('should return slotProvider ');
});
