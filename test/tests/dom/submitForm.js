/* @flow */

import { submitForm, wrapPromise, getBody } from "../../../src";

describe("submit form cases", () => {
  it("should submit a form to a target frame", () => {
    let frameLoaded = false;

    return wrapPromise(({ expect }) => {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("name", "myiframe");
      getBody().appendChild(iframe);

      submitForm({
        url: "/base/test/windows/basic/index.htm",
        target: "myiframe",
      });

      window.addEventListener(
        "message",
        expect("postMessage", (event) => {
          if (
            event.source === iframe.contentWindow &&
            event.data === "loaded"
          ) {
            frameLoaded = true;
            getBody().removeChild(iframe);
          }
        })
      );
    }).then(() => {
      if (!frameLoaded) {
        throw new Error(`Expected frame to be loaded`);
      }
    });
  });
});
