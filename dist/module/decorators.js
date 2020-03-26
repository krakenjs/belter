import { memoize, promisify } from './util';
export function memoized(target, name, descriptor) {
  descriptor.value = memoize(descriptor.value, {
    name: name,
    thisNamespace: true
  });
}
export function promise(target, name, descriptor) {
  descriptor.value = promisify(descriptor.value, {
    name: name
  });
}