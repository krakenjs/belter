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

before(() => {
    const body = document.body;
    
    customElements.define('custom-web-component', customWebComponent);
    customElements.define('custom-wrapper', customWebWrapper);

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
            throw new Error(`should have returned '[object ShadowRoot]', gotten ${ result.toString() }`);
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
            if (!error.message.match(/Element is not in shadow dom/i)) {
                throw new Error(`should have thrown 'Element is not in shadow dom' exception, gotten: ${ error.message }`);
            }
        }

    });

    it('should throw exception if Host element is also in shadow dom', () => {
        const body = document.body;
        
        if (!body) {
            throw new Error('Body not found');
        }

        // TestCase components setup
        const customWrapper = document.createElement('custom-wrapper');
        customWrapper.setAttribute('id', 'custom-wrapper');

        const customComponent = document.createElement('second-custom-web-component');
        customComponent.setAttribute('id', 'shadow-host');

        // Get the div within custom-wrapper that will be used as inner host for a new shadow DOM
        const hostDiv =  customWrapper.shadowRoot?.querySelector('#inner-host-div');

        const nestedShadow = hostDiv?.attachShadow({ mode: 'open' });
        const innerSpan = document.createElement('span');
        innerSpan.setAttribute('id', 'inner-span');
        // $FlowFixMe
        nestedShadow.appendChild(innerSpan);
        // $FlowFixMe
        customWrapper.appendChild(customComponent);

        /**
         * At this point the HTML structure looks like this:
         * <html>
         *    ...
         *    <custom-wrapper>
         *         #shadow-root (open)
         *           <div id="wrapper-div">
         *              #shadow-root (open)
         *                <span id="inner-span"></span>
         *           </div>
         *    </custom-wrapper>
         * </html>
         */
         

        try {
            insertShadowSlot(innerSpan);
        } catch (error) {
            if (!error.message.match(/Host element is also in shadow dom/)) {
                throw new Error(`should have thrown 'Host element is also in shadow dom' exception, gotten '${ error.message }'`);
            }
        }
    });


    it('should return slotProvider ', () => {
        const innerElement = document.querySelector('custom-web-component')?.shadowRoot?.querySelector('#inner-span');
        
        if (!innerElement) {
            throw new Error('unable to find inner element');
        }

        const result = insertShadowSlot(innerElement);

        if (!result) {
            throw new Error('should have returned an element, gotten undefined');
        }

        if (!result?.getAttribute('slot')?.match(/shadow-slot-/i)) {
            throw new Error('should have returned an valid slot element');
        }
    });
});
