/* @flow */

import { isCrossSiteTrackingEnabled  } from '../../../src/device';

describe('isCrossSiteTrackingEnabled', () => {
    it('should return false when expected cookies are present', () => {
        document.cookie = 'enforce_policy=ccpa';

        const bool = isCrossSiteTrackingEnabled();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    
    it('should return true when expected cookies are not present', () => {
        document.cookie = '';

        const bool = isCrossSiteTrackingEnabled();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
});
