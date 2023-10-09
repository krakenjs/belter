/* eslint max-lines: 0 */
import { ZalgoPromise } from "@krakenjs/zalgo-promise";
import { WeakMap } from "@krakenjs/cross-domain-safe-weakmap/dist/esm";

import type { CancelableType } from "./types";

export function getEmptyObject(): Record<string, unknown> {
  return {};
}

export function isElement(element: unknown): boolean {
  let passed = false;

  try {
    if (element instanceof window.Element) {
      passed = true;
    } else if (
      element !== null &&
      typeof element === "object" &&
      // @ts-expect-error - not refined to element yet
      element.nodeType === 1 &&
      // @ts-expect-error - not refined to element yet
      typeof element.style === "object" &&
      // @ts-expect-error - not refined to element yet
      typeof element.ownerDocument === "object"
    ) {
      passed = true;
    }
  } catch (_) {
    // we don't have an element
  }

  return passed;
}

export function getFunctionName(
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function
): string {
  // @ts-expect-error __name__ and displayName are not properties of Functions
  return fn.name || fn.__name__ || fn.displayName || "anonymous";
}

export function setFunctionName(
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function,
  name: string
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function {
  try {
    // @ts-expect-error function.name is readonly
    delete fn.name;
    // @ts-expect-error function.name is readonly
    fn.name = name;
  } catch (err) {
    // pass
  }

  // @ts-expect-error function.__name__ is not real outside belter
  fn.__name__ = fn.displayName = name;
  return fn;
}

export function base64encode(str: string): string {
  if (typeof btoa === "function") {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_m, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    ).replace(/[=]/g, "");
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf8").toString("base64").replace(/[=]/g, "");
  }

  throw new Error(`Can not find window.btoa or Buffer`);
}

export function base64decode(str: string): string {
  if (typeof atob === "function") {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), (c) => {
          // eslint-disable-next-line prefer-template, @typescript-eslint/restrict-plus-operands
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64").toString("utf8");
  }

  throw new Error(`Can not find window.atob or Buffer`);
}

export function uniqueID(): string {
  const chars = "0123456789abcdef";
  const randomID = "xxxxxxxxxx".replace(/./g, () => {
    return chars.charAt(Math.floor(Math.random() * chars.length));
  });
  const timeID = base64encode(
    new Date().toISOString().slice(11, 19).replace("T", ".")
  )
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  return `uid_${randomID}_${timeID}`;
}

export function getGlobal(): Record<string, any> {
  if (typeof window !== "undefined") {
    return window;
  }

  if (typeof global !== "undefined") {
    return global;
  }

  // @ts-expect-error usage of global
  if (typeof __GLOBAL__ !== "undefined") {
    // @ts-expect-error usage of global
    // eslint-disable-next-line no-undef
    return __GLOBAL__;
  }

  throw new Error(`No global found`);
}

let objectIDs: WeakMap<Record<string, string>, string>;
export function getObjectID(obj: Record<string, any>): string {
  objectIDs = objectIDs || new WeakMap();

  if (
    obj === null ||
    obj === undefined ||
    (typeof obj !== "object" && typeof obj !== "function")
  ) {
    throw new Error(`Invalid object`);
  }

  let uid = objectIDs.get(obj);

  if (!uid) {
    uid = `${typeof obj}:${uniqueID()}`;
    objectIDs.set(obj, uid);
  }

  return uid;
}

function serializeArgs<T>(args: readonly T[]): string {
  try {
    return JSON.stringify(Array.prototype.slice.call(args), (_subkey, val) => {
      // Treat each distinct function as unique for purposes of memoization
      // e.g. even if someFunction.stringify() is the same, we may use a different memoize cache
      // if the actual function is different.
      if (typeof val === "function") {
        return `memoize[${getObjectID(val)}]`;
      }

      // By default JSON.stringify(domElement) returns '{}'. This ensures that stays true even for non-standard
      // elements (e.g. React-rendered dom elements) with custom properties
      if (isElement(val)) {
        return {};
      }

      return val;
    });
  } catch (err) {
    throw new Error(`Arguments not serializable -- can not be used to memoize`);
  }
}

