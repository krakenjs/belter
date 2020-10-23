/* @flow */

/**
 * Sets up mocking for tests in this directory
 */


Object.defineProperties(window, {
    navigator:  {
        value:    {},
        writable: true
    }
});
