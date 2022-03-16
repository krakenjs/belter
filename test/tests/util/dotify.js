/* @flow */

import { dotify, undotify } from '../../../src';

describe('dotify cases', () => {

    it('should dotify and undotify to give the same result', () => {
        const data = {
            foo:    'bar',
            baz:    [ 1, 2, 3 ],
            bing:   [ 'aaa', 'bbb', 'ccc' ],
            bong:   [ { a: 1 }, { b: 2 }, { c: 3 } ],
            nested: {
                obj: {
                    blerf: 'foobar',
                    blorf: 555
                },
                zorg: 'zerg',
                berk: 'me,erk'
            },
            func:          () =>  true
        };

        const dotified = dotify(data);
        const undotified = undotify(dotified);

        if (JSON.stringify(data) !== JSON.stringify(undotified)) {
            throw new Error(`Does not match. Original data:\n\n${ JSON.stringify(data, null, 4) }\n\nDotified:\n\n${ JSON.stringify(dotified, null, 4) }\n\nUndotified:\n\n${ JSON.stringify(undotified, null, 4) }`);
        }
    });

    it('undotify should throw an error', () => {
        const expectedErrorMessage = 'Disallowed key: constructor';
        const data = {
            'test':             Object.prototype,
            'constructor.part': 'error'
        };

        try {
            // $FlowFixMe[incompatible-call]
            undotify(data);
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error message "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
    });
});
