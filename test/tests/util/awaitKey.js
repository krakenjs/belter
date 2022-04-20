/* @flow */

import { awaitKey } from '../../../src';

describe('awaitKey cases', () => {
    it('awaitKey should return the value when existing', () => {
        const obj = {
            custom: true
        };
        const result = awaitKey(obj, 'custom');

        if (!result) {
            throw new Error(`should return "true", but got: ${ result }`);
        }
    });

    it('awaitKey should return the configured value when does not exists', () => {
        const obj = {};

        awaitKey(obj, 'custom');
        obj.custom = 'result';
        const result = obj.custom;

        if (result !== 'result') {
            throw new Error(`should return "result", but got: ${ result }`);
        }
    });
});
