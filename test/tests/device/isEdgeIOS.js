/* @flow */

import { isEdgeIOS  } from '../../../src/device';

describe('isEdgeIOS', () => {
    beforeEach(() => {
        
        window.navigator = {};
    });
    it('should return true when userAgent contains edgios(case insensitive)', () => {
        
        window.navigator.userAgent = 'edgios';
        const bool = isEdgeIOS();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT contain edgios(case insensitive)', () => {
        
        window.navigator.userAgent = 'edgey potato';
        const bool = isEdgeIOS();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
