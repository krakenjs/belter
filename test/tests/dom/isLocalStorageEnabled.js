/* @flow */

import { isLocalStorageEnabled } from '../../../src';

describe('dom isLocalStorageEnabled cases', () => {
    it('isLocalStorageEnabled should return "true" when is available in window context', () => {
        const result = isLocalStorageEnabled();

        if (result.toString()  !== 'true') {
            throw new Error(`should return "true", but got: ${ String(result) }`);
        }
    });

    it('isLocalStorageEnabled should return "false" when is unavailable in window context', () => {
        const originalCache = Reflect.get(isLocalStorageEnabled, '__inline_memoize_cache__');
        const originalLocalStorage = window.localStorage;
        Reflect.deleteProperty(isLocalStorageEnabled, '__inline_memoize_cache__');
        Reflect.deleteProperty(window, 'localStorage');
        
        const result = isLocalStorageEnabled();
        if (result.toString() !== 'false') {
            throw new Error(`should return "true", but got: ${ String(result) }`);
        }
        Reflect.set(window, 'localStorage', originalLocalStorage);
        Reflect.set(isLocalStorageEnabled, '__inline_memoize_cache__', originalCache);
    });
});
