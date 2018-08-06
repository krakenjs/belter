'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.request = request;

var _src = require('zalgo-promise/src');

require('cross-domain-utils/src');

var HEADERS = {
    CONTENT_TYPE: 'content-type',
    ACCEPT: 'accept'
};

var headerBuilders = [];

function parseHeaders() {
    var rawHeaders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var result = {};
    for (var _iterator = rawHeaders.trim().split('\n'), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
        }

        var line = _ref;

        var _line$split = line.split(':'),
            _key = _line$split[0],
            values = _line$split.slice(1);

        result[_key.toLowerCase()] = values.join(':').trim();
    }
    return result;
}

function request(_ref2) {
    var url = _ref2.url,
        _ref2$method = _ref2.method,
        method = _ref2$method === undefined ? 'get' : _ref2$method,
        _ref2$headers = _ref2.headers,
        headers = _ref2$headers === undefined ? {} : _ref2$headers,
        json = _ref2.json,
        data = _ref2.data,
        body = _ref2.body,
        _ref2$win = _ref2.win,
        win = _ref2$win === undefined ? window : _ref2$win,
        _ref2$timeout = _ref2.timeout,
        timeout = _ref2$timeout === undefined ? 0 : _ref2$timeout;

    return new _src.ZalgoPromise(function (resolve, reject) {

        if (json && data || json && body || data && json) {
            throw new Error('Only options.json or options.data or options.body should be passed');
        }

        var normalizedHeaders = {};

        for (var _iterator2 = Object.keys(headers), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref3 = _iterator2[_i2++];
            } else {
                _i2 = _iterator2.next();
                if (_i2.done) break;
                _ref3 = _i2.value;
            }

            var _key3 = _ref3;

            normalizedHeaders[_key3.toLowerCase()] = headers[_key3];
        }

        if (json) {
            normalizedHeaders[HEADERS.CONTENT_TYPE] = normalizedHeaders[HEADERS.CONTENT_TYPE] || 'application/json';
        } else if (data || body) {
            normalizedHeaders[HEADERS.CONTENT_TYPE] = normalizedHeaders[HEADERS.CONTENT_TYPE] || 'application/x-www-form-urlencoded; charset=utf-8';
        }

        normalizedHeaders[HEADERS.ACCEPT] = normalizedHeaders[HEADERS.ACCEPT] || 'application/json';

        for (var _iterator3 = headerBuilders, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref4;

            if (_isArray3) {
                if (_i3 >= _iterator3.length) break;
                _ref4 = _iterator3[_i3++];
            } else {
                _i3 = _iterator3.next();
                if (_i3.done) break;
                _ref4 = _i3.value;
            }

            var headerBuilder = _ref4;

            var builtHeaders = headerBuilder();

            for (var _iterator4 = Object.keys(builtHeaders), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
                var _ref5;

                if (_isArray4) {
                    if (_i4 >= _iterator4.length) break;
                    _ref5 = _iterator4[_i4++];
                } else {
                    _i4 = _iterator4.next();
                    if (_i4.done) break;
                    _ref5 = _i4.value;
                }

                var _key4 = _ref5;

                normalizedHeaders[_key4.toLowerCase()] = builtHeaders[_key4];
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
            var res = this.responseText;

            try {
                res = JSON.parse(this.responseText);
            } catch (err) {
                if (isJSON) {
                    return reject(new Error('Invalid json: ' + this.responseText + '.'));
                }
            }

            if (this.status >= 400) {
                var message = 'Request to ' + method.toLowerCase() + ' ' + url + ' failed with ' + this.status + ' error.';

                if (res) {
                    if ((typeof res === 'undefined' ? 'undefined' : _typeof(res)) === 'object' && res !== null) {
                        res = JSON.stringify(res, null, 4);
                    }

                    message = message + '\n\n' + res + '\n';
                }

                return reject(new Error(message));
            }

            return resolve(res);
        }, false);

        xhr.addEventListener('error', function (evt) {
            reject(new Error('Request to ' + method.toLowerCase() + ' ' + url + ' failed: ' + evt.toString() + '.'));
        }, false);

        xhr.open(method, url, true);

        for (var _key2 in normalizedHeaders) {
            if (normalizedHeaders.hasOwnProperty(_key2)) {
                xhr.setRequestHeader(_key2, normalizedHeaders[_key2]);
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

request.get = function (url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return request(_extends({ method: 'get', url: url }, options));
};

request.post = function (url, data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return request(_extends({ method: 'post', url: url, data: data }, options));
};

request.addHeaderBuilder = function (method) {
    headerBuilders.push(method);
};