type MemoizeOptions = {
  name?: string;
  time?: number;
  thisNamespace?: boolean;
};

const getDefaultMemoizeOptions = (): MemoizeOptions => {
  return {};
};

export type Memoized<F> = F & {
  reset: () => void;
};

let memoizeGlobalIndex = 0;
let memoizeGlobalIndexValidFrom = 0;
export function memoize<F extends (...args: any[]) => any>(
  method: F,
  options: MemoizeOptions = getDefaultMemoizeOptions()
): Memoized<F> {
  const { thisNamespace = false, time: cacheTime } = options;
  let simpleCache: Record<string, unknown> | undefined | null;
  let thisCache: WeakMap<Record<string, unknown>, unknown> | undefined | null;
  let memoizeIndex = memoizeGlobalIndex;
  memoizeGlobalIndex += 1;

  const memoizedFunction = function memoizedFunction(
    ...args: unknown[]
  ): unknown {
    if (memoizeIndex < memoizeGlobalIndexValidFrom) {
      simpleCache = null;
      thisCache = null;
      memoizeIndex = memoizeGlobalIndex;
      memoizeGlobalIndex += 1;
    }

    let cache;

    if (thisNamespace) {
      thisCache = thisCache || new WeakMap();
      // @ts-expect-error this
      cache = thisCache.getOrSet(this, getEmptyObject);
    } else {
      cache = simpleCache = simpleCache || {};
    }

    let cacheKey;

    try {
      cacheKey = serializeArgs(args);
    } catch {
      // @ts-expect-error use rest parameter over arguments
      // eslint-disable-next-line prefer-rest-params
      return method.apply(this, arguments);
    }

    // @ts-expect-error need to use a generic for cache later
    let cacheResult = cache[cacheKey];

    if (cacheResult && cacheTime && Date.now() - cacheResult.time < cacheTime) {
      // @ts-expect-error need to use a generic for cache later
      delete cache[cacheKey];
      cacheResult = null;
    }

    if (cacheResult) {
      return cacheResult.value;
    }

    const time = Date.now();
    // @ts-expect-error use rest parameter over arguments
    // eslint-disable-next-line prefer-rest-params
    const value = method.apply(this, arguments);
    // @ts-expect-error need to use a generic for cache later
    cache[cacheKey] = {
      time,
      value,
    };
    return value;
  };

  memoizedFunction.reset = () => {
    simpleCache = null;
    thisCache = null;
  };

  const result = memoizedFunction;
  // @ts-expect-error memoized function vs function
  return setFunctionName(
    result,
    `${options.name || getFunctionName(method)}::memoized`
  );
}

memoize.clear = () => {
  memoizeGlobalIndexValidFrom = memoizeGlobalIndex;
};

export function promiseIdentity<T>(
  item: ZalgoPromise<T> | T
): ZalgoPromise<T | ZalgoPromise<T>> {
  return ZalgoPromise.resolve(item);
}

export function memoizePromise<R>(
  method: (...args: readonly any[]) => ZalgoPromise<R>
): (...args: readonly any[]) => ZalgoPromise<R> {
  let cache = {};

  function memoizedPromiseFunction(...args: readonly any[]): ZalgoPromise<R> {
    const key: string = serializeArgs(args);

    if (cache.hasOwnProperty(key)) {
      // @ts-expect-error need to use a generic for cache later
      return cache[key];
    }

    // @ts-expect-error this line just has all sorts of problems
    // eslint-disable-next-line prefer-rest-params
    cache[key] = ZalgoPromise.try(() => method.apply(this, arguments)).finally(
      () => {
        // @ts-expect-error need to use a generic for cache later
        delete cache[key];
      }
    );

    // @ts-expect-error need to use a generic for cache later
    return cache[key];
  }

  memoizedPromiseFunction.reset = () => {
    cache = {};
  };

  // @ts-expect-error function vs memoized function
  return setFunctionName(
    memoizedPromiseFunction,
    `${getFunctionName(method)}::promiseMemoized`
  );
}

type PromisifyOptions = {
  name?: string;
};

const getDefaultPromisifyOptions = (): PromisifyOptions => {
  return {};
};

