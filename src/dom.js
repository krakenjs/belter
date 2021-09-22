/* @flow */
/* eslint max-lines: off */
import { ZalgoPromise } from 'zalgo-promise/src';
import { linkFrameWindow, isWindowClosed, assertSameDomain,
    type SameDomainWindowType, type CrossDomainWindowType } from 'cross-domain-utils/src';
import { WeakMap } from 'cross-domain-safe-weakmap/src';

import { inlineMemoize, memoize, noop, stringify, capitalizeFirstLetter,
    once, extend, safeInterval, uniqueID, arrayFrom, ExtendableError, strHashStr } from './util';
import { isDevice } from './device';
import { KEY_CODES, ATTRIBUTES, UID_HASH_LENGTH } from './constants';
import type { CancelableType } from './types';

type ElementRefType = string | HTMLElement;

export function getBody() : HTMLBodyElement {
    // eslint-disable-next-line compat/compat
    const body = document.body;

    if (!body) {
        throw new Error(`Body element not found`);
    }

    return body;
}

export function isDocumentReady() : boolean {
    // eslint-disable-next-line compat/compat
    return Boolean(document.body) && (document.readyState === 'complete');
}

export function isDocumentInteractive() : boolean {
    // eslint-disable-next-line compat/compat
    return Boolean(document.body) && (document.readyState === 'interactive');
}

export function urlEncode(str : string) : string {
    return encodeURIComponent(str);
}

export function waitForWindowReady() : ZalgoPromise<void> {
    return inlineMemoize(waitForWindowReady, () : ZalgoPromise<void> => {
        return new ZalgoPromise(resolve => {
            if (isDocumentReady()) {
                resolve();
            }

            window.addEventListener('load', () => resolve());
        });
    });
}

type WaitForDocumentReady = () => ZalgoPromise<void>;

export const waitForDocumentReady : WaitForDocumentReady = memoize(() => {
    return new ZalgoPromise(resolve => {

        if (isDocumentReady() || isDocumentInteractive()) {
            return resolve();
        }

        const interval = setInterval(() => {
            if (isDocumentReady() || isDocumentInteractive()) {
                clearInterval(interval);
                return resolve();
            }
        }, 10);
    });
});

export function waitForDocumentBody() : ZalgoPromise<HTMLBodyElement> {
    return ZalgoPromise.try(() => {
        if (document.body) {
            return document.body;
        }

        return waitForDocumentReady().then(() => {
            if (document.body) {
                return document.body;
            }

            throw new Error('Document ready but document.body not present');
        });
    });
}

