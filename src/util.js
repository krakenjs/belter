/* @flow */
/* eslint max-lines: 0 */

import { ZalgoPromise } from 'zalgo-promise/src';

export function getGlobal() : Object {
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    throw new Error(`No global found`);
}

// eslint-disable-next-line flowtype/no-weak-types
export function memoize<R>(method : (...args : Array<any>) => R, options : { time? : number } = {}) : ((...args : Array<any>) => R) {

    if (method.__memoized__) {
        return method.__memoized__;
    }

    let cache : { [key : string] : { time : number, value : R } } = {};

    // eslint-disable-next-line no-unused-vars, flowtype/no-weak-types
    method.__memoized__ = function memoizedFunction(...args : Array<any>) : R {

        if (method.__memoized__ && method.__memoized__.__calling__) {
            throw new Error(`Can not call memoized method recursively`);
        }

        let key : string;

        try {
            key = JSON.stringify(Array.prototype.slice.call(arguments));
        } catch (err) {
            throw new Error(`Arguments not serializable -- can not be used to memoize`);
        }

        let cacheTime = options.time;
        if (cache[key] && cacheTime && (Date.now() - cache[key].time) < cacheTime) {
            delete cache[key];
        }

        let glob = getGlobal();

        if (glob.__CACHE_START_TIME__ && cache[key] && cache[key].time < glob.__CACHE_START_TIME__) {
            delete cache[key];
        }

        if (cache[key]) {
            return cache[key].value;
        }

        method.__memoized__.__calling__ = true;

        let time  = Date.now();
        let value = method.apply(this, arguments);

        method.__memoized__.__calling__ = false;

        cache[key] = { time, value };

        return cache[key].value;
    };

    return method.__memoized__;
}

// eslint-disable-next-line flowtype/no-weak-types
export function inlineMemoize<R>(method : (...args : Array<any>) => R, logic : (...args : Array<any>) => R, args : Array<any> = []) : R {
    if (!method.__memoized__) {
        // $FlowFixMe
        method.__memoized__ = memoize(logic);
    }

    // $FlowFixMe
    return method.__memoized__(...args);
}

// eslint-disable-next-line no-unused-vars
export function noop(...args : Array<mixed>) {
    // pass
}

export function once(method : Function) : Function {
    let called = false;

    return function onceFunction() : mixed {
        if (!called) {
            called = true;
            return method.apply(this, arguments);
        }
    };
}

export function base64encode(str : string) : string {
    if (typeof __WEB__ === 'undefined' || !__WEB__) {
        return require('Base64').btoa(str);
    }
    return window.btoa(str);
}

export function base64decode(str : string) : string {
    if (typeof __WEB__ === 'undefined' || !__WEB__) {
        return require('Base64').atob(str);
    }
    return window.atob(str);
}

export function uniqueID() : string {

    let chars = '0123456789abcdef';

    let randomID = 'xxxxxxxxxx'.replace(/./g, () => {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    });

    let timeID = base64encode(
        new Date().toISOString().slice(11, 19).replace('T', '.')
    ).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
    return `${ randomID }_${ timeID }`;
}

export function hashStr(str : string) : number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash += str[i].charCodeAt(0) * Math.pow((i % 10) + 1, 5);
    }
    return Math.floor(Math.pow(Math.sqrt(hash), 5));
}

export function strHashStr(str : string) : string {
    let hash = '';

    for (let i = 0; i < str.length; i++) {
        let total = (str[i].charCodeAt(0) * i);

        if (str[i + 1]) {
            total += (str[i + 1].charCodeAt(0) * (i - 1));
        }

        hash += String.fromCharCode(97 + (Math.abs(total) % 26));
    }

    return hash;
}

export function match(str : string, pattern : RegExp) : ?string {
    let regmatch = str.match(pattern);
    if (regmatch) {
        return regmatch[1];
    }
}

type Listener = {
    listen : (method : Function) => {
        cancel : () => void
    },
    once : (method : Function) => void,
    trigger : (...args : Array<mixed>) => void
};

