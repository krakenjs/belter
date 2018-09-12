/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import type { CrossDomainWindowType } from 'cross-domain-utils/src';

import { inlineMemoize, noop } from './util';
import { isDevice } from './device';
import { KEY_CODES } from './constants';

export function isDocumentReady() : boolean {
    return Boolean(document.body) && document.readyState === 'complete';
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

export function waitForDocumentReady() : ZalgoPromise<void> {
    return inlineMemoize(waitForDocumentReady, () : ZalgoPromise<void> => {
        return new ZalgoPromise(resolve => {

            if (isDocumentReady()) {
                return resolve();
            }

            let interval = setInterval(() => {
                if (isDocumentReady()) {
                    clearInterval(interval);
                    return resolve();
                }
            }, 10);
        });
    });
}

export function waitForDocumentBody() : ZalgoPromise<HTMLBodyElement> {
    return waitForDocumentReady.then(() => {
        if (document.body) {
            return document.body;
        }

        throw new Error('Document ready but document.body not present');
    });
}

export function parseQuery(queryString : string) : Object {
    return inlineMemoize(parseQuery, () : Object => {
        let params = {};

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

export function extendUrl(url : string, params : { [key : string] : string } = {}) : string {

    let hasHash = url.indexOf('#') > 0;

    let [ serverUrl, hash ] = url.split('#');

    if (hash && !serverUrl) {
        [ serverUrl, hash ] = [ `#${ hash }`, '' ];
    }

    let [ originalUrl, originalQueryString ] = serverUrl.split('?');

    if (originalQueryString) {
        let originalQuery = parseQuery(originalQueryString);

        for (let key in originalQuery) {
            if (!params.hasOwnProperty(key)) {
                params[key] = originalQuery[key];
            }
        }
    }

    let newQueryString = Object.keys(params).filter(key => key && params[key]).sort().map(key => {
        return `${ encodeURIComponent(key) }=${ encodeURIComponent(params[key]) }`;
    }).join('&');

    let newUrl = originalUrl;

    if (newQueryString) {
        newUrl = `${ newUrl }?${ newQueryString }`;
    }

    if (hasHash) {
        newUrl = `${ newUrl }#${ hash || '' }`;
    }

    return newUrl;
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
    let meta = document.querySelector('meta[name=viewport]');

    if (isDevice() && window.screen.width < 660 && !meta) {
        return false;
    }

    return true;
}

export function isElementVisible(el : HTMLElement) : boolean {
    return Boolean(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

export function enablePerformance() : boolean {
    return inlineMemoize(enablePerformance, () : boolean => {
        /* eslint-disable compat/compat */
        return Boolean(
            window.performance &&
            performance.now &&
            performance.timing &&
            performance.timing.connectEnd &&
            performance.timing.navigationStart &&
            (Math.abs(performance.now() - Date.now()) > 1000) &&
            (performance.now() - (performance.timing.connectEnd - performance.timing.navigationStart)) > 0
        );
        /* eslint-enable compat/compat */
    });
}

export function getPageRenderTime() : ZalgoPromise<?number> {
    return waitForDocumentReady().then(() => {

        if (!enablePerformance()) {
            return;
        }

        let timing = window.performance.timing;

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
    return (typeof window !== 'undefined');
}

export function querySelectorAll(selector : string, doc : Document = window.document) : Array<Element> {
    return Array.prototype.slice.call(doc.querySelectorAll(selector));
}

export function onClick(element : Element, handler : (Event) => void) {
    element.addEventListener('touchstart', noop);
    element.addEventListener('click', handler);
    element.addEventListener('keypress', (event : Event) => {
        // $FlowFixMe
        if (event.keyCode === KEY_CODES.ENTER) {
            return handler(event);
        }
    });
}

export function getScript({ host = window.location.host, path } : { host? : string, path : string }) : ?HTMLScriptElement {
    return inlineMemoize(getScript, () : ?HTMLScriptElement => {

        let url = `${ host }${ path }`;
        let scripts = Array.prototype.slice.call(document.getElementsByTagName('script'));

        for (let script of scripts) {
            if (!script.src) {
                continue;
            }

            let src = script.src.replace(/^https?:\/\//, '').split('?')[0];

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
                let value = Math.random().toString();
                window.localStorage.setItem('__test__localStorage__', value);
                let result = window.localStorage.getItem('__test__localStorage__');
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

export function getBrowserLocales() : Array<{ country? : string, lang : string }> {
    let nav = window.navigator;

    let locales = nav.languages
        ? Array.prototype.slice.apply(nav.languages)
        : [];

    if (nav.language) {
        locales.push(nav.language);
    }

    if (nav.userLanguage) {
        locales.push(nav.userLanguage);
    }

    return locales.map(locale => {

        if (locale && locale.match(/^[a-z]{2}[-_][A-Z]{2}$/)) {
            let [ lang, country ] = locale.split(/[-_]/);
            return { country, lang };
        }

        if (locale && locale.match(/^[a-z]{2}$/)) {
            return { lang: locale };
        }

        return null;

    }).filter(Boolean);
}
