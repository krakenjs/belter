/* @flow */
import { $mockEndpoint, patchXmlHttpRequest } from 'sync-browser-mocks/dist/sync-browser-mocks';

import { request, addHeaderBuilder } from '../../src/http';

describe.only('http cases', () => {
    const url = '/test';
    const initialRequestConfig = {
        method:  'GET',
        uri:     url,
        data:    true
    };
    const mockRequest = (sourceData = initialRequestConfig) => {
        $mockEndpoint.register(sourceData).listen();
    };
    
    before(() => {
        patchXmlHttpRequest();
    });

    it('request should fail when multiple data is set', async () => {
        const expecteErrorMessage = 'Only options.json or options.data or options.body should be passed';
        try {
            await request({ url, json: [ true ], data: {}, body: 'true' });
        } catch (err) {
            if (err.message !== expecteErrorMessage) {
                throw new Error(`should throw the error message "${ expecteErrorMessage }", but got: ${ err.message }`);
            }
        }
    });

    // TODO: Depends on the changes in the "sync-browser-mocks" repo
    // it('request should fail when response status is not valid', async () => {
    //     const expectedErrorMessage = `Request to ${ initialRequestConfig.method.toLowerCase() } ${ url } failed: no response status code.`;

    //     mockRequest({ ...initialRequestConfig, status: 500 });
    //     try {
    //         await request({ url });
    //     } catch (err) {
    //         if (err.message !== expectedErrorMessage) {
    //             throw new Error(`should throw the error message "${ expectedErrorMessage }", but got: ${ err.message }`);
    //         }
    //     }
    // });

    // TODO: Depends on the changes in the "sync-browser-mocks" repo
    // it('request should handle exception when something was wrong', async () => {
    //     const expectedErrorMessage = `Request to ${ initialRequestConfig.method.toLowerCase() } ${ url } failed: no response status code.`;
        
    //     mockRequest({
    //         ...initialRequestConfig,
    //         status:  500,
    //         data:    undefined,
    //         handler: () => {
    //             throw new Error('server error');
    //         }
    //     });

    //     try {
    //         await request({ url });
    //     } catch (err) {
    //         if (err.message !== expectedErrorMessage) {
    //             throw new Error(`should throw the error message "${ expectedErrorMessage }", but got: ${ err.message }`);
    //         }
    //     }
    // });

    // TODO: Depends on the changes in the "sync-browser-mocks" repo
    // it('request should fail when with timeout', async () => {
    //     const expectedErrorMessage = `Request to ${ initialRequestConfig.method.toLowerCase() } ${ url } has timed out`;
    //     mockRequest({
    //         method:  'GET',
    //         uri:     url,
    //         handler: setTimeout(() => true, 1000)
    //     });
    //     try {
    //         await request({ url });
    //     } catch (err) {
    //         if (err.message !== expectedErrorMessage) {
    //             throw new Error(`should throw the error message "${ expectedErrorMessage }", but got: ${ err.message }`);
    //         }
    //     }
    // });

    it('request should received a valid response when use data parameter', async () => {
        mockRequest();
        const result = await request({
            url,
            data:    { 'value': '1' }
        });

        // $FlowIgnore[prop-missing]
        if (result.status !== 200 || !result.body) {
            // $FlowIgnore[prop-missing]
            throw new Error(`should return a "true" value as response, but got status: ${ result.status } and body: ${ result.body }`);
        }
    });

    it('request should received a valid response when use json parameter', async () => {
        mockRequest();
        addHeaderBuilder(() => ({ 'Content-Type': 'application/json' }));
        const result = await request({
            url,
            headers: { 'Content-Type': 'application/json' },
            json:    { value: 1 }
        });

        // $FlowIgnore[prop-missing]
        if (result.status !== 200 || !result.body) {
            // $FlowIgnore[prop-missing]
            throw new Error(`should return a "true" value as response, but got status: ${ result.status } and body: ${ result.body }`);
        }
    });

    it('request should throw and error when parsing "undefined" response', async () => {
        const expectedErrorMessage = 'Invalid json: undefined.';
        mockRequest({ ...initialRequestConfig, data: undefined });
        try {
            await request({
                url,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            if (err.message !== expectedErrorMessage) {
                throw new Error(`should throw error message "${ expectedErrorMessage }", but got: ${ err.message }`);
            }
        }
    });
});
