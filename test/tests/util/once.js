/* @flow */

import { once } from '../../../src';

describe('once cases', () => {

    it('should create a one time function', () => {

        let counter = 0;

        const add = once(() => {
            counter += 1;
        });

        add();
        add();
        add();
        add();
        add();

        if (counter !== 1) {
            throw new Error(`Expected counter to be 1, got ${ counter }`);
        }
    });
});
