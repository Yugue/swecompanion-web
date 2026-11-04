import assert from "node:assert/strict";
import { test } from "node:test";
import { authPageHref, safeAuthReturnPath } from "../../src/lib/authNavigation";

test("auth redirects reject external URLs and executable schemes", () => {
  for (const value of ["https://example.com", "//example.com", "javascript:alert(1)", "/\\example.com", "/%2fexample.com", "/\n/example.com"]) {
    assert.equal(safeAuthReturnPath(value), "/account", value);
  }
});

test("auth redirects avoid returning to another authentication page", () => {
  for (const value of ["/login", "/signup/", "/forgot-password?next=/login", "/coding/../login", "/%6cogin"]) {
    assert.equal(safeAuthReturnPath(value), "/account", value);
  }
});

test("auth redirects preserve a guide location and a selected billing plan", () => {
  for (const value of ["/coding/hashmap#progress", "/account?upgrade=yearly", "/account?upgrade=monthly"]) {
    assert.equal(safeAuthReturnPath(value), value);
  }
});

test("switching between login, signup, and reset preserves the return destination", () => {
  const next = "/account?upgrade=yearly";
  for (const page of ["/login", "/signup", "/forgot-password"] as const) {
    const url = new URL(authPageHref(page, next), "https://swecompanion.invalid");
    assert.equal(url.pathname, page);
    assert.equal(url.searchParams.get("next"), next);
  }
});
