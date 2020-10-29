/* @flow */

import { isDefined } from '../../../src/util';

describe('isDefined', () => {
    it('should return true when value is neither undefined nor null', () => {
        const bool = isDefined('potato')
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`)
        }
    });

    it('should return false when value is undefined', () => {
        const bool = isDefined(undefined)
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`)
        }
    });

    it('should return false when value is null', () => {
        const bool = isDefined(null)
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`)
        }
    });
});
