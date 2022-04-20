
/* @flow */

import { regex } from '../../../src/util';

describe('regex cases', () => {
    it('regex should return "undefined" when a regex does not match', () => {
        const result = regex('regex', 'source');

        if (result !== undefined) {
            throw new Error(`should get the value "undefined", but got ${ String(result) }`);
        }
    });

    it('regex should return the result object when a match was found', () => {
        const source = 'source';
        const result = regex('[a-z]+', source);

        if (result?.text !== source) {
            throw new Error(`should get the value "source", but got ${ String(result?.text) }`);
        }
    });

    it('regex should replace the resulting matching text', () => {
        const source = 'source';
        const result = regex('rce', source);
        // $FlowFixMe[incompatible-use]
        const text = result.replace('a');

        if (text !== 'rcea') {
            throw new Error(`should get the value "rcea", but got ${ text }`);
        }
    });

    it('regex should replace and return an empty string', () => {
        const source = 'source';
        const result = regex('', source);
        // $FlowFixMe[incompatible-use]
        const text = result.replace('');

        if (text !== '') {
            throw new Error(`should get the an empty string, but got ${ text }`);
        }
    });
});
