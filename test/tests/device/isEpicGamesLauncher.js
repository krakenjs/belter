/* @flow */

import { isEpicGamesLauncher  } from '../../../src/device';

describe('isEpicGamesLauncher', () => {
    beforeEach(() => {

        window.navigator = {};
    });
    it('should return true when userAgent contains EpicGamesLauncher(case insensitive)', () => {

        window.navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) EpicGamesLauncher/13.0.7-18049148+++Portal+Release-Live UnrealEngine/4.23.0-18049148+++Portal+Release-Live Chrome/84.0.4147.38 Safari/537.36';
        const bool = isEpicGamesLauncher();
        if (!bool) {
            throw new Error(`Expected true, got ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when userAgent does NOT contain EpicGamesLauncher(case insensitive)', () => {

        window.navigator.userAgent = 'fired potato';
        const bool = isEpicGamesLauncher();
        if (bool) {
            throw new Error(`Expected false, got ${ JSON.stringify(bool) }`);
        }
    });
});
