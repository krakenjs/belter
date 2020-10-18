/* @flow */

import { getGlobalNameSpace } from '../../src/global';

describe('experiment', () => {
    it('should return the right value from the namespace', () => {
        window.__goku__latest_global__ = { vegeta: 'kamehameha' };
        const { get } = getGlobalNameSpace({ name: 'goku' });
        const res = get('vegeta');
        if (res !== 'kamehameha') {
            throw new Error(`Expected kamehameha, received ${ JSON.stringify(res) }`);
        }
        delete window.__goku__latest_global__;
    });
    it('should return default value from the namespace', () => {
        const { get } = getGlobalNameSpace({ name: 'goku' });
        const res = get('vegeta', 'testingDatDefaultValue');
        if (res !== 'testingDatDefaultValue') {
            throw new Error(`Expected testingDatDefaultValue, received ${ JSON.stringify(res) }`);
        }
    });
});
