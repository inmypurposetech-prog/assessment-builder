import { describe, expect, it } from "vitest";
import { getAuthErrorMessage, getSignupErrorMessage } from "./messages";

describe("getAuthErrorMessage", () => {
  it("explains unconfirmed email", () => {
    expect(getAuthErrorMessage("x", "email_not_confirmed")).toMatch(/confirm your email/i);
  });

  it("explains bad credentials", () => {
    expect(getAuthErrorMessage("x", "invalid_credentials")).toMatch(/Incorrect email/i);
  });
});

describe("getSignupErrorMessage", () => {
  it("maps already-registered emails", () => {
    expect(getSignupErrorMessage("User already registered")).toMatch(/already registered/i);
  });
});
