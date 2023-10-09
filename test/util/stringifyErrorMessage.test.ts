import { describe, it, expect } from "vitest";

import { stringifyErrorMessage } from "../../src";

describe("stringifyErrorMessage", () => {
  it("should return default error message when argument is falsy", () => {
    // @ts-expect-error argument for this is not provided
    const defaultMessage = `<unknown error: ${Object.prototype.toString.call()}>`;
    const message = stringifyErrorMessage(undefined);

    expect(message).toEqual(defaultMessage);
  });

  it("should return message field if Error instance is passed", () => {
    const expectedMessage = "Hello";
    const message = stringifyErrorMessage(new Error(expectedMessage));

    expect(message).toEqual(expectedMessage);
  });

  it("should return default message if Error instance without a message is passed", () => {
    const error = new Error();
    const expectedMessage = `<unknown error: ${Object.prototype.toString.call(
      error
    )}>`;
    const message = stringifyErrorMessage(error);

    expect(message).toEqual(expectedMessage);
  });

  it("should return message field of any non-Error object argument is passed", () => {
    const error = {
      message: "Hello",
    };
    const expectedMessage = "Hello";
    const message = stringifyErrorMessage(error);

    expect(message).toEqual(expectedMessage);
  });

  it("should return default message if argument passed has a empty string message field", () => {
    const error = {
      message: "",
    };
    const expectedMessage = `<unknown error: ${Object.prototype.toString.call(
      error
    )}>`;
    const message = stringifyErrorMessage(error);

    expect(message).toEqual(expectedMessage);
  });

  it("should return default message if a primitive argument is passed or argument has non-string value in message field", () => {
    const error = 42;
    const expectedMessage = `<unknown error: ${Object.prototype.toString.call(
      error
    )}>`;
    const message = stringifyErrorMessage(error);

    expect(message).toEqual(expectedMessage);
  });
});
