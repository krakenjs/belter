/* @flow */

import { popup } from '../../../src';

describe('popup', () => {
    let listeners = {};

    beforeEach(() => {
        window.addEventListener = (name, listener) => {
            listeners[name] = listener;
        };
    });

    afterEach(() => {
        listeners = {};
    });

    it('should close popup if parent is closed and closeOnUnload is true', () => {
        try {
            popup('https://www.paypal.com', {
                width:         100,
                height:        100,
                closeOnUnload: 1
            });
            
            if (!listeners.unload) {
                throw new Error(`Popup should have unload listener registered.`);
            }
        } catch (e) {
            throw new Error(`Test should not fail with closeOnUnload option - ${ e.message }`);
        }
    });

    it('should not close popup if parent is closed and closeOnUnload is false', () => {
        try {
            popup('https://www.paypal.com', {
                width:         100,
                height:        100,
                closeOnUnload: 0
            });
            
            if (listeners.unload) {
                throw new Error(`Popup should not have unload listener registered.`);
            }
        } catch (e) {
            throw new Error(`Test should not fail with closeOnUnload option - ${ e.message }`);
        }

        it('should throw an error when the window.open function call fails', () => {
            const expectedErrorMessage = 'Can not open popup window - Error: unknown error';
            const openCopy = window.open;
    
            window.open = () => {
                throw new Error('unknown error');
            };
    
            try {
                popup(window.location.href, {
                    width:         100,
                    height:        100,
                    closeOnUnload: 0
                });
            } catch (err) {
                if (!err.message.startsWith(expectedErrorMessage)) {
                    throw new Error(`should throw the error message starting with "${ expectedErrorMessage }", bot got: ${ err.message }`);
                }
            }
            window.open = openCopy;
        });
    });

    it('should return opened popup window.location object', () => {

        window.outerWidth = 1;
        window.outerHeight = 1;
        
        const openedWindow = popup(window.location.href, {
            width:         100,
            height:        100,
            closeOnUnload: 0
        });

        if (typeof openedWindow.location !== 'object') {
            throw new TypeError(`should get the opened window location object`);
        }
    });
});
