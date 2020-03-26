/* @flow */

// export something to force webpack to see this as an ES module
export const TYPES = true;

declare var __TEST__ : boolean;

export type JSONPrimitive = string | boolean | number;
export type JSONObject = { [string] : JSONPrimitive | JSONObject } | $ReadOnlyArray<JSONPrimitive | JSONObject>;
export type JSONType = JSONObject | JSONPrimitive;

export type CancelableType = {|
    cancel : () => void
|};
