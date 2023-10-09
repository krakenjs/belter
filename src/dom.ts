/* eslint max-lines: off */
import { ZalgoPromise } from "@krakenjs/zalgo-promise";
import type {
  SameDomainWindowType,
  CrossDomainWindowType,
} from "@krakenjs/cross-domain-utils/dist/esm";
import {
  linkFrameWindow,
  isWindowClosed,
  assertSameDomain,
} from "@krakenjs/cross-domain-utils/dist/esm";
import { WeakMap } from "@krakenjs/cross-domain-safe-weakmap/dist/esm";

import {
  isElement,
  inlineMemoize,
  memoize,
  noop,
  stringify,
  capitalizeFirstLetter,
  once,
  extend,
  safeInterval,
  uniqueID,
  arrayFrom,
  ExtendableError,
  strHashStr,
} from "./util";
import { isDevice } from "./device";
import { KEY_CODES, ATTRIBUTES, UID_HASH_LENGTH } from "./constants";
import type { CancelableType } from "./types";

type ElementRefType = string | HTMLElement;

export function getBody(): HTMLBodyElement | HTMLElement {
  const body = document.body;

  if (!body) {
    throw new Error(`Body element not found`);
  }

  return body;
}

export function isDocumentReady(): boolean {
  return Boolean(document.body) && document.readyState === "complete";
}

export function isDocumentInteractive(): boolean {
  return Boolean(document.body) && document.readyState === "interactive";
}

export function urlEncode(str: string): string {
  return encodeURIComponent(str);
}

export function waitForWindowReady(): ZalgoPromise<void> {
  return inlineMemoize(waitForWindowReady, (): ZalgoPromise<void> => {
    return new ZalgoPromise((resolve) => {
      if (isDocumentReady()) {
        resolve();
      }

      window.addEventListener("load", () => {
        resolve();
      });
    });
  });
}

type WaitForDocumentReady = () => ZalgoPromise<void>;

export const waitForDocumentReady: WaitForDocumentReady = memoize(() => {
  return new ZalgoPromise((resolve) => {
    if (isDocumentReady() || isDocumentInteractive()) {
      resolve();
      return;
    }

    const interval = setInterval(() => {
      if (isDocumentReady() || isDocumentInteractive()) {
        clearInterval(interval);
        resolve();
      }
    }, 10);
  });
});

export function waitForDocumentBody(): ZalgoPromise<
  HTMLElement | ZalgoPromise<HTMLElement>
> {
  return ZalgoPromise.try(() => {
    if (document.body) {
      return document.body;
    }

    return waitForDocumentReady().then(() => {
      if (document.body) {
        return document.body;
      }

      throw new Error("Document ready but document.body not present");
    });
  });
}

