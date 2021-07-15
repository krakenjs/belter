/* @flow */

import { noop } from './util';
import { getStorage } from './storage';

function getBelterExperimentStorage() : Object {
    return getStorage({ name: 'belter_experiment' });
}

function isEventUnique(name : string) : boolean {
    return getBelterExperimentStorage().getSessionState(state => {
        state.loggedBeacons = state.loggedBeacons || [];

        if (state.loggedBeacons.indexOf(name) === -1) {
            state.loggedBeacons.push(name);
            return true;
        }

        return false;
    });
}

type Payload = {
    [string] : ?(string | boolean)
};

export type Experiment = {|
    isEnabled : () => boolean,
    isDisabled : () => boolean,
    getTreatment : () => string,
    log : (string, payload? : Payload) => Experiment,
    logStart : (payload? : Payload) => Experiment,
    logComplete : (payload? : Payload) => Experiment
|};

function getRandomInteger(range : number) : number {
    return Math.floor(Math.random() * range);
}

function getThrottlePercentile(name : string) : number {
    return getBelterExperimentStorage().getState(state => {
        state.throttlePercentiles = state.throttlePercentiles || {};
        state.throttlePercentiles[name] = state.throttlePercentiles[name] || getRandomInteger(100);
        return state.throttlePercentiles[name];
    });
}

const THROTTLE_GROUP = {
    TEST:     'test',
    CONTROL:  'control',
    THROTTLE: 'throttle'
};

type ExperimentOptions = {|
    name : string,
    sample? : number,
    logTreatment? : ({| name : string, treatment : string, payload : Payload, throttle : number |}) => void,
    logCheckpoint? : ({| name : string, treatment : string, checkpoint : string, payload : Payload, throttle : number |}) => void,
    sticky? : boolean
|};

export function experiment({ name, sample = 50, logTreatment = noop, logCheckpoint = noop, sticky = true } : ExperimentOptions) : Experiment {

    const throttle = sticky
        ? getThrottlePercentile(name)
        : getRandomInteger(100);

    let group;

    if (throttle < sample && !__TEST__) {
        group = THROTTLE_GROUP.TEST;
    } else if ((sample >= 50) || ((sample <= throttle) && (throttle < (sample * 2)))) {
        group = THROTTLE_GROUP.CONTROL;
    } else {
        group = THROTTLE_GROUP.THROTTLE;
    }

    const treatment = `${ name }_${ group }`;

    let started = false;
    let forced = false;

    try {
        if (window.localStorage && window.localStorage.getItem(name)) {
            forced = true;
        }
    } catch (err) {
        // pass
    }

    const exp = {

        isEnabled() : boolean {
            return (group === THROTTLE_GROUP.TEST) || forced;
        },

        isDisabled() : boolean {
            return (group !== THROTTLE_GROUP.TEST) && !forced;
        },

        getTreatment() : string {
            return treatment;
        },

        log(checkpoint : string, payload? : Payload = {}) : Experiment {
            if (!started) {
                return exp;
            }

            if (isEventUnique(`${ treatment }_${ JSON.stringify(payload) }`)) {
                logTreatment({ name, treatment, payload, throttle });
            }

            if (isEventUnique(`${ treatment }_${ checkpoint }_${ JSON.stringify(payload) }`)) {
                logCheckpoint({ name, treatment, checkpoint, payload, throttle });
            }

            return exp;
        },

        logStart(payload? : Payload = {}) : Experiment {
            started = true;
            return exp.log(`start`, payload);
        },

        logComplete(payload? : Payload = {}) : Experiment {
            return exp.log(`complete`, payload);
        }
    };

    return exp;
}