export function promisify<R>(
  method: (...args: readonly any[]) => R,
  options: PromisifyOptions = getDefaultPromisifyOptions()
): (...args: readonly any[]) => ZalgoPromise<R> {
  function promisifiedFunction(): ZalgoPromise<R | undefined> {
    // @ts-expect-error use rest parameter over arguments also something with this
    // eslint-disable-next-line prefer-rest-params
    return ZalgoPromise.try(method, this, arguments);
  }

  if (options.name) {
    promisifiedFunction.displayName = `${options.name}:promisified`;
  }

  // @ts-expect-error function vs memoized function
  return setFunctionName(
    promisifiedFunction,
    `${getFunctionName(method)}::promisified`
  );
}

export function inlineMemoize<R>(
  // eslint-disable-next-line @typescript-eslint/no-shadow
  method: (...args: readonly any[]) => R,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  logic: (...args: readonly any[]) => R,
  args: readonly any[] = []
): R {
  // @ts-expect-error __inline_memoize_cache__ does not exist
  const cache: Record<string, R> = (method.__inline_memoize_cache__ =
    // @ts-expect-error __inline_memoize_cache__ does not exist
    method.__inline_memoize_cache__ || {});
  const key = serializeArgs(args);

  if (cache.hasOwnProperty(key)) {
    return cache[key];
  }

  const result = (cache[key] = logic(...args));
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function noop(..._args: readonly unknown[]): void {
  // pass
}

export function once(method: (...args: any[]) => any): (...args: any[]) => any {
  let called = false;

  const onceFunction = function (): unknown {
    if (!called) {
      called = true;
      // @ts-expect-error use rest parameter over arguments
      // eslint-disable-next-line prefer-rest-params
      return method.apply(this, arguments);
    }
  };

  // @ts-expect-error function vs memoized function
  return setFunctionName(onceFunction, `${getFunctionName(method)}::once`);
}

export function hashStr(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash += str[i].charCodeAt(0) * Math.pow((i % 10) + 1, 5);
  }

  return Math.floor(Math.pow(Math.sqrt(hash), 5));
}

export function strHashStr(str: string): string {
  let hash = "";

  for (let i = 0; i < str.length; i++) {
    let total = str[i].charCodeAt(0) * i;

    if (str[i + 1]) {
      total += str[i + 1].charCodeAt(0) * (i - 1);
    }

    hash += String.fromCharCode(97 + (Math.abs(total) % 26));
  }

  return hash;
}

export function match(
  str: string,
  pattern: RegExp
): string | undefined | undefined {
  const regmatch = str.match(pattern);

  if (regmatch) {
    return regmatch[1];
  }
}

export function awaitKey<T>(
  obj: Record<string, any>,
  key: string
): ZalgoPromise<T> {
  return new ZalgoPromise((resolve) => {
    let value = obj[key];

    if (value) {
      resolve(value);
      return;
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

      get(): T {
        return value;
      },
    });
  });
}

export function stringifyError(err: unknown, level = 1): string {
  if (level >= 3) {
    return "stringifyError stack overflow";
  }

  try {
    if (!err) {
      return `<unknown error: ${Object.prototype.toString.call(err)}>`;
    }

    if (typeof err === "string") {
      return err;
    }

    if (err instanceof Error) {
      const stack = err && err.stack;
      const message = err && err.message;

      if (stack && message) {
        if (stack.includes(message)) {
          return stack;
        } else {
          return `${message}\n${stack}`;
        }
      } else if (stack) {
        return stack;
      } else if (message) {
        return message;
      }
    }

    if (
      err &&
      (err as Error).toString &&
      typeof (err as Error).toString === "function"
    ) {
      // stringify of err will be [object Object]
      // eslint-disable-next-line  @typescript-eslint/no-base-to-string
      return err.toString();
    }

    return Object.prototype.toString.call(err);
  } catch (newErr) {
    return `Error while stringifying error: ${stringifyError(
      newErr,
      level + 1
    )}`;
  }
}

