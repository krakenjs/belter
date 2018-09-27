/* @flow */

import { memoize, promisify } from './util';

export function memoized(target : Object, name : string, descriptor : Object) {
    descriptor.value = memoize(descriptor.value, { name, thisNamespace: true });
}

export function promise(target : Object, name : string, descriptor : Object) {
    descriptor.value = promisify(descriptor.value, { name });
}
