/* @flow */

import { isOperaMini  } from '../../../src/device';

describe('isOperaMini', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
    });
    it('should return true when userAgent equals `Opera Mini`', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'Opera Mini';
        const bool = isOperaMini();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT equal `Opera Mini`', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'mini potato';
        const bool = isOperaMini();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
