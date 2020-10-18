/* @flow */

import { experiment } from '../../src/experiment';

// also should check if each are functions too
const allKeys = (res) => {
    if (res.hasOwnProperty('isEnabled') && res.hasOwnProperty('isDisabled') && res.hasOwnProperty('getTreatment')) {
        if (res.hasOwnProperty('log') && res.hasOwnProperty('logStart') && res.hasOwnProperty('logComplete')) {
            return true;
        }
    }
    return false;
};

describe('experiment', () => {
    it('should return an object with all the correct keys when calling log function', () => {
        const obj = experiment({
            name:          'chickenLicker'
        });
        const res = obj.log('chickenLicker');
        const allThere = allKeys(res);
        if (!allThere) {
            throw new Error(`hinga my dinga ${ JSON.stringify(res) }`);
        }
    });
    it('should return an object with all the correct keys when calling logComplete function', () => {
        const obj = experiment({
            name:          'chickenLicker'
        });
        const res = obj.logComplete({});
        const allThere = allKeys(res);
        if (!allThere) {
            throw new Error(`hinga my dinga ${ JSON.stringify(res) }`);
        }
    });
    it('should return an object with all the correct keys when calling logStart function', () => {
        const obj = experiment({
            name:          'chickenLicker'
        });
        const res = obj.logStart({});
        const allThere = allKeys(res);
        if (!allThere) {
            throw new Error(`hinga my dinga ${ JSON.stringify(res) }`);
        }
    });
    it('should return true when isDisabled is called', () => {
        const res = experiment({
            name:          'chickenLicker'
        });
        const { isDisabled } = res;
        const bool = isDisabled();
        if (!bool) {
            throw new Error(`Expected false, received ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false correct treatment when isEnabled is called', () => {
        const res = experiment({
            name:          'chickenLicker'
        });
        const { isEnabled } = res;
        const bool = isEnabled();
        if (bool) {
            throw new Error(`Expected false, received ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when isEnabled is called', () => {
        window.localStorage.chickenLicker = 'hi';
        const res = experiment({
            name:          'chickenLicker'
        });
        const { isEnabled } = res;
        const bool = isEnabled();
        if (!bool) {
            throw new Error(`Expected true, received ${ JSON.stringify(bool) }`);
        }
    });
    it('should return chicken_control when getTreatment is called', () => {
        const res = experiment({
            name:          'chickenLicker',
            sample:        100
        });
        const { getTreatment } = res;
        const hi = getTreatment();
        if (hi !== 'chickenLicker_control') {
            throw new Error(`Expected chickenLicker_control, received ${ hi }`);
        }
    });
    it('should return chickenLicker_throttle when getTreatment is called', () => {
        const res = experiment({
            name:          'chickenLicker',
            sample:        0
        });
        const { getTreatment } = res;
        const hi = getTreatment();
        if (hi !== 'chickenLicker_throttle') {
            throw new Error(`Expected chickenLicker_throttle, received ${ hi }`);
        }
    });
    // it('should return chicken_test when getTreatment is called', () => {
    //     const res = experiment({
    //         name:          'chickenLicker',
    //         sample:        50
    //     });
    //     const { getTreatment } = res;
    //     const hi = getTreatment();
    //     if (hi !== 'chickenLicker_test') {
    //         throw new Error(`Expected chickenLicker_test, received ${ hi }`);
    //     }
    // });
});

