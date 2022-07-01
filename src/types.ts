// export something to force webpack to see this as an ES module
export const TYPES = true;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let __TEST__: boolean;

export type JSONPrimitive = string | boolean | number;

// TODO: need a fix
// @ts-expect-error circularly references self
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type JSONValue = string | number | boolean | JSONObject | JSONArray;

// TODO: need a fix
// @ts-expect-error circularly references self
type JSONObject = Record<string, JSONValue>;

type JSONArray = JSONValue[];

// export type JSONObject =
//   | Record<string, JSONPrimitive | JSONObject>
//   | ReadonlyArray<JSONPrimitive | JSONObject>;
// export type JSONType = JSONObject | JSONPrimitive;

export type CancelableType = {
  cancel: () => void;
};
