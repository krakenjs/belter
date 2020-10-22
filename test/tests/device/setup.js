/* @flow */

/**
 * Sets up mocking for tests in this directory
 */

const initObj = {
    value:    {},
    writable: true
};

Object.defineProperties(window, {
    navigator:  initObj,
    matchMedia: {
        writable: true,
        value:    () => ({ matches: true })
    }
});
