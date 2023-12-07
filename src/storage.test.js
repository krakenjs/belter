/* @flow */
import { vi, describe, test, expect, beforeEach } from "vitest";

import { getStorage } from "./storage";
import { uniqueID } from "./util";

vi.mock("./util", async () => {
  const actual = await vi.importActual("./util");

  return {
    ...actual,
    uniqueID: vi.fn(() => "unique-id-123"),
    getGlobal: vi.fn(() => ({})),
    inlineMemoize: vi.fn((_, impl) => impl()),
  };
});

describe("storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("happy path works", () => {
    // $FlowIssue mock
    uniqueID.mockReturnValue("fake-id");
    const { getID } = getStorage({ name: "test" });

    expect(getID()).toEqual("fake-id");
  });

  test("unique id is used for session id", () => {
    // $FlowIssue mock
    uniqueID.mockReturnValue("fake-session-id");
    const { getSessionID } = getStorage({ name: "test" });

    expect(getSessionID()).toEqual("fake-session-id");
  });

  test("sticky session id is used for session id", () => {
    // $FlowIssue mock
    uniqueID.mockReturnValue("fake-session-id");
    const { getSessionID } = getStorage({
      name: "test",
      stickySessionId: "sticky-session-id",
    });

    expect(getSessionID()).toEqual("sticky-session-id");
  });
});
