/* @flow */

import { getBody } from '../../../src';

describe('get body cases', () => {

    it('should get the body', () => {
        if (getBody() !== document.body) {
            throw new Error(`Expected getBody to get the correct body element`);
        }
    });
});
