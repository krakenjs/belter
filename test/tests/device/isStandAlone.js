/* @flow */

import { isStandAlone } from '../../../src/device';

describe('isStandAlone', () => {
    beforeEach(() => {
        // eslint-disable-next-line compat/compat
        window.navigator = {};
        window.matchMedia = () => ({ matches: true });
    });
    it('should return false when window.navigator.standalone is falsy and window.matchMedia().matches returns a falsy value', () => {
        window.matchMedia = () => ({ matches: false });
        const bool = isStandAlone();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when window.navigator.standalone is truthy', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.standalone = true;
        const bool = isStandAlone();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when navigator.standalone is falsy and window.matchMedia().matches returns a truthy value', () => {
        // eslint-disable-next-line compat/compat
        window.navigator.standalone = false;
        const bool = isStandAlone();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
});
