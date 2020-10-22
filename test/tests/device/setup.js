/* @flow */

/**
 * Sets up mocking for tests in this directory
 */

const initProperty = {
    value:    {},
    writable: true
};

Object.defineProperties(window, {
    navigator:  initProperty,
    watchMedia: initProperty
});
