/* @flow */

import {  stringifyErrorMessage } from '../../../src';

describe('stringifyErrorMessage', () => {

    it('should return default error message when argument is falsy', () => {
        // $FlowFixMe method-unbinding
        const defaultMessage =  `<unknown error: ${ Object.prototype.toString.call() }>`;
        const message = stringifyErrorMessage();
        if (message !== defaultMessage) {
            throw new Error(`Expected ${ defaultMessage }, got ${ message }`);
        }
    });

    it('should return message field if Error instance is passed', () => {
        const expectedMessage =  'Hello';
        const message = stringifyErrorMessage(new Error(expectedMessage));
        if (message !== expectedMessage) {
            throw new Error(`Expected ${ expectedMessage }, got ${ message }`);
        }
    });

    it('should return default message if Error instance without a message is passed', () => {
        const error = new Error();
        // $FlowFixMe method-unbinding
        const expectedMessage =  `<unknown error: ${ Object.prototype.toString.call(error) }>`;
        const message = stringifyErrorMessage(error);
        if (message !== expectedMessage) {
            throw new Error(`Expected ${ expectedMessage }, got ${ message }`);
        }
    });

    it('should return message field of any non-Error object argument is passed', () => {
        const error = { message: 'Hello' };
        const expectedMessage =  'Hello';
        const message = stringifyErrorMessage(error);
        if (message !== expectedMessage) {
            throw new Error(`Expected ${ expectedMessage }, got ${ message }`);
        }
    });

    it('should return default message if argument passed has a empty string message field', () => {
        const error = { message: '' };
        // $FlowFixMe method-unbinding
        const expectedMessage =  `<unknown error: ${ Object.prototype.toString.call(error) }>`;
        const message = stringifyErrorMessage(error);
        if (message !== expectedMessage) {
            throw new Error(`Expected ${ expectedMessage }, got ${ message }`);
        }
    });

    it('should return default message if a primitive argument is passed or argument has non-string value in message field', () => {
        const error = 42;
        // $FlowFixMe method-unbinding
        const expectedMessage =  `<unknown error: ${ Object.prototype.toString.call(error) }>`;
        const message = stringifyErrorMessage(error);
        if (message !== expectedMessage) {
            throw new Error(`Expected ${ expectedMessage }, got ${ message }`);
        }
    });


});
