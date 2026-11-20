import assert from "node:assert/strict";
import { test } from "node:test";
import { billingErrorMessage } from "../../src/lib/billingErrors";

test("billing configuration errors have a distinct public message without exposing provider details", () => {
  assert.equal(billingErrorMessage({ code: "functions/failed-precondition", message: "private customer details" }),
    "Billing is temporarily unavailable. Please try again later.");
  assert.equal(billingErrorMessage({ code: "functions/invalid-argument", message: "private customer details" }),
    "Unable to start billing from this page. Please reload and try again.");
  for (const error of [null, undefined, new Error("private customer details"), { code: "functions/internal", message: "private customer details" }]) {
    assert.equal(billingErrorMessage(error), "Unable to complete this request. Please try again.");
  }
});
