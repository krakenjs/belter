import { memoize, promisify } from "./util";

// eslint-disable-next-line no-warning-comments
// TODO: is this file even used? Can we remove it?

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function memoized(
  target: Record<string, any>,
  name: string,
  descriptor: Record<string, any>
) {
  descriptor.value = memoize(descriptor.value, {
    name,
    thisNamespace: true,
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function promise(
  target: Record<string, any>,
  name: string,
  descriptor: Record<string, any>
) {
  descriptor.value = promisify(descriptor.value, {
    name,
  });
}
