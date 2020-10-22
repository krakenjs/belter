/* @flow */

import { experiment } from '../../src/experiment';

describe('experiment', () => {
    beforeEach(() => {
        window.sessionStorage.clear();
        window.localStorage.clear();
    });
    const name = 'potatoLicker';
    it('should call logComplete function that returns the result of experiment function call', () => {
        const expObj = experiment({ name });
        const logCompleteResult = expObj.logComplete({});
        if (expObj !== logCompleteResult) {
            throw new Error(`Expected calling logComplete function to equal expObject returned from experiment function call`);
        }
    });
    it('should call logStart function that returns the result of experiment function call', () => {
        const expObj = experiment({ name });
        const logStartResult = expObj.logStart({});
        if (expObj !== logStartResult) {
            throw new Error(`Expected calling logStart function to equal expObject returned from experiment function call`);
        }
    });
    it('should call logStart function and NOT call logTreatment function when localStorage is not set', () => {
        let isCalled;
        const logTreatment = () => {
            isCalled = true;
        };
        const expObj = experiment({ name, logTreatment });
        expObj.logStart();
        expObj.log(name);
        if (!isCalled) {
            throw new Error(`Expected logTreatment function to not have been called`);
        }
    });
    it('should return true when isDisabled is called', () => {
        const expObj = experiment({ name });
        const { isDisabled } = expObj;
        const bool = isDisabled();
        if (!bool) {
            throw new Error(`Expected true, received ${ JSON.stringify(bool) }`);
        }
    });
    it('should return false when isDisabled is called with set localStorage', () => {
        window.localStorage[name] = 'hi';
        const expObj = experiment({ name });
        const { isDisabled } = expObj;
        const bool = isDisabled();
        if (bool) {
            throw new Error(`Expected false, received ${ JSON.stringify(bool) }`);
        }
        window.localStorage.removeItem(name);
    });
    it('should return false when isEnabled is called', () => {
        const expObj = experiment({ name });
        const { isEnabled } = expObj;
        const bool = isEnabled();
        if (bool) {
            throw new Error(`Expected false, received ${ JSON.stringify(bool) }`);
        }
    });
    it('should return true when isEnabled is called with set localStorage', () => {
        window.localStorage[name] = 'hi';
        const expObj = experiment({ name });
        const { isEnabled } = expObj;
        const bool = isEnabled();
        if (!bool) {
            throw new Error(`Expected true, received ${ JSON.stringify(bool) }`);
        }
        window.localStorage.removeItem(name);
    });
    it('should return potatoLicker_control when getTreatment is called with sample 100', () => {
        const expObj = experiment({ name, sample: 100 });
        const { getTreatment } = expObj;
        const getTreatmentResult = getTreatment();
        if (getTreatmentResult !== 'potatoLicker_control') {
            throw new Error(`Expected potatoLicker_control, received ${ JSON.stringify(getTreatmentResult) }`);
        }
    });
    it('should return potatoLicker_throttle when getTreatment is called with sample 0', () => {
        const expObj = experiment({ name, sample: 0 });
        const { getTreatment } = expObj;
        const getTreatmentResult = getTreatment();
        if (getTreatmentResult !== 'potatoLicker_throttle') {
            throw new Error(`Expected potatoLicker_throttle, received ${ JSON.stringify(getTreatmentResult) }`);
        }
    });
});
