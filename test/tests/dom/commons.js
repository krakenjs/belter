/* @flow */

import {
    redirect, submitForm, getBrowserLocales,
    hasMetaViewPort, isElementVisible, getPerformance,
    enablePerformance, htmlEncode, isBrowser, querySelectorAll,
    onClick, getScript, appendChild, setStyle, addEventListener,
    bindEvents, setVendorCSS, makeElementVisible, makeElementInvisible,
    showElement, hideElement, destroyElement, showAndAnimate,
    addClass, removeClass, isElementClosed, fixScripts, isShadowElement,
    getStackTrace
} from '../../../src';

describe('dom commons cases', () => {
    let element;

    beforeEach(() => {
        element = window.document.createElement('div');
    });

    it('redirect', async () => {
        const expectedUrl = '#https://www.mio.com';
        const customWindow = {
            location: 'test'
        };
        // $FlowFixMe[prop-missing]
        await redirect(expectedUrl, customWindow);
        if (customWindow.location !== expectedUrl) {
            throw new Error(`should redirect to "${ expectedUrl }", but got: ${ String(customWindow.location) }`);
        }
    });

    it('submitForm should submit form and delete it', () => {
        submitForm({
            url:    'https://www.paypal.com',
            target: '_self',
            body:   {
                name:  'jhon',
                value: '10'
            }
        });
    });

    it('hasMetaViewPort should be "true" when browser is not in a device', () => {
        window.navigator.mockUserAgent = 'Mozilla/5.0';
        const result = hasMetaViewPort();
        
        if (result.toString() !== 'true') {
            throw new Error(`should return value "true", but got: ${ String(result) }`);
        }
    });

    it('hasMetaViewPort should be "false" when browser is a device and meta tag is not available in the DOM', () => {
        window.navigator.mockUserAgent = 'Mozilla/5.0';
        const result = hasMetaViewPort();
        
        if (result.toString() !== 'true') {
            throw new Error(`should return value "true", but got: ${ String(result) }`);
        }
    });

    it('isElementVisible', () => {
        const customDiv = document.createElement('div');
        // eslint-disable-next-line compat/compat
        document.body?.appendChild(customDiv);
        const result = isElementVisible(customDiv);

        if (result.toString() !== 'true') {
            throw new Error(`should return value "true", but got: ${ String(result) }`);
        }
    });

    it('getPerformance', () => {
        const performance = getPerformance();

        if (!performance) {
            throw new Error(`should get the performance from the window context, but got: ${ String(performance) }`);
        }
    });

    it('enablePerformance', () => {
        const result = enablePerformance();

        if (result.toString() !== 'true') {
            throw new Error(`should get the value "true", but got: ${ String(result) }`);
        }
    });

    it('htmlEncode', () => {
        const expectedResult = '&amp;&lt;&gt;&quot;&#39;&#x2F;';
        const result = htmlEncode(`&<>"'/`);

        if (result !== expectedResult) {
            throw new Error(`should get the value "${ expectedResult }", but got: ${ String(result) }`);
        }
    });

    it('isBrowser', () => {
        const result = isBrowser();

        if (result.toString() !== 'true') {
            throw new Error(`should get the value "true", but got: ${ String(result) }`);
        }
    });

    it('querySelectorAll', () => {
        const result = querySelectorAll('meta[name=viewport]');

        if (result.length < 1 || result[0].getAttribute('name') !==  'viewport') {
            throw new Error(`should found the HTMLMetaElement with name "viewport", but got: ${ String(result) }`);
        }
    });

    it('onClick', () => {
        let click;
        const elementInput = document.createElement('input');

        onClick(elementInput, () => {
            click = 'click';
        });
        // HACK: create a keypress event to test it
        const ev = document.createEvent('Events');
        ev.initEvent('keypress', true, true);
        // $FlowFixMe[prop-missing]
        ev.keyCode = 13;
        elementInput.dispatchEvent(ev);

        if (click !== 'click') {
            throw new Error(`should attach the onClick event to the element`);
        }
    });

    it('getScript', () => {
        const script = document.createElement('script');
        const scriptNoSrc = document.createElement('script');

        script.src = `${ window.location.host }/js`;
        // eslint-disable-next-line compat/compat
        document.body?.appendChild(script);
        // eslint-disable-next-line compat/compat
        document.body?.appendChild(scriptNoSrc);
        const result = getScript({ path: '/js', reverse: true });

        if (result?.getAttribute('src') !== `localhost:${ window.location.port }/js`) {
            throw new Error(`should found the HTMLMetaElement with name "viewport", but got: ${ String(result) }`);
        }
        script.remove();
        scriptNoSrc.remove();
    });

    it('appendChild', () => {
        const sourceElement = document.createElement('div');
        const childElement = document.createElement('p');

    
        appendChild(sourceElement, childElement);
        const tagChild = sourceElement.children[0].tagName;

        if (tagChild === 'p') {
            throw new Error(`should get a child element "p", but got: ${ tagChild }`);
        }
    });

    it('getBrowserLocales', () => {
        window.navigator.language = 'us-US';
        // eslint-disable-next-line compat/compat
        window.navigator.languages = [ '*' ];
        window.navigator.userLanguage = 'es';
        const result = getBrowserLocales();

        if (result[0].country !== 'US' || result[0].lang !== 'us') {
            throw new Error(`should get the browser language, but got: ${ JSON.stringify(result) }`);
        }
        Reflect.deleteProperty(window.navigator, 'language');
        Reflect.deleteProperty(window.navigator, 'userLanguage');
    });

    it('setStyle should set styleSheet property of the element', () => {
        element.styleSheet = {
            cssText: ''
        };

        setStyle(element, 'color: red');
        if (element.styleSheet.cssText !== 'color: red') {
            throw new Error(`should modify the element style to "color: red", but got: ${ element.style.color }`);
        }
    });

    it('setStyle should set it as child element', () => {
        const elementStyle = document.createElement('style');

        setStyle(elementStyle, 'color: red');
        if (elementStyle.innerHTML !== 'color: red') {
            throw new Error(`should get the child "color: red", but got: ${ String(elementStyle.innerHTML) }`);
        }
    });

    it('addEventListener', () => {
        let click = false;
        const elementBtn = document.createElement('button');

        const event = addEventListener(elementBtn, 'click',  () => {
            click = true;
        });
        
        elementBtn.click();
        event.cancel();

        if (!click) {
            throw new Error('should call element event handler');
        }
    });

    it('bindEvents', () => {
        let click = false;
        const elementBtn = document.createElement('button');

        const event = bindEvents(elementBtn, [ 'click' ],  () => {
            click = true;
        });
        
        elementBtn.click();
        event.cancel();

        if (!click) {
            throw new Error('should call element event handler');
        }
    });

    it('setVendorCSS', () => {
        setVendorCSS(element, 'color', 'red');

        if (element.style.color !== 'red') {
            throw new Error(`should have the color style "red", but got: ${ element.style.color }`);
        }
    });

    it('makeElementVisible', () => {
        makeElementVisible(element);

        if (element.style.visibility !== '') {
            throw new Error(`should have the visibility style, but got: ${ element.style.visibility }`);
        }
    });

    it('makeElementInvisible', () => {
        makeElementInvisible(element);

        if (element.style.visibility !== 'hidden') {
            throw new Error(`should have the visibility style "hidden", but got: ${ element.style.visibility }`);
        }
    });

    it('showElement', () => {
        showElement(element);

        if (element.style.display !== '') {
            throw new Error(`should have the display style, but got: ${ element.style.display }`);
        }
    });

    it('hideElement', () => {
        hideElement(element);

        if (element.style.display !== 'none') {
            throw new Error(`should have the display style "none", but got: ${ element.style.display }`);
        }
    });

    it('destroyElement', () => {
        const parent = window.document.createElement('div');

        parent.appendChild(element);
        destroyElement(element);
        
        if (parent.children.length > 0) {
            throw new Error('should destroy the child element, but got children');
        }
    });

    it('showAndAnimate', () => {
        showAndAnimate(element, 'test', () => {
            // pass
        });
        
        if (element.getAttribute('display' !== '')) {
            throw new Error('should have the property "display"');
        }
    });

    it('addClass and removeClass', () => {
        const className = 'testClass';

        addClass(element, className);
        
        if (!element.classList.contains(className)) {
            throw new Error(`should have the class name "${ className }"`);
        }

        removeClass(element, className);

        if (element.classList.contains(className)) {
            throw new Error(`should not have the class name "${ className }"`);
        }
    });

    it('isElementClosed', () => {
        const parent = window.document.createElement('div');

        parent.appendChild(element);
        // eslint-disable-next-line compat/compat
        window.document?.body.appendChild(parent);
        if (isElementClosed(element)) {
            throw new Error('should not be closed the element');
        }

        parent.remove();
        if (!isElementClosed(parent)) {
            throw new Error('should not be closed the element');
        }
    });

    it('fixScripts', () => {
        const parent = document.createElement('div');
        const script = document.createElement('script');

        fixScripts(script);

        parent.appendChild(script);
        fixScripts(parent);
    });

    it('fixScripts', () => {
        const result = isShadowElement(element);

        if (isShadowElement(element)) {
            throw new Error(`should return "false" value, but got: ${ String(result) }`);
        }
        const shadowElement = element.attachShadow({ mode: 'open' });

        if (!isShadowElement(shadowElement)) {
            throw new Error(`should return "true" value, but got: ${ String(result) }`);
        }
    });

    it('getStackTrace', () => {
        const expectedErrorMessage = 'Error: _';
        const result = getStackTrace();

        if (!result.startsWith('Error: _')) {
            throw new Error(`should throw an error message starting with "${ expectedErrorMessage }", but got: ${ expectedErrorMessage }`);
        }
    });
});
