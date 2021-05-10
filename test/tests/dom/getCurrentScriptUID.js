/* @flow */

import { getCurrentScriptUID, getCurrentScript, memoize, ATTRIBUTES } from '../../../src';


beforeEach(() => {
    const script = getCurrentScript();
    script.setAttribute(`${ ATTRIBUTES.NONE }`, '654321');
});

afterEach(() => {
    const script = getCurrentScript();
    script.removeAttribute(`${ ATTRIBUTES.UID }`);
    script.removeAttribute(`${ ATTRIBUTES.UID }-auto`);
    memoize.clear();
});

describe('get current script UID', () => {

    it('should create a data-uid-auto attribute', () => {
        
        getCurrentScriptUID();

        const currentScript = getCurrentScript();
        const uidAttr = currentScript.getAttribute(`${ ATTRIBUTES.UID }-auto`);

        if (!uidAttr) {
            throw new Error(
                `Expected result have a 'data-uid-auto' attribute, got none`
            );
        }
    });
  
    it('should use script\'s src and attributes to create the script UID', () => {

        const uidString : string = getCurrentScriptUID();

        if (!uidString.startsWith('UID_')) {
            throw new Error(
                `Expected result should be a data-uid-auto starting with UID_, got ${ uidString }`
            );
        }
    });

    it('should return data-uid if this was set', () => {

        const script : HTMLScriptElement = getCurrentScript();

        script.removeAttribute(`${ ATTRIBUTES.UID }-auto`);
        script.setAttribute(`${ ATTRIBUTES.UID }`, '123456');

        const uidString : string = getCurrentScriptUID();

        if (uidString !== '123456') {
            throw new Error(
                `Expected result should be '123456', got ${ uidString }`
            );
        }
    });
});
