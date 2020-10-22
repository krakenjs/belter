/* @flow */

import { isEdgeIOS  } from '../../../src/device';

describe('isEdgeIOS', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
    });
    it('should return true when userAgent equals edgios', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'edgios';
        const bool = isEdgeIOS();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT equal edgios(case insensitive)', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.userAgent = 'unanimous potato';
        const bool = isEdgeIOS();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
