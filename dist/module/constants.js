export var KEY_CODES = {
  ENTER: 13,
  SPACE: 32
};
export var ATTRIBUTES = {
  UID: "data-uid"
};
export var UID_HASH_LENGTH = 30;
export var invalidProtocolRegex = /([^\w]*)(javascript|data|vbscript)/im;
export var htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g;
export var htmlCtrlEntityRegex = /&(newline|tab);/gi;
export var ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
export var urlSchemeRegex = /^.+(:|&colon;)/gim;
export var relativeFirstCharacters = [".", "/"];
export var BLANK_URL = "about:blank";