/* @flow */

import {  identity } from '../../../src';

describe('identity', () => {

    it('should return the same value as argument passed', () => {
        const args = [ null, undefined, '', 0, 22, 'hello' ];
        args.forEach(arg => {
            if (identity(arg) !== arg) {
                throw new Error(`Expected ${ String(arg) } but received ${ String(identity(arg)) }`);
            }
        });
        const someObj = { a: 'a' };
        if (identity(someObj) !== someObj) {
            throw new Error(`Expected ${ someObj.toString() } but received ${ identity(someObj).toString() }`);
        }
    });

});
