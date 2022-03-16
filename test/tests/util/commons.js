/* @flow */

import { ZalgoPromise } from '@krakenjs/zalgo-promise/dist/zalgo-promise';

import {
    perc, min, max, roundUp, regexMap, svgToBase64,
    objFilter, regexTokenize, camelToDasherize, dasherizeToCamel,
    capitalizeFirstLetter, arrayFrom, isObject, isObjectObject,
    copyProp, cycle, weakMapMemoize, weakMapMemoizePromise,
    tryCatch, assertExists, unique, constHas, promiseIdentity,
    isElement, getObjectID, hashStr, safeTimeout, cleanup,
    dedupeErrors, ExtendableError
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
        // $FlowFixMe[incompatible-call]
        const result = regexMap(expectedResult, /[a-z]*/);

        if (result[0] !== expectedResult) {
            throw new Error(`should get the value "${ expectedResult }", but got: ${ String(result) }`);
        }
    });

    it('svgToBase64', () => {
        const expectedResult = 'data:image/svg+xml;base64,YQ';
        // $FlowFixMe[incompatible-call]
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

    it('copyProp should copy the name property from source object', () => {
        const target = {};
        copyProp({ value: 1 }, target, 'value');

        if (!target.value) {
            throw new Error(`should copy the property "value" in the target object`);
        }
    });

    it('copyProp should copy the name property from default value', () => {
        const target = {};
        copyProp({}, target, 'value', 1);

        if (!target.value) {
            throw new Error(`should copy the property "value" in the target object`);
        }
    });

    it('cycle', () => {
        const expectedErrorMessage = 'unexpected';
        try {
            cycle(() => {
                throw new Error(expectedErrorMessage);
            });
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error message "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
    });

    it('weakMapMemoize', () => {
        const result = weakMapMemoize(() => true)('value');

        if (!result) {
            throw new Error(`should return the value "true", but got: ${ result }`);
        }
    });

    it('weakMapMemoizePromise', async () => {
        const customMethod = () => {
            return new ZalgoPromise(resolve => {
                resolve(true);
            });
        };
        const result = await weakMapMemoizePromise(customMethod)('value');

        if (!result) {
            throw new Error(`should return the value "true", but got: ${ result }`);
        }
    });

    it('tryCatch should return the method execution', () => {
        const { result, error } = tryCatch(() => true);

        if (!result || error) {
            throw new Error(`should execute the method with no errors, but got: ${ String(error) }`);
        }
    });

    it('tryCatch should return the method execution', () => {
        const expectedErrorMessage = 'unexpected';
        // eslint-disable-next-line no-unused-vars
        const { result, error } = tryCatch(() => {
            throw new Error(expectedErrorMessage);
        });
        // $FlowFixMe[incompatible-type]
        if (error.message !== expectedErrorMessage) {
            // $FlowFixMe[incompatible-use]
            throw new Error(`should return error message "${ expectedErrorMessage }", but got: ${ error.message }`);
        }
    });

    it('assertExists should thrown an error', () => {
        const expectedErrorMessage = 'Expected value to be present';
        try {
            assertExists('value', null);
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should return error message "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
    });

    it('assertExists should return second argument', () => {
        const thing = {};
        const result = assertExists('value', thing);

        if (!Object.is(thing, result)) {
            throw new Error('should return the exact same oject, but got a different reference');
        }
    });

    it('unique', () => {
        const result = unique([ '1', '1', '1' ]);

        if (result.length > 1 || result[0] !== '1') {
            throw new Error(`should return unique values, but got: ${ String(result) }`);
        }
    });

    it('constHas', () => {
        const result = constHas({ 'test': 'test' }, 'test');

        if (!result) {
            throw new Error(`should return value "true", but got: ${ String(result) }`);
        }
    });

    it('promiseIdentity', async () => {
        const result = await promiseIdentity(true);

        if (!result) {
            throw new Error(`should return value "true", but got: ${ String(result) }`);
        }
    });

    it('isElement', () => {
        function NodeElement() {
            this.style = {
                color: 'red'
            };
        }
        NodeElement.prototype = Node.prototype;
        const element = new NodeElement();
        Reflect.defineProperty(element, 'nodeType', { value: 1 });
        Reflect.defineProperty(element, 'ownerDocument', { value: {} });
        const result = isElement(element);

        if (!result) {
            throw new Error(`should return is an Element with value "true", but got: ${ String(result) }`);
        }
    });

    it('getObjectID should return the object id', () => {
        const expectedResult = 'object:uid_';
        const result = getObjectID({ key: 'value' });

        if (!result.startsWith(expectedResult)) {
            throw new Error(`should return value starting with "${ expectedResult }", but got: ${ result }`);
        }
    });

    it('getObjectID should throw an error', () => {
        const expectedErrorMessage = 'Invalid object';
        try {
            getObjectID();
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error message "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
    });

    it('hashStr', () => {
        const expectedResult = 8725400074294;
        const result = hashStr('test');

        if (result !== expectedResult) {
            throw new Error(`should return value ${ expectedResult }, but got: ${ result }`);
        }
    });

    it('safeTimeout', () => {
        let result;
        const executeFunction = () => {
            result = true;
        };

        safeTimeout(executeFunction, 0);
        safeTimeout(() => {
            if (!result) {
                throw new Error(`should return value "true", but got: ${ result }`);
            }
        }, 100);
    });

    it('cleanup should send a register method to a queue', () => {
        const item = 'value';
        const cleaner = cleanup({});
        const result = cleaner.set('test', item);
        const register = cleaner.register(() => true);
        register.cancel();
        cleaner.all('error');

        if (result !== 'value') {
            throw new Error(`should get the value "${ item }", but got ${ String(result) }`);
        }
    });

    it('cleanup should directly execute a register method', () => {
        const item = 'value';
        const cleaner = cleanup({});
        const result = cleaner.set('test', item);
        cleaner.all('error');
        cleaner.register(() => true);

        if (result !== 'value') {
            throw new Error(`should get the value "${ item }", but got ${ String(result) }`);
        }
    });

    it('dedupeErrors', () => {
        const expectedResult = 'errorMessage';
        const error = new Error(expectedResult);
        // $FlowFixMe[incompatible-use]
        const result = dedupeErrors(err => err.message)(error);

        if (result !== expectedResult) {
            throw new Error(`should get the value "${ expectedResult }", but got ${ String(result) }`);
        }
    });

    it('ExtendableError with default stack', () => {
        const expectedErrorMessage = 'customError';
        const error = new ExtendableError(expectedErrorMessage);

        if (error.message !== expectedErrorMessage) {
            throw new Error(`should get the value "${ expectedErrorMessage }", but got ${ String(error.message) }`);
        }
    });

    it('ExtendableError with custom stack', () => {
        const original = Error.captureStackTrace;
        // $FlowFixMe[cannot-write]
        Error.captureStackTrace = undefined;
        const expectedErrorMessage = 'customError';
        const error = new ExtendableError(expectedErrorMessage);

        if (error.message !== expectedErrorMessage) {
            throw new Error(`should get the value "${ expectedErrorMessage }", but got ${ String(error.message) }`);
        }
        // $FlowFixMe[cannot-write]
        Error.captureStackTrace = original;
    });
});
