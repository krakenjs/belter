import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";

import { popup } from "../../src";

describe("popup", () => {
  let listeners: Record<string, unknown> = {};
  const windowOpenActual = window.open;
  const windowCloseActual = window.close;

  beforeEach(() => {
    window.addEventListener = (name: string, listener: unknown) => {
      listeners[name] = listener;
    };

    window.open = vi.fn();
    window.close = vi.fn();
    vi.mock("@krakenjs/cross-domain-utils/dist/esm", () => {
      const isWindowClosed = vi.fn().mockReturnValue(false);

      return { isWindowClosed };
    });
  });

  afterEach(() => {
    listeners = {};
    window.open = windowOpenActual;
    window.close = windowCloseActual;
  });

  it("should close popup if parent is closed and closeOnUnload is true", () => {
    try {
      popup("https://www.paypal.com", {
        width: 100,
        height: 100,
        closeOnUnload: 1,
      });

      expect(listeners.unload).toBeTruthy();
    } catch (e) {
      throw new Error(
        `Test should not fail with closeOnUnload option - ${
          (e as Error).message
        }`
      );
    }
  });

  it("should not close popup if parent is closed and closeOnUnload is false", () => {
    try {
      popup("https://www.paypal.com", {
        width: 100,
        height: 100,
        closeOnUnload: 0,
      });

      expect(listeners.unload).toBeFalsy();
    } catch (e) {
      throw new Error(
        `Test should not fail with closeOnUnload option - ${
          (e as Error).message
        }`
      );
    }
  });
});