export function stringifyErrorMessage(err: unknown): string {
  const defaultMessage = `<unknown error: ${Object.prototype.toString.call(
    err
  )}>`;

  if (!err) {
    return defaultMessage;
  }

  if (err instanceof Error) {
    return err.message || defaultMessage;
  }

  if (typeof (err as Error).message === "string") {
    return (err as Error).message || defaultMessage;
  }

  return defaultMessage;
}

export function stringify(item: unknown): string {
  if (typeof item === "string") {
    return item;
  }

  if (item && item.toString && typeof item.toString === "function") {
    // stringify of item will be [object Object]
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return item.toString();
  }

  return Object.prototype.toString.call(item);
}

export function domainMatches(hostname: string, domain: string): boolean {
  hostname = hostname.split("://")[1];
  const index = hostname.indexOf(domain);
  return index !== -1 && hostname.slice(index) === domain;
}

export function patchMethod(
  obj: Record<string, any>,
  name: string,
  handler: (...args: any[]) => any
): void {
  const original = obj[name];

  obj[name] = function patchedMethod(): unknown {
    return handler({
      context: this,
      // eslint-disable-next-line prefer-rest-params
      args: Array.prototype.slice.call(arguments),
      original,
      // @ts-expect-error arguments in an arrow function
      // eslint-disable-next-line prefer-rest-params
      callOriginal: () => original.apply(this, arguments),
    });
  };
}

export function extend<
  T extends Record<string, any> | ((...args: any[]) => any)
>(obj: T, source: Record<string, any>): T {
  if (!source) {
    return obj;
  }

  if (Object.assign) {
    return Object.assign(obj, source);
  }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      // @ts-expect-error need to use a generic for cache later
      obj[key] = source[key];
    }
  }

  return obj;
}

export function values<T>(obj: Record<string, T>): readonly T[] {
  if (Object.values) {
    return Object.values(obj);
  }

  const result: T[] = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result.push(obj[key]);
    }
  }

  return result;
}

export const memoizedValues: <T>(arg0: Record<string, T>) => readonly T[] =
  memoize(values);

export function perc(pixels: number, percentage: number): number {
  return Math.round((pixels * percentage) / 100);
}

export function min(...args: readonly number[]): number {
  return Math.min(...args);
}

export function max(...args: readonly number[]): number {
  return Math.max(...args);
}

export function roundUp(num: number, nearest: number): number {
  const remainder = num % nearest;
  return remainder ? num - remainder + nearest : num;
}

export function regexMap<T>(
  str: string,
  regexp: RegExp,
  handler?: () => T
): readonly T[] {
  const results: T[] | Array<string | T> = [];
  // @ts-expect-error no overload matches the cal of regexMapMatcher
  str.replace(regexp, function regexMapMatcher(item) {
    // @ts-expect-error use rest parameter over arguments
    // eslint-disable-next-line
    results.push(handler ? handler.apply(null, arguments) : item);
  });

  // @ts-expect-error results doesnt match return value
  return results;
}

export function svgToBase64(svg: string): string {
  return `data:image/svg+xml;base64,${base64encode(svg)}`;
}

export function objFilter<T, R>(
  obj: Record<string, T>,
  filter: (arg0: T, arg1: string | undefined | undefined) => unknown = Boolean
): Record<string, R> {
  const result = {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key) || !filter(obj[key], key)) {
      continue;
    }

    // @ts-expect-error string indexer
    result[key] = obj[key];
  }

  return result;
}

export function identity<T>(item: T): T {
  return item;
}

export function regexTokenize(text: string, regexp: RegExp): readonly string[] {
  const result: string[] = [];
  text.replace(regexp, (token) => {
    result.push(token);
    return "";
  });
  return result;
}

