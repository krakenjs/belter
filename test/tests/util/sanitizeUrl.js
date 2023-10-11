/* @flow */

import { sanitizeUrl } from "../../../src/util";

describe("sanitizeUrl", () => {
  it("should return about:blank for malicious URLs", () => {
    const testURL =
      'https://www.paypal.com/smart/checkout/venmo/popup?parentDomain=www.paypal.com&venmoWebEnabled=true&venmoWebUrl=javascript:alert(document["cookie"])//';
    const sanitizedUrl = sanitizeUrl(testURL);

    if (sanitizedUrl !== "about:blank") {
      throw new Error(
        `Does not match. Original data:\n\n${testURL}
          \n\nSanitized:\n\n${"about:blank"}\n`
      );
    }
  });

  it("should return original URL when URL is clean", () => {
    const testURL =
      "https://www.paypal.com/smart/checkout/venmo/popup?parentDomain=www.paypal.com&venmoWebEnabled=true&venmoWebUrl=www.venmo.com";
    const sanitizedUrl = sanitizeUrl(testURL);

    if (sanitizedUrl !== testURL) {
      throw new Error(
        `Does not match. Original data:\n\n${testURL}
          \n\nSanitized:\n\n${sanitizedUrl}\n`
      );
    }
  });
});
