/* @flow */

import {
    perc, min, max, roundUp, regexMap, svgToBase64,
    objFilter, regexTokenize, camelToDasherize, dasherizeToCamel,
    capitalizeFirstLetter, arrayFrom, isObject, isObjectObject
} from '../../../src/util';

describe('util cases', () => {
    const sourceValues = [ 7, 30, 1 ];

    it('perc', () => {
        const result = perc(1000, 50);

        if (result !== 500) {
            throw new Error(`should return the value "500", but got: ${ result }`);
        }
    });

    it('min', () => {
        const result = min(...sourceValues);

        if (result !== 1) {
            throw new Error(`should return the minimum value "1", but got: ${ result }`);
        }
    });

    it('max', () => {
        const result = max(...sourceValues);

        if (result !== 30) {
            throw new Error(`should return the maximum value "30", but got: ${ result }`);
        }
    });

    it('roundUp', () => {
        const result = roundUp(10, 5);

        if (result !== 10) {
            throw new Error(`should return the roundUp value "10", but got: ${ result }`);
        }
    });

    it('roundUp', () => {
        const result = roundUp(10, 6);

        if (result !== 12) {
            throw new Error(`should return the roundUp value "12", but got: ${ result }`);
        }
    });

    it('regexMap', () => {
        const expectedResult = 'test';
        // $FlowFixMe incompatible-call
        const result = regexMap(expectedResult, /[a-z]*/);

        if (result[0] !== expectedResult) {
            throw new Error(`should get the value "${ expectedResult }", but got: ${ String(result) }`);
        }
    });

    it('svgToBase64', () => {
        const expectedResult = 'data:image/svg+xml;base64,YQ';
        // $FlowFixMe incompatible-call
        const result = svgToBase64('a');

        if (result !== expectedResult) {
            throw new Error(`should get the value "${ expectedResult }", but got: ${ String(result) }`);
        }
    });

    it('objFilter', () => {
        const result = objFilter({ value: true, value1: false }, value => value);

        if (!result.value) {
            throw new Error(`should get the value "true" from key, but got: ${ String(result) }`);
        }
    });

    it('regexTokenize', () => {
        const expectedResult = 'test';
        const result = regexTokenize(expectedResult, /[a-z]+/);

        if (result[0] !== expectedResult) {
            throw new Error(`should get the value "${ expectedResult }" from key, but got: ${ String(result) }`);
        }
    });

    it('camelToDasherize and dasherizeToCamel', () => {
        const dasherize = camelToDasherize('TestCase');
        const undasherize = dasherizeToCamel(dasherize);

        if (dasherize !== '-test-case' || undasherize !== 'TestCase') {
            throw new Error(`should dasherize and undasherize values, but got dasherize: ${ String(dasherize) } and undasherize: ${ undasherize }`);
        }
    });

    it('capitalizeFirstLetter', () => {
        const expectedResult = 'Test';
        const result = capitalizeFirstLetter('test');

        if (result !== expectedResult) {
            throw new Error(`should return the value "${ expectedResult }", but got ${ String(result) }`);
        }
    });

    it('arrayFrom', () => {
        const result = arrayFrom([ 1, 2, 3 ]);

        if (result.length !== 3) {
            throw new Error(`should return an array with length "3", but got ${ String(result) }`);
        }
    });

    it('isObject', () => {
        const result = isObject({});

        if (!result) {
            throw new Error(`should return the value "true", but got ${ String(result) }`);
        }
    });

    it('isObjectObject', () => {
        const result = isObjectObject({});

        if (!result) {
            throw new Error(`should return the value "true", but got ${ String(result) }`);
        }
    });
});
