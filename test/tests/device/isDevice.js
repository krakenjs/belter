/* @flow */

import { isDevice } from '../../../src/device';

describe('isDevice', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
    });
    it('should return true when userAgent is android', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'android';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is webos', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'webos';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is iphone', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'iphone';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is ipad', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'ipad';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is ipod', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'ipod';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is bada', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'bada';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is symbian', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'symbian';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is palm', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'palm';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is crios', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'crios';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is blackberry', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'blackberry';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is blackberry', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'blackberry';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is iemobile', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'iemobile';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is windowsmobile', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'windowsmobile';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when userAgent is `opera mini`', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'opera mini';
        const bool = isDevice();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent is not a valid Choice', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'supreme potato';
        const bool = isDevice();
        if (bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
});