export function promiseDebounce<T>(
  method: () => ZalgoPromise<T> | T,
  delay = 50
): () => ZalgoPromise<T> {
  let promise: ZalgoPromise<T> | undefined | null;
  // eslint-disable-next-line no-undef
  let timeout: string | number | NodeJS.Timeout | undefined | null;

  const promiseDebounced = function (): ZalgoPromise<T> {
    if (timeout) {
      clearTimeout(timeout);
    }

    const localPromise = (promise = promise || new ZalgoPromise<T>());
    timeout = setTimeout(() => {
      promise = null;
      timeout = null;
      ZalgoPromise.try(method).then(
        (result) => {
          // @ts-expect-error T or ZalgoPromise<T> when T has no resolve
          void localPromise.resolve(result);
        },
        (err) => {
          void localPromise.reject(err);
        }
      );
    }, delay);
    return localPromise;
  };

  // @ts-expect-error function vs memoized function
  return setFunctionName(
    promiseDebounced,
    `${getFunctionName(method)}::promiseDebounced`
  );
}

export function safeInterval(
  method: (...args: any[]) => any,
  time: number
): {
  cancel: () => void;
} {
  // eslint-disable-next-line no-undef
  let timeout: NodeJS.Timeout;

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
    },
  };
}

export function isInteger(str: string): boolean {
  return Boolean(/^[0-9]+$/.exec(str));
}

export function isFloat(str: string): boolean {
  return Boolean(/^[0-9]+\.[0-9]+$/.exec(str));
}

export function serializePrimitive(value: string | number | boolean): string {
  return value.toString();
}

export function deserializePrimitive(value: string): string | number | boolean {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  } else if (isInteger(value)) {
    return parseInt(value, 10);
  } else if (isFloat(value)) {
    return parseFloat(value);
  } else {
    return value;
  }
}

export function dotify(
  obj: Record<string, any>,
  prefix = "",
  newobj: Record<string, any> = {}
): Record<string, string> {
  prefix = prefix ? `${prefix}.` : prefix;

  for (const key in obj) {
    if (
      !obj.hasOwnProperty(key) ||
      obj[key] === undefined ||
      obj[key] === null ||
      typeof obj[key] === "function"
    ) {
      continue;
    } else if (
      obj[key] &&
      Array.isArray(obj[key]) &&
      obj[key].length &&
      obj[key].every((val: any) => typeof val !== "object")
    ) {
      newobj[`${prefix}${key}[]`] = obj[key].join(",");
    } else if (obj[key] && typeof obj[key] === "object") {
      newobj = dotify(obj[key], `${prefix}${key}`, newobj);
    } else {
      newobj[`${prefix}${key}`] = serializePrimitive(obj[key]);
    }
  }

  return newobj;
}

export function undotify(obj: Record<string, unknown>): Record<string, any> {
  const result = {};

  for (let key in obj) {
    if (!obj.hasOwnProperty(key) || typeof obj[key] !== "string") {
      continue;
    }

    let value = obj[key];

    if (/^.+\[\]$/.exec(key)) {
      key = key.slice(0, -2);
      // @ts-expect-error unknown type split
      value = value.split(",").map(deserializePrimitive);
    } else {
      // @ts-expect-error unknown type
      value = deserializePrimitive(value);
    }

    let keyResult = result;
    const parts = key.split(".");

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i + 1 === parts.length;
      const isIndex = !isLast && isInteger(parts[i + 1]);

      if (
        part === "constructor" ||
        part === "prototype" ||
        part === "__proto__"
      ) {
        throw new Error(`Disallowed key: ${part}`);
      }

      if (isLast) {
        // @ts-expect-error string indexer
        keyResult[part] = value;
      } else {
        // @ts-expect-error string indexer
        keyResult = keyResult[part] = keyResult[part] || (isIndex ? [] : {});
      }
    }
  }

  return result;
}

export type EventEmitterType = {
  on: (eventName: string, handler: (...args: any[]) => any) => CancelableType;
  once: (eventName: string, handler: (...args: any[]) => any) => CancelableType;
  trigger: (
    eventName: string,
    ...args: readonly unknown[]
  ) => ZalgoPromise<void>;
  triggerOnce: (
    eventName: string,
    ...args: readonly unknown[]
  ) => ZalgoPromise<void>;
  reset: () => void;
};

