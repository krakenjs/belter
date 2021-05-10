/* @flow */
import { isShadowElement, getShadowRoot, getShadowHost, insertShadowSlot } from '../../../src';

// This component is needed for testing the case when shadowRoot and shadowDOM are the same
const customWebWrapper = class extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const shadowDOMContainer = document.createElement('div');
        shadowDOMContainer.setAttribute('id', 'inner-host-div');
        shadowRoot.appendChild(shadowDOMContainer);
    }
};

const customWebComponent = class extends HTMLElement {
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
};

customElements.define('custom-web-component', customWebComponent);
customElements.define('custom-wrapper', customWebWrapper);

describe('Web components', () => {

    beforeEach(() => {
        if (!document?.body) {
            throw new Error('Body not found');
        }
        
        const customElement = document.createElement('custom-web-component');

        // Clean the DOM
        if (document.body) {
            document.body.innerHTML = '';
            document.body.appendChild(customElement);
        }

    
        if (!customElement || !customElement.shadowRoot) {
            throw new Error('custom element does not have shadow root');
        }
    
    });

    describe('isShadowElement cases', () => {
  
        it('should return true if parent node is shadow root',  () => {
            const innerElement = document.querySelector('custom-web-component')?.shadowRoot?.querySelector('#inner-span');
    
            if (!innerElement) {
                throw new Error('unable to find inner element');
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
                throw new Error('unable to find inner element');
            }
            const result = getShadowRoot(innerElement);
    
            if (!result) {
                throw new Error(`should have returned innerElement`);
            }
    
            if (!result.toString() === '[object ShadowRoot]') {
                throw new Error(`should have returned '[object ShadowRoot]', got ${ result.toString() }`);
            }
            
        });
    });
    
    describe('getShadowHost cases', () => {
        it('should return shadow host if exists', () => {
            const innerElement = document.querySelector('custom-web-component')?.shadowRoot?.querySelector('#inner-span');
    
            if (!innerElement) {
                throw new Error('unable to find inner element');
            }
    
            const result = getShadowHost(innerElement);
            
            if (!result) {
                throw new Error(`should have returned the inner element, got undefined`);
            }
    
            const hostId = result.getAttribute('id');
    
            if (hostId && hostId !== 'shadow-host') {
                throw new Error(`should have returned 'shadow-host', got ${ hostId }`);
            }
    
        });
    });
    
    describe('insertShadowSlot cases', () => {
        it('should throw exception if element is not in shadow DOM', () => {
            const testElement = document.createElement('div');
            let insertShadowSlotError = '';

            try {
                insertShadowSlot(testElement);
            } catch (error) {
                insertShadowSlotError = error?.message;
            }

            if (!insertShadowSlotError.match(/Element is not in shadow dom/i)) {
                throw new Error(`should have thrown 'Element is not in shadow dom' exception, got: ${ insertShadowSlotError }`);
            }
    
        });
    
        it('should return slotProvider ', () => {
            const innerElement = document.querySelector('custom-web-component')?.shadowRoot?.querySelector('#inner-span');
            
            if (!innerElement) {
                throw new Error('unable to find inner element');
            }
    
            const result = insertShadowSlot(innerElement);
    
            if (!result) {
                throw new Error('should have returned an element, got undefined');
            }
    
            if (!result?.getAttribute('slot')?.match(/shadow-slot-/i)) {
                throw new Error('should have returned a valid slot element');
            }
        });

        it('should return a nested slotProvider ', () => {
            // TestCase components setup
            const customWrapper = document.createElement('custom-wrapper');
            customWrapper.setAttribute('id', 'custom-wrapper-id');
    
            const customComponent = document.createElement('custom-web-component');
            customComponent.setAttribute('id', 'custom-component-id');
    
            const innerSpan = document.createElement('span');
            innerSpan.setAttribute('id', 'inner-span');
            
            const customComponentShadowRoot = customComponent.shadowRoot;
            const customWrapperShadowRoot = customWrapper.shadowRoot;
            
            if (customComponentShadowRoot) {
                customComponentShadowRoot.appendChild(innerSpan);
            }

            if (customWrapperShadowRoot) {
                customWrapperShadowRoot.appendChild(customComponent);
            }

            if (document.body) {
                document.body.appendChild(customWrapper);
            }

            /**
             * At this point the HTML structure looks like this:
             * <html>
             *    ...
             *    <custom-wrapper id="custom-wrapper-id">
             *         #shadow-root (open)
             *           <custom-web-component id="custom-component-id">
             *              #shadow-root (open)
             *                <span id="inner-span"></span>
             *           </custom-web-component>
             *    </custom-wrapper>
             * </html>
             */

            const slotProvider =  insertShadowSlot(innerSpan);

            if (!slotProvider) {
                throw new Error('should have returned an element, got undefined');
            }
    
            if (!slotProvider?.getAttribute('slot')?.match(/shadow-slot-/i)) {
                throw new Error('should have returned a valid slot element');
            }
        });
    });
});
