/* @flow */

declare var __TEST__ : boolean;

export type JSONPrimitive = string | boolean | number;
export type JSONObject = { [string] : JSONPrimitive | JSONObject } | Array<JSONPrimitive | JSONObject>;
export type JSONType = JSONObject | JSONPrimitive;
