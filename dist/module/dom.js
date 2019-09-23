var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* eslint max-lines: off */

import { ZalgoPromise } from 'zalgo-promise/src';
import { linkFrameWindow, isWindowClosed } from 'cross-domain-utils/src';
import { WeakMap } from 'cross-domain-safe-weakmap/src';

import { inlineMemoize, noop, stringify, capitalizeFirstLetter, once, extend, safeInterval, uniqueID, arrayFrom } from './util';
import { isDevice } from './device';
import { KEY_CODES } from './constants';


export function isDocumentReady() {
    return Boolean(document.body) && document.readyState === 'complete';
}

export function urlEncode(str) {
    return str.replace(/\?/g, '%3F').replace(/&/g, '%26').replace(/#/g, '%23').replace(/\+/g, '%2B');
}

export function waitForWindowReady() {
    return inlineMemoize(waitForWindowReady, function () {
        return new ZalgoPromise(function (resolve) {
            if (isDocumentReady()) {
                resolve();
            }

            window.addEventListener('load', function () {
                return resolve();
            });
        });
    });
}

export function waitForDocumentReady() {
    return inlineMemoize(waitForDocumentReady, function () {
        return new ZalgoPromise(function (resolve) {

            if (isDocumentReady()) {
                return resolve();
            }

            var interval = setInterval(function () {
                if (isDocumentReady()) {
                    clearInterval(interval);
                    return resolve();
                }
            }, 10);
        });
    });
}

export function waitForDocumentBody() {
    return waitForDocumentReady().then(function () {
        if (document.body) {
            return document.body;
        }

        throw new Error('Document ready but document.body not present');
    });
}

export function parseQuery(queryString) {
    return inlineMemoize(parseQuery, function () {
        var params = {};

        if (!queryString) {
            return params;
        }

        if (queryString.indexOf('=') === -1) {
            return params;
        }

        for (var _i2 = 0, _queryString$split2 = queryString.split('&'), _length2 = _queryString$split2 == null ? 0 : _queryString$split2.length; _i2 < _length2; _i2++) {
            var pair = _queryString$split2[_i2];
            pair = pair.split('=');

            if (pair[0] && pair[1]) {
                params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
        }

        return params;
    }, [queryString]);
}

export function getQueryParam(name) {
    return parseQuery(window.location.search.slice(1))[name];
}

export function urlWillRedirectPage(url) {

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

export function formatQuery() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    return Object.keys(obj).filter(function (key) {
        return typeof obj[key] === 'string';
    }).map(function (key) {
        return urlEncode(key) + '=' + urlEncode(obj[key]);
    }).join('&');
}

export function extendQuery(originalQuery) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (!props || !Object.keys(props).length) {
        return originalQuery;
    }

    return formatQuery(_extends({}, parseQuery(originalQuery), props));
}

export function extendUrl(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var query = options.query || {};
    var hash = options.hash || {};

    var originalUrl = void 0;
    var originalQuery = void 0;
    var originalHash = void 0;

    var _url$split = url.split('#');

    originalUrl = _url$split[0];
    originalHash = _url$split[1];

    var _originalUrl$split = originalUrl.split('?');

    originalUrl = _originalUrl$split[0];
    originalQuery = _originalUrl$split[1];


    var queryString = extendQuery(originalQuery, query);
    var hashString = extendQuery(originalHash, hash);

    if (queryString) {
        originalUrl = originalUrl + '?' + queryString;
    }

    if (hashString) {
        originalUrl = originalUrl + '#' + hashString;
    }

    return originalUrl;
}

export function redirect(url) {
    var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

    return new ZalgoPromise(function (resolve) {
        win.location = url;
        if (!urlWillRedirectPage(url)) {
            resolve();
        }
    });
}

export function hasMetaViewPort() {
    var meta = document.querySelector('meta[name=viewport]');

    if (isDevice() && window.screen.width < 660 && !meta) {
        return false;
    }

    return true;
}

export function isElementVisible(el) {
    return Boolean(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

export function enablePerformance() {
    return inlineMemoize(enablePerformance, function () {
        /* eslint-disable compat/compat */
        return Boolean(window.performance && performance.now && performance.timing && performance.timing.connectEnd && performance.timing.navigationStart && Math.abs(performance.now() - Date.now()) > 1000 && performance.now() - (performance.timing.connectEnd - performance.timing.navigationStart) > 0);
        /* eslint-enable compat/compat */
    });
}

export function getPageRenderTime() {
    return waitForDocumentReady().then(function () {

        if (!enablePerformance()) {
            return;
        }

        var timing = window.performance.timing;

        if (timing.connectEnd && timing.domInteractive) {
            return timing.domInteractive - timing.connectEnd;
        }
    });
}

export function htmlEncode() {
    var html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return html.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\//g, '&#x2F;');
}

export function isBrowser() {
    return typeof window !== 'undefined';
}

export function querySelectorAll(selector) {
    var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.document;

    return Array.prototype.slice.call(doc.querySelectorAll(selector));
}

export function onClick(element, handler) {
    element.addEventListener('touchstart', noop);
    element.addEventListener('click', handler);
    element.addEventListener('keypress', function (event) {
        // $FlowFixMe
        if (event.keyCode === KEY_CODES.ENTER) {
            return handler(event);
        }
    });
}

export function getScript(_ref) {
    var _ref$host = _ref.host,
        host = _ref$host === undefined ? window.location.host : _ref$host,
        path = _ref.path;

    return inlineMemoize(getScript, function () {

        var url = '' + host + path;
        var scripts = Array.prototype.slice.call(document.getElementsByTagName('script'));

        for (var _i4 = 0, _length4 = scripts == null ? 0 : scripts.length; _i4 < _length4; _i4++) {
            var script = scripts[_i4];
            if (!script.src) {
                continue;
            }

            var src = script.src.replace(/^https?:\/\//, '').split('?')[0];

            if (src === url) {
                return script;
            }
        }
    }, [path]);
}

export function isLocalStorageEnabled() {
    return inlineMemoize(isLocalStorageEnabled, function () {
        try {
            if (typeof window === 'undefined') {
                return false;
            }

            if (window.localStorage) {
                var value = Math.random().toString();
                window.localStorage.setItem('__test__localStorage__', value);
                var result = window.localStorage.getItem('__test__localStorage__');
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

export function getBrowserLocales() {
    var nav = window.navigator;

    var locales = nav.languages ? Array.prototype.slice.apply(nav.languages) : [];

    if (nav.language) {
        locales.push(nav.language);
    }

    if (nav.userLanguage) {
        locales.push(nav.userLanguage);
    }

    return locales.map(function (locale) {

        if (locale && locale.match(/^[a-z]{2}[-_][A-Z]{2}$/)) {
            var _locale$split = locale.split(/[-_]/),
                _lang = _locale$split[0],
                _country = _locale$split[1];

            return { country: _country, lang: _lang };
        }

        if (locale && locale.match(/^[a-z]{2}$/)) {
            return { lang: locale };
        }

        return null;
    }).filter(Boolean);
}

export function appendChild(container, child) {
    container.appendChild(child);
}

export function isElement(element) {

    if (element instanceof window.Element) {
        return true;
    }

    if (element !== null && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && element.nodeType === 1 && _typeof(element.style) === 'object' && _typeof(element.ownerDocument) === 'object') {
        return true;
    }

    return false;
}

export function getElementSafe(id) {
    var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;


    if (isElement(id)) {
        // $FlowFixMe
        return id;
    }

    if (typeof id === 'string') {
        return doc.querySelector(id);
    }
}

export function getElement(id) {
    var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;


    var element = getElementSafe(id, doc);

    if (element) {
        return element;
    }

    throw new Error('Can not find element: ' + stringify(id));
}

export function elementReady(id) {
    return new ZalgoPromise(function (resolve, reject) {

        var name = stringify(id);
        var el = getElementSafe(id);

        if (el) {
            return resolve(el);
        }

        if (isDocumentReady()) {
            return reject(new Error('Document is ready and element ' + name + ' does not exist'));
        }

        var interval = setInterval(function () {

            el = getElementSafe(id);

            if (el) {
                clearInterval(interval);
                return resolve(el);
            }

            if (isDocumentReady()) {
                clearInterval(interval);
                return reject(new Error('Document is ready and element ' + name + ' does not exist'));
            }
        }, 10);
    });
}

export function PopupOpenError(message) {
    this.message = message;
}

PopupOpenError.prototype = Object.create(Error.prototype);

export function popup(url, options) {

    // $FlowFixMe
    options = options || {};

    var _options = options,
        width = _options.width,
        height = _options.height;


    var top = 0;
    var left = 0;

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

    if (width && height) {
        options = _extends({
            top: top,
            left: left,
            width: width,
            height: height,
            status: 1,
            toolbar: 0,
            menubar: 0,
            resizable: 1,
            scrollbars: 1
        }, options);
    }

    var name = options.name || '';
    delete options.name;

    // eslint-disable-next-line array-callback-return
    var params = Object.keys(options).map(function (key) {
        // $FlowFixMe
        if (options[key] !== null && options[key] !== undefined) {
            return key + '=' + stringify(options[key]);
        }
    }).filter(Boolean).join(',');

    var win = void 0;

    try {
        win = window.open(url, name, params, true);
    } catch (err) {
        throw new PopupOpenError('Can not open popup window - ' + (err.stack || err.message));
    }

    if (isWindowClosed(win)) {
        var err = new PopupOpenError('Can not open popup window - blocked');
        throw err;
    }

    window.addEventListener('unload', function () {
        return win.close();
    });

    return win;
}

export function writeToWindow(win, html) {
    try {
        win.document.open();
        win.document.write(html);
        win.document.close();
    } catch (err) {
        try {
            win.location = 'javascript: document.open(); document.write(' + JSON.stringify(html) + '); document.close();';
        } catch (err2) {
            // pass
        }
    }
}

export function writeElementToWindow(win, el) {

    var tag = el.tagName.toLowerCase();

    if (tag !== 'html') {
        throw new Error('Expected element to be html, got ' + tag);
    }

    var documentElement = win.document.documentElement;

    for (var _i6 = 0, _arrayFrom2 = arrayFrom(documentElement.children), _length6 = _arrayFrom2 == null ? 0 : _arrayFrom2.length; _i6 < _length6; _i6++) {
        var child = _arrayFrom2[_i6];
        documentElement.removeChild(child);
    }

    for (var _i8 = 0, _arrayFrom4 = arrayFrom(el.children), _length8 = _arrayFrom4 == null ? 0 : _arrayFrom4.length; _i8 < _length8; _i8++) {
        var _child = _arrayFrom4[_i8];
        documentElement.appendChild(_child);
    }
}

export function setStyle(el, styleText) {
    var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window.document;

    // $FlowFixMe
    if (el.styleSheet) {
        // $FlowFixMe
        el.styleSheet.cssText = styleText;
    } else {
        el.appendChild(doc.createTextNode(styleText));
    }
}

var awaitFrameLoadPromises = void 0;

export function awaitFrameLoad(frame) {
    awaitFrameLoadPromises = awaitFrameLoadPromises || new WeakMap();

    if (awaitFrameLoadPromises.has(frame)) {
        var _promise = awaitFrameLoadPromises.get(frame);
        if (_promise) {
            return _promise;
        }
    }

    var promise = new ZalgoPromise(function (resolve, reject) {
        frame.addEventListener('load', function () {
            linkFrameWindow(frame);
            resolve(frame);
        });

        frame.addEventListener('error', function (err) {
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

export function awaitFrameWindow(frame) {
    return awaitFrameLoad(frame).then(function (loadedFrame) {

        if (!loadedFrame.contentWindow) {
            throw new Error('Could not find window in iframe');
        }

        return loadedFrame.contentWindow;
    });
}

export function createElement() {
    var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var container = arguments[2];


    tag = tag.toLowerCase();
    var element = document.createElement(tag);

    if (options.style) {
        extend(element.style, options.style);
    }

    if (options['class']) {
        element.className = options['class'].join(' ');
    }

    if (options.id) {
        element.setAttribute('id', options.id);
    }

    if (options.attributes) {
        for (var _i10 = 0, _Object$keys2 = Object.keys(options.attributes), _length10 = _Object$keys2 == null ? 0 : _Object$keys2.length; _i10 < _length10; _i10++) {
            var key = _Object$keys2[_i10];
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
                throw new Error('Iframe html can not be written unless container provided and iframe in DOM');
            }

            // $FlowFixMe
            writeToWindow(element.contentWindow, options.html);
        } else {
            element.innerHTML = options.html;
        }
    }

    return element;
}

export function iframe() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var container = arguments[1];


    var attributes = options.attributes || {};
    var style = options.style || {};

    var frame = createElement('iframe', {
        attributes: _extends({
            allowTransparency: 'true'
        }, attributes),
        style: _extends({
            backgroundColor: 'transparent',
            border: 'none'
        }, style),
        html: options.html,
        'class': options['class']
    });

    var isIE = window.navigator.userAgent.match(/MSIE|Edge/i);

    if (!frame.hasAttribute('id')) {
        frame.setAttribute('id', uniqueID());
    }

    // $FlowFixMe
    awaitFrameLoad(frame);

    if (container) {
        var el = getElement(container);
        el.appendChild(frame);
    }

    if (options.url || isIE) {
        frame.setAttribute('src', options.url || 'about:blank');
    }

    // $FlowFixMe
    return frame;
}

export function addEventListener(obj, event, handler) {
    obj.addEventListener(event, handler);
    return {
        cancel: function cancel() {
            obj.removeEventListener(event, handler);
        }
    };
}

export function bindEvents(element, eventNames, handler) {

    handler = once(handler);

    for (var _i12 = 0, _length12 = eventNames == null ? 0 : eventNames.length; _i12 < _length12; _i12++) {
        var eventName = eventNames[_i12];
        element.addEventListener(eventName, handler);
    }

    return {
        cancel: once(function () {
            for (var _i14 = 0, _length14 = eventNames == null ? 0 : eventNames.length; _i14 < _length14; _i14++) {
                var _eventName = eventNames[_i14];
                element.removeEventListener(_eventName, handler);
            }
        })
    };
}

var VENDOR_PREFIXES = ['webkit', 'moz', 'ms', 'o'];

export function setVendorCSS(element, name, value) {

    // $FlowFixMe
    element.style[name] = value;

    var capitalizedName = capitalizeFirstLetter(name);

    for (var _i16 = 0, _length16 = VENDOR_PREFIXES == null ? 0 : VENDOR_PREFIXES.length; _i16 < _length16; _i16++) {
        var prefix = VENDOR_PREFIXES[_i16];
        // $FlowFixMe
        element.style['' + prefix + capitalizedName] = value;
    }
}

var ANIMATION_START_EVENTS = ['animationstart', 'webkitAnimationStart', 'oAnimationStart', 'MSAnimationStart'];
var ANIMATION_END_EVENTS = ['animationend', 'webkitAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd'];

export function animate(element, name, clean) {
    var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;

    return new ZalgoPromise(function (resolve, reject) {

        var el = getElement(element);

        if (!el) {
            return resolve();
        }

        var hasStarted = false;

        var startTimeout = void 0;
        var endTimeout = void 0;
        var startEvent = void 0;
        var endEvent = void 0;

        function cleanUp() {
            clearTimeout(startTimeout);
            clearTimeout(endTimeout);
            startEvent.cancel();
            endEvent.cancel();
        }

        startEvent = bindEvents(el, ANIMATION_START_EVENTS, function (event) {

            // $FlowFixMe
            if (event.target !== el || event.animationName !== name) {
                return;
            }

            clearTimeout(startTimeout);

            event.stopPropagation();

            startEvent.cancel();
            hasStarted = true;

            endTimeout = setTimeout(function () {
                cleanUp();
                resolve();
            }, timeout);
        });

        endEvent = bindEvents(el, ANIMATION_END_EVENTS, function (event) {

            // $FlowFixMe
            if (event.target !== el || event.animationName !== name) {
                return;
            }

            cleanUp();

            // $FlowFixMe
            if (typeof event.animationName === 'string' && event.animationName !== name) {
                return reject('Expected animation name to be ' + name + ', found ' + event.animationName);
            }

            return resolve();
        });

        setVendorCSS(el, 'animationName', name);

        startTimeout = setTimeout(function () {
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

var STYLE = {

    DISPLAY: {
        NONE: 'none',
        BLOCK: 'block'
    },

    VISIBILITY: {
        VISIBLE: 'visible',
        HIDDEN: 'hidden'
    },

    IMPORTANT: 'important'
};

export function makeElementVisible(element) {
    element.style.setProperty('visibility', '');
}

export function makeElementInvisible(element) {
    element.style.setProperty('visibility', STYLE.VISIBILITY.HIDDEN, STYLE.IMPORTANT);
}

export function showElement(element) {
    element.style.setProperty('display', '');
}

export function hideElement(element) {
    element.style.setProperty('display', STYLE.DISPLAY.NONE, STYLE.IMPORTANT);
}

export function destroyElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

export function showAndAnimate(element, name, clean) {
    var animation = animate(element, name, clean);
    showElement(element);
    return animation;
}

export function animateAndHide(element, name, clean) {
    return animate(element, name, clean).then(function () {
        hideElement(element);
    });
}

export function addClass(element, name) {
    element.classList.add(name);
}

export function removeClass(element, name) {
    element.classList.remove(name);
}

export function isElementClosed(el) {
    if (!el || !el.parentNode) {
        return true;
    }
    return false;
}

export function watchElementForClose(element, handler) {
    handler = once(handler);

    var interval = void 0;

    if (isElementClosed(element)) {
        handler();
    } else {
        interval = safeInterval(function () {
            if (isElementClosed(element)) {
                interval.cancel();
                handler();
            }
        }, 50);
    }

    return {
        cancel: function cancel() {
            if (interval) {
                interval.cancel();
            }
        }
    };
}

export function fixScripts(el) {
    var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.document;

    for (var _i18 = 0, _querySelectorAll2 = querySelectorAll('script', el), _length18 = _querySelectorAll2 == null ? 0 : _querySelectorAll2.length; _i18 < _length18; _i18++) {
        var script = _querySelectorAll2[_i18];
        var parentNode = script.parentNode;

        if (!parentNode) {
            continue;
        }

        var newScript = doc.createElement('script');
        newScript.text = script.textContent;
        parentNode.replaceChild(newScript, script);
    }
}

export function onResize(el, handler) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$width = _ref2.width,
        width = _ref2$width === undefined ? true : _ref2$width,
        _ref2$height = _ref2.height,
        height = _ref2$height === undefined ? true : _ref2$height,
        _ref2$interval = _ref2.interval,
        interval = _ref2$interval === undefined ? 100 : _ref2$interval,
        _ref2$win = _ref2.win,
        win = _ref2$win === undefined ? window : _ref2$win;

    var currentWidth = el.offsetWidth;
    var currentHeight = el.offsetHeight;

    handler({ width: currentWidth, height: currentHeight });

    var check = function check() {
        var newWidth = el.offsetWidth;
        var newHeight = el.offsetHeight;

        if (width && newWidth !== currentWidth || height && newHeight !== currentHeight) {
            handler({ width: newWidth, height: newHeight });
        }

        currentWidth = newWidth;
        currentHeight = newHeight;
    };

    var observer = void 0;
    var timeout = void 0;

    if (typeof win.ResizeObserver !== 'undefined') {
        observer = new win.ResizeObserver(check);
        observer.observe(el);
    } else if (typeof win.MutationObserver !== 'undefined') {
        observer = new win.MutationObserver(check);
        observer.observe(el, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: false
        });
        win.addEventListener('resize', check);
    } else {
        var loop = function loop() {
            check();
            timeout = setTimeout(loop, interval);
        };
        loop();
    }

    return {
        cancel: function cancel() {
            observer.disconnect();
            window.removeEventListener('resize', check);
            clearTimeout(timeout);
        }
    };
}

export function getResourceLoadTime(url) {

    if (!enablePerformance()) {
        return;
    }

    if (!window.performance || typeof window.performance.getEntries !== 'function') {
        return;
    }

    var entries = window.performance.getEntries();

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];

        if (entry && entry.name && entry.name.indexOf(url) === 0 && typeof entry.duration === 'number') {
            return Math.floor(entry.duration);
        }
    }
}