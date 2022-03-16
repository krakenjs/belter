
/* @flow */

import { eventEmitter } from '../../../src/util';

describe('eventEmitter cases', () => {
    const eventName = 'click';
    let click = false;
    const handler = () => {
        click = true;
    };

    beforeEach(() => {
        click = false;
    });

    it('eventEmitter should return the emitter object', () => {
        const emitter = eventEmitter();

        if (typeof emitter !== 'object') {
            throw new TypeError(`should get the emitter object, but got ${ JSON.stringify(emitter) }`);
        }
    });

    it('eventEmitter should resolve the handler when on event', async () => {
        const emitter = eventEmitter();
        const emitterOnEvent = emitter.on(eventName, handler);
        await emitter.trigger(eventName);
        emitterOnEvent.cancel();
        if (!click) {
            throw new Error(`should call the event "${ eventName }" with the result "true", but got ${ String(click) }`);
        }
    });

    it('eventEmitter should resolve the handler when calling trigger', async () => {
        const emitter = eventEmitter();
        emitter.once(eventName, handler);
        await emitter.trigger(eventName);

        if (!click) {
            throw new Error(`should call once the event "${ eventName }" with the result "true", but got ${ String(click) }`);
        }
    });

    it('eventEmitter should resolve the handler once when calling triggerOnce', async () => {
        const emitter = eventEmitter();
        emitter.once(eventName, handler);
        emitter.triggerOnce(eventName);
        await emitter.triggerOnce(eventName);

        if (!click) {
            throw new Error(`should trigger once the event "${ eventName }" with the result "true", but got ${ String(click) }`);
        }
    });

    it('eventEmitter should reset all registered handlers', async () => {
        const emitter = eventEmitter();
        emitter.on(eventName, handler);
        emitter.reset();
        await emitter.trigger(eventName);

        if (click !== false) {
            throw new Error(`should not found the event "${ eventName }" and the result should be "undefined", but got ${ String(click) }`);
        }
    });
});
