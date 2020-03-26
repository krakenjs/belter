/* @flow */

import { getGlobal } from './util';

export function getGlobalNameSpace<T : Object>({ name, version = 'latest' } : {| name : string, version? : string |}) : {| get : (string, defValue? : T) => T |} {

    const global = getGlobal();
    const globalKey = `__${ name }__${ version }_global__`;

    const namespace = global[globalKey] = global[globalKey] || {};

    return {
        get: (key : string, defValue? : T) : T => {
            // $FlowFixMe
            defValue = defValue || {};
            const item = namespace[key] = namespace[key] || defValue;
            return item;
        }
    };
}
