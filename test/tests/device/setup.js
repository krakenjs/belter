/* @flow */

/**
 * Sets up mocking for tests in this directory
 */

Object.defineProperty(window, "navigator", {
  value: {},
  writable: true,
});
