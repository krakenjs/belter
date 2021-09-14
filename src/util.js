
/* @flow */
/* eslint max-lines: 0 */

import { ZalgoPromise } from 'zalgo-promise/src';
import { WeakMap } from 'cross-domain-safe-weakmap/src';

import type { CancelableType } from './types';

export function getFunctionName <T : Function>(fn : T) : string {
    return fn.name || fn.__name__ || fn.displayName || 'anonymous';
}

export function setFunctionName <T : Function>(fn : T, name : string) : T {
    try {
        delete fn.name;
        fn.name = name;
    } catch (err) {
        // pass
    }

    fn.__name__ = fn.displayName = name;
    return fn;
}

export function base64encode(str : string) : string {
    if (typeof btoa === 'function') {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (m, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        })).replace(/[=]/g, '');
    }

    if (typeof Buffer !== 'undefined') {
        return Buffer.from(str, 'utf8').toString('base64').replace(/[=]/g, '');
    }

    throw new Error(`Can not find window.btoa or Buffer`);
}

export function base64decode(str : string) : string {
    if (typeof atob === 'function') {
        // $FlowFixMe[method-unbinding]
        return decodeURIComponent(Array.prototype.map.call(atob(str), c => {
            // eslint-disable-next-line prefer-template
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    if (typeof Buffer !== 'undefined') {
        return Buffer.from(str, 'base64').toString('utf8');
    }

    throw new Error(`Can not find window.atob or Buffer`);
}

export function uniqueID() : string {

    const chars = '0123456789abcdef';

    const randomID = 'xxxxxxxxxx'.replace(/./g, () => {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    });

    const timeID = base64encode(
        new Date().toISOString().slice(11, 19).replace('T', '.')
    ).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    return `uid_${ randomID }_${ timeID }`;
}

export function getGlobal() : Object {
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    if (typeof __GLOBAL__ !== 'undefined') {
        return __GLOBAL__;
    }
    throw new Error(`No global found`);
}

let objectIDs;

export function getObjectID(obj : Object) : string {

    objectIDs = objectIDs || new WeakMap();

    if (obj === null || obj === undefined || (typeof obj !== 'object' && typeof obj !== 'function')) {
        throw new Error(`Invalid object`);
    }

    let uid = objectIDs.get(obj);

    if (!uid) {
        uid = `${ typeof obj }:${ uniqueID() }`;
        objectIDs.set(obj, uid);
    }

    return uid;
}

function serializeArgs<T>(args : $ReadOnlyArray<T>) : string {
    try {
        // $FlowFixMe[method-unbinding]
        return JSON.stringify(Array.prototype.slice.call(args), (subkey, val) => {
            if (typeof val === 'function') {
                return `memoize[${ getObjectID(val) }]`;
            }
            return val;
        });
    } catch (err) {
        throw new Error(`Arguments not serializable -- can not be used to memoize`);
    }
}

export function getEmptyObject() : {||} {
    // $FlowFixMe
    return {};
}

type MemoizeOptions = {|
    name? : string,
    time? : number,
    thisNamespace? : boolean
|};

const getDefaultMemoizeOptions = () : MemoizeOptions => {
    // $FlowFixMe
    return {};
};

export type Memoized<F> = F & {| reset : () => void |};

let memoizeGlobalIndex = 0;
let memoizeGlobalIndexValidFrom = 0;

export function memoize<F : Function>(method : F, options? : MemoizeOptions = getDefaultMemoizeOptions()) : Memoized<F> {
    const { thisNamespace = false, time: cacheTime } = options;

    let simpleCache;
    let thisCache;

    let memoizeIndex = memoizeGlobalIndex;
    memoizeGlobalIndex += 1;

    const memoizedFunction = function memoizedFunction(...args) : mixed {
        if (memoizeIndex < memoizeGlobalIndexValidFrom) {
            simpleCache = null;
            thisCache = null;
            memoizeIndex = memoizeGlobalIndex;
            memoizeGlobalIndex += 1;
        }

        let cache;

        if (thisNamespace) {
            thisCache = thisCache || new WeakMap();
            cache = thisCache.getOrSet(this, getEmptyObject);
        } else {
            cache = simpleCache = simpleCache || {};
        }

        const cacheKey = serializeArgs(args);
        let cacheResult = cache[cacheKey];

        if (cacheResult && cacheTime && (Date.now() - cacheResult.time) < cacheTime) {
            delete cache[cacheKey];
            cacheResult = null;
        }

        if (cacheResult) {
            return cacheResult.value;
        }

        const time  = Date.now();
        const value = method.apply(this, arguments);

        cache[cacheKey] = { time, value };

        return value;
    };

    memoizedFunction.reset = () => {
        simpleCache = null;
        thisCache = null;
    };

    // $FlowFixMe
    const result : F = memoizedFunction;

    return setFunctionName(result, `${ options.name || getFunctionName(method) }::memoized`);
}

memoize.clear = () => {
    memoizeGlobalIndexValidFrom = memoizeGlobalIndex;
};

export function promiseIdentity<T : mixed>(item : ZalgoPromise<T> | T) : ZalgoPromise<T> {
    // $FlowFixMe
    return ZalgoPromise.resolve(item);
}

// eslint-disable-next-line flowtype/no-weak-types
export function memoizePromise<R>(method : (...args : $ReadOnlyArray<any>) => ZalgoPromise<R>) : ((...args : $ReadOnlyArray<any>) => ZalgoPromise<R>) {
    let cache = {};

    // eslint-disable-next-line flowtype/no-weak-types
    function memoizedPromiseFunction(...args : $ReadOnlyArray<any>) : ZalgoPromise<R> {
        const key : string = serializeArgs(args);

        if (cache.hasOwnProperty(key)) {
            return cache[key];
        }

        cache[key] = ZalgoPromise.try(() => method.apply(this, arguments))
            .finally(() => {
                delete cache[key];
            });

        return cache[key];
    }

    memoizedPromiseFunction.reset = () => {
        cache = {};
    };

    return setFunctionName(memoizedPromiseFunction, `${ getFunctionName(method) }::promiseMemoized`);
}

type PromisifyOptions = {|
    name ? : string
|};

const getDefaultPromisifyOptions = () : PromisifyOptions => {
    // $FlowFixMe
    return {};
};

// eslint-disable-next-line flowtype/no-weak-types
export function promisify<R>(method : (...args : $ReadOnlyArray<any>) => R, options : PromisifyOptions = getDefaultPromisifyOptions()) : ((...args : $ReadOnlyArray<any>) => ZalgoPromise<R>) {
    function promisifiedFunction() : ZalgoPromise<R> {
        return ZalgoPromise.try(method, this, arguments);
    }

    if (options.name) {
        promisifiedFunction.displayName = `${ options.name }:promisified`;
    }

    return setFunctionName(promisifiedFunction, `${ getFunctionName(method) }::promisified`);
}

// eslint-disable-next-line flowtype/no-weak-types
export function inlineMemoize<R>(method : (...args : $ReadOnlyArray<any>) => R, logic : (...args : $ReadOnlyArray<any>) => R, args : $ReadOnlyArray<any> = []) : R {
    // $FlowFixMe
    const cache : {| [string] : R |} = method.__inline_memoize_cache__ = method.__inline_memoize_cache__ || {};
    const key = serializeArgs(args);

    if (cache.hasOwnProperty(key)) {
        return cache[key];
    }
    
    const result = cache[key] = logic(...args);

    return result;
}

// eslint-disable-next-line no-unused-vars
export function noop(...args : $ReadOnlyArray<mixed>) {
    // pass
}

export function once(method : Function) : Function {
    let called = false;

    const onceFunction = function() : mixed {
        if (!called) {
            called = true;
            return method.apply(this, arguments);
        }
    };

    return setFunctionName(onceFunction, `${ getFunctionName(method) }::once`);
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
    const regmatch = str.match(pattern);
    if (regmatch) {
        return regmatch[1];
    }
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

            get() : T {
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
            // $FlowFixMe[method-unbinding]
            return `<unknown error: ${ Object.prototype.toString.call(err) }>`;
        }

        if (typeof err === 'string') {
            return err;
        }

        if (err instanceof Error) {
            const stack = err && err.stack;
            const message = err && err.message;

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

        if (err && err.toString && typeof err.toString === 'function') {
            // $FlowFixMe
            return err.toString();
        }

        // $FlowFixMe[method-unbinding]
        return Object.prototype.toString.call(err);

    } catch (newErr) {
        return `Error while stringifying error: ${ stringifyError(newErr, level + 1) }`;
    }
}

export function stringifyErrorMessage(err : mixed) : string {

    // $FlowFixMe[method-unbinding]
    const defaultMessage = `<unknown error: ${ Object.prototype.toString.call(err) }>`;

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

    if (item && item.toString && typeof item.toString === 'function') {
        // $FlowFixMe
        return item.toString();
    }

    // $FlowFixMe[method-unbinding]
    return Object.prototype.toString.call(item);
}

export function domainMatches(hostname : string, domain : string) : boolean {
    hostname = hostname.split('://')[1];
    const index = hostname.indexOf(domain);
    return (index !== -1 && hostname.slice(index) === domain);
}

export function patchMethod(obj : Object, name : string, handler : Function) {
    const original = obj[name];

    obj[name] = function patchedMethod() : mixed {
        return handler({
            context:      this,
            // $FlowFixMe[method-unbinding]
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

    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            obj[key] = source[key];
        }
    }

    return obj;
}

export function values<T>(obj : { [string] : T }) : $ReadOnlyArray<T> {
    if (Object.values) {
        // $FlowFixMe
        return Object.values(obj);
    }

    const result : Array<T> = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // $FlowFixMe[escaped-generic]
            result.push(obj[key]);
        }
    }

    // $FlowFixMe
    return result;
}

// eslint-disable-next-line no-undef
export const memoizedValues : <T>({ [string] : T }) => $ReadOnlyArray<T> = memoize(values);

export function perc(pixels : number, percentage : number) : number {
    return Math.round((pixels * percentage) / 100);
}

export function min(...args : $ReadOnlyArray<number>) : number {
    return Math.min(...args);
}

export function max(...args : $ReadOnlyArray<number>) : number {
    return Math.max(...args);
}

export function roundUp(num : number, nearest : number) : number {
    const remainder = num % nearest;
    return remainder
        ? (num - remainder) + nearest
        : num;
}

export function regexMap<T>(str : string, regexp : RegExp, handler : () => T) : $ReadOnlyArray<T> {
    const results = [];

    // $FlowFixMe
    str.replace(regexp, function regexMapMatcher(item) {
        results.push(handler ? handler.apply(null, arguments) : item);
    });

    // $FlowFixMe
    return results;
}

export function svgToBase64(svg : string) : string {
    return `data:image/svg+xml;base64,${ base64encode(svg) }`;
}

export function objFilter<T, R>(obj : { [string] : T }, filter? : (T, ?string) => mixed = Boolean) : { [string] : R } {
    const result = {};

    for (const key in obj) {
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

export function regexTokenize(text : string, regexp : RegExp) : $ReadOnlyArray<string> {
    const result = [];
    text.replace(regexp, token => {
        result.push(token);
        return '';
    });
    return result;
}

export function promiseDebounce<T>(method : () => ZalgoPromise<T> | T, delay : number = 50) : () => ZalgoPromise<T> {

    let promise;
    let timeout;

    const promiseDebounced = function() : ZalgoPromise<T> {
        if (timeout) {
            clearTimeout(timeout);
        }

        const localPromise = promise = promise || new ZalgoPromise();

        timeout = setTimeout(() => {
            promise = null;
            timeout = null;

            ZalgoPromise.try(method).then(
                result => { localPromise.resolve(result); },
                err => { localPromise.reject(err); }
            );
        }, delay);

        return localPromise;
    };

    return setFunctionName(promiseDebounced, `${ getFunctionName(method) }::promiseDebounced`);
}

export function safeInterval(method : Function, time : number) : {| cancel : () => void |} {

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
    for (const key in obj) {
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
    
    const result = {};

    for (let key in obj) {
        if (!obj.hasOwnProperty(key) || typeof obj[key] !== 'string') {
            continue;
        }

        let value = obj[key];

        if (key.match(/^.+\[\]$/)) {
            key = key.slice(0, -2);
            value = value.split(',').map(deserializePrimitive);
        } else {
            value = deserializePrimitive(value);
        }

        let keyResult = result;
        const parts = key.split('.');
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = (i + 1 === parts.length);
            const isIndex = !isLast && isInteger(parts[i + 1]);

            if (part === 'constructor' || part === 'prototype' || part === '__proto__') {
                throw new Error(`Disallowed key: ${ part }`);
            }

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

export type EventEmitterType = {|
    on : (eventName : string, handler : Function) => CancelableType,
    once : (eventName : string, handler : Function) => CancelableType,
    trigger : (eventName : string, ...args : $ReadOnlyArray<mixed>) => ZalgoPromise<void>,
    triggerOnce : (eventName : string, ...args : $ReadOnlyArray<mixed>) => ZalgoPromise<void>,
    reset : () => void
|};

export function eventEmitter() : EventEmitterType {
    const triggered = {};
    let handlers = {};

    const emitter = {

        on(eventName : string, handler : Function) : CancelableType {
            const handlerList = handlers[eventName] = handlers[eventName] || [];

            handlerList.push(handler);

            let cancelled = false;

            return {
                cancel() {
                    if (!cancelled) {
                        cancelled = true;
                        handlerList.splice(handlerList.indexOf(handler), 1);
                    }

                }
            };
        },

        once(eventName : string, handler : Function) : CancelableType {

            const listener = emitter.on(eventName, () => {
                listener.cancel();
                handler();
            });

            return listener;
        },

        trigger(eventName : string, ...args : $ReadOnlyArray<mixed>) : ZalgoPromise<void> {

            const handlerList = handlers[eventName];
            const promises = [];

            if (handlerList) {
                for (const handler of handlerList) {
                    promises.push(ZalgoPromise.try(() => handler(...args)));
                }
            }

            return ZalgoPromise.all(promises).then(noop);
        },

        triggerOnce(eventName : string, ...args : $ReadOnlyArray<mixed>) : ZalgoPromise<void> {

            if (triggered[eventName]) {
                return ZalgoPromise.resolve();
            }

            triggered[eventName] = true;
            return emitter.trigger(eventName, ...args);
        },

        reset() {
            handlers = {};
        }
    };

    return emitter;
}

export function camelToDasherize(string : string) : string {
    return string.replace(/([A-Z])/g, (g) => {
        return `-${ g.toLowerCase() }`;
    });
}

export function dasherizeToCamel(string : string) : string {
    return string.replace(/-([a-z])/g, (g) => {
        return g[1].toUpperCase();
    });
}

export function capitalizeFirstLetter(string : string) : string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function get(item : Object, path : string, def : mixed) : mixed {

    if (!path) {
        return def;
    }

    const pathParts = path.split('.');

    // Loop through each section of our key path

    for (let i = 0; i < pathParts.length; i++) {

        // If we have an object, we can get the key
        if (typeof item === 'object' && item !== null) {
            item = item[pathParts[i]];

        // Otherwise, we should return the default (undefined if not provided)
        } else {
            return def;
        }
    }

    // If our final result is undefined, we should return the default

    return item === undefined ? def : item;
}

export function safeTimeout(method : Function, time : number) {

    const interval = safeInterval(() => {
        time -= 100;
        if (time <= 0) {
            interval.cancel();
            method();
        }
    }, 100);
}

export function defineLazyProp<T>(obj : Object | $ReadOnlyArray<mixed>, key : string | number, getter : () => T) {
    if (Array.isArray(obj)) {
        if (typeof key !== 'number') {
            throw new TypeError(`Array key must be number`);
        }
    } else if (typeof obj === 'object' && obj !== null) {
        if (typeof key !== 'string') {
            throw new TypeError(`Object key must be string`);
        }
    }
    
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable:   true,
        get:          () => {
            // $FlowFixMe
            delete obj[key];
            const value = getter();
            // $FlowFixMe
            obj[key] = value;
            return value;
        },
        set: (value : T) => {
            // $FlowFixMe
            delete obj[key];
            // $FlowFixMe
            obj[key] = value;
        }
    });
}

export function arrayFrom<T>(item : Iterable<T>) : $ReadOnlyArray<T> { // eslint-disable-line no-undef
    // $FlowFixMe[method-unbinding]
    return Array.prototype.slice.call(item);
}

export function isObject(item : mixed) : boolean {
    return (typeof item === 'object' && item !== null);
}

export function isObjectObject(obj : mixed) : boolean {
    // $FlowFixMe[method-unbinding]
    return isObject(obj) && Object.prototype.toString.call(obj) === '[object Object]';
}

export function isPlainObject(obj : mixed) : boolean {
    if (!isObjectObject(obj)) {
        return false;
    }

    // $FlowFixMe
    const constructor = obj.constructor;

    if (typeof constructor !== 'function') {
        return false;
    }

    const prototype = constructor.prototype;

    if (!isObjectObject(prototype)) {
        return false;
    }

    if (!prototype.hasOwnProperty('isPrototypeOf')) {
        return false;
    }

    return true;
}

export function replaceObject<T : $ReadOnlyArray<mixed> | Object> (item : T, replacer : (mixed, string | number, string) => mixed, fullKey : string = '') : T {

    if (Array.isArray(item)) {
        const length = item.length;
        const result : Array<mixed> = [];

        for (let i = 0; i < length; i++) {

            
            defineLazyProp(result, i, () => {
                const itemKey = fullKey ? `${ fullKey }.${ i }` : `${ i }`;
                const el = item[i];

                let child = replacer(el, i, itemKey);

                if (isPlainObject(child) || Array.isArray(child)) {
                    // $FlowFixMe
                    child = replaceObject(child, replacer, itemKey);
                }

                return child;
            });
        }

        // $FlowFixMe
        return result;
    } else if (isPlainObject(item)) {
        const result = {};

        for (const key in item) {
            if (!item.hasOwnProperty(key)) {
                continue;
            }

            defineLazyProp(result, key, () => {
                const itemKey = fullKey ? `${ fullKey }.${ key }` : `${ key }`;
                // $FlowFixMe
                const el = item[key];

                let child = replacer(el, key, itemKey);

                if (isPlainObject(child) || Array.isArray(child)) {
                    // $FlowFixMe
                    child = replaceObject(child, replacer, itemKey);
                }

                return child;
            });
        }

        // $FlowFixMe
        return result;
    } else {
        throw new Error(`Pass an object or array`);
    }
}


export function copyProp(source : Object, target : Object, name : string, def : mixed) {
    if (source.hasOwnProperty(name)) {
        const descriptor = Object.getOwnPropertyDescriptor(source, name);
        // $FlowFixMe
        Object.defineProperty(target, name, descriptor);

    } else {
        target[name] = def;
    }
}

type RegexResultType = {|
    text : string,
    groups : $ReadOnlyArray<string>,
    start : number,
    end : number,
    length : number,
    replace : (text : string) => string
|};

export function regex(pattern : string | RegExp, string : string, start : number = 0) : ?RegexResultType {

    if (typeof pattern === 'string') {
        // eslint-disable-next-line security/detect-non-literal-regexp
        pattern = new RegExp(pattern);
    }

    const result = string.slice(start).match(pattern);

    if (!result) {
        return;
    }

    // $FlowFixMe
    const index : number = result.index;
    const regmatch = result[0];

    return {
        text:   regmatch,
        groups: result.slice(1),
        start:  start + index,
        end:    start + index + regmatch.length,
        length: regmatch.length,

        replace(text : string) : string {

            if (!regmatch) {
                return '';
            }

            return `${ regmatch.slice(0, start + index) }${ text }${ regmatch.slice(index + regmatch.length) }`;
        }
    };
}

export function regexAll(pattern : string | RegExp, string : string) : $ReadOnlyArray<RegexResultType> {

    const matches = [];
    let start = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const regmatch = regex(pattern, string, start);

        if (!regmatch) {
            break;
        }

        matches.push(regmatch);
        start = match.end;
    }

    return matches;
}

export function isDefined(value : ?mixed) : boolean {
    return value !== null && value !== undefined;
}

export function cycle(method : Function) : ZalgoPromise<void> {
    return ZalgoPromise.try(method).then(() => cycle(method));
}

export function debounce<T>(method : (...args : $ReadOnlyArray<mixed>) => T, time : number = 100) : (...args : $ReadOnlyArray<mixed>) => void {

    let timeout;

    const debounceWrapper = function() {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            return method.apply(this, arguments);
        }, time);
    };

    return setFunctionName(debounceWrapper, `${ getFunctionName(method) }::debounced`);
}

export function isRegex(item : mixed) : boolean {
    // $FlowFixMe[method-unbinding]
    return Object.prototype.toString.call(item) === '[object RegExp]';
}

type FunctionProxy<T : Function> = (method : T) => T;

// eslint-disable-next-line flowtype/no-weak-types
export const weakMapMemoize : FunctionProxy<*> = <R : mixed>(method : (arg : any) => R) : ((...args : $ReadOnlyArray<any>) => R) => {

    const weakmap = new WeakMap();

    // eslint-disable-next-line flowtype/no-weak-types
    return function weakmapMemoized(arg : any) : R {
        return weakmap.getOrSet(arg, () => method.call(this, arg));
    };
};

type FunctionPromiseProxy<R : mixed, T : (...args : $ReadOnlyArray<mixed>) => ZalgoPromise<R>> = (T) => T;

// eslint-disable-next-line flowtype/no-weak-types
export const weakMapMemoizePromise : FunctionPromiseProxy<*, *> = <R : mixed>(method : (arg : any) => ZalgoPromise<R>) : ((...args : $ReadOnlyArray<any>) => ZalgoPromise<R>) => {

    const weakmap = new WeakMap();

    // eslint-disable-next-line flowtype/no-weak-types
    return function weakmapMemoizedPromise(arg : any) : ZalgoPromise<R> {
        return weakmap.getOrSet(arg, () =>
            method.call(this, arg).finally(() => {
                weakmap.delete(arg);
            }));
    };
};

export function getOrSet<O : Object, T : mixed>(obj : O, key : string, getter : () => T) : T {
    if (obj.hasOwnProperty(key)) {
        return obj[key];
    }

    const val = getter();
    obj[key] = val;
    return val;
}

export type CleanupType = {|
    set : <T : mixed>(string, T) => T, // eslint-disable-line no-undef
    register : (Function) => {| cancel : () => void |},
    all : (err? : mixed) => ZalgoPromise<void>
|};

export function cleanup(obj : Object) : CleanupType {

    const tasks = [];
    let cleaned = false;
    let cleanErr;

    const cleaner = {
        set<T : mixed>(name : string, item : T) : T {
            if (!cleaned) {
                obj[name] = item;
                cleaner.register(() => {
                    delete obj[name];
                });
            }
            return item;
        },

        register(method : Function) : {| cancel : () => void |} {
            const task = once(() => method(cleanErr));

            if (cleaned) {
                method(cleanErr);
            } else {
                tasks.push(task);
            }

            return {
                cancel: () => {
                    const index = tasks.indexOf(task);
                    if (index !== -1) {
                        tasks.splice(index, 1);
                    }
                }
            };
        },

        all(err? : mixed) : ZalgoPromise<void> {
            cleanErr = err;

            const results = [];
            cleaned = true;

            while (tasks.length) {
                const task = tasks.shift();
                results.push(task());
            }

            return ZalgoPromise.all(results).then(noop);
        }
    };

    return cleaner;
}

export function tryCatch<T>(fn : () => T) : {| result : T, error : void |} | {| result : void, error : mixed |} {
    let result;
    let error;

    try {
        result = fn();
    } catch (err) {
        error = err;
    }
    
    // $FlowFixMe
    return { result, error };
}

// eslint-disable-next-line flowtype/no-mutable-array
export function removeFromArray<X, T : Array<X>>(arr : T, item : X) {
    const index = arr.indexOf(item);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

export function assertExists<T>(name : string, thing : void | null | T) : T {
    if (thing === null || typeof thing === 'undefined') {
        throw new Error(`Expected ${ name } to be present`);
    }
                            
    return thing;
}

export function unique(arr : $ReadOnlyArray<string>) : $ReadOnlyArray<string> {
    const result = {};
    for (const item of arr) {
        result[item] = true;
    }
    return Object.keys(result);
}

export const constHas = <X : (string | boolean | number), T : { [string] : X }>(constant : T, value : X) : boolean => {
    return memoizedValues(constant).indexOf(value) !== -1;
};

export function dedupeErrors<T>(handler : (mixed) => T) : (mixed) => (T | void) {
    const seenErrors = [];
    const seenStringifiedErrors = {};

    return (err) => {
        if (seenErrors.indexOf(err) !== -1) {
            return;
        }

        seenErrors.push(err);

        const stringifiedError = stringifyError(err);
        if (seenStringifiedErrors[stringifiedError]) {
            return;
        }

        seenStringifiedErrors[stringifiedError] = true;
        return handler(err);
    };
}

export class ExtendableError extends Error {
    constructor(message : string) {
        super(message);
        // eslint-disable-next-line unicorn/custom-error-definition
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}
  
