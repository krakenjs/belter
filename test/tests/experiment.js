/* @flow */

import { experiment } from '../../src/experiment';

describe('experiment', () => {
    const name = 'potatoLicker';
    it('should return logComplete function that returns the result of experiment function call', () => {
        const obj = experiment({ name });
        const res = obj.logComplete({});
        if (obj !== res) {
            throw new Error(`Expected calling logComplete function to equal object returned from experiment function call`);
        }
    });
    it('should return logStart function that returns the result of experiment function call', () => {
        const obj = experiment({ name });
        const res = obj.logStart({});
        if (obj !== res) {
            throw new Error(`Expected calling logStart function to equal object returned from experiment function call`);
        }
    });
    it('should call logTreatment function', () => {
        let isCalled;
        const logTreatment = () => (isCalled = true);
        window.localStorage.setItem('__belter_experiment_storage__', JSON.stringify({
            __session__: {
                state: {
                    loggedBeacons: [ 'potatoLicker_potatoLicker_control_undefined' ]
                }
            }
        }));
        const obj = experiment({ name, logTreatment, sample: 100 });
        obj.logStart();
        obj.log('potatoLicker');
        if (!isCalled) {
            throw new Error(`Expected logTreatment function to have been called`);
        }
    });
    it('should return true when isDisabled is called', () => {
        const res = experiment({ name });
        const { isDisabled } = res;
        const bool = isDisabled();
        if (!bool) {
            throw new Error(`Expected true, received ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when isDisabled is called with set localStorage', () => {
        window.localStorage.potatoLicker = 'hi';
        const res = experiment({ name });
        const { isDisabled } = res;
        const bool = isDisabled();
        if (bool) {
            throw new Error(`Expected false, received ${ JSON.stringify(bool) }`);
        }
        window.localStorage.removeItem('potatoLicker');
    });
    it('should return false when isEnabled is called', () => {
        const res = experiment({ name });
        const { isEnabled } = res;
        const bool = isEnabled();
        if (bool) {
            throw new Error(`Expected false, received ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when isEnabled is called with set localStorage', () => {
        window.localStorage.potatoLicker = 'hi';
        const res = experiment({ name });
        const { isEnabled } = res;
        const bool = isEnabled();
        if (!bool) {
            throw new Error(`Expected true, received ${ JSON.stringify(bool) }`);
        }
        window.localStorage.removeItem('potatoLicker');
    });
    it('should return potato_control when getTreatment is called with sample 100', () => {
        const res = experiment({ name, sample: 100 });
        const { getTreatment } = res;
        const hi = getTreatment();
        if (hi !== 'potatoLicker_control') {
            throw new Error(`Expected potatoLicker_control, received ${ hi }`);
        }
    });
    it('should return potatoLicker_throttle when getTreatment is called with sample 0', () => {
        const res = experiment({ name, sample: 0 });
        const { getTreatment } = res;
        const hi = getTreatment();
        if (hi !== 'potatoLicker_throttle') {
            throw new Error(`Expected potatoLicker_throttle, received ${ hi }`);
        }
    });
});
