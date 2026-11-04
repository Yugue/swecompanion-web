import assert from "node:assert/strict";
import { test } from "node:test";
import { authPageHref, safeAuthReturnPath } from "../../src/lib/authNavigation";
import { desktopCallbackUrl, isDesktopAuthPath, parseDesktopAuthRequest } from "../../src/lib/desktopAuth";

const STATE = "q7Lm".repeat(10) + "abc";
const CHALLENGE = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM";
const PAGE = `/desktop-auth?${new URLSearchParams({ state: STATE, code_challenge: CHALLENGE })}`;

test("the page accepts only a well-formed request from the app", () => {
  assert.deepEqual(parseDesktopAuthRequest(new URLSearchParams({ state: STATE, code_challenge: CHALLENGE })), { state: STATE, codeChallenge: CHALLENGE });
  for (const query of ["", `state=${STATE}`, `code_challenge=${CHALLENGE}`, `state=short&code_challenge=${CHALLENGE}`,
    `state=${STATE}&code_challenge=${CHALLENGE}x`, `state=${STATE}&code_challenge=%3Cscript%3E`]) {
    assert.equal(parseDesktopAuthRequest(new URLSearchParams(query)), null, query);
  }
});

test("a code can go only to the app, whatever the request says", () => {
  const url = new URL(desktopCallbackUrl("the-code", STATE));
  assert.equal(`${url.protocol}${url.pathname}`, "com.swecompanion.app:/auth/callback");
  assert.equal(url.searchParams.get("code"), "the-code");
  assert.equal(url.searchParams.get("state"), STATE);
  assert.equal(new URL(desktopCallbackUrl("a&redirect=https://example.com", STATE)).searchParams.get("redirect"), null);
});

test("the login page keeps the handoff as its destination through signup and reset", () => {
  assert.equal(safeAuthReturnPath(PAGE), PAGE);
  for (const page of ["/login", "/signup", "/forgot-password"] as const) {
    assert.equal(new URL(authPageHref(page, PAGE), "https://swecompanion.invalid").searchParams.get("next"), PAGE);
  }
});

test("only the handoff page counts as the handoff", () => {
  assert.equal(isDesktopAuthPath(PAGE), true);
  assert.equal(isDesktopAuthPath("/desktop-auth"), true);
  for (const path of ["/account", "/", "/desktop-auth/other", "/desktop-authx", "/account?next=/desktop-auth"]) {
    assert.equal(isDesktopAuthPath(path), false, path);
  }
});
