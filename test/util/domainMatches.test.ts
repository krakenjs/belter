import { describe, it, expect } from "vitest";

import { domainMatches } from "../../src";

describe("domainMatches", () => {
  it("should return true when domain matches", () => {
    const domain = "paypal.com";
    const hostNames = [
      "https://www.paypal.com",
      "file://www.paypal.com",
      "anything://anything.paypal.com",
    ];
    const results = hostNames.map((hostname) =>
      domainMatches(hostname, domain)
    );
    const expectedResult = true;

    expect(results.every((result) => result === expectedResult)).toBeTruthy();
  });

  it("should return false when domain does not match", () => {
    const domain = "paypal.com";
    const hostNames = [
      "https://www.paypal.com/",
      "file://www.anything.com",
      "anything://anything.paypal.co.uk",
    ];
    const results = hostNames.map((hostname) =>
      domainMatches(hostname, domain)
    );
    const expectedResult = false;

    expect(results.every((result) => result === expectedResult)).toBeTruthy();
  });
});
