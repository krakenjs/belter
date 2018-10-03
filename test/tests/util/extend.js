/* @flow */

import { extend } from '../../../src';

describe('extend cases', () => {

    it('should add keys from one object to another', () => {
        let obj1 : Object = {
            'foo': 1,
            'bar': 2,
            'baz': 3
        };

        let obj2 : Object = {
            'blep':  4,
            'blop':  5,
            'bloop': 6
        };

        extend(obj1, obj2);

        if (obj1.blep !== 4) {
            throw new Error(`Expected obj1.blep to equal 4, got ${ obj1.blep }`);
        }

        if (obj1.blop !== 5) {
            throw new Error(`Expected obj1.blop to equal 5, got ${ obj1.blop }`);
        }

        if (obj1.bloop !== 6) {
            throw new Error(`Expected obj1.bloop to equal 6, got ${ obj1.bloop }`);
        }
    });
});
