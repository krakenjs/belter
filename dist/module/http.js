import { ZalgoPromise } from 'zalgo-promise/src';
import 'cross-domain-utils/src';

var HEADERS = {
    CONTENT_TYPE: 'content-type',
    ACCEPT: 'accept'
};

var headerBuilders = [];

function parseHeaders() {
    var rawHeaders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var result = {};

    for (var _i2 = 0, _rawHeaders$trim$spli2 = rawHeaders.trim().split('\n'), _length2 = _rawHeaders$trim$spli2 == null ? 0 : _rawHeaders$trim$spli2.length; _i2 < _length2; _i2++) {
        var line = _rawHeaders$trim$spli2[_i2];
        var _line$split = line.split(':'),
            _key = _line$split[0],
            values = _line$split.slice(1);

        result[_key.toLowerCase()] = values.join(':').trim();
    }

    return result;
}

export function request(_ref) {
    var url = _ref.url,
        _ref$method = _ref.method,
        method = _ref$method === undefined ? 'get' : _ref$method,
        _ref$headers = _ref.headers,
        headers = _ref$headers === undefined ? {} : _ref$headers,
        json = _ref.json,
        data = _ref.data,
        body = _ref.body,
        _ref$win = _ref.win,
        win = _ref$win === undefined ? window : _ref$win,
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

    return new ZalgoPromise(function (resolve, reject) {

        if (json && data || json && body || data && json) {
            throw new Error('Only options.json or options.data or options.body should be passed');
        }

        var normalizedHeaders = {};

        for (var _i4 = 0, _Object$keys2 = Object.keys(headers), _length4 = _Object$keys2 == null ? 0 : _Object$keys2.length; _i4 < _length4; _i4++) {
            var _key2 = _Object$keys2[_i4];
            normalizedHeaders[_key2.toLowerCase()] = headers[_key2];
        }

        if (json) {
            normalizedHeaders[HEADERS.CONTENT_TYPE] = normalizedHeaders[HEADERS.CONTENT_TYPE] || 'application/json';
        } else if (data || body) {
            normalizedHeaders[HEADERS.CONTENT_TYPE] = normalizedHeaders[HEADERS.CONTENT_TYPE] || 'application/x-www-form-urlencoded; charset=utf-8';
        }

        normalizedHeaders[HEADERS.ACCEPT] = normalizedHeaders[HEADERS.ACCEPT] || 'application/json';

        for (var _i6 = 0, _length6 = headerBuilders == null ? 0 : headerBuilders.length; _i6 < _length6; _i6++) {
            var headerBuilder = headerBuilders[_i6];
            var builtHeaders = headerBuilder();

            for (var _i8 = 0, _Object$keys4 = Object.keys(builtHeaders), _length8 = _Object$keys4 == null ? 0 : _Object$keys4.length; _i8 < _length8; _i8++) {
                var _key3 = _Object$keys4[_i8];
                normalizedHeaders[_key3.toLowerCase()] = builtHeaders[_key3];
            }
        }

        var xhr = new win.XMLHttpRequest();

        xhr.addEventListener('load', function xhrLoad() {

            var responseHeaders = parseHeaders(this.getAllResponseHeaders());

            if (!this.status) {
                return reject(new Error('Request to ' + method.toLowerCase() + ' ' + url + ' failed: no response status code.'));
            }

            var contentType = responseHeaders['content-type'];
            var isJSON = contentType && (contentType.indexOf('application/json') === 0 || contentType.indexOf('text/json') === 0);
            var responseBody = this.responseText;

            try {
                responseBody = JSON.parse(responseBody);
            } catch (err) {
                if (isJSON) {
                    return reject(new Error('Invalid json: ' + this.responseText + '.'));
                }
            }

            var res = {
                status: this.status,
                headers: responseHeaders,
                body: responseBody
            };

            return resolve(res);
        }, false);

        xhr.addEventListener('error', function (evt) {
            reject(new Error('Request to ' + method.toLowerCase() + ' ' + url + ' failed: ' + evt.toString() + '.'));
        }, false);

        xhr.open(method, url, true);

        for (var _key4 in normalizedHeaders) {
            if (normalizedHeaders.hasOwnProperty(_key4)) {
                xhr.setRequestHeader(_key4, normalizedHeaders[_key4]);
            }
        }

        if (json) {
            body = JSON.stringify(json);
        } else if (data) {
            body = Object.keys(data).map(function (key) {
                return encodeURIComponent(key) + '=' + (data ? encodeURIComponent(data[key]) : '');
            }).join('&');
        }

        xhr.timeout = timeout;
        xhr.ontimeout = function xhrTimeout() {
            reject(new Error('Request to ' + method.toLowerCase() + ' ' + url + ' has timed out'));
        };

        xhr.send(body);
    });
}

export function addHeaderBuilder(method) {
    headerBuilders.push(method);
}