/* @flow */

import { deserializePrimitive } from '../../../src';

describe('deserializePrimitive cases', () => {
    it('deserializePrimitive should return true', () => {
        const result = deserializePrimitive('true');

        if (result !== true) {
            throw new Error(`should return "true", but got: ${ String(result) }`);
        }
    });

    it('deserializePrimitive should return false', () => {
        const result = deserializePrimitive('false');

        if (result !== false) {
            throw new Error(`should return "true", but got: ${ String(result) }`);
        }
    });

    it('deserializePrimitive should return numeric value', () => {
        const result = deserializePrimitive('10');

        if (result !== 10) {
            throw new Error(`should return "true", but got: ${ String(result) }`);
        }
    });


    it('deserializePrimitive should return float value', () => {
        const result = deserializePrimitive('10.57');

        if (result !== 10.57) {
            throw new Error(`should return "true", but got: ${ String(result) }`);
        }
    });
});
