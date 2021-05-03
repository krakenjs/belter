// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */

/* @flow */

import { isShadowElement, getShadowRoot, getShadowHost, insertShadowSlot } from '../../../src';


before(() => {
    const body = document.body;
    
    customElements.define('custom-web-component', class extends HTMLElement {
        constructor() {
            super();
            const shadowHost = this.attachShadow({ mode: 'open' });
            const shadowDOMContainer = document.createElement('div');
            const testSpan = document.createElement('span');
            testSpan.setAttribute('id', 'inner-span');
            testSpan.textContent = 'text from custom web component';
            // Append it to the shadow root
            shadowDOMContainer.appendChild(testSpan);
            shadowHost.appendChild(shadowDOMContainer);
        }
    });

    if (!body) {
        throw new Error('Body not found');
    }
    
    const customElement = document.createElement('custom-web-component');
    body.appendChild(customElement);

    if (!customElement || !customElement.shadowRoot) {
        throw new Error('custom element does not have shadow root');
    }

});

describe('isShadowElement cases', () => {
  
    it('should return true if parent node is shadow root',  () => {
        const innerElement = document.querySelector('custom-web-component')?.shadowRoot?.querySelector('#inner-span');

        if (!innerElement) {
            throw new Error('there is not inner element');
        }
        
        const result = isShadowElement(innerElement);

        if (!result) {
            throw new Error(`Expected result to be true, got ${ String(result) }`);
        }
    });

    it('should return false if parent node is not shadow root', () => {
        const testElement = document.createElement('div');
        const result = isShadowElement(testElement);

        if (result) {
            throw new Error(`Expected result to be false, got ${ String(result) }`);
        }
    });
});

describe('getShadowRoot cases', () => {
    it('should return shadow root host', () => {
        const innerElement = document.querySelector('custom-web-component')?.shadowRoot?.querySelector('#inner-span');

        if (!innerElement) {
            throw new Error('there is not inner element');
        }
        const result = getShadowRoot(innerElement);

        if (!result) {
            throw new Error(`should have returned innerElement`);
        }

        if (!result.toString() === '[object ShadowRoot]') {
            throw new Error(`should have returned '[object ShadowRoot]', gotten ${ result.toString() }`);
        }
        
    });
});

describe('getShadowHost cases', () => {
    it('should return shadow host if exists', () => {
        const innerElement = document.querySelector('custom-web-component')?.shadowRoot?.querySelector('#inner-span');

        if (!innerElement) {
            throw new Error('there is not inner element');
        }

        const result = getShadowHost(innerElement);
        
        if (!result) {
            throw new Error(`should have returned the inner element, but gotten undefined`);
        }

        const hostId = result.getAttribute('id');

        if (hostId && hostId !== 'shadow-host') {
            throw new Error(`should have returned> shadow-host but gotten ${ hostId }`);
        }

    });
});

describe('insertShadowSlot cases', () => {
    it('should throw exception if element is not in shadow DOM', () => {
        const testElement = document.createElement('div');

        try {
            insertShadowSlot(testElement);
        } catch (error) {
            console.log(error.message);
            if (!error.message.match(/Element is not in shadow dom/i)) {
                throw new Error(`should have thrown 'Element is not in shadow dom' exception, gotten: ${ error.message }`);
            }
        }

    });

    // don't know how to test it
    it.skip('should throw exception if Host element is also in shadow dom', () => {
        const innerElement = document.querySelector('custom-web-component')?.shadowRoot?.querySelector('#inner-span');
        
        if (!innerElement) {
            throw new Error('there is not inner element');
        }
        
        const shadowHost = getShadowHost(innerElement);

        if (!shadowHost) {
            throw new Error('there is not shadow host');
        }

        try {
            insertShadowSlot(shadowHost);
        } catch (error) {
            if (!error.message.match(/Host element is also in shadow dom/)) {
                throw new Error(`should have thrown 'Host element is also in shadow dom' exception, gotten '${ error.message }'`);
            }
        }
    });

    
    it.skip('should return slotProvider ');
});
