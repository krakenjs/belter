import { beforeEach, describe, it, expect } from "vitest";

import {
  isShadowElement,
  getShadowRoot,
  getShadowHost,
  insertShadowSlot,
} from "../../src";

// This component is needed for testing the case when shadowRoot and shadowDOM are the same
const customWebWrapper = class extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({
      mode: "open",
    });
    const shadowDOMContainer = document.createElement("div");
    shadowDOMContainer.setAttribute("id", "inner-host-div");
    shadowRoot.appendChild(shadowDOMContainer);
  }
};

const customWebComponent = class extends HTMLElement {
  constructor() {
    super();
    const shadowHost = this.attachShadow({
      mode: "open",
    });
    const shadowDOMContainer = document.createElement("div");
    const testSpan = document.createElement("span");
    testSpan.setAttribute("id", "inner-span");
    testSpan.textContent = "text from custom web component";
    // Append it to the shadow root
    shadowDOMContainer.appendChild(testSpan);
    shadowHost.appendChild(shadowDOMContainer);
  }
};
customElements.define("custom-web-component", customWebComponent);
customElements.define("custom-wrapper", customWebWrapper);

/**
 * Tests here won't work without access to a real dom environment
 */
describe.skip("Web components", () => {
  beforeEach(() => {
    if (!document?.body) {
      throw new Error("Body not found");
    }

    const customElement = document.createElement("custom-web-component");

    // Clean the DOM
    if (document.body) {
      document.body.innerHTML = "";
      document.body.appendChild(customElement);
    }

    expect(customElement).toBeTruthy();
    expect(customElement.shadowRoot).toBeTruthy();
  });

  describe("isShadowElement cases", () => {
    it("should return true if parent node is shadow root", () => {
      const innerElement = document
        .querySelector("custom-web-component")
        ?.shadowRoot?.querySelector("#inner-span");

      if (!innerElement) {
        throw new Error("unable to find inner element");
      }

      const result = isShadowElement(innerElement);

      expect(result).toBeTruthy();
    });

    it("should return false if parent node is not shadow root", () => {
      const testElement = document.createElement("div");
      const result = isShadowElement(testElement);

      expect(result).toBeFalsy();
    });
  });

  /**
   * Tests here won't work without access to a real dom environment
   */
  describe("getShadowRoot cases", () => {
    it("should return shadow root", () => {
      const innerElement = document
        .querySelector("custom-web-component")
        ?.shadowRoot?.querySelector("#inner-span");

      if (!innerElement) {
        throw new Error("unable to find inner element");
      }

      const result = getShadowRoot(innerElement);

      expect(result).toBeTruthy();
      expect(result?.toString()).toEqual("[object ShadowRoot]");
    });
  });

  /**
   * Tests here won't work without access to a real dom environment
   */
  describe("getShadowHost cases", () => {
    it("should return shadow host if exists", () => {
      const innerElement = document
        .querySelector("custom-web-component")
        ?.shadowRoot?.querySelector("#inner-span");

      if (!innerElement) {
        throw new Error("unable to find inner element");
      }

      const result = getShadowHost(innerElement);

      if (!result) {
        throw new Error(
          `should have returned the inner element, got undefined`
        );
      }

      const hostId = result.getAttribute("id");

      expect(hostId).toBeTruthy();
      expect(hostId).toEqual("shadow-host");
    });
  });

  describe("insertShadowSlot cases", () => {
    it("should throw exception if element is not in shadow DOM", () => {
      const testElement = document.createElement("div");
      let insertShadowSlotError = "";

      try {
        insertShadowSlot(testElement);
      } catch (error) {
        insertShadowSlotError = (error as Error)?.message;
      }

      expect(
        /Element is not in shadow dom/i.exec(insertShadowSlotError)
      ).toBeTruthy();
    });

    it("should return slotProvider ", () => {
      const innerElement = document
        .querySelector("custom-web-component")
        ?.shadowRoot?.querySelector("#inner-span");

      if (!innerElement) {
        throw new Error("unable to find inner element");
      }

      // @ts-expect-error Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
      const result = insertShadowSlot(innerElement);

      expect(result).toBeTruthy();
      expect(result?.getAttribute("slot")?.match(/shadow-slot-/i)).toBeTruthy();
    });

    it("should return a nested slotProvider ", () => {
      // TestCase components setup
      const customWrapper = document.createElement("custom-wrapper");
      customWrapper.setAttribute("id", "custom-wrapper-id");
      const customComponent = document.createElement("custom-web-component");
      customComponent.setAttribute("id", "custom-component-id");
      const innerSpan = document.createElement("span");
      innerSpan.setAttribute("id", "inner-span");
      const customComponentShadowRoot = customComponent.shadowRoot;
      const customWrapperShadowRoot = customWrapper.shadowRoot;

      if (customComponentShadowRoot) {
        customComponentShadowRoot.appendChild(innerSpan);
      }

      if (customWrapperShadowRoot) {
        customWrapperShadowRoot.appendChild(customComponent);
      }

      if (document.body) {
        document.body.appendChild(customWrapper);
      }

      /**
       * At this point the HTML structure looks like this:
       * <html>
       *    ...
       *    <custom-wrapper id="custom-wrapper-id">
       *         #shadow-root (open)
       *           <custom-web-component id="custom-component-id">
       *              #shadow-root (open)
       *                <span id="inner-span"></span>
       *           </custom-web-component>
       *    </custom-wrapper>
       * </html>
       */
      const slotProvider = insertShadowSlot(innerSpan);

      expect(slotProvider).toBeTruthy();
      expect(
        slotProvider?.getAttribute("slot")?.match(/shadow-slot-/i)
      ).toBeTruthy();
    });
  });
});
