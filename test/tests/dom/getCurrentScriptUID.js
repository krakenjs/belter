/* @flow */

import { getCurrentScriptUID, getCurrentScript, memoize, ATTRIBUTES, strHashStr } from '../../../src';


beforeEach(() => {
    const script = getCurrentScript();
    script.removeAttribute(`${ ATTRIBUTES.UID }`);
    script.removeAttribute(`${ ATTRIBUTES.UID }-auto`);
    script.setAttribute('data-csp-nonce', '654321');
    memoize.clear();
});

describe('get current script UID', () => {

    it('should create a data-uid-auto attribute', () => {

        getCurrentScriptUID();

        const currentScript = getCurrentScript();
        const uidAttr = currentScript.getAttribute(`${ ATTRIBUTES.UID }-auto`);

        if (!uidAttr) {
            throw new Error(
                `Should have a 'data-uid-auto' attribute, got undefined`
            );
        }
    });

    it('should use script\'s src and attributes to create the script UID', () => {

        const currentScript : HTMLScriptElement = getCurrentScript();
        const { src, dataset } = currentScript;
        const stringToHash = JSON.stringify({ src, dataset });
        const maxLengthForHashString = 20;
        const hashedString = strHashStr(stringToHash).slice(maxLengthForHashString);
        const uidToCompare = `uid_${ hashedString }`;

        const uidString : string = getCurrentScriptUID();

        if (uidString !== uidToCompare) {
            throw new Error(
                `Should have a data-uid-auto attribute ${ uidToCompare }, got ${ uidString }`
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
                `Should have returned a data-uid with '123456', got ${ uidString }`
            );
        }
    });
});