export function eventEmitter(): EventEmitterType {
  const triggered = {};
  let handlers = {};
  const emitter = {
    on(eventName: string, handler: (...args: any[]) => any): CancelableType {
      // @ts-expect-error string index
      const handlerList = (handlers[eventName] = handlers[eventName] || []);
      handlerList.push(handler);
      let cancelled = false;
      return {
        cancel() {
          if (!cancelled) {
            cancelled = true;
            handlerList.splice(handlerList.indexOf(handler), 1);
          }
        },
      };
    },

    once(eventName: string, handler: (...args: any[]) => any): CancelableType {
      const listener = emitter.on(eventName, () => {
        listener.cancel();
        handler();
      });
      return listener;
    },

    trigger(
      eventName: string,
      ...args: readonly unknown[]
    ): ZalgoPromise<void> {
      // @ts-expect-error string index
      const handlerList = handlers[eventName];
      const promises = [];

      if (handlerList) {
        for (const handler of handlerList) {
          promises.push(ZalgoPromise.try(() => handler(...args)));
        }
      }

      return ZalgoPromise.all(promises).then(noop);
    },

    triggerOnce(
      eventName: string,
      ...args: readonly unknown[]
    ): ZalgoPromise<void> {
      // @ts-expect-error string index
      if (triggered[eventName]) {
        return ZalgoPromise.resolve();
      }

      // @ts-expect-error string index
      triggered[eventName] = true;
      return emitter.trigger(eventName, ...args);
    },

    reset() {
      handlers = {};
    },
  };
  return emitter;
}

export function camelToDasherize(string: string): string {
  return string.replace(/([A-Z])/g, (g) => {
    return `-${g.toLowerCase()}`;
  });
}

export function dasherizeToCamel(string: string): string {
  return string.replace(/-([a-z])/g, (g) => {
    return g[1].toUpperCase();
  });
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function get(
  item: Record<string, any>,
  path: string,
  def?: unknown
): unknown {
  if (!path) {
    return def;
  }

  const pathParts = path.split(".");

  // Loop through each section of our key path
  for (let i = 0; i < pathParts.length; i++) {
    // If we have an object, we can get the key
    if (typeof item === "object" && item !== null) {
      item = item[pathParts[i]]; // Otherwise, we should return the default (undefined if not provided)
    } else {
      return def;
    }
  }

  // If our final result is undefined, we should return the default
  return item === undefined ? def : item;
}

export function safeTimeout(
  method: (...args: any[]) => any,
  time: number
): void {
  const interval = safeInterval(() => {
    time -= 100;

    if (time <= 0) {
      interval.cancel();
      method();
    }
  }, 100);
}

export function defineLazyProp<T>(
  obj: Record<string, any> | readonly unknown[],
  key: string | number,
  getter: () => T
): void {
  if (Array.isArray(obj)) {
    if (typeof key !== "number") {
      throw new TypeError(`Array key must be number`);
    }
  } else if (typeof obj === "object" && obj !== null) {
    if (typeof key !== "string") {
      throw new TypeError(`Object key must be string`);
    }
  }

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get: () => {
      // @ts-expect-error delete on a dynamic key
      delete obj[key];
      const value = getter();
      // @ts-expect-error string indexer
      obj[key] = value;
      return value;
    },
    set: (value: T) => {
      // @ts-expect-error delete on a dynamic key
      delete obj[key];
      // @ts-expect-error string indexer
      obj[key] = value;
    },
  });
}

export function arrayFrom<T>(item: T[] | T): readonly T[] {
  return Array.prototype.slice.call(item);
}

export function isObject(item: unknown): boolean {
  return typeof item === "object" && item !== null;
}

export function isObjectObject(obj: unknown): boolean {
  return (
    isObject(obj) && Object.prototype.toString.call(obj) === "[object Object]"
  );
}

export function isPlainObject(obj: unknown): boolean {
  if (!isObjectObject(obj)) {
    return false;
  }

  // @ts-expect-error obj is unknown
  const constructor = obj.constructor;

  if (typeof constructor !== "function") {
    return false;
  }

  const prototype = constructor.prototype;

  if (!isObjectObject(prototype)) {
    return false;
  }

  if (!prototype.hasOwnProperty("isPrototypeOf")) {
    return false;
  }

  return true;
}

export function replaceObject<
  T extends readonly unknown[] | Record<string, any>