export function parseQuery(queryString : string) : Object {
    return inlineMemoize(parseQuery, () : Object => {
        const params = {};

        if (!queryString) {
            return params;
        }

        if (queryString.indexOf('=') === -1) {
            return params;
        }

        for (let pair of queryString.split('&')) {
            pair = pair.split('=');

            if (pair[0] && pair[1]) {
                params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
        }

        return params;
    }, [ queryString ]);
}


export function getQueryParam(name : string) : string {
    return parseQuery(window.location.search.slice(1))[name];
}

export function urlWillRedirectPage(url : string) : boolean {

    if (url.indexOf('#') === -1) {
        return true;
    }

    if (url.indexOf('#') === 0) {
        return false;
    }

    if (url.split('#')[0] === window.location.href.split('#')[0]) {
        return false;
    }

    return true;
}

export type Query = {
    [ string ] : boolean | string
};

export function formatQuery(obj : Query = {}) : string {

    return Object.keys(obj).filter(key => {
        return typeof obj[key] === 'string' || typeof obj[key] === 'boolean';
    }).map(key => {
        const val = obj[key];

        if (typeof val !== 'string' && typeof val !== 'boolean') {
            throw new TypeError(`Invalid type for query`);
        }

        return `${ urlEncode(key) }=${ urlEncode(val.toString()) }`;
    }).join('&');
}

export function extendQuery(originalQuery : string, props : Query = {}) : string {

    if (!props || !Object.keys(props).length) {
        return originalQuery;
    }

    return formatQuery({
        ...parseQuery(originalQuery),
        ...props
    });
}

export function extendUrl(url : string, options : {| query? : Query, hash? : Query |}) : string {

    const query = options.query || {};
    const hash = options.hash || {};

    let originalUrl;
    let originalQuery;
    let originalHash;

    [ originalUrl, originalHash ] = url.split('#');
    [ originalUrl, originalQuery ] = originalUrl.split('?');

    const queryString = extendQuery(originalQuery, query);
    const hashString = extendQuery(originalHash, hash);

    if (queryString) {
        originalUrl = `${ originalUrl }?${ queryString }`;
    }

    if (hashString) {
        originalUrl = `${ originalUrl }#${ hashString }`;
    }

    return originalUrl;
}

export function redirect(url : string, win : CrossDomainWindowType = window) : ZalgoPromise<void> {
    return new ZalgoPromise(resolve => {
        win.location = url;
        if (!urlWillRedirectPage(url)) {
            resolve();
        }
    });
}

export function hasMetaViewPort() : boolean {
    const meta = document.querySelector('meta[name=viewport]');

    if (isDevice() && window.screen.width < 660 && !meta) {
        return false;
    }

    return true;
}

export function isElementVisible(el : HTMLElement) : boolean {
    return Boolean(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

export function getPerformance() : ?Performance {
    return inlineMemoize(getPerformance, () : ?Performance => {
        const performance = window.performance;

        if (
            performance &&
            performance.now &&
            performance.timing &&
            performance.timing.connectEnd &&
            performance.timing.navigationStart &&
            (Math.abs(performance.now() - Date.now()) > 1000) &&
            (performance.now() - (performance.timing.connectEnd - performance.timing.navigationStart)) > 0
        ) {
            return performance;
        }
    });
}

export function enablePerformance() : boolean {
    return Boolean(getPerformance());
}

export function getPageRenderTime() : ZalgoPromise<?number> {
    return waitForDocumentReady().then(() => {
        const performance = getPerformance();

        if (!performance) {
            return;
        }

        const timing = performance.timing;

        if (timing.connectEnd && timing.domInteractive) {
            return timing.domInteractive - timing.connectEnd;
        }
    });
}

export function htmlEncode(html : string = '') : string {
    return html.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\//g, '&#x2F;');
}

export function isBrowser() : boolean {
    return (typeof window !== 'undefined') && window.location !== undefined;
}

export function querySelectorAll(selector : string, doc : HTMLElement = window.document) : $ReadOnlyArray<HTMLElement> {
    // $FlowFixMe[method-unbinding]
    return Array.prototype.slice.call(doc.querySelectorAll(selector));
}

export function onClick(element : HTMLElement, handler : (Event) => void) {
    element.addEventListener('touchstart', noop);
    element.addEventListener('click', handler);
    element.addEventListener('keypress', (event : Event) => {
        // $FlowFixMe
        if (event.keyCode === KEY_CODES.ENTER || event.keyCode === KEY_CODES.SPACE) { // eslint-disable-line unicorn/prefer-event-key
            return handler(event);
        }
    });
}

export function getScript({ host = window.location.host, path, reverse = false } : {| host? : string, path : string, reverse? : boolean |}) : ?HTMLScriptElement {
    return inlineMemoize(getScript, () : ?HTMLScriptElement => {

        const url = `${ host }${ path }`;
        // $FlowFixMe[method-unbinding]
        const scripts = Array.prototype.slice.call(document.getElementsByTagName('script'));

        if (reverse) {
            scripts.reverse();
        }

        for (const script of scripts) {
            if (!script.src) {
                continue;
            }

            const src = script.src.replace(/^https?:\/\//, '').split('?')[0];

            if (src === url) {
                return script;
            }
        }
    }, [ path ]);
}

export function isLocalStorageEnabled() : boolean {
    return inlineMemoize(isLocalStorageEnabled, () => {
        try {
            if (typeof window === 'undefined') {
                return false;
            }

            if (window.localStorage) {
                const value = Math.random().toString();
                window.localStorage.setItem('__test__localStorage__', value);
                const result = window.localStorage.getItem('__test__localStorage__');
                window.localStorage.removeItem('__test__localStorage__');
                if (value === result) {
                    return true;
                }
            }
        } catch (err) {
            // pass
        }
        return false;
    });
}

export function getBrowserLocales() : $ReadOnlyArray<{| country? : string, lang : string |}> {
    const nav = window.navigator;

    const locales = nav.languages
        ? [ ...nav.languages ]
        : [];

    if (nav.language) {
        locales.push(nav.language);
    }

    if (nav.userLanguage) {
        locales.push(nav.userLanguage);
    }

    return locales.map(locale => {

        if (locale && locale.match(/^[a-z]{2}[-_][A-Z]{2}$/)) {
            const [ lang, country ] = locale.split(/[-_]/);
            return { country, lang };
        }

        if (locale && locale.match(/^[a-z]{2}$/)) {
            return { lang: locale };
        }

        return null;

    }).filter(Boolean);
}


export function appendChild(container : HTMLElement, child : HTMLElement | Text) {
    container.appendChild(child);
}

export function isElement(element : mixed) : boolean {

    if (element instanceof window.Element) {
        return true;
    }

    if (element !== null && typeof element === 'object' && element.nodeType === 1 && typeof element.style === 'object' && typeof element.ownerDocument === 'object') {
        return true;
    }

    return false;
}

export function getElementSafe(id : ElementRefType, doc : Document | HTMLElement = document) : ?HTMLElement {

    if (isElement(id)) {
        // $FlowFixMe
        return id;
    }

    if (typeof id === 'string') {
        return doc.querySelector(id);
    }
}

export function getElement(id : ElementRefType, doc : Document | HTMLElement = document) : HTMLElement {

    const element = getElementSafe(id, doc);

    if (element) {
        return element;
    }

    throw new Error(`Can not find element: ${ stringify(id) }`);
}

export function elementReady(id : ElementRefType) : ZalgoPromise<HTMLElement> {
    return new ZalgoPromise((resolve, reject) => {

        const name = stringify(id);
        let el = getElementSafe(id);

        if (el) {
            return resolve(el);
        }

        if (isDocumentReady()) {
            return reject(new Error(`Document is ready and element ${ name } does not exist`));
        }

        const interval = setInterval(() => {

            el = getElementSafe(id);

            if (el) {
                resolve(el);
                clearInterval(interval);
                return;
            }

            if (isDocumentReady()) {
                clearInterval(interval);
                return reject(new Error(`Document is ready and element ${ name } does not exist`));
            }
        }, 10);
    });
}

// eslint-disable-next-line unicorn/custom-error-definition
export class PopupOpenError extends ExtendableError {}

type PopupOptions = {|
    name? : string,
    width? : number,
    height? : number,
    top? : number,
    left? : number,
    status? : 0 | 1,
    resizable? : 0 | 1,
    toolbar? : 0 | 1,
    menubar? : 0 | 1,
    scrollbars? : 0 | 1,
    closeOnUnload? : 0 | 1
|};

export function popup(url : string, options? : PopupOptions) : CrossDomainWindowType {

    // $FlowFixMe
    options = options || {};

    const { closeOnUnload = 1, name = '', width, height } = options;

    let top = 0;
    let left = 0;

    if (width) {
        if (window.outerWidth) {
            left = Math.round((window.outerWidth - width) / 2) + window.screenX;
        } else if (window.screen.width) {
            left = Math.round((window.screen.width - width) / 2);
        }
    }

    if (height) {
        if (window.outerHeight) {
            top = Math.round((window.outerHeight - height) / 2) + window.screenY;
        } else if (window.screen.height) {
            top = Math.round((window.screen.height - height) / 2);
        }
    }

    delete options.closeOnUnload;
    delete options.name;

    if (width && height) {
        // $FlowFixMe
        options = {
            top,
            left,
            width,
            height,
            status:     1,
            toolbar:    0,
            menubar:    0,
            resizable:  1,
            scrollbars: 1,
            ...options
        };
    }

    // eslint-disable-next-line array-callback-return
    const params = Object.keys(options).map(key => {
        // $FlowFixMe
        if (options[key] !== null && options[key] !== undefined) {
            return `${ key }=${ stringify(options[key]) }`;
        }
    }).filter(Boolean).join(',');

    let win;

    try {
        win = window.open(url, name, params);
    } catch (err) {
        throw new PopupOpenError(`Can not open popup window - ${ err.stack || err.message }`);
    }

    if (isWindowClosed(win)) {
        const err = new PopupOpenError(`Can not open popup window - blocked`);
        throw err;
    }

    if (closeOnUnload) {
        window.addEventListener('unload', () => win.close());
    }

    return win;
}


export function writeToWindow(win : SameDomainWindowType, html : string) {
    try {
        win.document.open();
        win.document.write(html);
        win.document.close();
    } catch (err) {
        try {
            win.location = `javascript: document.open(); document.write(${ JSON.stringify(html) }); document.close();`;
        } catch (err2) {
            // pass
        }
    }
}

export function writeElementToWindow(win : SameDomainWindowType, el : HTMLElement) {

    const tag = el.tagName.toLowerCase();

    if (tag !== 'html') {
        throw new Error(`Expected element to be html, got ${ tag }`);
    }

    const documentElement = win.document.documentElement;

    for (const child of arrayFrom(documentElement.children)) {
        documentElement.removeChild(child);
    }

    for (const child of arrayFrom(el.children)) {
        documentElement.appendChild(child);
    }
}

export function setStyle(el : HTMLElement, styleText : string, doc : Document = window.document) {
    // $FlowFixMe
    if (el.styleSheet) {
        // $FlowFixMe
        el.styleSheet.cssText = styleText;
    } else {
        el.appendChild(doc.createTextNode(styleText));
    }
}

export type ElementOptionsType = {|
    style? : { [ string ] : string },
    id? : string,
    class? : ?$ReadOnlyArray<string>,
    attributes? : { [ string ] : string },
    styleSheet? : ?string,
    html? : ?string
|};

let awaitFrameLoadPromises : WeakMap<HTMLIFrameElement, ZalgoPromise<HTMLIFrameElement>>;

export function awaitFrameLoad(frame : HTMLIFrameElement) : ZalgoPromise<HTMLIFrameElement> {
    awaitFrameLoadPromises = awaitFrameLoadPromises || new WeakMap();

    if (awaitFrameLoadPromises.has(frame)) {
        const promise = awaitFrameLoadPromises.get(frame);
        if (promise) {
            return promise;
        }
    }

    const promise = new ZalgoPromise((resolve, reject) => {
        frame.addEventListener('load', () => {
            linkFrameWindow(frame);
            resolve(frame);
        });

        frame.addEventListener('error', (err : Event) => {
            if (frame.contentWindow) {
                resolve(frame);
            } else {
                reject(err);
            }
        });
    });

    awaitFrameLoadPromises.set(frame, promise);

    return promise;
}

export function awaitFrameWindow(frame : HTMLIFrameElement) : ZalgoPromise<CrossDomainWindowType> {
    return awaitFrameLoad(frame).then(loadedFrame => {

        if (!loadedFrame.contentWindow) {
            throw new Error(`Could not find window in iframe`);
        }

        return loadedFrame.contentWindow;
    });
}

const getDefaultCreateElementOptions = () : ElementOptionsType => {
    // $FlowFixMe
    return {};
};

export function createElement(tag : string = 'div', options : ElementOptionsType = getDefaultCreateElementOptions(), container : ?HTMLElement) : HTMLElement {

    tag = tag.toLowerCase();
    const element = document.createElement(tag);

    if (options.style) {
        extend(element.style, options.style);
    }

    if (options.class) {
        element.className = options.class.join(' ');
    }

    if (options.id) {
        element.setAttribute('id', options.id);
    }

    if (options.attributes) {
        for (const key of Object.keys(options.attributes)) {
            element.setAttribute(key, options.attributes[key]);
        }
    }

    if (options.styleSheet) {
        setStyle(element, options.styleSheet);
    }

    if (container) {
        appendChild(container, element);
    }

    if (options.html) {
        if (tag === 'iframe') {
            // $FlowFixMe
            if (!container || !element.contentWindow) {
                throw new Error(`Iframe html can not be written unless container provided and iframe in DOM`);
            }

            // $FlowFixMe
            writeToWindow(element.contentWindow, options.html);

        } else {
            element.innerHTML = options.html;
        }
    }

    return element;
}

type StringMap = {|
    [ string ] : string
|};

export type IframeElementOptionsType = {|
    style? : StringMap,
    class? : ?$ReadOnlyArray<string>,
    attributes? : StringMap,
    styleSheet? : ?string,
    html? : ?string,
    url? : ?string
|};

const getDefaultIframeOptions = () : IframeElementOptionsType => {
    // $FlowFixMe
    return {};
};

const getDefaultStringMap = () : StringMap => {
    // $FlowFixMe
    return {};
};

export function iframe(options : IframeElementOptionsType = getDefaultIframeOptions(), container : ?HTMLElement) : HTMLIFrameElement {

    const attributes = options.attributes || getDefaultStringMap();
    const style = options.style || getDefaultStringMap();

    // $FlowFixMe
    const newAttributes = {
        allowTransparency: 'true',
        ...attributes
    };

    // $FlowFixMe
    const newStyle = {
        backgroundColor: 'transparent',
        border:          'none',
        ...style
    };

    const frame = createElement('iframe', {
        attributes: newAttributes,
        style:      newStyle,
        html:       options.html,
        class:      options.class
    });

    const isIE = window.navigator.userAgent.match(/MSIE|Edge/i);

    if (!frame.hasAttribute('id')) {
        frame.setAttribute('id', uniqueID());
    }

    // $FlowFixMe
    awaitFrameLoad(frame);

    if (container) {
        const el = getElement(container);
        el.appendChild(frame);
    }

    if (options.url || isIE) {
        frame.setAttribute('src', options.url || 'about:blank');
    }

    // $FlowFixMe
    return frame;
}

export function addEventListener(obj : HTMLElement, event : string, handler : (event : Event) => void) : CancelableType {
    obj.addEventListener(event, handler);
    return {
        cancel() {
            obj.removeEventListener(event, handler);
        }
    };
}

export function bindEvents(element : HTMLElement, eventNames : $ReadOnlyArray<string>, handler : (event : Event) => void) : CancelableType {

    handler = once(handler);

    for (const eventName of eventNames) {
        element.addEventListener(eventName, handler);
    }

    return {
        cancel: once(() => {
            for (const eventName of eventNames) {
                element.removeEventListener(eventName, handler);
            }
        })
    };
}

const VENDOR_PREFIXES = [ 'webkit', 'moz', 'ms', 'o' ];

export function setVendorCSS(element : HTMLElement, name : string, value : string) {

    // $FlowFixMe
    element.style[name] = value;

    const capitalizedName = capitalizeFirstLetter(name);

    for (const prefix of VENDOR_PREFIXES) {
        // $FlowFixMe
        element.style[`${ prefix }${ capitalizedName }`] = value;
    }
}

const ANIMATION_START_EVENTS = [ 'animationstart', 'webkitAnimationStart', 'oAnimationStart', 'MSAnimationStart' ];
const ANIMATION_END_EVENTS   = [ 'animationend', 'webkitAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd' ];

export function animate(element : ElementRefType, name : string, clean : (Function) => void, timeout : number = 1000) : ZalgoPromise<void> {
    return new ZalgoPromise((resolve, reject) => {

        const el = getElement(element);

        if (!el) {
            return resolve();
        }

        let hasStarted = false;

        // eslint-disable-next-line prefer-const
        let startTimeout;
        let endTimeout;
        // eslint-disable-next-line prefer-const
        let startEvent;
        // eslint-disable-next-line prefer-const
        let endEvent;

        function cleanUp() {
            clearTimeout(startTimeout);
            clearTimeout(endTimeout);
            startEvent.cancel();
            endEvent.cancel();
        }

        startEvent = bindEvents(el, ANIMATION_START_EVENTS, event => {

            // $FlowFixMe
            if (event.target !== el || event.animationName !== name) {
                return;
            }

            clearTimeout(startTimeout);

            event.stopPropagation();

            startEvent.cancel();
            hasStarted = true;

            endTimeout = setTimeout(() => {
                cleanUp();
                resolve();
            }, timeout);
        });

        endEvent = bindEvents(el, ANIMATION_END_EVENTS, event => {

            // $FlowFixMe
            if (event.target !== el || event.animationName !== name) {
                return;
            }

            cleanUp();

            // $FlowFixMe
            if (typeof event.animationName === 'string' && event.animationName !== name) {
                return reject(`Expected animation name to be ${ name }, found ${ event.animationName }`);
            }

            return resolve();
        });

        setVendorCSS(el, 'animationName', name);

        startTimeout = setTimeout(() => {
            if (!hasStarted) {
                cleanUp();
                return resolve();
            }
        }, 200);

        if (clean) {
            clean(cleanUp);
        }
    });
}

export function makeElementVisible(element : HTMLElement) {
    element.style.setProperty('visibility', '');
}

export function makeElementInvisible(element : HTMLElement) {
    element.style.setProperty('visibility', 'hidden', 'important');
}


export function showElement(element : HTMLElement) {
    element.style.setProperty('display', '');
}

export function hideElement(element : HTMLElement) {
    element.style.setProperty('display', 'none', 'important');
}

export function destroyElement(element : HTMLElement) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

export function showAndAnimate(element : HTMLElement, name : string, clean : (Function) => void) : ZalgoPromise<void> {
    const animation = animate(element, name, clean);
    showElement(element);
    return animation;
}

export function animateAndHide(element : HTMLElement, name : string, clean : (Function) => void) : ZalgoPromise<void> {
    return animate(element, name, clean).then(() => {
        hideElement(element);
    });
}

export function addClass(element : HTMLElement, name : string) {
    element.classList.add(name);
}

export function removeClass(element : HTMLElement, name : string) {
    element.classList.remove(name);
}

export function isElementClosed(el : HTMLElement) : boolean {
    if (!el || !el.parentNode || !el.ownerDocument || !el.ownerDocument.documentElement || !el.ownerDocument.documentElement.contains(el)) {
        return true;
    }
    return false;
}

export function watchElementForClose(element : HTMLElement, handler : () => mixed) : CancelableType {
    handler = once(handler);

    let cancelled = false;
    const mutationObservers = [];
    // eslint-disable-next-line prefer-const
    let interval;
    // eslint-disable-next-line prefer-const
    let sacrificialFrame;
    let sacrificialFrameWin;

    const cancel = () => {
        cancelled = true;
        for (const observer of mutationObservers) {
            observer.disconnect();
        }
        if (interval) {
            interval.cancel();
        }
        if (sacrificialFrameWin) {
            // eslint-disable-next-line no-use-before-define
            sacrificialFrameWin.removeEventListener('unload', elementClosed);
        }
        if (sacrificialFrame) {
            destroyElement(sacrificialFrame);
        }
    };

    const elementClosed = () => {
        if (!cancelled) {
            handler();
            cancel();
        }
    };

    if (isElementClosed(element)) {
        elementClosed();
        return { cancel };
    }

    // Strategy 1: Mutation observer

    if (window.MutationObserver) {
        let mutationElement = element.parentElement;
        while (mutationElement) {
            const mutationObserver = new window.MutationObserver(() => {
                if (isElementClosed(element)) {
                    elementClosed();
                }
            });

            mutationObserver.observe(mutationElement, { childList: true });
            mutationObservers.push(mutationObserver);
            mutationElement = mutationElement.parentElement;
        }
    }

    // Strategy 2: Sacrificial iframe

    sacrificialFrame = document.createElement('iframe');
    sacrificialFrame.setAttribute('name', `__detect_close_${ uniqueID() }__`);
    sacrificialFrame.style.display = 'none';
    awaitFrameWindow(sacrificialFrame).then(frameWin => {
        sacrificialFrameWin = assertSameDomain(frameWin);
        sacrificialFrameWin.addEventListener('unload', elementClosed);
    });
    element.appendChild(sacrificialFrame);

    // Strategy 3: Poller

    const check = () => {
        if (isElementClosed(element)) {
            elementClosed();
        }
    };
    interval = safeInterval(check, 1000);

    return { cancel };
}

export function fixScripts(el : HTMLElement, doc : Document = window.document) {
    for (const script of querySelectorAll('script', el)) {
        const parentNode = script.parentNode;

        if (!parentNode) {
            continue;
        }

        const newScript = doc.createElement('script');
        newScript.text = script.textContent;
        parentNode.replaceChild(newScript, script);
    }
}

type OnResizeOptions = {|
    width? : boolean,
    height? : boolean,
    interval? : number,
    win? : SameDomainWindowType
|};

export function onResize(el : HTMLElement, handler : ({| width : number, height : number |}) => void, { width = true, height = true, interval = 100, win = window } : OnResizeOptions = {}) : {| cancel : () => void |} {
    let currentWidth = el.offsetWidth;
    let currentHeight = el.offsetHeight;
    let canceled = false;

    handler({ width: currentWidth, height: currentHeight });

    const check = () => {
        if (canceled || !isElementVisible(el)) {
            return;
        }

        const newWidth = el.offsetWidth;
        const newHeight = el.offsetHeight;

        if ((width && newWidth !== currentWidth) || (height && newHeight !== currentHeight)) {
            handler({ width: newWidth, height: newHeight });
        }

        currentWidth = newWidth;
        currentHeight = newHeight;
    };

    let observer;
    let timeout;

    win.addEventListener('resize', check);

    if (typeof win.ResizeObserver !== 'undefined') {
        observer = new win.ResizeObserver(check);
        observer.observe(el);
        timeout = safeInterval(check, interval * 10);

    } else if (typeof win.MutationObserver !== 'undefined') {
        observer = new win.MutationObserver(check);
        observer.observe(el, {
            attributes:    true,
            childList:     true,
            subtree:       true,
            characterData: false
        });
        timeout = safeInterval(check, interval * 10);
    } else {
        timeout = safeInterval(check, interval);
    }

    return {
        cancel: () => {
            canceled = true;
            observer.disconnect();
            window.removeEventListener('resize', check);
            timeout.cancel();
        }
    };
}

export function getResourceLoadTime(url : string) : ?number {
    const performance = getPerformance();

    if (!performance) {
        return;
    }

    // $FlowFixMe[method-unbinding]
    if (typeof performance.getEntries !== 'function') {
        return;
    }

    const entries = performance.getEntries();

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        if (entry && entry.name && entry.name.indexOf(url) === 0 && typeof entry.duration === 'number') {
            return Math.floor(entry.duration);
        }
    }
}

export function isShadowElement(element : Node) : boolean {
    while (element.parentNode) {
        element = element.parentNode;
    }

    return element.toString() === '[object ShadowRoot]';
}

export function getShadowRoot(element : Node) : ?Node {
    while (element.parentNode) {
        element = element.parentNode;
    }

    if (isShadowElement(element)) {
        return element;
    }
}

export function getShadowHost(element : Node) : ?HTMLElement {
    const shadowRoot = getShadowRoot(element);

    // $FlowFixMe
    if (shadowRoot && shadowRoot.host) {
        // $FlowFixMe
        return shadowRoot.host;
    }
}


export function insertShadowSlot(element : HTMLElement) : HTMLElement {
    const shadowHost = getShadowHost(element);

    if (!shadowHost) {
        throw new Error(`Element is not in shadow dom`);
    }

    const slotName = `shadow-slot-${ uniqueID() }`;
    const slot = document.createElement('slot');
    slot.setAttribute('name', slotName);
    element.appendChild(slot);

    const slotProvider = document.createElement('div');
    slotProvider.setAttribute('slot', slotName);
    shadowHost.appendChild(slotProvider);

    if (isShadowElement(shadowHost)) {
        return insertShadowSlot(slotProvider);
    }

    return slotProvider;
}

export function preventClickFocus(el : HTMLElement) {
    const onFocus = (event : Event) => {
        el.removeEventListener('focus', onFocus);
        event.preventDefault();
        el.blur();
        return false;
    };

    el.addEventListener('mousedown', () => {
        el.addEventListener('focus', onFocus);
        setTimeout(() => {
            el.removeEventListener('focus', onFocus);
        }, 1);
    });
}

export function getStackTrace() : string {
    try {
        throw new Error('_');
    }
    catch (err) {
        return err.stack || '';
    }
}

function inferCurrentScript() : ?HTMLScriptElement {
    try {
        const stack = getStackTrace();
        const stackDetails = (/.*at [^(]*\((.*):(.+):(.+)\)$/ig).exec(stack);
        const scriptLocation = stackDetails && stackDetails[1];

        if (!scriptLocation) {
            return;
        }

        // $FlowFixMe[method-unbinding]
        for (const script of Array.prototype.slice.call(document.getElementsByTagName('script')).reverse()) {
            if (script.src && script.src === scriptLocation) {
                return script;
            }
        }

    } catch (err) {
        // pass
    }
}

// eslint-disable-next-line compat/compat
let currentScript = typeof document !== 'undefined' ? document.currentScript : null;

type GetCurrentScript = () => HTMLScriptElement;

export const getCurrentScript : GetCurrentScript = memoize(() => {
    if (currentScript) {
        return currentScript;
    }

    currentScript = inferCurrentScript();

    if (currentScript) {
        return currentScript;
    }

    throw new Error('Can not determine current script');
});

const currentUID = uniqueID();

type GetCurrentScriptUID = () => string;

export const getCurrentScriptUID : GetCurrentScriptUID = memoize(() => {
    let script;

    try {
        script = getCurrentScript();
    } catch (err) {
        return currentUID;
    }

    let uid = script.getAttribute(ATTRIBUTES.UID);

    if (uid && typeof uid === 'string') {
        return uid;
    }

    uid = script.getAttribute(`${ ATTRIBUTES.UID }-auto`);

    if (uid && typeof uid === 'string') {
        return uid;
    }

    if (script.src) {

        const { src, dataset } = script;
        const stringToHash = JSON.stringify({ src, dataset });
        const hashedString = strHashStr(stringToHash);
        const hashResult = hashedString.slice(hashedString.length - UID_HASH_LENGTH);

        uid = `uid_${ hashResult }`;
    } else {
        uid = uniqueID();
    }

    script.setAttribute(`${ ATTRIBUTES.UID }-auto`, uid);

    return uid;
});

type SubmitFormOptions = {|
    url : string,
    target : string,
    body? : {| [string] : string | boolean |},
    method? : string
|};

export function submitForm({ url, target, body, method = 'post' } : SubmitFormOptions) {
    const form = document.createElement('form');
    form.setAttribute('target', target);
    form.setAttribute('method', method);
    form.setAttribute('action', url);
    form.style.display = 'none';

    if (body) {
        for (const key of Object.keys(body)) {
            const input = document.createElement('input');
            input.setAttribute('name', key);
            input.setAttribute('value', body[key]?.toString());
            form.appendChild(input);
        }
    }

    getBody().appendChild(form);
    form.submit();
    getBody().removeChild(form);
}
