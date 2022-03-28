/* @flow */

import { parseQuery, getQueryParam } from '../../../src';

describe('parseQuery cases', () => {
    const querySource = 'foo=1&bar=2';

    it('should return an empty object', () => {
        const resultEmptyString = JSON.stringify(parseQuery(''));

        if (resultEmptyString !== '{}') {
            throw new Error(`should get and empty object, but got: ${ resultEmptyString }`);
        }

        const resultNotFormedParam = JSON.stringify(parseQuery('foo'));

        if (resultNotFormedParam !== '{}') {
            throw new Error(`should get and empty object, but got: ${ resultNotFormedParam }`);
        }
    });

    it('should return the param object', () => {
        const result = JSON.stringify(parseQuery(querySource));

        if (result.toString() !== '{"foo":"1","bar":"2"}') {
            throw new Error(`should get and empty object, but got: ${ result.toString() }`);
        }
    });

    it('getQueryParam should get the query parameter value', () => {
        window.history.pushState({}, 'test', `?foo=1`);
        const result = getQueryParam('foo');

        if (result !== '1') {
            throw new Error(`should get the value "1", but got: ${ result }`);
        }
    });
});