export function eventEmitter() : Listener {

    let listeners = [];

    return {
        listen(method : Function) : { cancel : () => void } {
            listeners.push(method);

            return {
                cancel() {
                    listeners.splice(listeners.indexOf(method), 1);
                }
            };
        },

        once(method : Function) {
            let listener = this.listen(function onceListener() {
                method.apply(null, arguments);
                listener.cancel();
            });
        },

        trigger(...args : Array<mixed>) {
            for (let listener of listeners) {
                listener(...args);
            }
        }
    };
}

export function awaitKey<T: mixed>(obj : Object, key : string) : ZalgoPromise<T> {
    return new ZalgoPromise(resolve => {

        let value = obj[key];

        if (value) {
            return resolve(value);
        }

        delete obj[key];

        Object.defineProperty(obj, key, {

            configurable: true,

            set(item) {
                value = item;

                if (value) {
                    resolve(value);
                }
            },

            get() : mixed {
                return value;
            }
        });
    });
}

export function stringifyError(err : mixed, level : number = 1) : string {

    if (level >= 3) {
        return 'stringifyError stack overflow';
    }

    try {
        if (!err) {
            return `<unknown error: ${ Object.prototype.toString.call(err) }>`;
        }

        if (typeof err === 'string') {
            return err;
        }

        if (err instanceof Error) {
            let stack = err && err.stack;
            let message = err && err.message;

            if (stack && message) {
                if (stack.indexOf(message) !== -1) {
                    return stack;
                } else {
                    return `${ message }\n${ stack }`;
                }
            } else if (stack) {
                return stack;
            } else if (message) {
                return message;
            }
        }

        if (typeof err.toString === 'function') {
            return err.toString();
        }

        return Object.prototype.toString.call(err);

    } catch (newErr) { // eslint-disable-line unicorn/catch-error-name
        return `Error while stringifying error: ${ stringifyError(newErr, level + 1) }`;
    }
}

export function stringifyErrorMessage(err : mixed) : string {

    let defaultMessage = `<unknown error: ${ Object.prototype.toString.call(err) }>`;

    if (!err) {
        return defaultMessage;
    }

    if (err instanceof Error) {
        return err.message || defaultMessage;
    }

    if (typeof err.message === 'string') {
        return err.message || defaultMessage;
    }

    return defaultMessage;
}

export function stringify(item : mixed) : string {
    if (typeof item === 'string') {
        return item;
    }

    if (item && typeof item.toString === 'function') {
        return item.toString();
    }

    return Object.prototype.toString.call(item);
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

export function domainMatches(hostname : string, domain : string) : boolean {
    hostname = hostname.split('://')[1];
    let index = hostname.indexOf(domain);
    return (index !== -1 && hostname.slice(index) === domain);
}

export function patchMethod(obj : Object, name : string, handler : Function) {
    let original = obj[name];

    obj[name] = function patchedMethod() : mixed {
        return handler({
            context:      this,
            args:         Array.prototype.slice.call(arguments),
            original,
            callOriginal: () => original.apply(this, arguments)
        });
    };
}

export function extend<T : Object | Function>(obj : T, source : Object) : T {
    if (!source) {
        return obj;
    }

    if (Object.assign) {
        return Object.assign(obj, source);
    }

    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            obj[key] = source[key];
        }
    }

    return obj;
}

export function values<T>(obj : { [string] : T }) : Array<T> {
    let result = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result.push(obj[key]);
        }
    }
    return result;
}

export function perc(pixels : number, percentage : number) : number {
    return Math.round((pixels * percentage) / 100);
}

export function min(...args : Array<number>) : number {
    return Math.min(...args);
}

export function max(...args : Array<number>) : number {
    return Math.max(...args);
}

export function regexMap<T>(str : string, regex : RegExp, handler : () => T) : Array<T> {
    let results = [];

    // $FlowFixMe
    str.replace(regex, function regexMapMatcher(item) {
        results.push(handler ? handler.apply(null, arguments) : item);
    });

    // $FlowFixMe
    return results;
}