export function parseQuery(queryString: string): Record<string, any> {
  return inlineMemoize(
    parseQuery,
    (): Record<string, any> => {
      const params = {};

      if (!queryString) {
        return params;
      }

      if (!queryString.includes("=")) {
        return params;
      }

      for (let pair of queryString.split("&")) {
        // @ts-expect-error pair.split is a string[] not string so this isnt a safe assignment
        pair = pair.split("=");

        if (pair[0] && pair[1]) {
          // @ts-expect-error we need to clean this lhs up
          params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
      }

      return params;
    },
    [queryString]
  );
}

export function getQueryParam(name: string): string {
  return parseQuery(window.location.search.slice(1))[name];
}

export function urlWillRedirectPage(url: string): boolean {
  if (!url.includes("#")) {
    return true;
  }

  if (url.startsWith("#")) {
    return false;
  }

  if (url.split("#")[0] === window.location.href.split("#")[0]) {
    return false;
  }

  return true;
}

export type Query = Record<string, boolean | string>;

export function formatQuery(obj: Query = {}): string {
  return Object.keys(obj)
    .filter((key) => {
      return typeof obj[key] === "string" || typeof obj[key] === "boolean";
    })
    .map((key) => {
      const val = obj[key];

      if (typeof val !== "string" && typeof val !== "boolean") {
        throw new TypeError(`Invalid type for query`);
      }

      return `${urlEncode(key)}=${urlEncode(val.toString())}`;
    })
    .join("&");
}

export function extendQuery(originalQuery: string, props: Query = {}): string {
  if (!props || !Object.keys(props).length) {
    return originalQuery;
  }

  return formatQuery({ ...parseQuery(originalQuery), ...props });
}

export function extendUrl(
  url: string,
  options: {
    query?: Query;
    hash?: Query;
  }
): string {
  const query = options.query || {};
  const hash = options.hash || {};
  let originalUrl;
  let originalQuery;
  let originalHash;
  // eslint-disable-next-line prefer-const
  [originalUrl, originalHash] = url.split("#");
  // eslint-disable-next-line prefer-const
  [originalUrl, originalQuery] = originalUrl.split("?");
  const queryString = extendQuery(originalQuery, query);
  const hashString = extendQuery(originalHash, hash);

  if (queryString) {
    originalUrl = `${originalUrl}?${queryString}`;
  }

  if (hashString) {
    originalUrl = `${originalUrl}#${hashString}`;
  }

  return originalUrl;
}

export function redirect(
  url: string,
  win: CrossDomainWindowType = window
): ZalgoPromise<void> {
  return new ZalgoPromise((resolve) => {
    win.location = url;

    if (!urlWillRedirectPage(url)) {
      resolve();
    }
  });
}

export function hasMetaViewPort(): boolean {
  const meta = document.querySelector("meta[name=viewport]");

  if (isDevice() && window.screen.width < 660 && !meta) {
    return false;
  }

  return true;
}

export function isElementVisible(el: HTMLElement): boolean {
  return Boolean(
    el.offsetWidth || el.offsetHeight || el.getClientRects().length
  );
}

export function getPerformance(): Performance | undefined | undefined {
  return inlineMemoize(
    getPerformance,
    (): Performance | undefined | undefined => {
      const performance = window.performance;

      if (
        performance &&
        performance.now &&
        performance.timing &&
        performance.timing.connectEnd &&
        performance.timing.navigationStart &&
        Math.abs(performance.now() - Date.now()) > 1000 &&
        performance.now() -
          (performance.timing.connectEnd - performance.timing.navigationStart) >
          0
      ) {
        return performance;
      }
    }
  );
}

export function enablePerformance(): boolean {
  return Boolean(getPerformance());
}

export function getPageRenderTime(): ZalgoPromise<
  number | undefined | undefined
> {
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

export function htmlEncode(html = ""): string {
  return html
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;");
}

export function isBrowser(): boolean {
  return typeof window !== "undefined" && window.location !== undefined;
}

export function querySelectorAll(
  selector: string,
  doc: Document = window.document
): readonly HTMLElement[] {
  // $FlowFixMe[method-unbinding]
  return Array.prototype.slice.call(doc.querySelectorAll(selector));
}

/**
 * Sets up event handlers for click events and
 * enter/space keypresses.
 * @callback handler
 * @param {HTMLElement} element
 * @param {handler} handler
 */
export function onClick(
  element: HTMLElement,
  handler: (arg0: Event) => void
): void {
  element.addEventListener("touchstart", noop, { passive: true });
  element.addEventListener("click", handler);
  element.addEventListener("keypress", (event: KeyboardEvent) => {
    if (
      event.keyCode === KEY_CODES.ENTER ||
      event.keyCode === KEY_CODES.SPACE
    ) {
      handler(event);
    }
  });
}

export function getScript({
  host = window.location.host,
  path,
  reverse = false,
}: {
  host?: string;
  path: string;
  reverse?: boolean;
}): HTMLScriptElement | undefined | undefined {
  return inlineMemoize(
    getScript,
    (): HTMLScriptElement | undefined | undefined => {
      const url = `${host}${path}`;
      // $FlowFixMe[method-unbinding]
      const scripts = Array.prototype.slice.call(
        document.getElementsByTagName("script")
      );

      if (reverse) {
        scripts.reverse();
      }

      for (const script of scripts) {
        if (!script.src) {
          continue;
        }

        const src = script.src.replace(/^https?:\/\//, "").split("?")[0];

        if (src === url) {
          return script;
        }
      }
    },
    [path]
  );
}

export function isLocalStorageEnabled(): boolean {
  return inlineMemoize(isLocalStorageEnabled, () => {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      if (window.localStorage) {
        const value = Math.random().toString();
        window.localStorage.setItem("__test__localStorage__", value);
        const result = window.localStorage.getItem("__test__localStorage__");
        window.localStorage.removeItem("__test__localStorage__");

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

export function getBrowserLocales(): ReadonlyArray<
  | {
      country?: string;
      lang: string;
    }
  | undefined
  | null
> {
  const nav = window.navigator;
  const locales = nav.languages ? [...nav.languages] : [];

  if (nav.language) {
    locales.push(nav.language);
  }

  // @ts-expect-error Property 'userLanguage' does not exist on type 'Navigator'.ts(2339)
  if (nav.userLanguage) {
    // @ts-expect-error Property 'userLanguage' does not exist on type 'Navigator'.ts(2339)
    locales.push(nav.userLanguage);
  }

  return locales
    .map((locale) => {
      if (locale && /^[a-z]{2}[-_][A-Z]{2}$/.exec(locale)) {
        const [lang, country] = locale.split(/[-_]/);
        return {
          country,
          lang,
        };
      }

      if (locale && /^[a-z]{2}$/.exec(locale)) {
        return {
          lang: locale,
        };
      }

      // TSTODO: can we remove this null?
      return null;
    })
    .filter(Boolean);
}

export function appendChild(
  container: HTMLElement,
  child: HTMLElement | Text
): void {
  container.appendChild(child);
}

export function getElementSafe(
  id: ElementRefType,
  doc: Document | HTMLElement = document
): HTMLElement | undefined | undefined {
  if (isElement(id)) {
    // @ts-expect-error - no idea what we are doing here
    return id;
  }

  if (typeof id === "string") {
    // @ts-expect-error id can be null or undefined still
    return doc.querySelector(id);
  }
}

export function getElement(
  id: ElementRefType,
  doc: Document | HTMLElement = document
): HTMLElement {
  const element = getElementSafe(id, doc);

  if (element) {
    return element;
  }

  throw new Error(`Can not find element: ${stringify(id)}`);
}

export function elementReady(id: ElementRefType): ZalgoPromise<HTMLElement> {
  return new ZalgoPromise((resolve, reject) => {
    const name = stringify(id);
    let el = getElementSafe(id);

    if (el) {
      resolve(el);
      return;
    }

    if (isDocumentReady()) {
      reject(new Error(`Document is ready and element ${name} does not exist`));
      return;
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
        reject(
          new Error(`Document is ready and element ${name} does not exist`)
        );
      }
    }, 10);
  });
}

export class PopupOpenError extends ExtendableError {}

type PopupOptions = {
  name?: string;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  status?: 0 | 1;
  resizable?: 0 | 1;
  toolbar?: 0 | 1;
  menubar?: 0 | 1;
  scrollbars?: 0 | 1;
  closeOnUnload?: 0 | 1;
};

export function popup(
  url: string,
  options?: PopupOptions
): CrossDomainWindowType {
  // $FlowFixMe
  options = options || {};
  const { closeOnUnload = 1, name = "", width, height } = options;
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
      status: 1,
      toolbar: 0,
      menubar: 0,
      resizable: 1,
      scrollbars: 1,
      ...options,
    };
  }

  const params = Object.keys(options)
    .map((key) => {
      // @ts-expect-error cant see index for some reason
      if (options[key] !== null && options[key] !== undefined) {
        // @ts-expect-error cant see index for some reason
        return `${key}=${stringify(options[key])}`;
      }
    })
    .filter(Boolean)
    .join(",");

  let win: Window;

  try {
    // @ts-expect-error window.open can be null but we didn't account for that
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    win = window.open(url, name, params);
  } catch (err) {
    throw new PopupOpenError(
      `Can not open popup window - ${
        (err as Error).stack || (err as Error).message
      }`
    );
  }

  if (isWindowClosed(win)) {
    const err = new PopupOpenError(`Can not open popup window - blocked`);
    throw err;
  }

  if (closeOnUnload) {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    window.addEventListener("unload", () => win.close());
  }

  return win;
}

export function writeToWindow(win: SameDomainWindowType, html: string): void {
  try {
    win.document.open();
    win.document.write(html);
    win.document.close();
  } catch (err) {
    try {
      // @ts-expect-error string is not assignable to window.location
      win.location = `javascript: document.open(); document.write(${JSON.stringify(
        html
      )}); document.close();`;
    } catch (err2) {
      // pass
    }
  }
}

export function writeElementToWindow(
  win: SameDomainWindowType,
  el: HTMLElement
): void {
  const tag = el.tagName.toLowerCase();

  if (tag !== "html") {
    throw new Error(`Expected element to be html, got ${tag}`);
  }

  const documentElement = win.document.documentElement;

  for (const child of arrayFrom(documentElement.children)) {
    // @ts-expect-error HTMLCollection element is not same as node
    documentElement.removeChild(child);
  }

  for (const child of arrayFrom(el.children)) {
    // @ts-expect-error HTMLCollection element is not same as node
    documentElement.appendChild(child);
  }
}

export function setStyle(
  el: HTMLElement,
  styleText: string,
  doc: Document = window.document
): void {
  // @ts-expect-error styleSheet does not exist on HTMLElement
  if (el.styleSheet) {
    // @ts-expect-error styleSheet does not exist on HTMLElement
    el.styleSheet.cssText = styleText;
  } else {
    el.appendChild(doc.createTextNode(styleText));
  }
}

export type ElementOptionsType = {
  style?: Record<string, string>;
  id?: string;
  class?: readonly string[] | undefined | undefined;
  attributes?: Record<string, string>;
  styleSheet?: string | undefined | undefined;
  html?: string | undefined | undefined;
};
let awaitFrameLoadPromises: WeakMap<
  // @ts-expect-error need to revisit cross-domain-safeweakmap types maybe
  HTMLIFrameElement,
  ZalgoPromise<HTMLIFrameElement>
>;
export function awaitFrameLoad(
  frame: HTMLIFrameElement
): ZalgoPromise<HTMLIFrameElement> {
  awaitFrameLoadPromises = awaitFrameLoadPromises || new WeakMap();

  if (awaitFrameLoadPromises.has(frame)) {
    const promise = awaitFrameLoadPromises.get(frame);

    if (promise) {
      return promise;
    }
  }

  const promise = new ZalgoPromise<HTMLIFrameElement>((resolve, reject) => {
    frame.addEventListener("load", () => {
      linkFrameWindow(frame);
      resolve(frame);
    });
    frame.addEventListener("error", (err: Event) => {
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

export function awaitFrameWindow(
  frame: HTMLIFrameElement
): ZalgoPromise<CrossDomainWindowType> {
  return awaitFrameLoad(frame).then((loadedFrame) => {
    if (!loadedFrame.contentWindow) {
      throw new Error(`Could not find window in iframe`);
    }

    return loadedFrame.contentWindow;
  });
}

const getDefaultCreateElementOptions = (): ElementOptionsType => {
  return {};
};

export function createElement(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  tag = "div",
  // eslint-disable-next-line @typescript-eslint/default-param-last
  options: ElementOptionsType = getDefaultCreateElementOptions(),
  container: HTMLElement | undefined | undefined
): HTMLElement {
  tag = tag.toLowerCase();
  const element = document.createElement(tag);

  if (options.style) {
    extend(element.style, options.style);
  }

  if (options.class) {
    element.className = options.class.join(" ");
  }

  if (options.id) {
    element.setAttribute("id", options.id);
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
    if (tag === "iframe") {
      // @ts-expect-error contentWindow does not exist on HTMLElement
      if (!container || !element.contentWindow) {
        throw new Error(
          `Iframe html can not be written unless container provided and iframe in DOM`
        );
      }

      // @ts-expect-error contentWindow does not exist on HTMLElement
      writeToWindow(element.contentWindow, options.html);
    } else {
      element.innerHTML = options.html;
    }
  }

  return element;
}

type StringMap = Record<string, string>;
export type IframeElementOptionsType = {
  style?: StringMap;
  class?: readonly string[] | undefined | undefined;
  attributes?: StringMap;
  styleSheet?: string | undefined | undefined;
  html?: string | undefined | undefined;
  url?: string | undefined | undefined;
};

const getDefaultIframeOptions = (): IframeElementOptionsType => {
  return {};
};

const getDefaultStringMap = (): StringMap => {
  return {};
};

export function iframe(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  options: IframeElementOptionsType = getDefaultIframeOptions(),
  container: HTMLElement | undefined | undefined
): HTMLIFrameElement {
  const attributes = options.attributes || getDefaultStringMap();
  const style = options.style || getDefaultStringMap();
  const newAttributes = {
    allowTransparency: "true",
    ...attributes,
  };
  const newStyle = {
    backgroundColor: "transparent",
    border: "none",
    ...style,
  };

  // @ts-expect-error - createElement takes 3 args not 2
  const frame = createElement("iframe", {
    attributes: newAttributes,
    style: newStyle,
    html: options.html,
    class: options.class,
  }) as HTMLIFrameElement;

  const isIE = /MSIE|Edge/i.exec(window.navigator.userAgent);

  if (!frame.hasAttribute("id")) {
    frame.setAttribute("id", uniqueID());
  }

  void awaitFrameLoad(frame);

  if (container) {
    const el = getElement(container);
    el.appendChild(frame);
  }

  if (options.url || isIE) {
    frame.setAttribute("src", options.url || "about:blank");
  }

  return frame;
}

export function addEventListener(
  obj: HTMLElement,
  event: string,
  handler: (event: Event) => void
): CancelableType {
  obj.addEventListener(event, handler);
  return {
    cancel() {
      obj.removeEventListener(event, handler);
    },
  };
}

export function bindEvents(
  element: HTMLElement,
  eventNames: readonly string[],
  handler: (event: Event) => void
): CancelableType {
  handler = once(handler);

  for (const eventName of eventNames) {
    element.addEventListener(eventName, handler);
  }

  return {
    cancel: once(() => {
      for (const eventName of eventNames) {
        element.removeEventListener(eventName, handler);
      }
    }),
  };
}

const VENDOR_PREFIXES = ["webkit", "moz", "ms", "o"];

export function setVendorCSS(
  element: HTMLElement,
  name: string,
  value: string
): void {
  // @ts-expect-error indexer as string
  element.style[name] = value;
  const capitalizedName = capitalizeFirstLetter(name);

  for (const prefix of VENDOR_PREFIXES) {
    // @ts-expect-error indexer as string
    element.style[`${prefix}${capitalizedName}`] = value;
  }
}

const ANIMATION_START_EVENTS = [
  "animationstart",
  "webkitAnimationStart",
  "oAnimationStart",
  "MSAnimationStart",
];

const ANIMATION_END_EVENTS = [
  "animationend",
  "webkitAnimationEnd",
  "oAnimationEnd",
  "MSAnimationEnd",
];

export function animate(
  element: ElementRefType,
  name: string,
  clean: (arg0: (...args: any[]) => any) => void,
  timeout = 1000
): ZalgoPromise<void> {
  return new ZalgoPromise((resolve, reject) => {
    const el = getElement(element);

    if (!el) {
      resolve();
      return;
    }

    let hasStarted = false;
    // eslint-disable-next-line prefer-const, no-undef
    let startTimeout: NodeJS.Timeout;
    // eslint-disable-next-line no-undef
    let endTimeout: NodeJS.Timeout;
    // eslint-disable-next-line prefer-const
    let startEvent: ReturnType<typeof safeInterval>;
    // eslint-disable-next-line prefer-const
    let endEvent: ReturnType<typeof safeInterval>;

    function cleanUp() {
      clearTimeout(startTimeout);
      clearTimeout(endTimeout);
      startEvent.cancel();
      endEvent.cancel();
    }

    startEvent = bindEvents(el, ANIMATION_START_EVENTS, (event) => {
      // @ts-expect-error animationName does not exist on event
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
    endEvent = bindEvents(el, ANIMATION_END_EVENTS, (event) => {
      // @ts-expect-error animationName does not exist on event
      if (event.target !== el || event.animationName !== name) {
        return;
      }

      cleanUp();

      if (
        // @ts-expect-error animationName does not exist on event
        typeof event.animationName === "string" &&
        // @ts-expect-error animationName does not exist on event
        event.animationName !== name
      ) {
        reject(
          // @ts-expect-error animationName does not exist on event
          `Expected animation name to be ${name}, found ${event.animationName}`
        );
        return;
      }

      resolve();
    });
    setVendorCSS(el, "animationName", name);
    startTimeout = setTimeout(() => {
      if (!hasStarted) {
        cleanUp();
        resolve();
      }
    }, 200);

    if (clean) {
      clean(cleanUp);
    }
  });
}

export function makeElementVisible(element: HTMLElement): void {
  element.style.setProperty("visibility", "");
}

export function makeElementInvisible(element: HTMLElement): void {
  element.style.setProperty("visibility", "hidden", "important");
}

export function showElement(element: HTMLElement): void {
  element.style.setProperty("display", "");
}

export function hideElement(element: HTMLElement): void {
  element.style.setProperty("display", "none", "important");
}

export function destroyElement(element: HTMLElement): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

export function showAndAnimate(
  element: HTMLElement,
  name: string,
  clean: (arg0: (...args: any[]) => any) => void
): ZalgoPromise<void> {
  const animation = animate(element, name, clean);
  showElement(element);
  return animation;
}

export function animateAndHide(
  element: HTMLElement,
  name: string,
  clean: (arg0: (...args: any[]) => any) => void
): ZalgoPromise<void> {
  return animate(element, name, clean).then(() => {
    hideElement(element);
  });
}

export function addClass(element: HTMLElement, name: string): void {
  element.classList.add(name);
}

export function removeClass(element: HTMLElement, name: string): void {
  element.classList.remove(name);
}

export function isElementClosed(el: HTMLElement): boolean {
  if (
    !el ||
    !el.parentNode ||
    !el.ownerDocument ||
    !el.ownerDocument.documentElement ||
    !el.ownerDocument.documentElement.contains(el)
  ) {
    return true;
  }

  return false;
}

export function watchElementForClose(
  element: HTMLElement,
  handler: () => unknown
): CancelableType {
  handler = once(handler);
  let cancelled = false;
  const mutationObservers: MutationObserver[] = [];
  // eslint-disable-next-line prefer-const
  let interval: ReturnType<typeof safeInterval>;
  // eslint-disable-next-line prefer-const
  let sacrificialFrame: HTMLIFrameElement;
  let sacrificialFrameWin: SameDomainWindowType;

  const cancel = () => {
    cancelled = true;

    for (const observer of mutationObservers) {
      observer.disconnect();
    }

    if (interval) {
      interval.cancel();
    }

    if (sacrificialFrameWin) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      sacrificialFrameWin.removeEventListener("unload", elementClosed);
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
    return {
      cancel,
    };
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
      mutationObserver.observe(mutationElement, {
        childList: true,
      });
      mutationObservers.push(mutationObserver);
      mutationElement = mutationElement.parentElement;
    }
  }

  // Strategy 2: Sacrificial iframe
  sacrificialFrame = document.createElement("iframe");
  sacrificialFrame.setAttribute("name", `__detect_close_${uniqueID()}__`);
  sacrificialFrame.style.display = "none";
  void awaitFrameWindow(sacrificialFrame).then((frameWin) => {
    sacrificialFrameWin = assertSameDomain(frameWin);
    sacrificialFrameWin.addEventListener("unload", elementClosed);
  });
  element.appendChild(sacrificialFrame);

  // Strategy 3: Poller
  const check = () => {
    if (isElementClosed(element)) {
      elementClosed();
    }
  };

  interval = safeInterval(check, 1000);
  return {
    cancel,
  };
}

export function fixScripts(
  el: Document,
  doc: Document = window.document
): void {
  for (const script of querySelectorAll("script", el)) {
    const parentNode = script.parentNode;

    if (!parentNode) {
      continue;
    }

    const newScript = doc.createElement("script");
    // @ts-expect-error textContent can be null
    newScript.text = script.textContent;
    parentNode.replaceChild(newScript, script);
  }
}

type OnResizeOptions = {
  width?: boolean;
  height?: boolean;
  interval?: number;
  win?: SameDomainWindowType;
};
export function onResize(
  el: HTMLElement,
  handler: (arg0: { width: number; height: number }) => void,
  {
    width = true,
    height = true,
    interval = 100,
    win = window,
  }: OnResizeOptions = {}
): {
  cancel: () => void;
} {
  let currentWidth = el.offsetWidth;
  let currentHeight = el.offsetHeight;
  let canceled = false;
  handler({
    width: currentWidth,
    height: currentHeight,
  });

  const check = () => {
    if (canceled || !isElementVisible(el)) {
      return;
    }

    const newWidth = el.offsetWidth;
    const newHeight = el.offsetHeight;

    if (
      (width && newWidth !== currentWidth) ||
      (height && newHeight !== currentHeight)
    ) {
      handler({
        width: newWidth,
        height: newHeight,
      });
    }

    currentWidth = newWidth;
    currentHeight = newHeight;
  };

  let observer: ResizeObserver;
  let timeout: ReturnType<typeof safeInterval>;
  win.addEventListener("resize", check);

  // @ts-expect-error Property 'ResizeObserver' does not exist on type 'SameDomainWindowType'.ts(2339)
  if (typeof win.ResizeObserver !== "undefined") {
    // @ts-expect-error Property 'ResizeObserver' does not exist on type 'SameDomainWindowType'.ts(2339)
    observer = new win.ResizeObserver(check);
    observer.observe(el);
    timeout = safeInterval(check, interval * 10);
    // @ts-expect-error Property 'MutationObserver' does not exist on type 'SameDomainWindowType'.ts(2339)
  } else if (typeof win.MutationObserver !== "undefined") {
    // @ts-expect-error Property 'MutationObserver' does not exist on type 'SameDomainWindowType'.ts(2339)
    observer = new win.MutationObserver(check);
    observer.observe(el, {
      // @ts-expect-error attributes is not a valid property of MutationObserver
      attributes: true,
      childList: true,
      subtree: true,
      characterData: false,
    });
    timeout = safeInterval(check, interval * 10);
  } else {
    timeout = safeInterval(check, interval);
  }

  return {
    cancel: () => {
      canceled = true;
      observer.disconnect();
      window.removeEventListener("resize", check);
      timeout.cancel();
    },
  };
}

export function getResourceLoadTime(
  url: string
): number | undefined | undefined {
  const performance = getPerformance();

  if (!performance) {
    return;
  }

  // $FlowFixMe[method-unbinding]
  if (typeof performance.getEntries !== "function") {
    return;
  }

  const entries = performance.getEntries();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    if (
      entry &&
      entry.name &&
      entry.name.startsWith(url) &&
      typeof entry.duration === "number"
    ) {
      return Math.floor(entry.duration);
    }
  }
}

export function isShadowElement(element: Node): boolean {
  while (element.parentNode) {
    element = element.parentNode;
  }

  // 'element' will evaluate to '[object Object]' when stringified.
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return element.toString() === "[object ShadowRoot]";
}

export function getShadowRoot(element: Node): Node | undefined | undefined {
  while (element.parentNode) {
    element = element.parentNode;
  }

  if (isShadowElement(element)) {
    return element;
  }
}

export function getShadowHost(
  element: Node
): HTMLElement | undefined | undefined {
  const shadowRoot = getShadowRoot(element);

  // @ts-expect-error host does not exist on node
  if (shadowRoot && shadowRoot.host) {
    // @ts-expect-error host does not exist on node
    return shadowRoot.host;
  }
}

export function insertShadowSlot(element: HTMLElement): HTMLElement {
  const shadowHost = getShadowHost(element);

  if (!shadowHost) {
    throw new Error(`Element is not in shadow dom`);
  }

  const slotName = `shadow-slot-${uniqueID()}`;
  const slot = document.createElement("slot");
  slot.setAttribute("name", slotName);
  element.appendChild(slot);
  const slotProvider = document.createElement("div");
  slotProvider.setAttribute("slot", slotName);
  shadowHost.appendChild(slotProvider);

  if (isShadowElement(shadowHost)) {
    return insertShadowSlot(slotProvider);
  }

  return slotProvider;
}

export function preventClickFocus(el: HTMLElement): void {
  const onFocus = (event: Event) => {
    el.removeEventListener("focus", onFocus);
    event.preventDefault();
    el.blur();
    return false;
  };

  el.addEventListener("mousedown", () => {
    el.addEventListener("focus", onFocus);
    setTimeout(() => {
      el.removeEventListener("focus", onFocus);
    }, 1);
  });
}

export function getStackTrace(): string {
  try {
    throw new Error("_");
  } catch (err) {
    return (err as Error).stack || "";
  }
}

function inferCurrentScript(): HTMLScriptElement | undefined | undefined {
  try {
    const stack = getStackTrace();
    const stackDetails = /.*at [^(]*\((.*):(.+):(.+)\)$/gi.exec(stack);
    const scriptLocation = stackDetails && stackDetails[1];

    if (!scriptLocation) {
      return;
    }

    for (const script of Array.prototype.slice
      .call(document.getElementsByTagName("script"))
      .reverse()) {
      if (script.src && script.src === scriptLocation) {
        return script;
      }
    }
  } catch (err) {
    // pass
  }
}

let currentScript: HTMLScriptElement | undefined | null =
  typeof document !== "undefined"
    ? (document.currentScript as HTMLScriptElement)
    : null;

export const getCurrentScript = memoize(() => {
  if (currentScript) {
    return currentScript;
  }

  currentScript = inferCurrentScript();

  if (currentScript) {
    return currentScript;
  }

  throw new Error("Can not determine current script");
});

const currentUID = uniqueID();
type GetCurrentScriptUID = () => string;

export const getCurrentScriptUID: GetCurrentScriptUID = memoize(() => {
  let script;

  try {
    script = getCurrentScript();
  } catch (err) {
    return currentUID;
  }

  let uid = script.getAttribute(ATTRIBUTES.UID);

  if (uid && typeof uid === "string") {
    return uid;
  }

  uid = script.getAttribute(`${ATTRIBUTES.UID}-auto`);

  if (uid && typeof uid === "string") {
    return uid;
  }

  if (script.src) {
    const { src, dataset } = script;
    const stringToHash = JSON.stringify({
      src,
      dataset,
    });
    const hashedString = strHashStr(stringToHash);
    const hashResult = hashedString.slice(
      hashedString.length - UID_HASH_LENGTH
    );
    uid = `uid_${hashResult}`;
  } else {
    uid = uniqueID();
  }

  script.setAttribute(`${ATTRIBUTES.UID}-auto`, uid);
  return uid;
});

type SubmitFormOptions = {
  url: string;
  target: string;
  body?: Record<string, string | boolean>;
  method?: string;
};

export function submitForm({
  url,
  target,
  body,
  method = "post",
}: SubmitFormOptions): void {
  const form = document.createElement("form");
  form.setAttribute("target", target);
  form.setAttribute("method", method);
  form.setAttribute("action", url);
  form.style.display = "none";

  if (body) {
    for (const key of Object.keys(body)) {
      const input = document.createElement("input");
      input.setAttribute("name", key);
      input.setAttribute("value", body[key]?.toString());
      form.appendChild(input);
    }
  }

  getBody().appendChild(form);
  form.submit();
  getBody().removeChild(form);
}
