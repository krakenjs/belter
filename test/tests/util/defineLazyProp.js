/* @flow */

import { defineLazyProp } from '../../../src/util';

describe('defineLazyProp cases', () => {
    let source;

    beforeEach(() => {
        source = {};
    });

    it('defineLazyProp should throw error message when typeof is array and key is not a number', () => {
        const expectedErrorMessage = 'Array key must be number';
        try {
            defineLazyProp([ 1 ], 'key', () => 'key');
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
    });

    it('defineLazyProp should throw error message when typeof is object and key is not a string', () => {
        const expectedErrorMessage = 'Object key must be string';
        try {
            defineLazyProp({}, 2, () => 'key');
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
    });

    it('defineLazyProp should get the property', () => {
        defineLazyProp(source, 'test', () => 1);
        const result = source.test;


        // $FlowFixMe[incompatible-type]
        if (result !== 1) {
            throw new Error(`should return the value "1", but got: ${ String(result) }`);
        }
    });

    it('defineLazyProp should set the property', () => {
        defineLazyProp(source, 'test', () => true);
        source.test = 30;
        
        // $FlowFixMe[incompatible-type]
        if (source.test !== 30) {
            throw new Error(`should return the an object with key "value", but got: ${ JSON.stringify(source.test) }`);
        }
    });
});
