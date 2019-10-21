import { noop } from './util';
import { getStorage } from './storage';

function getBelterExperimentStorage() {
    return getStorage({ name: 'belter_experiment' });
}

function isEventUnique(name) {
    return getBelterExperimentStorage().getSessionState(function (state) {
        state.loggedBeacons = state.loggedBeacons || [];

        if (state.loggedBeacons.indexOf(name) === -1) {
            state.loggedBeacons.push(name);
            return true;
        }

        return false;
    });
}

function getThrottlePercentile(name) {
    return getBelterExperimentStorage().getState(function (state) {
        state.throttlePercentiles = state.throttlePercentiles || {};
        state.throttlePercentiles[name] = state.throttlePercentiles[name] || Math.floor(Math.random() * 100);
        return state.throttlePercentiles[name];
    });
}

var THROTTLE_GROUP = {
    TEST: 'test',
    CONTROL: 'control',
    THROTTLE: 'throttle'
};

export function experiment(_ref) {
    var name = _ref.name,
        _ref$sample = _ref.sample,
        sample = _ref$sample === undefined ? 50 : _ref$sample,
        _ref$logTreatment = _ref.logTreatment,
        logTreatment = _ref$logTreatment === undefined ? noop : _ref$logTreatment,
        _ref$logCheckpoint = _ref.logCheckpoint,
        logCheckpoint = _ref$logCheckpoint === undefined ? noop : _ref$logCheckpoint;


    var throttle = getThrottlePercentile(name);

    var group = void 0;

    if (throttle < sample) {
        group = THROTTLE_GROUP.TEST;
    } else if (sample >= 50 || sample <= throttle && throttle < sample * 2) {
        group = THROTTLE_GROUP.CONTROL;
    } else {
        group = THROTTLE_GROUP.THROTTLE;
    }

    var treatment = name + '_' + group;

    var started = false;
    var forced = false;

    try {
        if (window.localStorage && window.localStorage.getItem(name)) {
            forced = true;
        }
    } catch (err) {
        // pass
    }

    return {
        isEnabled: function isEnabled() {
            return group === THROTTLE_GROUP.TEST || forced;
        },
        isDisabled: function isDisabled() {
            return group !== THROTTLE_GROUP.TEST && !forced;
        },
        getTreatment: function getTreatment() {
            return treatment;
        },
        log: function log(checkpoint) {
            var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (!started) {
                return this;
            }

            if (isEventUnique(name + '_' + treatment + '_' + JSON.stringify(payload))) {
                logTreatment({ name: name, treatment: treatment, payload: payload });
            }

            if (isEventUnique(name + '_' + treatment + '_' + checkpoint + '_' + JSON.stringify(payload))) {
                logCheckpoint({ name: name, treatment: treatment, checkpoint: checkpoint, payload: payload });
            }

            return this;
        },
        logStart: function logStart() {
            var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            started = true;
            return this.log('start', payload);
        },
        logComplete: function logComplete() {
            var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.log('complete', payload);
        }
    };
}