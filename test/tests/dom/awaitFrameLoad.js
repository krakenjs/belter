/* @flow */
import { ZalgoPromise } from '@krakenjs/zalgo-promise/src';

import { awaitFrameLoad, awaitFrameWindow } from '../../../src';

describe('awaitFrameLoad cases', () => {
    let iframe;

    beforeEach(() => {
        iframe = document.createElement('iframe');
        iframe.id = 'test';
    });

    it('should load the iframe', () => {
        awaitFrameLoad(iframe)
            .then(frame => {
                if (frame.id !== 'test') {
                    throw new Error('should get the same iframe id');
                }
            })
            .catch(err => {
                throw err;
            });

        iframe.dispatchEvent(new Event('load'));
    });

    it('should return the iframe when exception occurs but the contentWindow is available', () => {
        Object.defineProperty(iframe, 'contentWindow', { value: {} });
        awaitFrameLoad(iframe)
            .then(frame => {
                const result = JSON.stringify(frame.contentWindow);

                if (result !==  '{}') {
                    throw new Error(`should get and empty object, but got: ${ result }`);
                }
            }).catch(err => {
                throw err;
            });

        iframe.dispatchEvent(new ErrorEvent('error'));
    });

    it('should throw and error when and the iframe load fails', () => {
        const expectedErrorMessage = 'unknown error';

        awaitFrameLoad(iframe)
            .catch(err => {
                // $FlowFixMe[incompatible-type]
                if (err.message !== expectedErrorMessage) {
                    // $FlowFixMe[incompatible-use]
                    throw new Error(`should the error message "${ expectedErrorMessage }", but got: ${ String(err.message) }`);
                }
            });

        iframe.dispatchEvent(new ErrorEvent('error', {
            message: expectedErrorMessage
        }));
    });

    it('should return the exact same promise from the WeakMap', () => {
        const frameOne = awaitFrameLoad(iframe);
        const frameTwo = awaitFrameLoad(iframe);

        ZalgoPromise.all([ frameOne, frameTwo ])
            .then(([ responseOne, responseTwo ]) => {
                if (responseOne.id !== responseTwo.id) {
                    throw new Error('should return same id and call the promise from the cached WeakMap');
                }
            }).catch(err => {
                throw err;
            });

        iframe.dispatchEvent(new Event('load'));
    });

    it('should throw and error when contentWindow is empty', () => {
        const expectedErrorMessage = 'Could not find window in iframe';

        awaitFrameWindow(iframe)
            .catch(err => {
                // $FlowFixMe[incompatible-type]
                if (err.message !== expectedErrorMessage) {
                    // $FlowFixMe[incompatible-use]
                    throw new Error(`should thrown the message "${ expectedErrorMessage }", but got: ${ err.message }`);
                }
            });
        
        iframe.dispatchEvent(new Event('load'));
    });

    it('should return the iframe contentWindow object', () => {
        Object.defineProperty(iframe, 'contentWindow', { value: {} });

        awaitFrameWindow(iframe)
            .then(frame => {
                const result = JSON.stringify(frame);

                if (result !== '{}') {
                    throw new Error(`should get and empty object, but got: ${ result }`);
                }
            });
        
        iframe.dispatchEvent(new Event('load'));
    });
});