export function svgToBase64(svg : string) : string {
    return `data:image/svg+xml;base64,${ base64encode(svg) }`;
}

export function objFilter<T, R>(obj : { [string] : T }, filter? : (T, ?string) => mixed = Boolean) : { [string] : R } {
    let result = {};

    for (let key in obj) {
        if (!obj.hasOwnProperty(key) || !filter(obj[key], key)) {
            continue;
        }

        result[key] = obj[key];
    }

    return result;
}

export function identity <T>(item : T) : T {
    return item;
}

export function regexTokenize(text : string, regex : RegExp) : Array<string> {
    let result = [];
    text.replace(regex, token => {
        result.push(token);
        return '';
    });
    return result;
}

export function promiseDebounce<T>(method : () => ZalgoPromise<T> | T, delay : number = 50) : () => ZalgoPromise<T> {

    let promise;
    let timeout;

    return function promiseDebouncedMethod() : ZalgoPromise<T> {
        if (timeout) {
            clearTimeout(timeout);
        }

        let localPromise = promise = promise || new ZalgoPromise();

        timeout = setTimeout(() => {
            promise = null;
            timeout = null;

            ZalgoPromise.try(method)
                .then(result => localPromise.resolve(result),
                    err    => localPromise.reject(err));
        }, delay);

        return localPromise;
    };
}

export function safeInterval(method : Function, time : number) : { cancel : () => void } {

    let timeout;

    function loop() {
        timeout = setTimeout(() => {
            method();
            loop();
        }, time);
    }

    loop();

    return {
        cancel() {
            clearTimeout(timeout);
        }
    };
}

export function isInteger(str : string) : boolean {
    return Boolean(str.match(/^[0-9]+$/));
}

export function isFloat(str : string) : boolean {
    return Boolean(str.match(/^[0-9]+\.[0-9]+$/));
}

export function serializePrimitive(value : string | number | boolean) : string {
    return value.toString();
}

export function deserializePrimitive(value : string) : string | number | boolean {
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    } else if (isInteger(value)) {
        return parseInt(value, 10);
    } else if (isFloat(value)) {
        return parseFloat(value);
    } else {
        return value;
    }
}

export function dotify(obj : Object, prefix : string = '', newobj : Object = {}) : { [string] : string } {
    prefix = prefix ? `${ prefix }.` : prefix;
    for (let key in obj) {
        if (!obj.hasOwnProperty(key) || obj[key] === undefined || obj[key] === null || typeof obj[key] === 'function') {
            continue;
        } else if (obj[key] && Array.isArray(obj[key]) && obj[key].length && obj[key].every(val => typeof val !== 'object')) {
            newobj[`${ prefix }${ key }[]`] = obj[key].join(',');
        } else if (obj[key] && typeof obj[key] === 'object') {
            newobj = dotify(obj[key], `${ prefix }${ key }`, newobj);
        } else {
            newobj[`${ prefix }${ key }`] = serializePrimitive(obj[key]);
        }
    }
    return newobj;
}

export function undotify(obj : { [string] : string }) : Object {
    
    let result = {};

    for (let key in obj) {
        if (!obj.hasOwnProperty(key) || typeof obj[key] !== 'string') {
            continue;
        }

        let value = obj[key];

        if (key.match(/^.+\[\]$/)) {
            key = key.slice(0, key.length - 2);
            value = value.split(',').map(deserializePrimitive);
        } else {
            value = deserializePrimitive(value);
        }

        let keyResult = result;
        let parts = key.split('.');
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            let isLast = (i + 1 === parts.length);
            let isIndex = !isLast && isInteger(parts[i + 1]);

            if (isLast) {
                // $FlowFixMe
                keyResult[part] = value;
            } else {
                // $FlowFixMe
                keyResult = keyResult[part] = keyResult[part] || (isIndex ? [] : {});
            }
        }
    }

    return result;
}
