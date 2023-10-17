/* @flow */

export const KEY_CODES = {
  ENTER: 13,
  SPACE: 32,
};

export const ATTRIBUTES = {
  UID: "data-uid",
};

export const UID_HASH_LENGTH = 30;

/* eslint-disable no-control-regex*/
export const invalidProtocolRegex: RegExp =
  /([^\w]*)(javascript|data|vbscript)/im;
export const htmlEntitiesRegex: RegExp = /&#(\w+)(^\w|;)?/g;
export const htmlCtrlEntityRegex: RegExp = /&(newline|tab);/gi;
export const ctrlCharactersRegex: RegExp =
  /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
export const urlSchemeRegex: RegExp = /^.+(:|&colon;)/gim;
export const relativeFirstCharacters = [".", "/"];
export const BLANK_URL = "about:blank";
/* eslint-enable no-control-regex*/