>(
  item: T,
  replacer: (arg0: unknown, arg1: string | number, arg2: string) => unknown,
  fullKey = ""
): T {
  if (Array.isArray(item)) {
    const length = item.length;
    const result: unknown[] = [];

    for (let i = 0; i < length; i++) {
      defineLazyProp(result, i, () => {
        const itemKey = fullKey ? `${fullKey}.${i}` : `${i}`;
        const el = item[i];
        let child = replacer(el, i, itemKey);

        if (isPlainObject(child) || Array.isArray(child)) {
          // @ts-expect-error  child is unknown type
          child = replaceObject(child, replacer, itemKey);
        }

        return child;
      });
    }

    // @ts-expect-error unknown[] is not assignable to T
    return result;
  } else if (isPlainObject(item)) {
    const result = {};

    for (const key in item) {
      if (!item.hasOwnProperty(key)) {
        continue;
      }

      defineLazyProp(result, key, () => {
        const itemKey = fullKey ? `${fullKey}.${key}` : `${key}`;
        const el = item[key];
        let child = replacer(el, key, itemKey);

        if (isPlainObject(child) || Array.isArray(child)) {
          // @ts-expect-error child is unknown type
          child = replaceObject(child, replacer, itemKey);
        }

        return child;
      });
    }

    // @ts-expect-error unknown[] is not assignable to T
    return result;
  } else {
    throw new Error(`Pass an object or array`);
  }
}

export function copyProp(
  source: Record<string, any>,
  target: Record<string, any>,
  name: string,
  def: unknown
): void {
  if (source.hasOwnProperty(name)) {
    const descriptor = Object.getOwnPropertyDescriptor(source, name);
    // @ts-expect-error - Type 'undefined' is not assignable to type 'PropertyDescriptor'
    Object.defineProperty(target, name, descriptor);
  } else {
    target[name] = def;
  }
}

type RegexResultType = {
  text: string;
  groups: readonly string[];
  start: number;
  end: number;
  length: number;
  replace: (text: string) => string;
};

export function regex(
  pattern: string | RegExp,
  string: string,
  start = 0
): RegexResultType | undefined | undefined {
  if (typeof pattern === "string") {
    // eslint-disable-next-line security/detect-non-literal-regexp
    pattern = new RegExp(pattern);
  }

  const result = string.slice(start).match(pattern);

  if (!result || result.index === undefined) {
    return;
  }

  const index = result.index;
  const regmatch = result[0];
  return {
    text: regmatch,
    groups: result.slice(1),
    start: start + index,
    end: start + index + regmatch.length,
    length: regmatch.length,

    replace(text: string): string {
      if (!regmatch) {
        return "";
      }

      return `${regmatch.slice(0, start + index)}${text}${regmatch.slice(
        index + regmatch.length
      )}`;
    },
  };
}

export function regexAll(
  pattern: string | RegExp,
  string: string
): readonly RegexResultType[] {
  const matches = [];
  let start = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const regmatch = regex(pattern, string, start);

    if (!regmatch) {
      break;
    }

    matches.push(regmatch);
    // @ts-expect-error end does not exist on match
    start = match.end;
  }

  return matches;
}

export function isDefined(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function cycle(method: (...args: any[]) => any): ZalgoPromise<void> {
  return ZalgoPromise.try(method).then(() => cycle(method));
}

export function debounce<T>(
  method: (...args: readonly unknown[]) => T,
  time = 100
): (...args: readonly unknown[]) => void {
  // eslint-disable-next-line no-undef
  let timeout: NodeJS.Timeout;

  const debounceWrapper = function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // @ts-expect-error use rest parameter over arguments
      // eslint-disable-next-line
      return method.apply(this, arguments);
    }, time);
  };

  // @ts-expect-error this is a problematic helper
  return setFunctionName(
    debounceWrapper,
    `${getFunctionName(method)}::debounced`
  );
}

export function isRegex(item: unknown): boolean {
  return Object.prototype.toString.call(item) === "[object RegExp]";
}

type FunctionProxy<T extends (...args: any[]) => any> = (method: T) => T;

