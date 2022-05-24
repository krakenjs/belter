/* @flow */

import { isCrossSiteTrackingEnabled  } from '../../../src/device';

describe('isCrossSiteTrackingEnabled', () => {
    it('should return false when expected cookies are present', () => {
        window.document.cookie = 'enforce_policy=ccpa';

        const bool = isCrossSiteTrackingEnabled('enforce_policy');
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });

    it('should return true when expected cookies are not present', () => {
        window.document.cookie = 'enforce_policy=ccpa;expires=Thu, 21 Sep 1979 00:00:01 UTC;';

        const bool = isCrossSiteTrackingEnabled('enforce_policy');
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
});
