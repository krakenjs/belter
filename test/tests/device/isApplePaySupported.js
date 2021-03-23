/* @flow */

import { isApplePaySupported } from '../../../src/device';

describe('isApplePaySupported', () => {
    it('should return true if ApplePaySession and canMakePayments is true', () => {
        window.ApplePaySession = {
            canMakePayments: () => {
                return true;
            }
        };
        const bool = isApplePaySupported();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false if ApplePaySession and canMakePayments is false', () => {
        window.ApplePaySession = null;

        const bool = isApplePaySupported();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
