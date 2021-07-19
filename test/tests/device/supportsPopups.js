/* @flow */

import { supportsPopups } from '../../../src/device';

describe('supportsPopups', () => {
    beforeEach(() => {
        
        window.navigator.userAgent = 'anthonykhoa wants to work at paypal :D';
        Object.defineProperty(window, 'status', { writable: true, value: {} });
    });
    it('should return false when isIosWebview function returns true', () => {
        
        window.navigator.userAgent = 'iPhone GSA';
        const bool = supportsPopups();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when isAndroidWebview function returns true', () => {
        
        window.navigator.userAgent = 'AndroidVersion/9';
        const bool = supportsPopups();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when isOperaMini function returns true', () => {
        
        window.navigator.userAgent = 'Opera Mini';
        const bool = supportsPopups();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when isFirefoxIOS function returns true', () => {
        
        window.navigator.userAgent = 'fxios';
        const bool = supportsPopups();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when isEdgeIOS function returns true', () => {
        
        window.navigator.userAgent = 'edgios';
        const bool = supportsPopups();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when isFacebookWebView function returns true', () => {
        
        window.navigator.userAgent = 'FBAN';
        const bool = supportsPopups();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when QQBrowser function returns true', () => {
        
        window.navigator.userAgent = 'QQBrowser';
        const bool = supportsPopups();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when isElectron function returns true', () => {
        global.process.versions.electron = true;
        const bool = supportsPopups();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when isMacOsCna function returns true', () => {
        
        window.navigator.userAgent = 'macintosh.potatoAppleWebKit';
        const bool = supportsPopups();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when isStandAlone function returns true', () => {
        
        window.navigator.standalone = true;
        const bool = supportsPopups();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when every function call returns false', () => {
        // makes isElectron function return false
        global.process = {};
        // matchMedia and navigator.standalone are set to make isStandAlone function return false
        window.matchMedia = () => ({ matches: false });
        
        window.navigator.standalone = false;
        const bool = supportsPopups();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
});
