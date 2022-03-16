/* @flow */

import { isPlainObject } from '../../../src';

describe('isPlainObject cases', () => {
    let entity;

    beforeEach(() => {
        function Entity() {
            this.description = 'test';
        }
        entity = new Entity();
    });

    it('isPlainObject should return false', () => {
        const result = isPlainObject(2);

        if (result) {
            throw new Error(`should return is not a plain object, but got: ${ String(result) }`);
        }
    });

    it('isPlainObject should return false when constructor is not a function', () => {
        entity.constructor = false;
        const result = isPlainObject(entity);

        if (result) {
            throw new Error(`should return is not a plain object, but got: ${ String(result) }`);
        }
    });

    it('isPlainObject should return false when prototype is not an object', () => {
        entity.constructor.prototype = null;
        const result = isPlainObject(entity);

        if (result) {
            throw new Error(`should return is not a plain object, but got: ${ String(result) }`);
        }
    });

    it('isPlainObject should return false when prototype is not an object', () => {
        Reflect.deleteProperty(entity.constructor.prototype, 'isPrototypeOf');
        const result = isPlainObject(entity);

        if (result) {
            throw new Error(`should return is not a plain object, but got: ${ String(result) }`);
        }
    });

    it('isPlainObject should return false when prototype is not an object', () => {
        const result = isPlainObject({});

        if (!result) {
            throw new Error(`should return is a valid plain object, but got: ${ String(result) }`);
        }
    });
});
