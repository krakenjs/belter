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

export type Experiment = {
    isEnabled : () => boolean,
    isDisabled : () => boolean,
    getTreatment : () => string,
    log : (string, payload? : { [string] : ?string }) => Experiment,
    logStart : (payload? : { [string] : ?string }) => Experiment,
    logComplete : (payload? : { [string] : ?string }) => Experiment
};

function getThrottlePercentile(name : string) : number {
    return getBelterExperimentStorage().getState(state => {
        state.throttlePercentiles = state.throttlePercentiles || {};
        state.throttlePercentiles[name] = state.throttlePercentiles[name] || Math.floor(Math.random() * 100);
        return state.throttlePercentiles[name];
    });
}

const THROTTLE_GROUP = {
    TEST:     'test',
    CONTROL:  'control',
    THROTTLE: 'throttle'
};

type ExperimentOptions = {
    name : string,
    sample? : number,
    logTreatment? : ({ name : string, treatment : string, payload : { [string] : ?string } }) => void,
    logCheckpoint? : ({ name : string, treatment : string, checkpoint : string, payload : { [string] : ?string } }) => void
};

export function experiment({ name, sample = 50, logTreatment = noop, logCheckpoint = noop } : ExperimentOptions) : Experiment {

    let throttle = getThrottlePercentile(name);

    let group;

    if (throttle < sample) {
        group = THROTTLE_GROUP.TEST;
    } else if ((sample >= 50) || ((sample <= throttle) && (throttle < (sample * 2)))) {
        group = THROTTLE_GROUP.CONTROL;
    } else {
        group = THROTTLE_GROUP.THROTTLE;
    }

    let treatment = `${ name }_${ group }`;

    let started = false;
    let forced = false;

    try {
        if (window.localStorage && window.localStorage.getItem(name)) {
            forced = true;
        }
    } catch (err) {
        // pass
    }

    return {

        isEnabled() : boolean {
            return (group === THROTTLE_GROUP.TEST) || forced;
        },

        isDisabled() : boolean {
            return (group !== THROTTLE_GROUP.TEST) && !forced;
        },

        getTreatment() : string {
            return treatment;
        },

        log(checkpoint : string, payload? : { [string] : ?string } = {}) : Experiment {
            if (!started) {
                return this;
            }

            if (isEventUnique(`${ name }_${ treatment }_${ JSON.stringify(payload) }`)) {
                logTreatment({ name, treatment, payload });
            }

            if (isEventUnique(`${ name }_${ treatment }_${ checkpoint }_${ JSON.stringify(payload) }`)) {
                logCheckpoint({ name, treatment, checkpoint, payload });
            }

            return this;
        },

        logStart(payload? : { [string] : ?string } = {}) : Experiment {
            started = true;
            return this.log(`start`, payload);
        },

        logComplete(payload? : { [string] : ?string } = {}) : Experiment {
            return this.log(`complete`, payload);
        }
    };
}
