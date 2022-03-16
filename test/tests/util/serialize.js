/* @flow */

import { base64encode, base64decode } from '../../../src';

describe('serialization cases', () => {
    function encodedecode(input) {
        const encoded = base64encode(input);
        const decoded = base64decode(encoded);

        if (input !== decoded) {
            throw new Error(`Encoding mismatch. Original data:\n\n${ input }\n\nBase64 Encoded:\n\n${ encoded }\n\nBase64 Decoded:\n\n${ decoded }`);
        }
    }

    it('should base64 encode and decode basic strings', () => {
        encodedecode('basic');
    });

    it('should base64 encode and decode JSON strings', () => {
        const data = JSON.stringify({
            foo:    'bar',
            baz:    [ 1, 2, 3 ],
            bing:   [ 'aaa', 'bbb', 'ccc' ],
            bong:   [ { a: 1 }, { b: 2 }, { c: 3 } ],
            nested: {
                obj: {
                    blerf: 'foobar',
                    blorf: 555
                },
                zorg: 'zerg',
                berk: 'me,erk'
            }
        });

        encodedecode(data);
    });


    it('should base64 encode and decode unicode strings', () => {
        const cases = [
            'Привет! Это наш тест',
            'Tişört ve bluz'
        ];

        cases.forEach(encodedecode);
    });

    it('base64encode should return true when domain matches', () => {
        const original = 'ewewgweg';
        const expected = 'ZXdld2d3ZWc';

        const result = base64encode(original);

        if (result !== expected) {
            throw new Error(`Expected base64 of ${ original } to be ${ expected }, got ${ result }`);
        }
    });

    it('base64encode should return true when domain matches and btoa is not available', () => {
        const originalFn = window.btoa;
        Reflect.deleteProperty(window, 'btoa');
        window.Buffer = {
            from() : string {
                return 'ZXdld2d3ZWc';
            }
        };

        const original = 'ewewgweg';
        const expected = 'ZXdld2d3ZWc';

        const result = base64encode(original);

        if (result !== expected) {
            throw new Error(`Expected base64 of ${ original } to be ${ expected }, got ${ result }`);
        }
        Reflect.deleteProperty(window, 'Buffer');
        window.btoa = originalFn;
    });

    it('base64encode should throw an error when btoa and Buffer are not available', () => {
        const expectedErrorMessage = 'Can not find window.btoa or Buffer';
        const originalFn = window.btoa;
        Reflect.deleteProperty(window, 'btoa');

        try {
            base64encode('ewewgweg');
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error message "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
        window.btoa = originalFn;
    });

    it('base64decode should return decode value when btoa is not available', () => {
        const expectedResult = 'test';
        const originalFn = window.atob;
        Reflect.deleteProperty(window, 'atob');
        window.Buffer = {
            from() : string {
                return expectedResult;
            }
        };

        const result = base64decode('dGVzdA==');
        if (result !== expectedResult) {
            throw new Error(`should return the value "${ expectedResult }", but got: ${ expectedResult }`);
        }
        Reflect.deleteProperty(window, 'Buffer');
        window.atob = originalFn;
    });

    it('base64decode should throw an error when atob and Buffer are not available', () => {
        const expectedErrorMessage = 'Can not find window.atob or Buffer';
        const originalFn = window.atob;
        Reflect.deleteProperty(window, 'atob');

        try {
            base64decode('dGVzdA==');
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw the error message "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
        window.atob = originalFn;
    });
});
