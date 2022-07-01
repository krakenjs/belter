import { getGlobal } from "./util";

export function getGlobalNameSpace<T extends Record<string, any>>({
  name,
  version = "latest",
}: {
  name: string;
  version?: string;
}): {
  get: (arg0: string, defValue?: T) => T | {};
} {
  const global = getGlobal();
  const globalKey = `__${name}__${version}_global__`;
  const namespace = (global[globalKey] = global[globalKey] || {});
  return {
    get: (key: string, defValue?: T | {}): T | {} => {
      defValue = defValue || {};
      const item = (namespace[key] = namespace[key] || defValue);
      return item;
    },
  };
}
