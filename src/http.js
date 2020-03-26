/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import { type SameDomainWindowType } from 'cross-domain-utils/src';

type RequestOptionsType = {|
    url : string,
    method? : string,
    headers? : { [key : string] : string },
    json? : $ReadOnlyArray<mixed> | Object,
    data? : { [key : string] : string },
    body? : string,
    win? : SameDomainWindowType,
    timeout? : number
|};

type ResponseType = {|
    status : number,
    headers : { [string] : string },
    body : Object
|};

const HEADERS = {
    CONTENT_TYPE: 'content-type',
    ACCEPT:       'accept'
};

const headerBuilders = [];

function parseHeaders(rawHeaders : string = '') : { [string] : string } {
    const result = {};
    for (const line of rawHeaders.trim().split('\n')) {
        const [ key, ...values ] = line.split(':');
        result[key.toLowerCase()] = values.join(':').trim();
    }
    return result;
}

export function request({ url, method = 'get', headers = {}, json, data, body, win = window, timeout = 0 } : RequestOptionsType) : ZalgoPromise<ResponseType> {
    return new ZalgoPromise((resolve, reject) => {

        if ((json && data) || (json && body) || (data && json)) {
            throw new Error(`Only options.json or options.data or options.body should be passed`);
        }

        const normalizedHeaders = {};

        for (const key of Object.keys(headers)) {
            normalizedHeaders[key.toLowerCase()] = headers[key];
        }

        if (json) {
            normalizedHeaders[HEADERS.CONTENT_TYPE] = normalizedHeaders[HEADERS.CONTENT_TYPE] || 'application/json';
        } else if (data || body) {
            normalizedHeaders[HEADERS.CONTENT_TYPE] = normalizedHeaders[HEADERS.CONTENT_TYPE] || 'application/x-www-form-urlencoded; charset=utf-8';
        }

        normalizedHeaders[HEADERS.ACCEPT] = normalizedHeaders[HEADERS.ACCEPT] || 'application/json';

        for (const headerBuilder of headerBuilders) {
            const builtHeaders = headerBuilder();

            for (const key of Object.keys(builtHeaders)) {
                normalizedHeaders[key.toLowerCase()] = builtHeaders[key];
            }
        }

        const xhr = new win.XMLHttpRequest();

        xhr.addEventListener('load', function xhrLoad() : void {

            const responseHeaders = parseHeaders(this.getAllResponseHeaders());

            if (!this.status) {
                return reject(new Error(`Request to ${ method.toLowerCase() } ${ url } failed: no response status code.`));
            }
            
            const contentType = responseHeaders['content-type'];
            const isJSON = contentType && (contentType.indexOf('application/json') === 0 || contentType.indexOf('text/json') === 0);
            let responseBody = this.responseText;

            try {
                responseBody = JSON.parse(responseBody);
            } catch (err) {
                if (isJSON) {
                    return reject(new Error(`Invalid json: ${ this.responseText }.`));
                }
            }

            const res = {
                status:  this.status,
                headers: responseHeaders,
                body:    responseBody
            };

            return resolve(res);

        }, false);

        xhr.addEventListener('error', (evt) => {
            reject(new Error(`Request to ${ method.toLowerCase() } ${ url } failed: ${ evt.toString() }.`));
        }, false);

        xhr.open(method, url, true);

        for (const key in normalizedHeaders) {
            if (normalizedHeaders.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, normalizedHeaders[key]);
            }
        }

        if (json) {
            body = JSON.stringify(json);
        } else if (data) {
            body = Object.keys(data).map(key => {
                return `${ encodeURIComponent(key) }=${ data ? encodeURIComponent(data[key]) : '' }`;
            }).join('&');
        }

        xhr.timeout = timeout;
        xhr.ontimeout = function xhrTimeout() {
            reject(new Error(`Request to ${ method.toLowerCase() } ${ url } has timed out`));
        };

        xhr.send(body);
    });
}

export function addHeaderBuilder(method : () => { [string] : string }) {
    headerBuilders.push(method);
}
