import { getWebpackConfig } from "@krakenjs/webpack-config-grumbler";

const FILE_NAME = "belter";
const MODULE_NAME = "belter";

export const WEBPACK_CONFIG = getWebpackConfig({
  entry: "./src/index.ts",
  filename: `${FILE_NAME}.js`,
  modulename: MODULE_NAME,
  minify: false,
});

export const WEBPACK_CONFIG_MIN = getWebpackConfig({
  entry: "./src/index.ts",
  filename: `${FILE_NAME}.min.js`,
  modulename: MODULE_NAME,
  minify: true,
  vars: {
    __MIN__: true,
  },
});

export const WEBPACK_CONFIG_TEST = getWebpackConfig({
  entry: "./src/index.ts",
  modulename: MODULE_NAME,
  test: true,
});

export default [WEBPACK_CONFIG, WEBPACK_CONFIG_MIN];
