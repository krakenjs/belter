/* @flow */
/* eslint import/no-default-export: off */
/* eslint import/no-commonjs: off */
/* eslint no-process-env: off */

import { getKarmaConfig } from 'grumbler-scripts/config/karma.conf';

import { WEBPACK_CONFIG_TEST } from './webpack.config';

process.env.CHROME_BIN = require('puppeteer').executablePath();

export default function configKarma(karma : Object) {
    const karmaConfig = getKarmaConfig(karma, {
        basePath:  __dirname,
        webpack:   WEBPACK_CONFIG_TEST,
        autoWatch: true,
        singleRun: false
    });

    karma.set(karmaConfig);
}
