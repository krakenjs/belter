/* @flow */
/*  - since document.readyState is only a readonly property, we are creating a mock property
    - this allows us to switch readyState between 'loading', 'complete' and 'interactive'
    - the reason for adding this here is for consistency
    - else only the tests defined after the property below has been defined will be able to set values for readyState

    When to use document.mockReadyState?
    - When testing cases when the browser is ready or interactive after a setInterval
    - Even if you set document.readyState to 'loading', the browser will eventually load
    - Although your tests would pass but not for the reasons you were testing them for
*/

let oldMockReadyState = '';

Object.defineProperty(document, 'mockReadyState', {
    get() : string {
        return oldMockReadyState;
    },

    set(newMockState : string) {
        oldMockReadyState = newMockState;
    }
});

let oldReadyState = document.readyState;

Object.defineProperty(document, 'readyState', {
    get() : string {
        if (document.mockReadyState) {
            return document.mockReadyState;
        }
        return oldReadyState;
    },

    set(newState : string) {
        oldReadyState = newState;
    }
});
