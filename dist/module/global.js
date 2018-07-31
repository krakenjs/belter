'use strict';

exports.__esModule = true;
exports.getGlobalNameSpace = getGlobalNameSpace;

var _util = require('./util');

function getGlobalNameSpace(_ref) {
    var name = _ref.name,
        _ref$version = _ref.version,
        version = _ref$version === undefined ? 'latest' : _ref$version;


    var global = (0, _util.getGlobal)();
    var globalKey = '__' + name + '__' + version + '_global__';

    var namespace = global[globalKey] = global[globalKey] || {};

    return {
        get: function get(key, defValue) {
            // $FlowFixMe
            defValue = defValue || {};
            var item = namespace[key] = namespace[key] || defValue;
            return item;
        }
    };
}