export const weakMapMemoize: FunctionProxy<any> = <R>(
  method: (arg: any) => R
): ((...args: readonly any[]) => R) => {
  const weakmap = new WeakMap();

  return function weakmapMemoized(arg: any): R {
    // @ts-expect-error unknown is not assignable to R
    return weakmap.getOrSet(arg, () => method.call(this, arg));
  };
};

type FunctionPromiseProxy<
  R,
  T extends (...args: readonly unknown[]) => ZalgoPromise<R>
> = (arg0: T) => T;

export const weakMapMemoizePromise: FunctionPromiseProxy<any, any> = <R>(
  method: (arg: any) => ZalgoPromise<R>
): ((...args: readonly any[]) => ZalgoPromise<R>) => {
  const weakmap = new WeakMap();

  return function weakmapMemoizedPromise(arg: any): ZalgoPromise<R> {
    // @ts-expect-error unknown is not assignable to ZalgoPromise<R>
    return weakmap.getOrSet(arg, () =>
      // @ts-expect-error this has no type annotation
      method.call(this, arg).finally(() => {
        weakmap.delete(arg);
      })
    );
  };
};

export function getOrSet<O extends Record<string, any>, T>(
  obj: O,
  key: string,
  getter: () => T
): T {
  if (obj.hasOwnProperty(key)) {
    return obj[key];
  }

  const val = getter();
  // @ts-expect-error string indexer
  obj[key] = val;
  return val;
}

export type CleanupType = {
  set: <T>(arg0: string, arg1: T) => T;

  register: (arg0: (...args: any[]) => any) => {
    cancel: () => void;
  };
  all: (err?: unknown) => ZalgoPromise<void>;
};

export function cleanup(obj: Record<string, any>): CleanupType {
  const tasks: Array<() => unknown> = [];
  let cleaned = false;
  let cleanErr: unknown;
  const cleaner = {
    set<T>(name: string, item: T): T {
      if (!cleaned) {
        obj[name] = item;
        cleaner.register(() => {
          delete obj[name];
        });
      }

      return item;
    },

    register(method: (...args: any[]) => any): {
      cancel: () => void;
    } {
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
        },
      };
    },

    all(err?: unknown): ZalgoPromise<void> {
      cleanErr = err;
      const results = [];
      cleaned = true;

      while (tasks.length) {
        const task = tasks.shift();
        // @ts-expect-error - shift is possible to be undefined
        results.push(task());
      }

      return ZalgoPromise.all(results).then(noop);
    },
  };
  return cleaner;
}

export function tryCatch<T>(fn: () => T):
  | {
      result: T;
      error: Error;
    }
  | {
      result: unknown;
      error: unknown;
    } {
  let result;
  let error;

  try {
    result = fn();
  } catch (err) {
    error = err;
  }

  return {
    result,
    error,
  };
}

export function removeFromArray<X, T extends X[]>(arr: T, item: X): void {
  const index = arr.indexOf(item);

  if (index !== -1) {
    arr.splice(index, 1);
  }
}

export function assertExists<T>(
  name: string,
  thing: undefined | undefined | T
): T {
  if (thing === null || typeof thing === "undefined") {
    throw new Error(`Expected ${name} to be present`);
  }

  return thing;
}

export function unique(arr: readonly string[]): readonly string[] {
  const result: Record<string, boolean> = {};

  for (const item of arr) {
    result[item] = true;
  }

  return Object.keys(result);
}

export const constHas = <
  X extends string | boolean | number,
  T extends Record<string, X>
>(
  constant: T,
  value: X
): boolean => {
  return memoizedValues(constant).includes(value);
};

export function dedupeErrors<T>(
  handler: (arg0: unknown) => T
): (arg0: unknown) => T | undefined | undefined {
  const seenErrors: unknown[] = [];
  const seenStringifiedErrors = {};
  return (err) => {
    if (seenErrors.includes(err)) {
      return;
    }

    seenErrors.push(err);
    const stringifiedError = stringifyError(err);

    // @ts-expect-error string key
    if (seenStringifiedErrors[stringifiedError]) {
      return;
    }

    // @ts-expect-error string key
    seenStringifiedErrors[stringifiedError] = true;
    return handler(err);
  };
}

export class ExtendableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
