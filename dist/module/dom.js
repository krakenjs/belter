import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _extends from "@babel/runtime/helpers/esm/extends";

/* eslint max-lines: off */
import { ZalgoPromise } from 'zalgo-promise/src';
import { linkFrameWindow, isWindowClosed, assertSameDomain } from 'cross-domain-utils/src';
import { WeakMap } from 'cross-domain-safe-weakmap/src';
import { inlineMemoize, memoize, noop, stringify, capitalizeFirstLetter, once, extend, safeInterval, uniqueID, arrayFrom, ExtendableError, strHashStr } from './util';
import { isDevice } from './device';
import { KEY_CODES, ATTRIBUTES, UID_HASH_LENGTH } from './constants';
export function getBody() {
  // eslint-disable-next-line compat/compat
  var body = document.body;

  if (!body) {
    throw new Error("Body element not found");
  }

  return body;
}
export function isDocumentReady() {
  // eslint-disable-next-line compat/compat
  return Boolean(document.body) && document.readyState === 'complete';
}
export function isDocumentInteractive() {
  // eslint-disable-next-line compat/compat
  return Boolean(document.body) && document.readyState === 'interactive';
}
export function urlEncode(str) {
  return encodeURIComponent(str);
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
export var waitForDocumentReady = memoize(function () {
  return new ZalgoPromise(function (resolve) {
    if (isDocumentReady() || isDocumentInteractive()) {
      return resolve();
    }

    var interval = setInterval(function () {
      if (isDocumentReady() || isDocumentInteractive()) {
        clearInterval(interval);
        return resolve();
      }
    }, 10);
  });
});
export function waitForDocumentBody() {
  return ZalgoPromise.try(function () {
    if (document.body) {
      return document.body;
    }

    return waitForDocumentReady().then(function () {
      if (document.body) {
        return document.body;
      }

      throw new Error('Document ready but document.body not present');
    });
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

    for (var _i2 = 0, _queryString$split2 = queryString.split('&'); _i2 < _queryString$split2.length; _i2++) {
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
export function formatQuery(obj) {
  if (obj === void 0) {
    obj = {};
  }

  return Object.keys(obj).filter(function (key) {
    return typeof obj[key] === 'string' || typeof obj[key] === 'boolean';
  }).map(function (key) {
    var val = obj[key];

    if (typeof val !== 'string' && typeof val !== 'boolean') {
      throw new TypeError("Invalid type for query");
    }

    return urlEncode(key) + "=" + urlEncode(val.toString());
  }).join('&');
}
export function extendQuery(originalQuery, props) {
  if (props === void 0) {
    props = {};
  }

  if (!props || !Object.keys(props).length) {
    return originalQuery;
  }

  return formatQuery(_extends({}, parseQuery(originalQuery), props));
}
export function extendUrl(url, options) {
  var query = options.query || {};
  var hash = options.hash || {};
  var originalUrl;
  var originalQuery;
  var originalHash;

  var _url$split = url.split('#');

  originalUrl = _url$split[0];
  originalHash = _url$split[1];

  var _originalUrl$split = originalUrl.split('?');

  originalUrl = _originalUrl$split[0];
  originalQuery = _originalUrl$split[1];
  var queryString = extendQuery(originalQuery, query);
  var hashString = extendQuery(originalHash, hash);

  if (queryString) {
    originalUrl = originalUrl + "?" + queryString;
  }

  if (hashString) {
    originalUrl = originalUrl + "#" + hashString;
  }

  return originalUrl;
}
export function redirect(url, win) {
  if (win === void 0) {
    win = window;
  }

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
export function getPerformance() {
  return inlineMemoize(getPerformance, function () {
    var performance = window.performance;

    if (performance && performance.now && performance.timing && performance.timing.connectEnd && performance.timing.navigationStart && Math.abs(performance.now() - Date.now()) > 1000 && performance.now() - (performance.timing.connectEnd - performance.timing.navigationStart) > 0) {
      return performance;
    }
  });
}
export function enablePerformance() {
  return Boolean(getPerformance());
}
export function getPageRenderTime() {
  return waitForDocumentReady().then(function () {
    var performance = getPerformance();

    if (!performance) {
      return;
    }

    var timing = performance.timing;

    if (timing.connectEnd && timing.domInteractive) {
      return timing.domInteractive - timing.connectEnd;
    }
  });
}
export function htmlEncode(html) {
  if (html === void 0) {
    html = '';
  }

  return html.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\//g, '&#x2F;');
}
export function isBrowser() {
  return typeof window !== 'undefined' && window.location !== undefined;
}
export function querySelectorAll(selector, doc) {
  if (doc === void 0) {
    doc = window.document;
  }

  // $FlowFixMe[method-unbinding]
  return Array.prototype.slice.call(doc.querySelectorAll(selector));
}
export function onClick(element, handler) {
  element.addEventListener('touchstart', noop);
  element.addEventListener('click', handler);
  element.addEventListener('keypress', function (event) {
    // $FlowFixMe
    if (event.keyCode === KEY_CODES.ENTER || event.keyCode === KEY_CODES.SPACE) {
      // eslint-disable-line unicorn/prefer-event-key
      return handler(event);
    }
  });
}
export function getScript(_ref) {
  var _ref$host = _ref.host,
      host = _ref$host === void 0 ? window.location.host : _ref$host,
      path = _ref.path,
      _ref$reverse = _ref.reverse,
      reverse = _ref$reverse === void 0 ? false : _ref$reverse;
  return inlineMemoize(getScript, function () {
    var url = "" + host + path; // $FlowFixMe[method-unbinding]

    var scripts = Array.prototype.slice.call(document.getElementsByTagName('script'));

    if (reverse) {
      scripts.reverse();
    }

    for (var _i4 = 0; _i4 < scripts.length; _i4++) {
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
    } catch (err) {// pass
    }

    return false;
  });
}
export function getBrowserLocales() {
  var nav = window.navigator;
  var locales = nav.languages ? [].concat(nav.languages) : [];

  if (nav.language) {
    locales.push(nav.language);
  }

  if (nav.userLanguage) {
    locales.push(nav.userLanguage);
  }

  return locales.map(function (locale) {
    if (locale && locale.match(/^[a-z]{2}[-_][A-Z]{2}$/)) {
      var _locale$split = locale.split(/[-_]/),
          lang = _locale$split[0],
          country = _locale$split[1];

      return {
        country: country,
        lang: lang
      };
    }

    if (locale && locale.match(/^[a-z]{2}$/)) {
      return {
        lang: locale
      };
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

  if (element !== null && typeof element === 'object' && element.nodeType === 1 && typeof element.style === 'object' && typeof element.ownerDocument === 'object') {
    return true;
  }

  return false;
}
export function getElementSafe(id, doc) {
  if (doc === void 0) {
    doc = document;
  }

  if (isElement(id)) {
    // $FlowFixMe
    return id;
  }

  if (typeof id === 'string') {
    return doc.querySelector(id);
  }
}
export function getElement(id, doc) {
  if (doc === void 0) {
    doc = document;
  }

  var element = getElementSafe(id, doc);

  if (element) {
    return element;
  }

  throw new Error("Can not find element: " + stringify(id));
}
export function elementReady(id) {
  return new ZalgoPromise(function (resolve, reject) {
    var name = stringify(id);
    var el = getElementSafe(id);

    if (el) {
      return resolve(el);
    }

    if (isDocumentReady()) {
      return reject(new Error("Document is ready and element " + name + " does not exist"));
    }

    var interval = setInterval(function () {
      el = getElementSafe(id);

      if (el) {
        resolve(el);
        clearInterval(interval);
        return;
      }

      if (isDocumentReady()) {
        clearInterval(interval);
        return reject(new Error("Document is ready and element " + name + " does not exist"));
      }
    }, 10);
  });
} // eslint-disable-next-line unicorn/custom-error-definition

export var PopupOpenError = /*#__PURE__*/function (_ExtendableError) {
  _inheritsLoose(PopupOpenError, _ExtendableError);

  function PopupOpenError() {
    return _ExtendableError.apply(this, arguments) || this;
  }

  return PopupOpenError;
}(ExtendableError);
export function popup(url, options) {
  // $FlowFixMe
  options = options || {};
  var _options = options,
      _options$closeOnUnloa = _options.closeOnUnload,
      closeOnUnload = _options$closeOnUnloa === void 0 ? 1 : _options$closeOnUnloa,
      _options$name = _options.name,
      name = _options$name === void 0 ? '' : _options$name,
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

  delete options.closeOnUnload;
  delete options.name;

  if (width && height) {
    // $FlowFixMe
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
  } // eslint-disable-next-line array-callback-return


  var params = Object.keys(options).map(function (key) {
    // $FlowFixMe
    if (options[key] !== null && options[key] !== undefined) {
      return key + "=" + stringify(options[key]);
    }
  }).filter(Boolean).join(',');
  var win;

  try {
    win = window.open(url, name, params);
  } catch (err) {
    throw new PopupOpenError("Can not open popup window - " + (err.stack || err.message));
  }

  if (isWindowClosed(win)) {
    var err = new PopupOpenError("Can not open popup window - blocked");
    throw err;
  }

  if (closeOnUnload) {
    window.addEventListener('unload', function () {
      return win.close();
    });
  }

  return win;
}
export function writeToWindow(win, html) {
  try {
    win.document.open();
    win.document.write(html);
    win.document.close();
  } catch (err) {
    try {
      win.location = "javascript: document.open(); document.write(" + JSON.stringify(html) + "); document.close();";
    } catch (err2) {// pass
    }
  }
}
export function writeElementToWindow(win, el) {
  var tag = el.tagName.toLowerCase();

  if (tag !== 'html') {
    throw new Error("Expected element to be html, got " + tag);
  }

  var documentElement = win.document.documentElement;

  for (var _i6 = 0, _arrayFrom2 = arrayFrom(documentElement.children); _i6 < _arrayFrom2.length; _i6++) {
    var child = _arrayFrom2[_i6];
    documentElement.removeChild(child);
  }

  for (var _i8 = 0, _arrayFrom4 = arrayFrom(el.children); _i8 < _arrayFrom4.length; _i8++) {
    var _child = _arrayFrom4[_i8];
    documentElement.appendChild(_child);
  }
}
export function setStyle(el, styleText, doc) {
  if (doc === void 0) {
    doc = window.document;
  }

  // $FlowFixMe
  if (el.styleSheet) {
    // $FlowFixMe
    el.styleSheet.cssText = styleText;
  } else {
    el.appendChild(doc.createTextNode(styleText));
  }
}
var awaitFrameLoadPromises;
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
      throw new Error("Could not find window in iframe");
    }

    return loadedFrame.contentWindow;
  });
}

var getDefaultCreateElementOptions = function getDefaultCreateElementOptions() {
  // $FlowFixMe
  return {};
};

export function createElement(tag, options, container) {
  if (tag === void 0) {
    tag = 'div';
  }

  if (options === void 0) {
    options = getDefaultCreateElementOptions();
  }

  tag = tag.toLowerCase();
  var element = document.createElement(tag);

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
    for (var _i10 = 0, _Object$keys2 = Object.keys(options.attributes); _i10 < _Object$keys2.length; _i10++) {
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
        throw new Error("Iframe html can not be written unless container provided and iframe in DOM");
      } // $FlowFixMe


      writeToWindow(element.contentWindow, options.html);
    } else {
      element.innerHTML = options.html;
    }
  }

  return element;
}

var getDefaultIframeOptions = function getDefaultIframeOptions() {
  // $FlowFixMe
  return {};
};

var getDefaultStringMap = function getDefaultStringMap() {
  // $FlowFixMe
  return {};
};

export function iframe(options, container) {
  if (options === void 0) {
    options = getDefaultIframeOptions();
  }

  var attributes = options.attributes || getDefaultStringMap();
  var style = options.style || getDefaultStringMap(); // $FlowFixMe

  var newAttributes = _extends({
    allowTransparency: 'true'
  }, attributes); // $FlowFixMe


  var newStyle = _extends({
    backgroundColor: 'transparent',
    border: 'none'
  }, style);

  var frame = createElement('iframe', {
    attributes: newAttributes,
    style: newStyle,
    html: options.html,
    class: options.class
  });
  var isIE = window.navigator.userAgent.match(/MSIE|Edge/i);

  if (!frame.hasAttribute('id')) {
    frame.setAttribute('id', uniqueID());
  } // $FlowFixMe


  awaitFrameLoad(frame);

  if (container) {
    var el = getElement(container);
    el.appendChild(frame);
  }

  if (options.url || isIE) {
    frame.setAttribute('src', options.url || 'about:blank');
  } // $FlowFixMe


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

  for (var _i12 = 0; _i12 < eventNames.length; _i12++) {
    var eventName = eventNames[_i12];
    element.addEventListener(eventName, handler);
  }

  return {
    cancel: once(function () {
      for (var _i14 = 0; _i14 < eventNames.length; _i14++) {
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

  for (var _i16 = 0; _i16 < VENDOR_PREFIXES.length; _i16++) {
    var prefix = VENDOR_PREFIXES[_i16];
    // $FlowFixMe
    element.style["" + prefix + capitalizedName] = value;
  }
}
var ANIMATION_START_EVENTS = ['animationstart', 'webkitAnimationStart', 'oAnimationStart', 'MSAnimationStart'];
var ANIMATION_END_EVENTS = ['animationend', 'webkitAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd'];
export function animate(element, name, clean, timeout) {
  if (timeout === void 0) {
    timeout = 1000;
  }

  return new ZalgoPromise(function (resolve, reject) {
    var el = getElement(element);

    if (!el) {
      return resolve();
    }

    var hasStarted = false; // eslint-disable-next-line prefer-const

    var startTimeout;
    var endTimeout; // eslint-disable-next-line prefer-const

    var startEvent; // eslint-disable-next-line prefer-const

    var endEvent;

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

      cleanUp(); // $FlowFixMe

      if (typeof event.animationName === 'string' && event.animationName !== name) {
        return reject("Expected animation name to be " + name + ", found " + event.animationName);
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
export function makeElementVisible(element) {
  element.style.setProperty('visibility', '');
}
export function makeElementInvisible(element) {
  element.style.setProperty('visibility', 'hidden', 'important');
}
export function showElement(element) {
  element.style.setProperty('display', '');
}
export function hideElement(element) {
  element.style.setProperty('display', 'none', 'important');
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
  if (!el || !el.parentNode || !el.ownerDocument || !el.ownerDocument.documentElement || !el.ownerDocument.documentElement.contains(el)) {
    return true;
  }

  return false;
}
export function watchElementForClose(element, handler) {
  handler = once(handler);
  var cancelled = false;
  var mutationObservers = []; // eslint-disable-next-line prefer-const

  var interval; // eslint-disable-next-line prefer-const

  var sacrificialFrame;
  var sacrificialFrameWin;

  var cancel = function cancel() {
    cancelled = true;

    for (var _i18 = 0; _i18 < mutationObservers.length; _i18++) {
      var observer = mutationObservers[_i18];
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

  var elementClosed = function elementClosed() {
    if (!cancelled) {
      handler();
      cancel();
    }
  };

  if (isElementClosed(element)) {
    elementClosed();
    return {
      cancel: cancel
    };
  } // Strategy 1: Mutation observer


  if (window.MutationObserver) {
    var mutationElement = element.parentElement;

    while (mutationElement) {
      var mutationObserver = new window.MutationObserver(function () {
        if (isElementClosed(element)) {
          elementClosed();
        }
      });
      mutationObserver.observe(mutationElement, {
        childList: true
      });
      mutationObservers.push(mutationObserver);
      mutationElement = mutationElement.parentElement;
    }
  } // Strategy 2: Sacrificial iframe


  sacrificialFrame = document.createElement('iframe');
  sacrificialFrame.setAttribute('name', "__detect_close_" + uniqueID() + "__");
  sacrificialFrame.style.display = 'none';
  awaitFrameWindow(sacrificialFrame).then(function (frameWin) {
    sacrificialFrameWin = assertSameDomain(frameWin);
    sacrificialFrameWin.addEventListener('unload', elementClosed);
  });
  element.appendChild(sacrificialFrame); // Strategy 3: Poller

  var check = function check() {
    if (isElementClosed(element)) {
      elementClosed();
    }
  };

  interval = safeInterval(check, 1000);
  return {
    cancel: cancel
  };
}
export function fixScripts(el, doc) {
  if (doc === void 0) {
    doc = window.document;
  }

  for (var _i20 = 0, _querySelectorAll2 = querySelectorAll('script', el); _i20 < _querySelectorAll2.length; _i20++) {
    var script = _querySelectorAll2[_i20];
    var parentNode = script.parentNode;

    if (!parentNode) {
      continue;
    }

    var newScript = doc.createElement('script');
    newScript.text = script.textContent;
    parentNode.replaceChild(newScript, script);
  }
}
export function onResize(el, handler, _temp) {
  var _ref2 = _temp === void 0 ? {} : _temp,
      _ref2$width = _ref2.width,
      width = _ref2$width === void 0 ? true : _ref2$width,
      _ref2$height = _ref2.height,
      height = _ref2$height === void 0 ? true : _ref2$height,
      _ref2$interval = _ref2.interval,
      interval = _ref2$interval === void 0 ? 100 : _ref2$interval,
      _ref2$win = _ref2.win,
      win = _ref2$win === void 0 ? window : _ref2$win;

  var currentWidth = el.offsetWidth;
  var currentHeight = el.offsetHeight;
  var canceled = false;
  handler({
    width: currentWidth,
    height: currentHeight
  });

  var check = function check() {
    if (canceled || !isElementVisible(el)) {
      return;
    }

    var newWidth = el.offsetWidth;
    var newHeight = el.offsetHeight;

    if (width && newWidth !== currentWidth || height && newHeight !== currentHeight) {
      handler({
        width: newWidth,
        height: newHeight
      });
    }

    currentWidth = newWidth;
    currentHeight = newHeight;
  };

  var observer;
  var timeout;
  win.addEventListener('resize', check);

  if (typeof win.ResizeObserver !== 'undefined') {
    observer = new win.ResizeObserver(check);
    observer.observe(el);
    timeout = safeInterval(check, interval * 10);
  } else if (typeof win.MutationObserver !== 'undefined') {
    observer = new win.MutationObserver(check);
    observer.observe(el, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: false
    });
    timeout = safeInterval(check, interval * 10);
  } else {
    timeout = safeInterval(check, interval);
  }

  return {
    cancel: function cancel() {
      canceled = true;
      observer.disconnect();
      window.removeEventListener('resize', check);
      timeout.cancel();
    }
  };
}
export function getResourceLoadTime(url) {
  var performance = getPerformance();

  if (!performance) {
    return;
  } // $FlowFixMe[method-unbinding]


  if (typeof performance.getEntries !== 'function') {
    return;
  }

  var entries = performance.getEntries();

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];

    if (entry && entry.name && entry.name.indexOf(url) === 0 && typeof entry.duration === 'number') {
      return Math.floor(entry.duration);
    }
  }
}
export function isShadowElement(element) {
  while (element.parentNode) {
    element = element.parentNode;
  }

  return element.toString() === '[object ShadowRoot]';
}
export function getShadowRoot(element) {
  while (element.parentNode) {
    element = element.parentNode;
  }

  if (isShadowElement(element)) {
    return element;
  }
}
export function getShadowHost(element) {
  var shadowRoot = getShadowRoot(element); // $FlowFixMe

  if (shadowRoot && shadowRoot.host) {
    // $FlowFixMe
    return shadowRoot.host;
  }
}
export function insertShadowSlot(element) {
  var shadowHost = getShadowHost(element);

  if (!shadowHost) {
    throw new Error("Element is not in shadow dom");
  }

  var slotName = "shadow-slot-" + uniqueID();
  var slot = document.createElement('slot');
  slot.setAttribute('name', slotName);
  element.appendChild(slot);
  var slotProvider = document.createElement('div');
  slotProvider.setAttribute('slot', slotName);
  shadowHost.appendChild(slotProvider);

  if (isShadowElement(shadowHost)) {
    return insertShadowSlot(slotProvider);
  }

  return slotProvider;
}
export function preventClickFocus(el) {
  var onFocus = function onFocus(event) {
    el.removeEventListener('focus', onFocus);
    event.preventDefault();
    el.blur();
    return false;
  };

  el.addEventListener('mousedown', function () {
    el.addEventListener('focus', onFocus);
    setTimeout(function () {
      el.removeEventListener('focus', onFocus);
    }, 1);
  });
}
export function getStackTrace() {
  try {
    throw new Error('_');
  } catch (err) {
    return err.stack || '';
  }
}

function inferCurrentScript() {
  try {
    var stack = getStackTrace();
    var stackDetails = /.*at [^(]*\((.*):(.+):(.+)\)$/ig.exec(stack);
    var scriptLocation = stackDetails && stackDetails[1];

    if (!scriptLocation) {
      return;
    } // $FlowFixMe[method-unbinding]


    for (var _i22 = 0, _Array$prototype$slic2 = Array.prototype.slice.call(document.getElementsByTagName('script')).reverse(); _i22 < _Array$prototype$slic2.length; _i22++) {
      var script = _Array$prototype$slic2[_i22];

      if (script.src && script.src === scriptLocation) {
        return script;
      }
    }
  } catch (err) {// pass
  }
} // eslint-disable-next-line compat/compat


var currentScript = typeof document !== 'undefined' ? document.currentScript : null;
export var getCurrentScript = memoize(function () {
  if (currentScript) {
    return currentScript;
  }

  currentScript = inferCurrentScript();

  if (currentScript) {
    return currentScript;
  }

  throw new Error('Can not determine current script');
});
var currentUID = uniqueID();
export var getCurrentScriptUID = memoize(function () {
  var script;

  try {
    script = getCurrentScript();
  } catch (err) {
    return currentUID;
  }

  var uid = script.getAttribute(ATTRIBUTES.UID);

  if (uid && typeof uid === 'string') {
    return uid;
  }

  uid = script.getAttribute(ATTRIBUTES.UID + "-auto");

  if (uid && typeof uid === 'string') {
    return uid;
  }

  if (script.src) {
    var _script = script,
        src = _script.src,
        dataset = _script.dataset;
    var stringToHash = JSON.stringify({
      src: src,
      dataset: dataset
    });
    var hashedString = strHashStr(stringToHash);
    var hashResult = hashedString.slice(hashedString.length - UID_HASH_LENGTH);
    uid = "uid_" + hashResult;
  } else {
    uid = uniqueID();
  }

  script.setAttribute(ATTRIBUTES.UID + "-auto", uid);
  return uid;
});
export function submitForm(_ref3) {
  var url = _ref3.url,
      target = _ref3.target,
      body = _ref3.body,
      _ref3$method = _ref3.method,
      method = _ref3$method === void 0 ? 'post' : _ref3$method;
  var form = document.createElement('form');
  form.setAttribute('target', target);
  form.setAttribute('method', method);
  form.setAttribute('action', url);
  form.style.display = 'none';

  if (body) {
    for (var _i24 = 0, _Object$keys4 = Object.keys(body); _i24 < _Object$keys4.length; _i24++) {
      var _body$key;

      var key = _Object$keys4[_i24];
      var input = document.createElement('input');
      input.setAttribute('name', key);
      input.setAttribute('value', (_body$key = body[key]) == null ? void 0 : _body$key.toString());
      form.appendChild(input);
    }
  }

  getBody().appendChild(form);
  form.submit();
  getBody().removeChild(form);
}