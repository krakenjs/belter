/* @flow */

import { getGlobalNameSpace } from '../../src/global';

describe('experiment', () => {
    it('should return the right value from the namespace', () => {
        window.__goku__latest_global__ = { vegeta: 'vegetable' };
        const { get } = getGlobalNameSpace({ name: 'goku' });
        const res = get('vegeta');
        if (res !== 'vegetable') {
            throw new Error(`Expected vegetable, received ${ JSON.stringify(res) }`);
        }
    });
    it('should return default value from the namespace', () => {
        window.__goku__latest_global__ = null;
        const { get } = getGlobalNameSpace({ name: 'goku' });
        const res = get('vegeta', 'testingDatDefaultValue');
        if (res !== 'testingDefaultValue') {
            throw new Error(`Expected testingDefaultValue, received ${ JSON.stringify(res) }`);
        }
    });
});
