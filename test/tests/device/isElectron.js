/* @flow */

import { isElectron  } from '../../../src/device';

describe('isElectron', () => {
    beforeEach(() => {
        global.process = {};
        global.process.versions = {};
    });
    it('should return false when process is undefined', () => {
        global.process = undefined;
        const bool = isElectron();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when process.versions is a falsy value', () => {
        global.process.versions = false;
        const bool = isElectron();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when process.versions.electron is a falsy value', () => {
        global.process.versions.electron = false;
        const bool = isElectron();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when process.versions.electron is a truthy value', () => {
        global.process.versions.electron = true;
        const bool = isElectron();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
});
