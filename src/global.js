/* @flow */

import { getGlobal } from './util';

export function getGlobalNameSpace<T : Object>({ name, version = 'latest' } : { name : string, version? : string }) : { get : (string, defValue? : T) => T } {

    let global = getGlobal();
    let globalKey = `__${ name }__${ version }_global__`;

    let namespace = global[globalKey] = global[globalKey] || {};

    return {
        get: (key : string, defValue? : T) : T => {
            // $FlowFixMe
            defValue = defValue || {};
            let item = namespace[key] = namespace[key] || defValue;
            return item;
        }
    };
}
